
import React from 'react';
import { Link } from "react-router-dom";
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
    const familyInfo = getFamilyInfo(selectedFamilyId);
    const archetypes = getAllArchetypeSummaries().filter(
      a => a.familyId?.toLowerCase() === selectedFamilyId
    );
    
    return (
      <FamilyDetailView
        familyInfo={familyInfo}
        archetypes={archetypes}
        onSelectArchetype={handleArchetypeClick}
      />
    );
  }

  // Default state: Show gnome and CTA with hyperlink - now with horizontal layout
  return (
    <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 flex flex-row items-center">
      {/* Left side: Gnome image - increased size */}
      <div className="shrink-0 mr-6">
        <WebsiteImage 
          type="lefthand" 
          altText="Friendly gnome character"
          className="h-40 md:h-48 object-contain"
        />
      </div>
      
      {/* Right side: Text and CTA */}
      <div className="flex flex-col">
        <h3 className="text-2xl font-bold text-blue-700 mb-2">Come Play with the DNA!</h3>
        <p className="text-gray-600">
          Click around the helix to explore what makes each archetype unique. Then <Link to="/assessment" className="text-blue-600 hover:text-blue-800 font-medium underline">take the assessment</Link> to discover which one matches your organization.
        </p>
      </div>
    </div>
  );
};

export default ExplorerSidebar;
