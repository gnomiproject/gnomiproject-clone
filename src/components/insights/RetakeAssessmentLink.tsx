
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const RetakeAssessmentLink = () => {
  return (
    <div className="text-center my-8">
      <span className="text-gray-600">Want to try again? </span>
      <Link to="/assessment" className="text-blue-500 hover:text-blue-600 inline-flex items-center gap-1">
        Retake the assessment
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

export default RetakeAssessmentLink;
