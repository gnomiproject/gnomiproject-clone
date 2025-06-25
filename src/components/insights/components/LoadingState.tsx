
import React from 'react';

const LoadingState: React.FC = () => (
  <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md flex items-center">
    <div className="mr-3 h-5 w-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
    <p className="text-blue-800">Loading your unlocked content...</p>
  </div>
);

export default LoadingState;
