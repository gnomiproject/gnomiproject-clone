
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
  
  // Simplified logging - only log once when data changes
  React.useEffect(() => {
    if (!archetypeData.isLoading && !archetypeData.error) {
      console.log('[ArchetypeDataProvider] Context data ready:', {
        archetypeCount: archetypeData.archetypes.length,
        familyCount: archetypeData.families.length
      });
    }
  }, [archetypeData.isLoading, archetypeData.error]);
  
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
