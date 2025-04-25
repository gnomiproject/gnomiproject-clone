import { DistinctiveTraits } from '../types/archetype';

export const distinctiveTraits: DistinctiveTraits[] = [
  // Family A: Strategists
  {
    archetypeId: 'a1',
    id: 'a1',
    diseasePatterns: [
      { condition: 'Mental Health Conditions', variance: 20 },
      { condition: 'Musculoskeletal Disorders', variance: 15 },
      { condition: 'Autoimmune Conditions', variance: 25 }
    ],
    utilizationPatterns: [
      { category: 'Specialist Care', variance: 30 },
      { category: 'Digital Health', variance: 40 },
      { category: 'Emergency Care', variance: -15 }
    ],
    uniqueInsights: [
      'High specialist utilization paired with low emergency utilization indicates effective care navigation',
      'Technology adoption rates exceed benchmarks by 35%',
      'Mental health utilization shows strong engagement with available resources'
    ]
  },
  {
    archetypeId: 'a2',
    id: 'a2',
    diseasePatterns: [
      { condition: 'Chronic Conditions', variance: 30 },
      { condition: 'Rare Diseases', variance: 45 },
      { condition: 'Complex Comorbidities', variance: 35 }
    ],
    utilizationPatterns: [
      { category: 'Specialty Pharmacy', variance: 50 },
      { category: 'Case Management', variance: 40 },
      { category: 'Hospital Readmissions', variance: -20 }
    ],
    uniqueInsights: [
      'Effective management of complex conditions despite high prevalence',
      'Care coordination programs show 20% better outcomes than benchmarks',
      'Specialty pharmacy integration creates significant cost efficiencies'
    ]
  },
  {
    archetypeId: 'a3',
    id: 'a3',
    diseasePatterns: [
      { condition: 'Pediatric Conditions', variance: 25 },
      { condition: 'Preventable Chronic Conditions', variance: -15 },
      { condition: 'Family Planning Services', variance: 30 }
    ],
    utilizationPatterns: [
      { category: 'Preventive Services', variance: 35 },
      { category: 'Primary Care', variance: 25 },
      { category: 'Hospital Admissions', variance: -15 }
    ],
    uniqueInsights: [
      'Strong preventive care utilization correlates with lower chronic disease burden',
      'Family-centered care approach yields better long-term health outcomes',
      'Wellness program engagement exceeds benchmarks by 30%'
    ]
  },
  
  // Additional archetypes would follow the same pattern
  // For brevity, I'm including just the first family in detail

  // Family B: Pragmatists (abbreviated entries)
  {
    archetypeId: 'b1',
    id: 'b1',
    diseasePatterns: [
      { condition: 'Common Chronic Conditions', variance: 5 },
      { condition: 'Lifestyle-Related Conditions', variance: 8 },
      { condition: 'Acute Care Needs', variance: -3 }
    ],
    utilizationPatterns: [
      { category: 'Generic Medication', variance: 15 },
      { category: 'In-Network Services', variance: 10 },
      { category: 'Out-of-Network Care', variance: -20 }
    ],
    uniqueInsights: [
      'Efficient management of common conditions through cost-effective protocols',
      'Strong network management yields better than average unit costs',
      'High generic utilization creates pharmacy savings'
    ]
  },
  // Additional Family B entries would follow
  
  // Family C: Logisticians (abbreviated entries)
  {
    archetypeId: 'c1',
    id: 'c1',
    diseasePatterns: [
      { condition: 'Chronic Disease Management', variance: 10 },
      { condition: 'Care Coordination Needs', variance: 15 },
      { condition: 'Preventable Complications', variance: -10 }
    ],
    utilizationPatterns: [
      { category: 'Care Management Programs', variance: 25 },
      { category: 'Protocol Adherence', variance: 20 },
      { category: 'Preventable Admissions', variance: -15 }
    ],
    uniqueInsights: [
      'Systematic care protocols yield better than average outcomes',
      'Strong care coordination reduces fragmentation of care',
      'Process standardization improves patient experience metrics'
    ]
  }
  // Additional Family C entries would follow
];
