
import React from 'react';
import TopConditions from './disease/TopConditions';
import BehavioralHealthConditions from './disease/BehavioralHealthConditions';
import SpecialtyConditions from './disease/SpecialtyConditions';

interface DiseaseManagementProps {
  reportData: any;
  averageData: any;
}

const DiseaseManagement = ({ reportData, averageData }: DiseaseManagementProps) => {
  // Gnome image for the section
  const gnomeImage = '/assets/gnomes/gnome_magnifying.png';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-6">Disease Prevalence</h1>
          <p className="text-lg mb-2">
            Understanding the prevalence of health conditions across your population is crucial for
            developing effective care management strategies and benefit designs.
          </p>
          <p className="text-gray-600">
            This analysis compares your population's disease burden against benchmarks and
            identifies opportunities to improve health outcomes and reduce costs.
          </p>
        </div>
        <div className="md:w-1/3 flex justify-center">
          <img
            src={gnomeImage}
            alt="Disease Analysis Gnome"
            className="max-h-64 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/gnomes/placeholder.svg';
            }}
          />
        </div>
      </div>

      {/* Top Chronic Conditions */}
      <TopConditions reportData={reportData} averageData={averageData} />

      {/* Behavioral Health Conditions */}
      <BehavioralHealthConditions reportData={reportData} averageData={averageData} />

      {/* Specialty Conditions */}
      <SpecialtyConditions reportData={reportData} averageData={averageData} />
    </div>
  );
};

export default DiseaseManagement;
