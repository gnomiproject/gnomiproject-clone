
import React from 'react';
import { toast } from 'sonner';
import { checkCacheHealth } from '@/utils/reports/reportCache';

interface DebugButtonProps {
  isVisible: boolean;
  sessionStartTime: number;
  tokenStatus: 'valid' | 'checking' | 'warning' | 'error' | 'grace-period';
  lastStatusCheck: number;
  userData: any;
  isUsingFallbackData: boolean;
  reportData: any;
  debugInfo?: any;
}

const DebugButton: React.FC<DebugButtonProps> = ({
  isVisible,
  sessionStartTime,
  tokenStatus,
  lastStatusCheck,
  userData,
  isUsingFallbackData,
  reportData,
  debugInfo
}) => {
  if (!isVisible) {
    return null;
  }

  const handleClick = () => {
    console.group('[ReportViewer] Debug Info');
    console.log('Session Duration:', ((Date.now() - sessionStartTime) / 1000).toFixed(1) + 's');
    console.log('Token Status:', { status: tokenStatus, lastCheck: new Date(lastStatusCheck).toLocaleString() });
    console.log('User Data:', userData);
    console.log('Using Fallback Data:', isUsingFallbackData);
    console.log('Report Data Sample:', reportData ? {
      id: reportData.id || reportData.archetype_id,
      name: reportData.name || reportData.archetype_name
    } : null);
    console.log('Cache Health:', checkCacheHealth());
    console.log('Token Validation History:', debugInfo?.validationHistory || 'Not available');
    console.groupEnd();
    
    toast('Debug info logged to console', {
      description: `Token status: ${tokenStatus}`
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 print:hidden">
      <button
        onClick={handleClick}
        className="bg-gray-800 text-white px-3 py-1 rounded text-xs shadow-lg"
      >
        Log Debug Data
      </button>
    </div>
  );
};

export default DebugButton;
