
import { Archetype } from '../types/archetype';

export const archetypes: Archetype[] = [
  // Family a: Strategists
  {
    id: 'a1',
    name: 'Savvy Healthcare Navigators',
    familyId: 'a',
    shortDescription: 'Organizations focused on innovation with knowledge workers and significant resources for benefits.',
    longDescription: 'Effective at directing care appropriately, these are organizations that reduce emergency visits and hospital admissions by connecting members with timely specialist care, demonstrating sophisticated system knowledge despite relatively higher overall costs.',
    characteristics: [
      'Technology-forward approach',
      'High percentage of knowledge workers',
      'Comprehensive specialist networks'
    ],
    strategicPriorities: {
      primaryFocus: 'Care navigation and coordination',
      secondaryPriorities: [
        'Specialist access optimization',
        'Digital health integration',
        'Preventive health programs'
      ],
      keyOpportunities: [
        'Advanced digital navigation solutions',
        'Virtual primary care integration',
        'Specialized mental health access'
      ]
    },
    riskScore: 7.2,
    riskVariance: 10,
    primaryRiskDriver: 'Specialty condition prevalence',
    color: 'archetype-a1'
  },
  {
    id: 'a2',
    name: 'Complex Condition Managers',
    familyId: 'a',
    shortDescription: 'Adept at managing clinical complexity, these are organizations that face populations with elevated risk scores and high-cost specialty conditions.',
    longDescription: 'These organizations excel at condition management despite challenging population health profiles. They implement sophisticated care coordination strategies to address complex medical needs while maintaining cost efficiency.',
    characteristics: [
      'Effectively manages populations with higher clinical risk',
      'Coordinates care for complex specialty conditions',
      'Sophisticated clinical management programs'
    ],
    strategicPriorities: {
      primaryFocus: 'Complex condition management',
      secondaryPriorities: [
        'Care coordination enhancements',
        'Specialty pharmacy optimization',
        'Advanced care planning'
      ],
      keyOpportunities: [
        'Integrated care management platforms',
        'Specialty pharmacy case management',
        'Predictive analytics for high-risk patients'
      ]
    },
    riskScore: 8.5,
    riskVariance: 25,
    primaryRiskDriver: 'Chronic condition prevalence',
    color: 'archetype-a2'
  },
  {
    id: 'a3',
    name: 'Proactive Care Consumers',
    familyId: 'a',
    shortDescription: 'Focused on prevention and early intervention, these are organizations with younger populations, large families, and high specialty care demand.',
    longDescription: 'These organizations prioritize preventive care and early interventions, achieving better long-term health outcomes through targeted wellness programs and comprehensive family benefits.',
    characteristics: [
      'Focuses intensively on prevention and early intervention',
      'Supports larger families with comprehensive benefits',
      'High engagement in wellness programs'
    ],
    strategicPriorities: {
      primaryFocus: 'Preventive care optimization',
      secondaryPriorities: [
        'Family-focused benefit design',
        'Wellness program integration',
        'Early intervention protocols'
      ],
      keyOpportunities: [
        'Advanced wellness incentives',
        'Family care coordination',
        'Preventive screening optimization'
      ]
    },
    riskScore: 5.8,
    riskVariance: -5,
    primaryRiskDriver: 'Family health management',
    color: 'archetype-a3'
  },
  
  // Family b: Pragmatists
  {
    id: 'b1',
    name: 'Resourceful Adapters',
    familyId: 'b',
    shortDescription: 'Organizations that prioritize healthcare cost management while maintaining effective health outcomes.',
    longDescription: 'These organizations excel at balancing cost efficiency with appropriate healthcare access, implementing targeted interventions that deliver the highest value for their specific population needs.',
    characteristics: [
      'Strategic approach to cost management',
      'Value-based benefit design',
      'Efficient provider network utilization'
    ],
    strategicPriorities: {
      primaryFocus: 'Cost-effectiveness optimization',
      secondaryPriorities: [
        'Network optimization',
        'Value-based design',
        'Utilization management'
      ],
      keyOpportunities: [
        'Reference-based pricing',
        'Targeted high-cost claim management',
        'Preferred provider steerage'
      ]
    },
    riskScore: 6.4,
    riskVariance: -2,
    primaryRiskDriver: 'Utilization variance',
    color: 'archetype-b1'
  },
  {
    id: 'b2',
    name: 'Healthcare Pragmatists',
    familyId: 'b',
    shortDescription: 'Organizations that maintain a methodical approach to healthcare benefits with balanced cost and access priorities.',
    longDescription: 'These organizations achieve consistent health outcomes through well-structured benefit designs that balance access, quality, and cost considerations for their workforce demographics.',
    characteristics: [
      'Balanced approach to benefit design',
      'Moderate risk profile',
      'Consistent healthcare utilization patterns'
    ],
    strategicPriorities: {
      primaryFocus: 'Balanced benefits management',
      secondaryPriorities: [
        'Moderate plan design',
        'Targeted clinical programs',
        'Employee education'
      ],
      keyOpportunities: [
        'Tiered network design',
        'Condition-specific management programs',
        'Consumer decision support tools'
      ]
    },
    riskScore: 6.0,
    riskVariance: 0,
    primaryRiskDriver: 'Demographic distribution',
    color: 'archetype-b2'
  },
  {
    id: 'b3',
    name: 'Care Channel Optimizers',
    familyId: 'b',
    shortDescription: 'Organizations focused on maintaining workforce health through practical interventions and targeted health initiatives.',
    longDescription: 'These organizations prioritize stability in healthcare outcomes and costs, implementing practical programs that address the specific health needs of their employee population.',
    characteristics: [
      'Practical approach to workforce health',
      'Targeted interventions for key health issues',
      'Focus on workforce productivity'
    ],
    strategicPriorities: {
      primaryFocus: 'Workforce health stability',
      secondaryPriorities: [
        'Absence management',
        'Occupational health integration',
        'Productivity enhancement'
      ],
      keyOpportunities: [
        'Integrated disability management',
        'Site-based health services',
        'Population-specific health initiatives'
      ]
    },
    riskScore: 5.9,
    riskVariance: -3,
    primaryRiskDriver: 'Occupational risk factors',
    color: 'archetype-b3'
  },

  // Family c: Logisticians
  {
    id: 'c1',
    name: 'Scalable Access Architects',
    familyId: 'c',
    shortDescription: 'Organizations that excel in systematic care coordination through established protocols and procedures.',
    longDescription: 'These organizations leverage highly structured healthcare processes to ensure consistent care delivery, implementing standardized protocols that guide members through the healthcare system efficiently.',
    characteristics: [
      'Systematic approach to care coordination',
      'Strong procedural healthcare protocols',
      'Consistent healthcare delivery'
    ],
    strategicPriorities: {
      primaryFocus: 'Systematic care coordination',
      secondaryPriorities: [
        'Process standardization',
        'Care pathway development',
        'Health navigation support'
      ],
      keyOpportunities: [
        'Integrated care pathway systems',
        'Standardized clinical protocols',
        'Navigation support infrastructure'
      ]
    },
    riskScore: 6.7,
    riskVariance: 5,
    primaryRiskDriver: 'Care coordination complexity',
    color: 'archetype-c1'
  },
  {
    id: 'c2',
    name: 'Care Adherence Advocates',
    familyId: 'c',
    shortDescription: 'Organizations that leverage comprehensive data analysis to guide healthcare strategy and interventions.',
    longDescription: 'These organizations excel at using healthcare data to inform benefit design and clinical interventions, implementing targeted programs based on robust analytics and population insights.',
    characteristics: [
      'Analytics-based healthcare approach',
      'Evidence-driven program implementation',
      'Continuous program refinement'
    ],
    strategicPriorities: {
      primaryFocus: 'Analytics-driven decision making',
      secondaryPriorities: [
        'Predictive modeling',
        'Outcomes measurement',
        'Program optimization'
      ],
      keyOpportunities: [
        'Advanced analytics integration',
        'Predictive risk stratification',
        'Real-time intervention triggers'
      ]
    },
    riskScore: 7.1,
    riskVariance: 8,
    primaryRiskDriver: 'Population health complexities',
    color: 'archetype-c2'
  },
  {
    id: 'c3',
    name: 'Engaged Healthcare Consumers',
    familyId: 'c',
    shortDescription: 'Organizations that prioritize healthcare regulatory compliance while maintaining effective benefit structures.',
    longDescription: 'These organizations excel at maintaining compliance with healthcare regulations while implementing effective benefits programs, focusing on quality standards and documentation throughout the healthcare delivery system.',
    characteristics: [
      'Strong compliance orientation',
      'Standardized healthcare processes',
      'Quality assurance focus'
    ],
    strategicPriorities: {
      primaryFocus: 'Compliant program implementation',
      secondaryPriorities: [
        'Quality assurance',
        'Documentation excellence',
        'Regulatory navigation'
      ],
      keyOpportunities: [
        'Integrated compliance management',
        'Quality measurement systems',
        'Regulatory update automation'
      ]
    },
    riskScore: 6.3,
    riskVariance: 2,
    primaryRiskDriver: 'Regulatory complexity',
    color: 'archetype-c3'
  }
];
