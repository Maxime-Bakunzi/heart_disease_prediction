/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://heart-disease-prediction-apis.onrender.com/:path*',
      },
    ]
  },
}

module.exports = nextConfig
