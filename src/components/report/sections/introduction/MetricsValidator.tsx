
import React from 'react';

interface MetricsValidatorProps {
  metrics: any;
}

const MetricsValidator = ({ metrics }: MetricsValidatorProps) => {
  // Alert if wrong averages are being used
  const incorrectAverages = [];
  if (metrics.cost.average !== 13440) incorrectAverages.push(`Cost: ${metrics.cost.average} ≠ 13440`);
  if (metrics.risk.average !== 0.95) incorrectAverages.push(`Risk: ${metrics.risk.average} ≠ 0.95`);
  if (metrics.emergency.average !== 135) incorrectAverages.push(`Emergency: ${metrics.emergency.average} ≠ 135`);
  if (metrics.specialist.average !== 2250) incorrectAverages.push(`Specialist: ${metrics.specialist.average} ≠ 2250`);

  if (incorrectAverages.length > 0) {
    console.error('[MetricsValidator] 🚨 WRONG AVERAGES DETECTED:', incorrectAverages);
    console.error('[MetricsValidator] This indicates averageData is not being passed correctly!');
  } else {
    console.log('[MetricsValidator] ✅ All average values are CORRECT!');
  }

  // Only show validation in development
  if (import.meta.env.DEV && incorrectAverages.length > 0) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong>Debug Warning:</strong> Incorrect average values detected: {incorrectAverages.join(', ')}
      </div>
    );
  }

  return null;
};

export default MetricsValidator;
