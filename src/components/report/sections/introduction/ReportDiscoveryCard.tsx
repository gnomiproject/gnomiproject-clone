
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const ReportDiscoveryCard = () => {
  return (
    <Card className="bg-slate-50 p-6 border border-slate-100">
      <h3 className="text-xl font-semibold mb-4">What You'll Discover in This Report</h3>
      
      <ul className="space-y-3 mb-6">
        <li className="flex items-start">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
            <span className="text-primary font-bold text-sm">1</span>
          </div>
          <span>Comprehensive analysis of your population's healthcare utilization patterns</span>
        </li>
        <li className="flex items-start">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
            <span className="text-primary font-bold text-sm">2</span>
          </div>
          <span>Insights into cost drivers specific to your archetype</span>
        </li>
        <li className="flex items-start">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
            <span className="text-primary font-bold text-sm">3</span>
          </div>
          <span>Strategic recommendations tailored to your organization's profile</span>
        </li>
        <li className="flex items-start">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
            <span className="text-primary font-bold text-sm">4</span>
          </div>
          <span>Actionable opportunities for improving healthcare outcomes</span>
        </li>
      </ul>
      
      <div className="mt-6 flex justify-end">
        <Button className="bg-[#46E0D3] hover:bg-[#3BC0B5] text-white">
          Start Exploring <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default ReportDiscoveryCard;
