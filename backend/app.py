from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional
import pandas as pd
import io
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from pathlib import Path

app = FastAPI(title="Heart Disease Prediction API")

origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://pulsepoint-amber.vercel.app/",
    "https://pulsepoint-amber.vercel.app",
    "https://pulsepoint-amber-git-main-your-username.vercel.app",
    "https://pulsepoint-amber-your-username.vercel.app",
    "https://heart-disease-prediction-web.vercel.app/",
    "https://heart-disease-prediction-web.vercel.app",
    "https://heart-disease-prediction-web-git-main-your-username.vercel.app",
    "https://heart-disease-prediction-web-your-username.vercel.app",
    "*"  # This will allow all origins - only use during development
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Constants for file paths
MODEL_PATH = Path("../models/best_model.pkl")
SCALER_PATH = Path("../models/scaler.pkl")


class PredictionInput(BaseModel):
    age: float = Field(..., ge=0, le=150, description="Age in years")
    sex: int = Field(..., ge=0, le=1, description="Sex (0: Female, 1: Male)")
    chest_pain_type: int = Field(..., ge=1, le=4, alias="chest pain type",
                                 description="Chest pain type (1-4)")
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
    st_slope: int = Field(..., ge=1, le=3, alias="ST slope",
                          description="Slope of the peak exercise ST segment (1-3)")


class PredictionResponse(BaseModel):
    prediction: int
    probability: float


class BatchPredictionResponse(BaseModel):
    names: List[str]
    predictions: List[int]
    probabilities: List[float]


class ModelMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    training_samples: int
    test_samples: int


class RetrainingResponse(BaseModel):
    message: str
    metrics: ModelMetrics


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


@app.options("/predict")
async def options_predict():
    return JSONResponse(
        status_code=200,
        content={"message": "OK"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    )


def get_column_mapping():
    """Get mapping of possible column names to standardized names."""
    return {
        'age': ['age', 'Age', 'AGE'],
        'sex': ['sex', 'Sex', 'SEX', 'gender', 'Gender'],
        'chest pain type': ['chest_pain_type', 'chest pain type', 'ChestPainType', 'chest_pain'],
        'resting bp s': ['resting_bp_s', 'resting bp s', 'RestingBP', 'resting_bp', 'bp'],
        'cholesterol': ['cholesterol', 'Cholesterol', 'CHOL'],
        'fasting blood sugar': ['fasting_blood_sugar', 'fasting blood sugar', 'FastingBS'],
        'resting ecg': ['resting_ecg', 'resting ecg', 'RestingECG'],
        'max heart rate': ['max_heart_rate', 'max heart rate', 'MaxHR'],
        'exercise angina': ['exercise_angina', 'exercise angina', 'ExerciseAngina'],
        'oldpeak': ['oldpeak', 'Oldpeak', 'ST_Depression'],
        'ST slope': ['st_slope', 'ST slope', 'ST_Slope']
    }


@app.post("/predict/batch", response_model=BatchPredictionResponse)
async def predict_batch(file: UploadFile = File(...)):
    """Make predictions for multiple instances from CSV file."""
    try:
        # Read CSV file
        contents = await file.read()
        data = pd.read_csv(io.StringIO(contents.decode('utf-8')))

        # Store names if available, otherwise use index
        names = data.get('name', [f"Patient_{i}" for i in range(len(data))]).tolist()

        # Get column mapping
        column_mapping = get_column_mapping()
        
        # Create standardized DataFrame with exact column names used during training
        standardized_data = pd.DataFrame()
        missing_columns = []

        for standard_name, possible_names in column_mapping.items():
            # Find matching column in data
            matching_col = None
            for possible_name in possible_names:
                if possible_name in data.columns:
                    matching_col = possible_name
                    break
            
            if matching_col is not None:
                standardized_data[standard_name] = data[matching_col]
            else:
                missing_columns.append(standard_name)

        if missing_columns:
            raise ValueError(f"Missing required columns. Please ensure your CSV contains columns for: {', '.join(missing_columns)}")

        # Ensure numeric data types
        for col in standardized_data.columns:
            standardized_data[col] = pd.to_numeric(standardized_data[col], errors='coerce')

        # Check for any NaN values
        if standardized_data.isna().any().any():
            raise ValueError("Some required values are missing or invalid in your CSV file")

        # Ensure columns are in the correct order
        expected_columns = [
            'age', 'sex', 'chest pain type', 'resting bp s', 'cholesterol',
            'fasting blood sugar', 'resting ecg', 'max heart rate',
            'exercise angina', 'oldpeak', 'ST slope'
        ]
        standardized_data = standardized_data[expected_columns]

        # Preprocess data
        X_scaled = preprocess_data(standardized_data, scaler)

        # Make predictions
        predictions = model.predict(X_scaled)
        probabilities = model.predict_proba(X_scaled)[:, 1]

        return BatchPredictionResponse(
            names=names,
            predictions=predictions.tolist(),
            probabilities=probabilities.tolist()
        )
    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=400, detail="The uploaded CSV file is empty")
    except pd.errors.ParserError:
        raise HTTPException(status_code=400, detail="Invalid CSV file format")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the file: {str(e)}")


def calculate_metrics(model, X_test, y_test, X_train) -> ModelMetrics:
    """Calculate model performance metrics."""
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    return ModelMetrics(
        accuracy=float(accuracy_score(y_test, y_pred)),
        precision=float(precision_score(y_test, y_pred)),
        recall=float(recall_score(y_test, y_pred)),
        f1_score=float(f1_score(y_test, y_pred)),
        roc_auc=float(roc_auc_score(y_test, y_pred_proba)),
        training_samples=len(X_train),
        test_samples=len(X_test)
    )


async def retrain_model_task(training_data: pd.DataFrame):
    """Background task for model retraining."""
    try:
        # Separate features and target
        X = training_data.drop('target', axis=1)
        y = training_data['target']

        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        # Fit the scaler on training data
        scaler.fit(X_train)
        X_train_scaled = scaler.transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        # Train new model
        new_model = train_random_forest(X_train_scaled, y_train)

        # Calculate metrics
        metrics = calculate_metrics(new_model, X_test_scaled, y_test, X_train)

        # Save the new model and scaler
        joblib.dump(new_model, MODEL_PATH)
        joblib.dump(scaler, SCALER_PATH)

        # Update the global model reference
        global model
        model = new_model

        return metrics

    except Exception as e:
        print(f"Error in model retraining: {str(e)}")
        raise


@app.post("/retrain", response_model=RetrainingResponse)
async def retrain_model(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """Trigger model retraining with new data."""
    try:
        # Read and validate the training data
        contents = await file.read()
        training_data = pd.read_csv(io.StringIO(contents.decode('utf-8')))

        # Validate the required columns
        required_columns = list(get_column_mapping().keys()) + ['target']
        missing_columns = [col for col in required_columns if col not in training_data.columns]
        
        if missing_columns:
            raise ValueError(f"Missing required columns: {missing_columns}")

        # Start the retraining task
        metrics = await retrain_model_task(training_data)

        return RetrainingResponse(
            message="Model retrained successfully",
            metrics=metrics
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)