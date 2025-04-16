
import { ArchetypeId } from '@/types/archetype';

// Family colors with their hex values and RGB values (for CSS variables)
export const FAMILY_COLORS = {
  a: {
    name: 'Strategists',
    hexColor: '#00B0F0',
    rgbValues: '0, 176, 240'
  },
  b: {
    name: 'Pragmatists',
    hexColor: '#00B2B1',
    rgbValues: '0, 178, 177'
  },
  c: {
    name: 'Logisticians',
    hexColor: '#FF8B91',
    rgbValues: '255, 139, 145'
  }
};

// Archetype colors with their hex values
export const ARCHETYPE_COLORS: Record<ArchetypeId, string> = {
  'a1': '#EC7500', // Savvy Healthcare Navigators
  'a2': '#46E0D3', // Complex Condition Managers
  'a3': '#FFC600', // Proactive Care Consumers
  'b1': '#7030A0', // Resourceful Adapters
  'b2': '#FF8C91', // Healthcare Pragmatists
  'b3': '#0D41C0', // Care Channel Optimizers
  'c1': '#E40032', // Scalable Access Architects
  'c2': '#00B0F0', // Care Adherence Advocates
  'c3': '#870C0C'  // Engaged Healthcare Consumers
};

// Function to get an archetype's color
export const getArchetypeColorHex = (archetypeId: ArchetypeId): string => {
  return ARCHETYPE_COLORS[archetypeId] || '#888888'; // Fallback color if not found
};

// Function to get a family's color
export const getFamilyColorHex = (familyId: 'a' | 'b' | 'c'): string => {
  return FAMILY_COLORS[familyId].hexColor;
};

// Function to get a family's RGB values for CSS variables
export const getFamilyRgbValues = (familyId: 'a' | 'b' | 'c'): string => {
  return FAMILY_COLORS[familyId].rgbValues;
};

// For CSS class name generation
export const getArchetypeColorClass = (archetypeId: ArchetypeId): string => {
  return `archetype-${archetypeId}`;
};

export const getFamilyColorClass = (familyId: 'a' | 'b' | 'c'): string => {
  return `family-${familyId}`;
};
