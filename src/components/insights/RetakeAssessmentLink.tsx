
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface RetakeAssessmentLinkProps {
  onRetakeAssessment: () => void;
}

const RetakeAssessmentLink: React.FC<RetakeAssessmentLinkProps> = ({ onRetakeAssessment }) => {
  return (
    <div className="text-center my-8">
      <span className="text-gray-600">Want to try again? </span>
      <Link 
        to="/assessment" 
        className="text-blue-500 hover:text-blue-600 inline-flex items-center gap-1"
        onClick={(e) => {
          e.preventDefault();
          onRetakeAssessment();
        }}
      >
        Retake the assessment
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

export default RetakeAssessmentLink;
