# Heart Disease Prediction Web Application(PulsePoint)

A modern, user-friendly web application that leverages machine learning to predict the likelihood of heart disease. Built with FastAPI, Next.js, and scikit-learn, this application provides real-time predictions and supports model retraining capabilities.

## 🎥 Demo

[Watch the Demo on YouTube](youtube-link-here)

## 🌐 Live Application

Frontend: [Heart Disease Prediction Web App](https://pulsepoint-amber.vercel.app/)
API: [Backend API](https://heart-disease-prediction-apis.onrender.com)

## 🔍 Project Description

This project is a comprehensive heart disease prediction system that combines the power of machine learning with a modern web interface. It features:

- Real-time heart disease prediction based on user input
- Batch prediction support through CSV file upload
- Model retraining capabilities with new data
- Interactive and responsive UI
- Performance metrics visualization
- RESTful API with FastAPI
- Modern frontend built with Next.js and Tailwind CSS

### Key Features

- **Single Prediction**: Input individual patient data and get instant predictions
- **Batch Prediction**: Upload CSV files for multiple predictions at once
- **Model Retraining**: Improve model accuracy with new training data
- **Performance Metrics**: View model accuracy, precision, recall, and F1 score
- **API Documentation**: Interactive API documentation with Swagger UI

## 🚀 Setup Instructions

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Maxime-Bakunzi/heart-disease-prediction.git
   cd heart-disease-prediction
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:
   ```bash
   uvicorn app:app --reload
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

### Docker Image

You can also run the frontend directly using our pre-built Docker image from Docker Hub:

```bash
docker pull maximebakunzi/pulsepoint-frontend:latest
docker run -p 3000:3000 maximebakunzi/pulsepoint-frontend:latest
```

The application will be available at `http://localhost:3000`

## 🔧 Technical Stack

### Backend
- FastAPI
- scikit-learn
- pandas
- numpy
- joblib

### Frontend
- Next.js 13
- React
- TypeScript
- Tailwind CSS
- Axios

## 📊 Load Testing Results

Load testing was performed using Locust, simulating multiple concurrent users accessing different endpoints. The test was conducted on November 30, 2024, from 7:09:40 PM to 7:11:14 PM against the local development server (http://127.0.0.1:8000).

### Request Statistics

| Method   | Endpoint        | Requests | Fails | Avg(ms) | Min(ms) | Max(ms) | RPS | Failures/s |
|----------|----------------|----------|-------|---------|---------|---------|-----|------------|
| OPTIONS  | /predict       | 189      | 0     | 139     | 1       | 836     | 2.0 | 0.0        |
| POST     | /predict       | 265      | 0     | 203     | 56      | 958     | 2.8 | 0.0        |
| POST     | /predict/batch | 98       | 0     | 262     | 65      | 1082    | 1.0 | 0.0        |
| POST     | /retrain       | 91       | 0     | 421     | 278     | 1277    | 1.0 | 0.0        |
| **Total**| **Aggregated** | **643**  | **0** | **224** | **1**   | **1277**| **6.8** | **0.0** |

### Response Time Distribution (ms)

| Method   | Endpoint        | 50%ile | 60%ile | 70%ile | 80%ile | 90%ile | 95%ile | 99%ile | 100%ile |
|----------|----------------|--------|---------|---------|---------|---------|---------|---------|----------|
| OPTIONS  | /predict       | 75     | 130     | 180     | 250     | 370     | 570     | 760     | 840      |
| POST     | /predict       | 150    | 170     | 200     | 290     | 430     | 520     | 860     | 960      |
| POST     | /predict/batch | 180    | 200     | 250     | 380     | 680     | 880     | 1100    | 1100     |
| POST     | /retrain       | 370    | 390     | 430     | 490     | 620     | 760     | 1300    | 1300     |
| **All**  | **Aggregated** | **160**| **200** | **290** | **350** | **490** | **640** | **900** | **1300** |

### Key Findings:
- Zero failures across all endpoints
- Average response time: 224ms
- Highest throughput: 2.8 requests/second for POST /predict
- Batch predictions and retraining operations show higher latency as expected
- 95% of all requests completed under 880ms

The test results demonstrate robust API performance with no failures and consistent response times across different types of operations.

## 📝 API Documentation

The API documentation is available at `/docs` when running the backend server. Key endpoints include:

- `POST /predict`: Single prediction
- `POST /predict/batch`: Batch prediction
- `POST /retrain`: Model retraining


## 🙏 Acknowledgments

- Dataset source: Kaggle and UCI Machine Learning Repository
- Special thanks to the scikit-learn and FastAPI communities
