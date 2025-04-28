
import React from 'react';

interface DeepDiveSuccessStateProps {
  accessUrl: string;
}

const DeepDiveSuccessState = ({ accessUrl }: DeepDiveSuccessStateProps) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-green-800">
      <h4 className="font-semibold text-lg mb-2">Thank You!</h4>
      <p className="mb-3">Your request has been submitted successfully!</p>
      <p>You can access your report <a href={accessUrl} className="text-blue-600 underline font-medium">here</a>.</p>
    </div>
  );
};

export default DeepDiveSuccessState;
