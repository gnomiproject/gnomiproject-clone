
import { ArchetypeFamily } from '../types/archetype';

export const archetypeFamilies: ArchetypeFamily[] = [
  {
    id: 'a',
    name: 'Strategists',
    description: 'Organizations characterized by high healthcare literacy and strategic care management. They excel at directing members to specialists rather than emergency rooms, finding pathways that prevent costly hospitalizations while ensuring quality care.',
    commonTraits: [
      'Technology-forward approach to healthcare',
      'Emphasis on preventive services',
      'Strategic allocation of healthcare resources',
      'Focus on employee engagement in health decisions'
    ]
  },
  {
    id: 'b',
    name: 'Pragmatists',
    description: 'Resourceful and pragmatic, these are organizations that excel at finding practical solutions that deliver high-value care efficiently. They deploy straightforward solutions for chronic conditions, developing accessible care pathways despite geographic challenges and operational constraints.',
    commonTraits: [
      'Cost-conscious healthcare decision making',
      'Preference for established healthcare solutions',
      'Balanced approach to benefits design',
      'Focused utilization management'
    ]
  },
  {
    id: 'c',
    name: 'Logisticians',
    description: 'Organizations that achieve operational efficiency while managing workforces with variable schedules and higher turnover dynamics. They craft scalable systems that function effectively despite staffing complexities, achieving lower costs while maintaining necessary care quality.',
    commonTraits: [
      'Structured healthcare benefit programs',
      'Emphasis on care coordination',
      'Data-driven approach to program adjustments',
      'Comprehensive condition management protocols'
    ]
  }
];
