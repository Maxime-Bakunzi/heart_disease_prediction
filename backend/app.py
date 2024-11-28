from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import pandas as pd
import io
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from pathlib import Path

app = FastAPI(title="Heart Disease Prediction API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=False,  # Must be False for wildcard origin
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Constants for file paths
MODEL_PATH = Path("../models/best_model.pkl")
SCALER_PATH = Path("../models/scaler.pkl")


class PredictionInput(BaseModel):
    age: float = Field(..., ge=0, le=120, description="Age in years")
    sex: int = Field(..., ge=0, le=1, description="Sex (0: Female, 1: Male)")
    chest_pain_type: int = Field(..., ge=0, le=3, alias="chest pain type",
                                 description="Chest pain type (0-3)")
    resting_bp_s: float = Field(..., ge=80, le=200, alias="resting bp s",
                                description="Resting blood pressure (mm Hg)")
    cholesterol: float = Field(..., ge=100, le=600,
                               description="Serum cholesterol (mg/dl)")
    fasting_blood_sugar: int = Field(..., ge=0, le=1, alias="fasting blood sugar",
                                     description="Fasting blood sugar > 120 mg/dl (0: No, 1: Yes)")
    resting_ecg: int = Field(..., ge=0, le=2, alias="resting ecg",
                             description="Resting ECG results (0-2)")
    max_heart_rate: float = Field(..., ge=60, le=220, alias="max heart rate",
                                  description="Maximum heart rate achieved")
    exercise_angina: int = Field(..., ge=0, le=1, alias="exercise angina",
                                 description="Exercise induced angina (0: No, 1: Yes)")
    oldpeak: float = Field(..., ge=0, le=10,
                           description="ST depression induced by exercise")
    st_slope: int = Field(..., ge=0, le=2, alias="ST slope",
                          description="Slope of the peak exercise ST segment (0-2)")


class PredictionResponse(BaseModel):
    prediction: int
    probability: float


class BatchPredictionResponse(BaseModel):
    predictions: List[int]
    probabilities: List[float]


def load_model_and_scaler():
    """Load the trained model and scaler."""
    try:
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        return model, scaler
    except Exception as e:
        raise RuntimeError(f"Error loading model or scaler: {str(e)}")


def preprocess_data(data: pd.DataFrame, scaler: StandardScaler, fit: bool = False):
    """Preprocess input data using the scaler."""
    if fit:
        return scaler.fit_transform(data)
    return scaler.transform(data)


def train_random_forest(X, y):
    """Train a new Random Forest model."""
    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X, y)
    return model


# Load model and scaler at startup
model, scaler = load_model_and_scaler()


@app.post("/predict", response_model=PredictionResponse)
async def predict(input_data: PredictionInput):
    """Make a prediction for a single instance."""
    try:
        # Convert input to DataFrame
        df = pd.DataFrame([input_data.dict(by_alias=True)])

        # Preprocess data
        X_scaled = preprocess_data(df, scaler)

        # Make prediction
        prediction = model.predict(X_scaled)[0]
        probability = model.predict_proba(X_scaled)[0][1]

        return PredictionResponse(
            prediction=int(prediction),
            probability=float(probability)
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/predict/batch", response_model=BatchPredictionResponse)
async def predict_batch(file: UploadFile = File(...)):
    """Make predictions for multiple instances from CSV file."""
    try:
        # Read CSV file
        contents = await file.read()
        data = pd.read_csv(io.StringIO(contents.decode('utf-8')))

        # Validate columns
        required_columns = set(
            [field.alias or field.name for field in PredictionInput.__fields__.values()])
        if not required_columns.issubset(data.columns):
            missing_cols = required_columns - set(data.columns)
            raise ValueError(f"Missing required columns: {missing_cols}")

        # Preprocess data
        X_scaled = preprocess_data(data, scaler)

        # Make predictions
        predictions = model.predict(X_scaled)
        probabilities = model.predict_proba(X_scaled)[:, 1]

        return BatchPredictionResponse(
            predictions=predictions.tolist(),
            probabilities=probabilities.tolist()
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def retrain_model_task(training_data: pd.DataFrame):
    """Background task for model retraining."""
    try:
        # Validate and prepare data
        if 'target' not in training_data.columns:
            raise ValueError("Training data must include 'target' column")

        X = training_data.drop('target', axis=1)
        y = training_data['target']

        # Fit scaler and transform data
        X_scaled = preprocess_data(X, scaler, fit=True)

        # Train new model
        global model
        model = train_random_forest(X_scaled, y)

        # Save model and scaler
        joblib.dump(model, MODEL_PATH)
        joblib.dump(scaler, SCALER_PATH)

        print("Model retraining completed successfully")
    except Exception as e:
        print(f"Error in model retraining: {str(e)}")


@app.post("/retrain")
async def retrain_model(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """Trigger model retraining with new data."""
    try:
        # Read CSV file
        contents = await file.read()
        training_data = pd.read_csv(io.StringIO(contents.decode('utf-8')))

        # Add retraining task to background tasks
        background_tasks.add_task(retrain_model_task, training_data)

        return {
            "message": "Model retraining started in background",
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)