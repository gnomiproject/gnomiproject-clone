
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface CareGapsProps {
  reportData: any;
  averageData: any;
}

const CareGaps = ({ reportData, averageData }: CareGapsProps) => {
  // Gnome image
  const gnomeImage = '/assets/gnomes/gnome_clipboard.png';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-6">Care Gaps</h1>
          <p className="text-lg">
            This section highlights opportunities to improve care delivery and health outcomes.
            We'll expand this section in the next update.
          </p>
        </div>
        <div className="md:w-1/3 flex justify-center">
          <img
            src={gnomeImage}
            alt="Care Gaps Gnome"
            className="max-h-64 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/gnomes/placeholder.svg';
            }}
          />
        </div>
      </div>

      <div className="bg-blue-50 p-8 rounded-lg text-center">
        <AlertCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
        <p>The full care gaps analysis will be available in the next update.</p>
      </div>
    </div>
  );
};

export default CareGaps;
