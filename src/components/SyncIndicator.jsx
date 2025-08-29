// src/components/SyncIndicator.js
import React from 'react';

const SyncIndicator = () => {
  return (
    <div className="mb-4 text-center">
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
        Real-time sync active - Data shared across all admin devices
      </span>
    </div>
  );
};

export default SyncIndicator;