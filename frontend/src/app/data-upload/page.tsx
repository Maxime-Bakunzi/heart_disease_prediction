'use client';

import { useState } from 'react';
import Footer from '@/components/Footer';

interface PredictionResult {
  names: string[];
  predictions: number[];
  probabilities: number[];
}

export default function DataUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [results, setResults] = useState<PredictionResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setSuccess('');
      setResults(null);
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
    setResults(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://heart-disease-prediction-apis.onrender.com/predict/batch', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to process file');
      }

      const data = await response.json();
      setResults(data);
      setSuccess('File processed successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Batch Data Upload</h1>
          
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload CSV File
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
                  Please upload a CSV file containing patient data. The file should include all required parameters for heart disease prediction.
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
                  {loading ? 'Processing...' : 'Upload and Predict'}
                </button>
              </div>
            </form>
          </div>

          {results && results.names && results.names.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Prediction Results</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prediction
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Probability
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.names.map((name, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            results.predictions[index] === 1 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {results.predictions[index] === 1 ? 'High Risk' : 'Low Risk'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(results.probabilities[index] * 100).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
