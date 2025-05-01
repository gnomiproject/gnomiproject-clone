
import React from 'react';

interface GnomePlaceholderProps {
  type?: string;
}

const GnomePlaceholder = ({ type = 'welcome' }: GnomePlaceholderProps) => {
  return (
    <div className="flex items-center justify-center bg-gray-100 rounded-lg w-full h-full">
      <div className="text-center">
        <div className="text-xs text-gray-500">Gnome Image ({type})</div>
      </div>
    </div>
  );
};

export default GnomePlaceholder;
