
import { ArchetypeId } from '@/types/archetype';

/**
 * Creates gradients for DNA strands
 */
export const createDNAGradients = (ctx: CanvasRenderingContext2D, height: number) => {
  // Create the left strand gradient (blue to teal)
  const blueGradient = ctx.createLinearGradient(0, 0, 0, height);
  blueGradient.addColorStop(0, '#00B0F0'); // Family A color (top)
  blueGradient.addColorStop(0.5, '#0D41C0'); // Family B3 color (middle)
  blueGradient.addColorStop(1, '#00B2B1'); // Family B color (bottom)

  // Create the right strand gradient (orange to pink)
  const orangeGradient = ctx.createLinearGradient(0, 0, 0, height);
  orangeGradient.addColorStop(0, '#EC7500'); // Archetype A1 (top)
  orangeGradient.addColorStop(0.5, '#FFC600'); // Archetype A3 (middle)
  orangeGradient.addColorStop(1, '#FF8B91'); // Family C color (bottom)

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
