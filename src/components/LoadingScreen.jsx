// src/components/LoadingScreen.js
import React from 'react';
import { Loader } from 'lucide-react';

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <Loader className="animate-spin h-12 w-12 text-indigo-600 mx-auto" />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;