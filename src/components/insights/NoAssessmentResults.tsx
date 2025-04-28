
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";

const NoAssessmentResults = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">No Assessment Results</h2>
          <p className="text-gray-600 mb-4">
            Take our assessment to discover your healthcare archetype and get personalized insights.
          </p>
          <p className="text-sm text-gray-500">
            <Link to="/assessment" className="text-blue-500 hover:underline">
              Want to try again? Take the assessment
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoAssessmentResults;
