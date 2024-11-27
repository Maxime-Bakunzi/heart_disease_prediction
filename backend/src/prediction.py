import pandas as pd
import numpy as np
from pathlib import Path
from .preprocessing import DataPreprocessor
from .model import HeartDiseaseModel


class HeartDiseasePredictionPipeline:
    def __init__(self, model_path, scaler_path):
        """Initialize the prediction pipeline with model and scaler paths."""
        self.preprocessor = DataPreprocessor(scaler_path)
        self.model = HeartDiseaseModel(model_path)

    def predict_single(self, features_dict):
        """Make a prediction for a single instance."""
        # Convert single instance to DataFrame
        df = pd.DataFrame([features_dict])

        # Preprocess the data
        preprocessed_data = self.preprocessor.preprocess(df, fit=False)

        # Make prediction
        prediction = self.model.predict(preprocessed_data)

        return int(prediction[0])

    def predict_batch(self, features_df):
        """Make predictions for multiple instances."""
        # Preprocess the batch data
        preprocessed_data = self.preprocessor.preprocess(
            features_df, fit=False)

        # Make predictions
        predictions = self.model.predict(preprocessed_data)

        return predictions.tolist()

    def retrain(self, training_data, target):
        """Retrain the model with new data."""
        # Preprocess the new training data
        preprocessed_data = self.preprocessor.preprocess(
            training_data, fit=True)

        # Train the model
        self.model.train(preprocessed_data, target)

        return {
            "status": "success",
            "message": "Model successfully retrained"
        }
