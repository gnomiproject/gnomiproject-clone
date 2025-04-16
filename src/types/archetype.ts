
export type ArchetypeFamily = {
  id: 'a' | 'b' | 'c';
  name: string;
  description: string;
  commonTraits: string[];
  hexColor?: string; // New optional field for precise hex color
};
