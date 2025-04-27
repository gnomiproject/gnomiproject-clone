
import React from 'react';

interface FallbackBannerProps {
  show: boolean;
  message?: string;
}

const FallbackBanner = ({ show, message }: FallbackBannerProps) => {
  if (!show) return null;
  
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
      <p className="font-bold">Demo Mode</p>
      <p>{message || "This report is using placeholder data for demonstration purposes."}</p>
    </div>
  );
};

export default FallbackBanner;
