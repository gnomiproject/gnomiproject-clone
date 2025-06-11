
import React from 'react';

interface MetricsValidatorProps {
  metrics: any;
}

const MetricsValidator = ({ metrics }: MetricsValidatorProps) => {
  // Check for data structure validity rather than exact values
  const structureIssues = [];
  
  if (!metrics.cost || typeof metrics.cost.value !== 'number' || typeof metrics.cost.average !== 'number') {
    structureIssues.push('Cost metrics structure invalid');
  }
  if (!metrics.risk || typeof metrics.risk.value !== 'number' || typeof metrics.risk.average !== 'number') {
    structureIssues.push('Risk metrics structure invalid');
  }
  if (!metrics.emergency || typeof metrics.emergency.value !== 'number' || typeof metrics.emergency.average !== 'number') {
    structureIssues.push('Emergency metrics structure invalid');
  }
  if (!metrics.specialist || typeof metrics.specialist.value !== 'number' || typeof metrics.specialist.average !== 'number') {
    structureIssues.push('Specialist metrics structure invalid');
  }

  if (structureIssues.length > 0) {
    console.error('[MetricsValidator] 🚨 METRICS STRUCTURE ISSUES:', structureIssues);
    console.error('[MetricsValidator] Full metrics object:', metrics);
  } else {
    console.log('[MetricsValidator] ✅ All metrics have valid structure');
  }

  // Only show validation in development for structure issues
  if (import.meta.env.DEV && structureIssues.length > 0) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong>Debug Warning:</strong> Metrics structure issues detected: {structureIssues.join(', ')}
      </div>
    );
  }

  return null;
};

export default MetricsValidator;
