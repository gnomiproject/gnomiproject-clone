
import { ArchetypeId } from '@/types/archetype';

export interface DNAHelixProps {
  className?: string;
  onStepClick?: (archetypeId: ArchetypeId) => void;
  selectedArchetypeId?: ArchetypeId | null;
}

export interface StepPosition {
  x1: number;
  x2: number;
  y: number;
  archetypeId: ArchetypeId;
  circleX?: number;
  circleRadius?: number;
}

// Map step positions to archetype IDs
export const stepToArchetypeMap: ArchetypeId[] = [
  'a1', 'a2', 'a3',
  'b1', 'b2', 'b3',
  'c1', 'c2', 'c3',
  'a1', 'a2', 'a3', 'b1' // Adding extras to fill all 13 steps (we'll only use first 9)
];
