
import React from 'react';

const EmptyExplorerState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-10 bg-gray-50 rounded-lg border border-gray-100 text-center">
      <img 
        src="/lovable-uploads/3efcc8b7-0e2d-4a2b-bb23-fa686f18c691.png" 
        alt="Interactive guide" 
        className="h-16 mb-4 opacity-60"
      />
      <h3 className="text-xl font-bold text-gray-700 mb-2">Explore the Healthcare Archetypes</h3>
      <p className="text-gray-600 max-w-md">
        Click on any step in the DNA helix or family button to learn more about our healthcare archetypes.
      </p>
    </div>
  );
};

export default EmptyExplorerState;
