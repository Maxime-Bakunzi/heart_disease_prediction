import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">Advanced Heart Disease</span>{' '}
                    <span className="block text-indigo-600 xl:inline">Prediction System</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Using machine learning to predict heart disease risk with high accuracy. Our model analyzes key health indicators to provide early detection and risk assessment.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link
                        href="/prediction"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                      >
                        Start Prediction
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <a
                        href="#model-details"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                      >
                        View Model Details
                      </a>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <Image
              src="/images/heart_icon.png"
              alt="Heart illustration"
              width={800}
              height={800}
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            />
          </div>
        </div>

        {/* Model Information Section */}
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div id="model-details" className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Model Details</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Understanding Our Prediction Model
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                {/* Dataset Information */}
                <div className="relative">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Dataset Information</h3>
                  <p className="text-gray-500 mb-4">
                    The Heart Disease Dataset consists of several attributes, each providing critical information related to patient characteristics and diagnostic measurements. These attributes are as follows:
                  </p>
                  <div className="space-y-4 text-gray-600">
                    <div>
                      <p className="font-medium">Age:</p>
                      <p>The age of the individual is recorded in years and represented as a numeric value.</p>
                    </div>
                    
                    <div>
                      <p className="font-medium">Sex:</p>
                      <p>The sex of the individual is binary-coded, where 1 indicates male and 0 indicates female.</p>
                    </div>
                    
                    <div>
                      <p className="font-medium">Chest Pain Type:</p>
                      <p>This nominal attribute categorizes chest pain into four types:</p>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Value 1: Typical angina</li>
                        <li>Value 2: Atypical angina</li>
                        <li>Value 3: Non-anginal pain</li>
                        <li>Value 4: Asymptomatic</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium">Resting Blood Pressure:</p>
                      <p>The resting blood pressure of the individual, measured in mm Hg, is recorded as a numeric value.</p>
                    </div>
                    
                    <div>
                      <p className="font-medium">Serum Cholesterol:</p>
                      <p>This numeric value represents the individual's cholesterol level in mg/dl.</p>
                    </div>
                    
                    <div>
                      <p className="font-medium">Fasting Blood Sugar:</p>
                      <p>This binary attribute indicates whether fasting blood sugar exceeds 120 mg/dl, where 1 represents true and 0 represents false.</p>
                    </div>
                    
                    <div>
                      <p className="font-medium">Resting Electrocardiogram Results:</p>
                      <p>This nominal attribute records the results of an individual's electrocardiogram, categorized as follows:</p>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Value 0: Normal</li>
                        <li>Value 1: Showing ST-T wave abnormality (T wave inversions and/or ST elevation or depression of &gt; 0.05 mV)</li>
                        <li>Value 2: Indicating probable or definite left ventricular hypertrophy based on Estes&apos; criteria</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium">Maximum Heart Rate Achieved:</p>
                      <p>This numeric value ranges between 71 and 202 and reflects the highest heart rate achieved during testing.</p>
                    </div>
                    
                    <div>
                      <p className="font-medium">Exercise Induced Angina:</p>
                      <p>This binary attribute indicates whether the individual experienced exercise-induced angina, with 1 for &quot;yes&quot; and 0 for &quot;no.&quot;</p>
                    </div>
                    
                    <div>
                      <p className="font-medium">Oldpeak:</p>
                      <p>This numeric attribute represents ST depression induced by exercise relative to rest.</p>
                    </div>
                    
                    <div>
                      <p className="font-medium">The Slope of the Peak Exercise ST Segment:</p>
                      <p>A nominal attribute describing the slope of the ST segment during peak exercise:</p>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Value 1: Upsloping</li>
                        <li>Value 2: Flat</li>
                        <li>Value 3: Downsloping</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium">Class:</p>
                      <p>This binary target attribute indicates the presence or absence of heart disease, with 1 denoting heart disease and 0 indicating a normal condition.</p>
                    </div>
                  </div>
                </div>

                {/* Feature Analysis */}
                <div className="relative">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Feature Analysis</h3>
                  <p className="text-gray-500 mb-4">
                    Our analysis revealed important correlations between different features and heart disease:
                  </p>
                  <Image
                    src="/images/correlation_heatmap.png"
                    alt="Feature Correlation Heatmap"
                    width={600}
                    height={600}
                    className="rounded-lg shadow-lg w-full"
                  />
                  <p className="mt-4 text-gray-500">
                    The heatmap shows strong correlations between certain features and heart disease presence.
                  </p>
                </div>

                {/* Model Performance */}
                <div className="relative">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Model Performance</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <Image
                        src="/images/confusion_matrix.png"
                        alt="Confusion Matrix"
                        width={600}
                        height={600}
                        className="rounded-lg shadow-lg w-full"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Confusion Matrix showing model prediction accuracy
                      </p>
                    </div>
                    <div>
                      <Image
                        src="/images/roc_curve.png"
                        alt="ROC Curve"
                        width={600}
                        height={600}
                        className="rounded-lg shadow-lg w-full"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        ROC curve demonstrating model performance
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-gray-700 font-semibold mb-2">
                      Detailed Model Performance Metrics:
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-900 mb-2">Random Forest:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Accuracy: 0.936</li>
                        <li>• Precision: 0.943</li>
                        <li>• Recall: 0.935</li>
                        <li>• F1 Score: 0.939</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Feature Importance */}
                <div className="relative">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Feature Importance</h3>
                  <Image
                    src="/images/feature_importance.png"
                    alt="Feature Importance Plot"
                    width={600}
                    height={600}
                    className="rounded-lg shadow-lg w-full"
                  />
                  <p className="mt-4 text-gray-500">
                    The plot shows the relative importance of each feature in predicting heart disease, helping us understand which factors are most crucial for diagnosis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
