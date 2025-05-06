
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
      category: "Member Experience",
      metrics: [
        "Care navigation utilization",
        "Digital health engagement",
        "Time to appointment",
        "Access to care metrics"
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
      
      <div className="mt-6 bg-purple-50 p-6 rounded-lg border border-purple-100">
        <h4 className="font-semibold text-purple-800 mb-3">Need Help Tracking These Metrics?</h4>
        <p className="text-gray-700 mb-4">
          If you aren't already tracking these metrics or would like to improve how you compare against 
          industry benchmarks, Artemis can help. Our platform provides the tools to track, analyze, 
          and positively impact your company's healthcare program to ensure you're leading the pack.
        </p>
        <a 
          href="mailto:contact@artemis.com?subject=Healthcare%20Analytics%20Inquiry"
          className="inline-flex items-center text-purple-700 hover:text-purple-800 font-medium"
        >
          Contact us to learn more <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </Card>
  );
};

export default SuccessMetrics;
