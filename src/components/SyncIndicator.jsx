// src/components/SyncIndicator.js
import React from 'react';

const SyncIndicator = () => {
  return (
    <div className="mb-3 xs:mb-4 text-center px-2">
      <span className="inline-flex items-center px-2 xs:px-3 py-1 xs:py-1.5 rounded-full text-xs xs:text-sm font-medium bg-green-100 text-green-800 max-w-full">
        <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-green-400 rounded-full mr-1.5 xs:mr-2 animate-pulse flex-shrink-0"></span>
        <span className="truncate">
          <span className="hidden sm:inline">Real-time sync active - Data shared across all admin devices</span>
          <span className="sm:hidden">Real-time sync active</span>
        </span>
      </span>
    </div>
  );
};

export default SyncIndicator;