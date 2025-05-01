
import { ArchetypeDetailedData } from '../types/archetype';
import { getArchetypeColorHex } from './colors';

// Export an array of archetype data for fallback scenarios
export const archetypesDetailed: ArchetypeDetailedData[] = [
  // We can leave this empty for now as it's just needed for the type definition
  // The system will first try to get data from Supabase before falling back to this
];

// Export default for backward compatibility if needed
export default archetypesDetailed;
