import React from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Error404Page = () => {
    const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:px-6">
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-9xl font-bold text-gray-900 mb-4">404</h1>
              <div className="w-24 h-1 bg-gray-900 mx-auto"></div>
            </div>

            {/* Error Message Card */}
            <div className="border border-gray-200 rounded-lg p-8 mb-8 max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Page Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={() => navigate('/')}
                  className="flex items-center justify-center px-6 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </button>
                
                <button 
                  onClick={() => window.history.back()}
                  className="flex items-center justify-center px-6 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </button>
              </div>
            </div>

            {/* Additional Help Section */}
            <div className="border border-gray-200 rounded-lg p-6 max-w-lg mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Need Help?
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Visit our</p>
                  <a href="/help" className="text-gray-900 hover:underline cursor-pointer">
                    Help Center
                  </a>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Contact</p>
                  <a href="/contact" className="text-gray-900 hover:underline cursor-pointer">
                    Support Team
                  </a>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Check our</p>
                  <a href="/faq" className="text-gray-900 hover:underline cursor-pointer">
                    FAQ Section
                  </a>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Browse</p>
                  <a href="/sitemap" className="text-gray-900 hover:underline cursor-pointer">
                    Site Map
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Error404Page;