
import { ArchetypeId } from './archetype';

export type AssessmentQuestion = {
  id: string;
  text: string;
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

