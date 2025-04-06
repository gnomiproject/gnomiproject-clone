
import { ArchetypeId } from '@/types/archetype';

/**
 * Creates gradients for DNA strands
 */
export const createDNAGradients = (ctx: CanvasRenderingContext2D, height: number) => {
  // Create the left strand gradient (blue to teal to deep blue)
  const blueGradient = ctx.createLinearGradient(0, 0, 0, height);
  blueGradient.addColorStop(0, '#33C3F0'); // Sky blue at top
  blueGradient.addColorStop(0.5, '#00B2B1'); // Teal in middle
  blueGradient.addColorStop(1, '#0D41C0'); // Deep blue at bottom

  // Create the right strand gradient (orange to yellow to pink)
  const orangeGradient = ctx.createLinearGradient(0, 0, 0, height);
  orangeGradient.addColorStop(0, '#F97316'); // Orange at top
  orangeGradient.addColorStop(0.5, '#FFC600'); // Yellow in middle
  orangeGradient.addColorStop(1, '#FF8B91'); // Pink at bottom

  return { blueGradient, orangeGradient };
};

/**
 * Returns the appropriate color for an archetype circle
 */
export const getArchetypeColor = (archetypeId: ArchetypeId): string => {
  // Map archetype IDs to colors
  const colorMap: Record<ArchetypeId, string> = {
    'a1': '#EC7500', // orange
    'a2': '#00B2B1', // teal
    'a3': '#FFC600', // yellow
    'b1': '#00B0F0', // blue
    'b2': '#7030A0', // purple
    'b3': '#0D41C0', // blue
    'c1': '#00B050', // green
    'c2': '#C00000', // red
    'c3': '#5B2D90'  // indigo
  };
  
  return colorMap[archetypeId] || '#888888';
};
