
import { ArchetypeId } from '@/types/archetype';

export const isValidArchetypeId = (id: string): boolean => {
  const validIds: ArchetypeId[] = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];
  return validIds.includes(id as ArchetypeId);
};
