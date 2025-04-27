
import React from 'react';
import { Button } from "@/components/ui/button";

interface ArchetypeFooterProps {
  archetypeHexColor: string;
}

const ArchetypeFooter = ({ archetypeHexColor }: ArchetypeFooterProps) => {
  return (
    <div className="bg-gray-50 p-6 md:p-8 border-t">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Want a deeper analysis?</h3>
          <p className="text-gray-600 max-w-xl">Get a customized report tailored to your specific organization with detailed metrics and actionable recommendations.</p>
        </div>
        <Button 
          className="text-white px-6 py-3"
          style={{ backgroundColor: archetypeHexColor }}
          onClick={() => window.open('/contact', '_blank')}
        >
          Request Custom Analysis
        </Button>
      </div>
    </div>
  );
};

export default ArchetypeFooter;
