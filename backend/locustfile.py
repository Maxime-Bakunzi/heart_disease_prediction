from locust import HttpUser, task, between
import json
import random
import io

class HeartDiseaseUser(HttpUser):
    wait_time = between(1, 3)
    
    def on_start(self):
        """Initialize test data"""
        self.single_prediction_data = {
            "age": 54.0,
            "sex": 1,
            "chest pain type": 3,
            "resting bp s": 150.0,
            "cholesterol": 195.0,
            "fasting blood sugar": 0,
            "resting ecg": 0,
            "max heart rate": 122.0,
            "exercise angina": 0,
            "oldpeak": 0.0,
            "ST slope": 1
        }

    def generate_random_record(self):
        """Generate a random record with realistic values"""
        return {
            "age": round(random.uniform(30, 80), 1),
            "sex": random.randint(0, 1),
            "chest pain type": random.randint(1, 4),
            "resting bp s": round(random.uniform(90, 180), 1),
            "cholesterol": round(random.uniform(150, 300), 1),
            "fasting blood sugar": random.randint(0, 1),
            "resting ecg": random.randint(0, 2),
            "max heart rate": round(random.uniform(60, 200), 1),
            "exercise angina": random.randint(0, 1),
            "oldpeak": round(random.uniform(0, 6), 1),
            "ST slope": random.randint(1, 3)
        }

    @task(3)
    def predict_single(self):
        """Test single prediction endpoint"""
        data = self.generate_random_record()
        headers = {"Content-Type": "application/json"}
        with self.client.post("/predict", json=data, headers=headers, catch_response=True) as response:
            if response.status_code == 422:
                response.failure(f"Validation error: {response.text}")

    @task(2)
    def predict_options(self):
        """Test options endpoint"""
        self.client.options("/predict")

    @task(1)
    def predict_batch(self):
        """Test batch prediction endpoint"""
        # Create header row with name column
        headers = ["name", "age", "sex", "chest pain type", "resting bp s", "cholesterol", 
                  "fasting blood sugar", "resting ecg", "max heart rate", 
                  "exercise angina", "oldpeak", "ST slope"]
        
        # Create CSV content
        rows = [",".join(headers)]
        
        # Add 3 random records with names
        for i in range(3):
            record = self.generate_random_record()
            record["name"] = f"Patient_{i+1}"  # Add name field
            values = [str(record[header]) for header in headers]  # Include name in values
            rows.append(",".join(values))
        
        csv_content = "\n".join(rows)

        files = {
            'file': ('test.csv', csv_content.encode('utf-8'), 'text/csv')
        }
        with self.client.post("/predict/batch", files=files, catch_response=True) as response:
            if response.status_code != 200:
                response.failure(f"Batch prediction failed: {response.text}")

    @task(1)
    def retrain_model(self):
        """Test model retraining endpoint"""
        # Create header row
        headers = ["age", "sex", "chest pain type", "resting bp s", "cholesterol", 
                  "fasting blood sugar", "resting ecg", "max heart rate", 
                  "exercise angina", "oldpeak", "ST slope", "target"]
        
        # Create CSV content
        rows = [",".join(headers)]
        
        # Add 10 random records with balanced classes (5 each for 0 and 1)
        for target in [0, 1]:  # Ensure both classes are present
            for _ in range(5):
                record = self.generate_random_record()
                values = [str(record[header]) for header in headers[:-1]]  # Exclude target
                values.append(str(target))  # Add target value
                rows.append(",".join(values))
        
        csv_content = "\n".join(rows)

        files = {
            'file': ('training.csv', csv_content.encode('utf-8'), 'text/csv')
        }
        with self.client.post("/retrain", files=files, catch_response=True) as response:
            if response.status_code != 200:
                response.failure(f"Model retraining failed: {response.text}")