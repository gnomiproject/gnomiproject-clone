
import React from 'react';
import CareGapsSection from './care-gaps/CareGapsSection';

interface CareGapsProps {
  reportData: any;
  averageData: any;
}

const CareGaps: React.FC<CareGapsProps> = ({ reportData, averageData }) => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold mb-6">Care Gaps</h1>
      
      <p className="text-gray-700 mb-6">
        Identifying and addressing gaps in care is essential for improving health outcomes and reducing long-term costs.
        This section highlights key areas where preventive care and condition management can be improved.
      </p>
      
      <CareGapsSection reportData={reportData} averageData={averageData} />
    </div>
  );
};

export default CareGaps;
