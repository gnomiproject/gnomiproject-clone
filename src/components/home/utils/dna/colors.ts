import { ArchetypeId } from '@/types/archetype';
import { ARCHETYPE_COLORS } from '@/data/colors';

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
export const getArchetypeColor = (archetypeId: ArchetypeId, hexColor?: string): string => {
  // If a hex color is provided, use it directly
  if (hexColor) {
    return hexColor;
  }
  
  // Otherwise, get from our centralized colors
  return ARCHETYPE_COLORS[archetypeId] || '#888888';
};
