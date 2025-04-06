
import React from 'react';
import { Link } from 'react-router-dom';

const EmptyExplorerState: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center bg-blue-50/50 rounded-lg border border-blue-100 p-6 shadow-sm">
      {/* Left side: Gnome image */}
      <div className="shrink-0 mb-4 md:mb-0 md:mr-6">
        <img 
          src="/lovable-uploads/81530cfd-8e54-4bfc-8fda-6658f15d9b8b.png" 
          alt="Friendly gnome character" 
          className="h-32 md:h-40"
        />
      </div>
      
      {/* Right side: Text and CTA */}
      <div className="flex flex-col text-center md:text-left">
        <h3 className="text-2xl font-bold text-blue-700 mb-2">Come Play with the DNA!</h3>
        <p className="text-gray-600 mb-4">
          Click around the helix to explore what makes each archetype unique.
          Then <Link to="/assessment" className="text-blue-600 hover:text-blue-800 font-medium underline">take the assessment</Link> to discover which one matches your organization.
        </p>
      </div>
    </div>
  );
};

export default EmptyExplorerState;
