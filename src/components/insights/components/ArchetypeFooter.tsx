
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface ArchetypeFooterProps {
  archetypeHexColor: string;
}

const ArchetypeFooter = ({ archetypeHexColor }: ArchetypeFooterProps) => {
  const navigate = useNavigate();
  
  // Get current archetype ID from URL if available
  const getArchetypeIdFromUrl = (): string | null => {
    const pathname = window.location.pathname;
    const matches = pathname.match(/\/insights\/report\/([^\/]+)/) || pathname.match(/\/insights\/(report\/)?([^\/]+)/);
    return matches ? matches[1] || matches[2] : null;
  };

  const handleRequestClick = () => {
    // Get the current archetype ID from URL or use a default path
    const archetypeId = getArchetypeIdFromUrl();
    
    if (!archetypeId) {
      console.error("No archetype ID found in URL");
      return;
    }
    
    // Navigate to the insights/report/{archetypeId} route which should contain the PremiumReport component
    navigate(`/insights/report/${archetypeId}`);
  };

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
          onClick={handleRequestClick}
        >
          Request Deep Dive Report
        </Button>
      </div>
    </div>
  );
};

export default ArchetypeFooter;
