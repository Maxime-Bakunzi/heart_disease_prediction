'use client';

import { useState } from 'react';
import Footer from '@/components/Footer';
import { API_URL } from '@/config/api';

export default function PredictionPage() {
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    'chest pain type': '',
    'resting bp s': '',
    cholesterol: '',
    'fasting blood sugar': '',
    'resting ecg': '',
    'max heart rate': '',
    'exercise angina': '',
    oldpeak: '',
    'ST slope': ''
  });

  const [prediction, setPrediction] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPrediction(data.prediction === 1);
    } catch (error) {
      console.error('Error:', error);
      setError('Error making prediction. Please try again. Check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Heart Disease Prediction</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">Age in years</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Sex</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
                  required
                >
                  <option value="">Select</option>
                  <option value="1">Male</option>
                  <option value="0">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Chest Pain Type</label>
                <select
                  name="chest pain type"
                  value={formData['chest pain type']}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
                  required
                >
                  <option value="">Select</option>
                  <option value="1">Typical Angina</option>
                  <option value="2">Atypical Angina</option>
                  <option value="3">Non-anginal Pain</option>
                  <option value="4">Asymptomatic</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">Type of chest pain experienced</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Resting Blood Pressure</label>
                <input
                  type="number"
                  name="resting bp s"
                  value={formData['resting bp s']}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">In mm Hg</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cholesterol</label>
                <input
                  type="number"
                  name="cholesterol"
                  value={formData.cholesterol}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">Serum cholesterol in mg/dl</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Fasting Blood Sugar</label>
                <select
                  name="fasting blood sugar"
                  value={formData['fasting blood sugar']}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
                  required
                >
                  <option value="">Select</option>
                  <option value="1">Greater than 120 mg/dl</option>
                  <option value="0">Less than or equal to 120 mg/dl</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Resting ECG</label>
                <select
                  name="resting ecg"
                  value={formData['resting ecg']}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
                  required
                >
                  <option value="">Select</option>
                  <option value="0">Normal</option>
                  <option value="1">ST-T Wave Abnormality</option>
                  <option value="2">Left Ventricular Hypertrophy</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">Results of electrocardiogram while at rest</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Maximum Heart Rate</label>
                <input
                  type="number"
                  name="max heart rate"
                  value={formData['max heart rate']}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">Maximum heart rate achieved</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Exercise Induced Angina</label>
                <select
                  name="exercise angina"
                  value={formData['exercise angina']}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
                  required
                >
                  <option value="">Select</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">ST Depression (Oldpeak)</label>
                <input
                  type="number"
                  step="0.1"
                  name="oldpeak"
                  value={formData.oldpeak}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">ST depression induced by exercise relative to rest</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">ST Slope</label>
                <select
                  name="ST slope"
                  value={formData['ST slope']}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
                  required
                >
                  <option value="">Select</option>
                  <option value="1">Upsloping</option>
                  <option value="2">Flat</option>
                  <option value="3">Downsloping</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">Slope of the peak exercise ST segment</p>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm mt-2">
                {error}
              </div>
            )}

            {prediction !== null && (
              <div className={`p-4 rounded-md ${prediction ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {prediction ? (
                  <p className="font-medium">Based on the provided information, there is a high likelihood of heart disease. Please consult with a healthcare professional for a thorough evaluation.</p>
                ) : (
                  <p className="font-medium">Based on the provided information, there is a low likelihood of heart disease. However, maintain a healthy lifestyle and regular check-ups.</p>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  loading && 'opacity-50 cursor-not-allowed'
                }`}
              >
                {loading ? 'Processing...' : 'Get Prediction'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
