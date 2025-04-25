
import { ArchetypeFamily } from '@/types/archetype';

export const archetypeFamilies: ArchetypeFamily[] = [
  {
    id: 'a',
    name: 'Strategists',
    hexColor: '#8B5CF6',
    description: 'Organizations focused on strategic healthcare innovation and long-term vision',
    commonTraits: [
      'Forward-thinking approach to employee healthcare',
      'Willingness to invest in innovative solutions',
      'Strategic alignment of healthcare with business goals',
      'Emphasis on data-driven decision making'
    ]
  },
  {
    id: 'b',
    name: 'Pragmatists',
    hexColor: '#EC4899',
    description: 'Organizations balancing practical healthcare implementation with measured innovation',
    commonTraits: [
      'Balanced approach to healthcare management',
      'Focus on operational efficiency',
      'Selective adoption of proven solutions',
      'Emphasis on measurable outcomes and ROI'
    ]
  },
  {
    id: 'c',
    name: 'Logisticians',
    hexColor: '#0EA5E9',
    description: 'Organizations prioritizing structured healthcare administration and compliance',
    commonTraits: [
      'Systematic approach to healthcare administration',
      'Strong focus on compliance and risk management',
      'Comprehensive and consistent benefit offerings',
      'Emphasis on process reliability and standardization'
    ]
  }
];
