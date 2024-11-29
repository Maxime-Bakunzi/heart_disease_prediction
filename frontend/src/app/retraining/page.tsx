'use client';

import { useState } from 'react';
import Footer from '@/components/Footer';

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  training_samples: number;
  test_samples: number;
}

interface RetrainingResponse {
  message: string;
  metrics: ModelMetrics;
}

export default function RetrainingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setMetrics(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError('');
    setMetrics(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://heart-disease-prediction-apis.onrender.com/retrain', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to retrain model');
      }

      const data: RetrainingResponse = await response.json();
      setMetrics(data.metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error retraining model. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, description }: { title: string; value: number; description: string }) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <dt className="text-sm font-medium text-gray-500">{title}</dt>
      <dd className="mt-1 text-3xl font-semibold text-indigo-600">
        {typeof value === 'number' ? (value * 100).toFixed(2) + '%' : value}
      </dd>
      <dd className="mt-2 text-sm text-gray-500">{description}</dd>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Model Retraining</h1>
          
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="mb-6">
              <p className="text-gray-600">
                Upload a new dataset to retrain the heart disease prediction model. The file should be in CSV format and include both features and target labels.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Training Dataset
                </label>
                <div className="mt-1">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  The dataset should include all required features and the target variable for heart disease prediction.
                </p>
              </div>

              {error && (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !file}
                  className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    (loading || !file) && 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Retraining...' : 'Retrain Model'}
                </button>
              </div>
            </form>
          </div>

          {metrics && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">New Model Performance Metrics</h2>
              
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <MetricCard
                  title="Accuracy"
                  value={metrics.accuracy}
                  description="Overall prediction accuracy"
                />
                <MetricCard
                  title="Precision"
                  value={metrics.precision}
                  description="Ratio of correct positive predictions"
                />
                <MetricCard
                  title="Recall"
                  value={metrics.recall}
                  description="Ratio of actual positives correctly identified"
                />
                <MetricCard
                  title="F1 Score"
                  value={metrics.f1_score}
                  description="Harmonic mean of precision and recall"
                />
                <MetricCard
                  title="ROC AUC"
                  value={metrics.roc_auc}
                  description="Area under the ROC curve"
                />
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500">Training Samples</dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">{metrics.training_samples}</dd>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500">Test Samples</dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">{metrics.test_samples}</dd>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
