'use client';

import { useState } from 'react';
import Footer from '@/components/Footer';

export default function RetrainingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setSuccess('');
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
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://heart-disease-prediction-apis.onrender.com/retrain', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to retrain model');
      }

      const data = await response.json();
      setSuccess('Model retrained successfully! New model metrics: ' + JSON.stringify(data.metrics));
    } catch (err) {
      setError('Error retraining model. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Model Retraining</h1>
          
          <div className="bg-white p-6 rounded-lg shadow">
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

              {success && (
                <div className="text-green-600 text-sm">
                  {success}
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
                  {loading ? 'Retraining Model...' : 'Start Retraining'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
