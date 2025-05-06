
import React from 'react';

interface TokenStatusBannerProps {
  tokenStatus: 'valid' | 'checking' | 'warning' | 'error' | 'grace-period';
  onRequestNewToken: () => void;
  isUsingFallbackData: boolean;
}

const TokenStatusBanner: React.FC<TokenStatusBannerProps> = ({
  tokenStatus,
  onRequestNewToken,
  isUsingFallbackData
}) => {
  // Don't render anything if token is valid or being checked
  if (tokenStatus === 'valid' || tokenStatus === 'checking') {
    return null;
  }

  // Warning banner (near-expired tokens)
  if (tokenStatus === 'warning') {
    return (
      <div className="bg-yellow-50 border-b border-yellow-200 p-2 text-center">
        <p className="text-sm text-yellow-700">
          <span className="font-semibold">Note:</span> This report access will expire soon.
          Please contact your administrator if you need continued access.
        </p>
      </div>
    );
  }

  // Grace period banner - more informative and less alarming
  if (tokenStatus === 'grace-period') {
    return (
      <div className="bg-orange-50 border-b border-orange-200 p-3 text-center">
        <p className="text-sm text-orange-700">
          <span className="font-semibold">Access Token Expired:</span> This report is viewable in grace period mode.
          {isUsingFallbackData && " You're viewing a cached copy of this report."}
        </p>
        <button
          onClick={onRequestNewToken}
          className="mt-2 px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
        >
          Request New Access Token
        </button>
      </div>
    );
  }

  // Error banner with fallback data
  if (tokenStatus === 'error' && isUsingFallbackData) {
    return (
      <div className="bg-red-50 border-b border-red-200 p-4 text-center">
        <p className="text-base text-red-700">
          <span className="font-semibold">Access Token Expired:</span> You're viewing a cached copy of this report.
        </p>
        <button
          onClick={onRequestNewToken}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Request New Access Token
        </button>
      </div>
    );
  }

  return null;
};

export default TokenStatusBanner;
