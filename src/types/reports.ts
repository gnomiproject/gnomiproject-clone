
export interface Archetype {
  id: string;
  code: string;
  name: string;
  status: 'pending' | 'success' | 'error';
  lastUpdated: string | null;
}

export interface GenerationResult {
  total: number;
  succeeded: number;
  failed: number;
  errors?: string[];
  archetypeIds: string[];
}
