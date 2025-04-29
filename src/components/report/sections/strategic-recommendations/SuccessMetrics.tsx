
import React from 'react';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface SuccessMetricsProps {
  reportData?: any;
}

const SuccessMetrics: React.FC<SuccessMetricsProps> = ({ reportData }) => {
  // Define metric categories and specific metrics to track
  const metricCategories = [
    {
      category: "Utilization Metrics",
      metrics: [
        "Primary care visit rate per 1,000 members",
        "Emergency department utilization rate",
        "Telehealth adoption percentage",
        "Specialist referral rates"
      ],
      color: "blue"
    },
    {
      category: "Cost Management",
      metrics: [
        "Medical cost PMPM trend",
        "Avoidable ER visit cost reduction",
        "Pharmacy cost PMPM",
        "High-cost claimant percentage"
      ],
      color: "green"
    },
    {
      category: "Quality & Outcomes",
      metrics: [
        "Preventive care gap closure rates",
        "Chronic condition medication adherence",
        "Hospital readmissions rate",
        "Disease control metrics (e.g., HbA1c levels)"
      ],
      color: "purple"
    },
    {
      category: "Member Experience",
      metrics: [
        "Member satisfaction scores",
        "Digital engagement rates",
        "Time to appointment",
        "Care navigation utilization"
      ],
      color: "orange"
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Check className="h-6 w-6 text-purple-600" />
        <h3 className="text-xl font-semibold">Success Metrics</h3>
      </div>
      
      <p className="text-gray-600 mb-6">
        To measure the effectiveness of your strategic initiatives, we recommend tracking 
        these key metrics across four essential categories:
      </p>
      
      <div className="space-y-6">
        {metricCategories.map((category, index) => (
          <div key={index}>
            <h4 className={`font-medium text-${category.color}-700 text-lg mb-3`}>
              {category.category}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {category.metrics.map((metric, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-${category.color}-100 flex items-center justify-center`}>
                    <div className={`w-2 h-2 rounded-full bg-${category.color}-500`}></div>
                  </div>
                  <span className="text-gray-700">{metric}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
        <h4 className="font-medium text-gray-700 mb-2">Recommended Tracking Cadence</h4>
        <p className="text-gray-600">
          Monthly: Cost trends, care gap closure<br />
          Quarterly: Utilization patterns, program engagement<br />
          Annually: Full program impact assessment and strategic adjustment
        </p>
      </div>
    </Card>
  );
};

export default SuccessMetrics;
