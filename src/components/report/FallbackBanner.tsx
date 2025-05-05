
import React from 'react';
import { AlertCircle, Clock, RotateCw } from 'lucide-react';

interface FallbackBannerProps {
  show: boolean;
  message?: string;
  timestamp?: string;
  onRefresh?: () => void;
}

const FallbackBanner = ({ show, message, timestamp, onRefresh }: FallbackBannerProps) => {
  if (!show) return null;
  
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-700 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-amber-500" />
        </div>
        <div className="ml-3">
          <p className="font-bold text-amber-800">Offline Mode</p>
          <p className="text-sm">{message || "This report is using cached data for offline viewing."}</p>
          {timestamp && (
            <p className="text-xs mt-1 flex items-center">
              <Clock className="h-3 w-3 mr-1" /> Last updated: {new Date(timestamp).toLocaleString()}
            </p>
          )}
        </div>
        {onRefresh && (
          <button 
            onClick={onRefresh}
            className="ml-auto bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1 rounded flex items-center text-xs"
          >
            <RotateCw className="h-3 w-3 mr-1" /> Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default FallbackBanner;
