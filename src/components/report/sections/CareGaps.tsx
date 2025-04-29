
import React from 'react';
import CareGapsSection from './care-gaps/CareGapsSection';

interface CareGapsProps {
  reportData: any;
  averageData: any;
}

const CareGaps: React.FC<CareGapsProps> = ({ reportData, averageData }) => {
  return <CareGapsSection reportData={reportData} averageData={averageData} />;
};

export default CareGaps;
