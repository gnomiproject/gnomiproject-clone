
export type ArchetypeId = 'a1' | 'a2' | 'a3' | 'b1' | 'b2' | 'b3' | 'c1' | 'c2' | 'c3';

export type ArchetypeColor = 'archetype-a1' | 'archetype-a2' | 'archetype-a3' | 'archetype-b1' | 'archetype-b2' | 'archetype-b3' | 'archetype-c1' | 'archetype-c2' | 'archetype-c3';

export interface Archetype {
  id: ArchetypeId;
  familyId: 'a' | 'b' | 'c';
  name: string;
  description?: string;
  color?: string;
  characteristics?: string[];
}

export interface ArchetypeSummary {
  id: ArchetypeId;
  familyId: 'a' | 'b' | 'c';
  name: string;
  description?: string;
  key_characteristics?: string[];
}

export interface ArchetypeDetailedData {
  id: ArchetypeId;
  familyId: 'a' | 'b' | 'c';
  name: string;
  familyName: string;
  color: string;
  hexColor: string;
  short_description: string;
  long_description: string;
  key_characteristics: string[];
}

export interface ArchetypeFamily {
  id: 'a' | 'b' | 'c';
  name: string;
  hexColor: string;
  description: string;
  commonTraits: string[];
}
