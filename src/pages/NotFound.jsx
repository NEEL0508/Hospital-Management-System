import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="text-9xl font-extrabold text-blue-600 mb-4 select-none">404</div>
        <div className="text-6xl mb-6">🏥</div>

        <h1 className="text-2xl font-bold text-slate-800 mb-3">Page Not Found</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Go to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
