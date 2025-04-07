
import { ArchetypeId } from './archetype';

export type AssessmentQuestion = {
  id: string;
  text: string;
  type?: 'single-select' | 'multi-select'; // Added type property as optional
  options: {
    id: string;
    text: string;
    archetypeWeights: {
      [key in ArchetypeId]?: number;
    };
  }[];
};

export type AssessmentResult = {
  primaryArchetype: ArchetypeId;
  secondaryArchetype: ArchetypeId | null;
  tertiaryArchetype: ArchetypeId | null;
  score: number;
  percentageMatch: number;
  resultTier: 'Basic' | 'Detailed' | 'Comprehensive';
};
