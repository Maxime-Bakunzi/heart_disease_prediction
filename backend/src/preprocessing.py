import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib
from pathlib import Path


class DataPreprocessor:
    def __init__(self, scaler_path=None):
        """Initialize the preprocessor with an optional path to a saved scaler."""
        self.scaler = None
        if scaler_path and Path(scaler_path).exists():
            self.scaler = joblib.load(scaler_path)
        else:
            self.scaler = StandardScaler()

    def validate_input_features(self, data):
        """Validate that input data has all required features."""
        required_features = [
            'age', 'sex', 'chest pain type', 'resting bp s', 'cholesterol',
            'fasting blood sugar', 'resting ecg', 'max heart rate',
            'exercise angina', 'oldpeak', 'ST slope'
        ]
        missing_features = [
            feat for feat in required_features if feat not in data.columns]
        if missing_features:
            raise ValueError(f"Missing required features: {missing_features}")

    def clean_data(self, data):
        """Clean the input data by handling missing values and outliers."""
        df = data.copy()

        # Handle missing values
        numeric_columns = df.select_dtypes(include=[np.number]).columns
        for col in numeric_columns:
            df[col].fillna(df[col].median(), inplace=True)

        # Handle categorical missing values
        categorical_columns = df.select_dtypes(exclude=[np.number]).columns
        for col in categorical_columns:
            df[col].fillna(df[col].mode()[0], inplace=True)

        # Remove outliers using IQR method for numeric columns
        for col in numeric_columns:
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            df[col] = df[col].clip(lower_bound, upper_bound)

        return df

    def preprocess(self, data, fit=False):
        """Preprocess the data by cleaning and scaling."""
        # Validate input features
        self.validate_input_features(data)

        # Clean the data
        cleaned_data = self.clean_data(data)

        # Scale the features
        if fit:
            scaled_data = self.scaler.fit_transform(cleaned_data)
        else:
            if self.scaler is None:
                raise ValueError(
                    "Scaler not fitted. Either fit the scaler or provide a pre-fitted scaler.")
            scaled_data = self.scaler.transform(cleaned_data)

        return pd.DataFrame(scaled_data, columns=data.columns)

    def save_scaler(self, path):
        """Save the fitted scaler to disk."""
        if self.scaler is None:
            raise ValueError("Scaler not fitted. Cannot save unfitted scaler.")
        joblib.dump(self.scaler, path)
