
import React from 'react';
import UniqueAdvantagesTab from '../tabs/UniqueAdvantagesTab';
import BiggestChallengesTab from '../tabs/BiggestChallengesTab';
import BestOpportunitiesTab from '../tabs/BestOpportunitiesTab';
import PotentialPitfallsTab from '../tabs/PotentialPitfallsTab';
import UnlockPlaceholder from './UnlockPlaceholder';
import DataPreparationPlaceholder from './DataPreparationPlaceholder';
import { ArchetypeDetailedData } from '@/types/archetype';

interface TabContentRendererProps {
  activeTab: string;
  reportData: ArchetypeDetailedData | null;
  isUnlocked: boolean;
  name: string;
  onUnlock: () => void;
  hasStrengthsData: boolean;
  hasChallengesData: boolean;
  hasOpportunitiesData: boolean;
  hasPitfallsData: boolean;
}

const TabContentRenderer: React.FC<TabContentRendererProps> = ({
  activeTab,
  reportData,
  isUnlocked,
  name,
  onUnlock,
  hasStrengthsData,
  hasChallengesData,
  hasOpportunitiesData,
  hasPitfallsData
}) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'unique-advantages':
        if (hasStrengthsData) {
          return <UniqueAdvantagesTab archetypeData={reportData} />;
        }
        return !isUnlocked ? (
          <UnlockPlaceholder name={name} onUnlock={onUnlock} />
        ) : (
          <DataPreparationPlaceholder dataType="Unique Advantages" />
        );

      case 'biggest-challenges':
        if (hasChallengesData) {
          return <BiggestChallengesTab archetypeData={reportData} />;
        }
        return !isUnlocked ? (
          <UnlockPlaceholder name={name} onUnlock={onUnlock} />
        ) : (
          <DataPreparationPlaceholder dataType="Biggest Challenges" />
        );

      case 'best-opportunities':
        if (hasOpportunitiesData) {
          return <BestOpportunitiesTab archetypeData={reportData} />;
        }
        return !isUnlocked ? (
          <UnlockPlaceholder name={name} onUnlock={onUnlock} />
        ) : (
          <DataPreparationPlaceholder dataType="Best Opportunities" />
        );

      case 'potential-pitfalls':
        if (hasPitfallsData) {
          return <PotentialPitfallsTab archetypeData={reportData} />;
        }
        return !isUnlocked ? (
          <UnlockPlaceholder name={name} onUnlock={onUnlock} />
        ) : (
          <DataPreparationPlaceholder dataType="Potential Pitfalls" />
        );

      default:
        return null;
    }
  };

  return <>{renderTabContent()}</>;
};

export default TabContentRenderer;
