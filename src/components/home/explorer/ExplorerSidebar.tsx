
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WebsiteImage from '@/components/common/WebsiteImage';
import ArchetypeDetailView from '../ArchetypeDetailView';
import FamilyDetailView from '../FamilyDetailView';
import { ArchetypeId } from '@/types/archetype';

interface ExplorerSidebarProps {
  selectedArchetypeId: string | null;
  selectedFamilyId: 'a' | 'b' | 'c' | null;
  formatArchetypeSummary: (archetypeId: string) => any;
  getFamilyInfo: (familyId: 'a' | 'b' | 'c') => any;
  getAllArchetypeSummaries: () => any[];
  handleArchetypeClick: (id: string) => void;
}

const ExplorerSidebar: React.FC<ExplorerSidebarProps> = ({
  selectedArchetypeId,
  selectedFamilyId,
  formatArchetypeSummary,
  getFamilyInfo,
  getAllArchetypeSummaries,
  handleArchetypeClick
}) => {
  if (selectedArchetypeId) {
    // Show archetype details when an archetype is selected
    return (
      <ArchetypeDetailView 
        archetypeSummary={formatArchetypeSummary(selectedArchetypeId)}
      />
    );
  } 
  
  if (selectedFamilyId) {
    // Show family details when a family is selected
    return (
      <FamilyDetailView
        familyInfo={getFamilyInfo(selectedFamilyId)}
        archetypes={getAllArchetypeSummaries()}
        onSelectArchetype={handleArchetypeClick}
      />
    );
  }

  // Default state: Show gnome and CTA
  return (
    <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 flex flex-col items-center justify-center">
      <WebsiteImage 
        type="lefthand" 
        altText="Friendly gnome character"
        className="h-32 mb-4"
      />
      
      <h3 className="text-2xl font-bold text-blue-700 mb-2">Come Play with the DNA!</h3>
      <p className="text-gray-600 mb-6 text-center">
        Click around the helix to explore what makes each archetype unique. Then take the assessment to discover which one matches your organization.
      </p>
      
      <Button asChild size="lg">
        <Link to="/assessment">Take the Assessment</Link>
      </Button>
    </div>
  );
};

export default ExplorerSidebar;
