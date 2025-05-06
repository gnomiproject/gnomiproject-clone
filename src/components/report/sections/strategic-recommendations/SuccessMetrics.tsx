
import React from 'react';
import { Card } from '@/components/ui/card';
import { Check, ArrowRight } from 'lucide-react';

interface SuccessMetricsProps {
  reportData?: any;
}

const SuccessMetrics: React.FC<SuccessMetricsProps> = ({ reportData }) => {
  // Define metric categories and specific metrics to track from level4 table metrics
  const metricCategories = [
    {
      category: "Utilization Metrics",
      metrics: [
        "PCP visits per 1,000 members",
        "Emergency department visits per 1,000 members",
        "Telehealth adoption percentage",
        "Specialist visits per 1,000 members"
      ],
      color: "blue"
    },
    {
      category: "Cost Management",
      metrics: [
        "Medical & RX cost PMPY trend",
        "Avoidable ER visit cost reduction",
        "Specialty RX cost PMPM",
        "High-cost claimant percentage"
      ],
      color: "green"
    },
    {
      category: "Quality & Outcomes",
      metrics: [
        "Preventive care gap closure rates",
        "Diabetes medication adherence",
        "Hospital readmissions rate",
        "HbA1c control metrics"
      ],
      color: "purple"
    },
    {
      category: "Risk Factors",
      metrics: [
        "Concurrent Clinical Risk Score",
        "Prospective Clinical Risk Score",
        "Emerging Risk Indicators",
        "SDOH Risk Factors"
      ],
      color: "amber"
    }
  ];

  return (
    <Card className="p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Success Metrics</h3>
      </div>
      
      <div className="space-y-6">
        <div>
          <p className="text-gray-600 mb-4">
            To maximize the value of these recommendations, we suggest tracking your organization's 
            performance metrics and comparing them against this archetype's benchmarks. This comparative 
            analysis allows you to identify where your performance leads or lags relative to similar 
            organizations.
          </p>
          
          <p className="text-gray-600 mb-6">
            Below are key metrics we recommend monitoring across four essential categories 
            that align with the data presented throughout this report:
          </p>
        </div>
        
        {metricCategories.map((category, index) => (
          <div key={index}>
            <h4 className={`font-medium text-${category.color}-700 text-lg mb-3`}>
              {category.category}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {category.metrics.map((metric, mIndex) => (
                <div key={mIndex} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{metric}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 bg-purple-50 p-6 rounded-lg border border-purple-100">
        <h4 className="font-semibold text-purple-800 mb-3">Need Help Tracking These Metrics?</h4>
        <p className="text-gray-700 mb-4">
          If you aren't already tracking these metrics or would like to improve how you compare against 
          industry benchmarks, Artemis can help. Our platform provides the tools to track, analyze, 
          and positively impact your company's healthcare program to ensure you're leading the pack.
        </p>
        <a 
          href="mailto:artemis@nomihealth.com?subject=Healthcare%20Analytics%20Inquiry"
          className="inline-flex items-center text-purple-700 hover:text-purple-800 font-medium"
        >
          Contact us to learn more <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </Card>
  );
};

export default SuccessMetrics;
