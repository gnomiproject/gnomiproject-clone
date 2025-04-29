
import React from 'react';
import { Heart } from 'lucide-react';

interface DiseaseManagementProps {
  reportData: any;
  averageData: any;
}

const DiseaseManagement = ({ reportData, averageData }: DiseaseManagementProps) => {
  // Gnome image
  const gnomeImage = '/assets/gnomes/gnome_magnifying.png';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-6">Disease Prevalence</h1>
          <p className="text-lg">
            This section analyzes the prevalence of key conditions in your population.
            We'll expand this section in the next update.
          </p>
        </div>
        <div className="md:w-1/3 flex justify-center">
          <img
            src={gnomeImage}
            alt="Disease Gnome"
            className="max-h-64 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/gnomes/placeholder.svg';
            }}
          />
        </div>
      </div>

      <div className="bg-blue-50 p-8 rounded-lg text-center">
        <Heart className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
        <p>The full disease prevalence analysis will be available in the next update.</p>
      </div>
    </div>
  );
};

export default DiseaseManagement;
