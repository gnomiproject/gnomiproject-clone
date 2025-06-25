
import React, { createContext, useContext, ReactNode } from 'react';
import { useArchetypeBasics } from '@/hooks/archetype/useArchetypeBasics';
import { Archetype, ArchetypeFamily, ArchetypeId, FamilyId } from '@/types/archetype';

interface ArchetypeDataContextType {
  archetypes: Archetype[];
  families: ArchetypeFamily[];
  getArchetypeById: (id: ArchetypeId) => Archetype | null;
  getArchetypesByFamily: (familyId: string) => Archetype[];
  getFamilyById: (id: FamilyId) => ArchetypeFamily | null;
  isLoading: boolean;
  error: Error | null;
}

const ArchetypeDataContext = createContext<ArchetypeDataContextType | undefined>(undefined);

interface ArchetypeDataProviderProps {
  children: ReactNode;
}

export const ArchetypeDataProvider: React.FC<ArchetypeDataProviderProps> = ({ children }) => {
  const archetypeData = useArchetypeBasics();
  
  // Add request tracking for debugging
  React.useEffect(() => {
    if (archetypeData.isLoading) {
      console.log('[ArchetypeDataProvider] Loading archetype data...');
    } else if (archetypeData.error) {
      console.error('[ArchetypeDataProvider] Error loading data:', archetypeData.error);
    } else {
      console.log('[ArchetypeDataProvider] Data loaded successfully:', {
        archetypeCount: archetypeData.archetypes.length,
        familyCount: archetypeData.families.length
      });
    }
  }, [archetypeData.isLoading, archetypeData.error, archetypeData.archetypes.length, archetypeData.families.length]);
  
  return (
    <ArchetypeDataContext.Provider value={archetypeData}>
      {children}
    </ArchetypeDataContext.Provider>
  );
};

export const useArchetypeData = () => {
  const context = useContext(ArchetypeDataContext);
  if (context === undefined) {
    throw new Error('useArchetypeData must be used within an ArchetypeDataProvider');
  }
  return context;
};
