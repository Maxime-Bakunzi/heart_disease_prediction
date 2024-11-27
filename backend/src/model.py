import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.regularizers import l2
from tensorflow.keras.optimizers import RMSprop
from pathlib import Path


class HeartDiseaseModel:
    def __init__(self, model_path=None):
        """Initialize the model with an optional path to a saved model."""
        self.model = None
        if model_path and Path(model_path).exists():
            file_extension = Path(model_path).suffix
            if file_extension == '.pkl':
                self.model = joblib.load(model_path)
            elif file_extension == '.tf':
                self.model = load_model(model_path)

    def build_model(self, input_shape):
        """Build the neural network model architecture."""
        model = Sequential([
            Dense(64, activation='relu', kernel_regularizer=l2(0.01),
                  input_shape=(input_shape,)),
            Dropout(0.5),
            Dense(32, activation='relu', kernel_regularizer=l2(0.01)),
            Dense(1, activation='sigmoid')
        ])
        model.compile(optimizer=RMSprop(learning_rate=0.001),
                      loss='binary_crossentropy',
                      metrics=['accuracy'])
        return model

    def train(self, X, y, validation_split=0.2, epochs=50, batch_size=32):
        """Train the model on the provided data."""
        input_shape = X.shape[1]
        self.model = self.build_model(input_shape)

        history = self.model.fit(
            X, y,
            validation_split=validation_split,
            epochs=epochs,
            batch_size=batch_size,
            verbose=1
        )
        return history

    def evaluate(self, X_test, y_test):
        """Evaluate the model and return performance metrics."""
        if self.model is None:
            raise ValueError("Model not trained. Train or load a model first.")

        if isinstance(self.model, Sequential):
            y_pred_proba = self.model.predict(X_test)
            y_pred = (y_pred_proba > 0.5).astype(int)
        else:
            y_pred = self.model.predict(X_test)

        metrics = {
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred),
            'recall': recall_score(y_test, y_pred),
            'f1_score': f1_score(y_test, y_pred)
        }
        return metrics

    def predict(self, X):
        """Make predictions on new data."""
        if self.model is None:
            raise ValueError("Model not trained. Train or load a model first.")

        if isinstance(self.model, Sequential):
            predictions = self.model.predict(X)
            return (predictions > 0.5).astype(int)
        return self.model.predict(X)

    def save(self, path):
        """Save the trained model to disk."""
        if self.model is None:
            raise ValueError("Model not trained. Cannot save untrained model.")

        if isinstance(self.model, Sequential):
            self.model.save(path)
        else:
            joblib.dump(self.model, path)
