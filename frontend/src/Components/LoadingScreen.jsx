import React from "react";
import { Spinner } from "flowbite-react";

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        {/* Logo or Icon */}
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 mx-auto text-blue-600 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Loading Text */}
        <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Loading your financial data...
        </p>

        {/* Optional Subtext */}
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Please wait while we prepare your dashboard.
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
