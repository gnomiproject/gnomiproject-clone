
import React from 'react';

interface RetakeAssessmentLinkProps {
  onRetakeAssessment: () => void;
}

const RetakeAssessmentLink = ({ onRetakeAssessment }: RetakeAssessmentLinkProps) => {
  return (
    <div className="max-w-5xl mx-auto mb-8 text-center">
      <p className="text-lg">
        Want to try again?{" "}
        <button 
          onClick={onRetakeAssessment} 
          className="text-blue-600 font-medium hover:underline inline-flex items-center"
        >
          Retake the assessment
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <path d="m13 5 7 7-7 7"></path>
            <path d="M5 12h15"></path>
          </svg>
        </button>
      </p>
    </div>
  );
};

export default RetakeAssessmentLink;
