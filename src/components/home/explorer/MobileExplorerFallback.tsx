
import React from 'react';

const MobileExplorerFallback: React.FC = () => {
  return (
    <section id="dna-explorer" className="relative py-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">Healthcare Archetype Families</h2>
          <p className="text-gray-600 mt-2 text-sm">
            View on desktop to explore the interactive DNA visualization.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MobileExplorerFallback;
