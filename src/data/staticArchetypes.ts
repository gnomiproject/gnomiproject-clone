
import { ArchetypeId } from '@/types/archetype';

export interface StaticArchetype {
  id: ArchetypeId;
  name: string;
  familyId: string;
  description: string;
}

export const ARCHETYPES: StaticArchetype[] = [
  { id: 'a1', name: 'Savvy Healthcare Navigators', familyId: 'a', description: 'Effective at directing care appropriately' },
  { id: 'a2', name: 'Complex Condition Managers', familyId: 'a', description: 'Adept at managing clinical complexity' },
  { id: 'a3', name: 'Proactive Care Consumers', familyId: 'a', description: 'Focused on prevention and early intervention' },
  { id: 'b1', name: 'Resourceful Adapters', familyId: 'b', description: 'Skilled at overcoming access barriers' },
  { id: 'b2', name: 'Healthcare Pragmatists', familyId: 'b', description: 'Cost-effective and practical' },
  { id: 'b3', name: 'Care Channel Optimizers', familyId: 'b', description: 'Effective across geographic boundaries' },
  { id: 'c1', name: 'Scalable Access Architects', familyId: 'c', description: 'Adaptable to varying schedules' },
  { id: 'c2', name: 'Care Adherence Advocates', familyId: 'c', description: 'Systematic in their approach' },
  { id: 'c3', name: 'Engaged Healthcare Consumers', familyId: 'c', description: 'Committed to self-directed care' },
];
