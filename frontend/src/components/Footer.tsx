'use client';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">PulsePoint</h3>
            <p className="text-gray-300">
              Advanced heart disease prediction using machine learning and neural networks.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/prediction" className="text-gray-300 hover:text-white">
                Make Prediction
                </a>
              </li>
              <li>
                <a href="/data-upload" className="text-gray-300 hover:text-white">
                Batch Processing
                </a>
              </li>
              <li>
                <a href="/retraining" className="text-gray-300 hover:text-white">
                Retrain Model
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300">
              For support and inquiries:
              <br />
              Email: guymaximebakunzi@gmail.com
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} PulsePoint. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
