
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface RetakeButtonProps {
  onClick: () => void;
}

const RetakeButton = ({ onClick }: RetakeButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="text-gray-600 hover:text-gray-800 inline-flex items-center text-sm gap-1.5 transition-colors"
    >
      Want to try again? <span className="text-blue-500">Retake the assessment</span> <ArrowRight className="h-3.5 w-3.5 text-blue-500" />
    </button>
  );
};

export default RetakeButton;
