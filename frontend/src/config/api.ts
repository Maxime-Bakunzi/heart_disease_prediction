const isDevelopment = process.env.NODE_ENV === 'development';

export const API_URL = isDevelopment 
  ? '/api'  // This will use our Next.js proxy
  : 'https://heart-disease-prediction-apis.onrender.com';
