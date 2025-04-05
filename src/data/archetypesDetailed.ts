
import { ArchetypeDetailedData } from '../types/archetype';

export const archetypesDetailed: ArchetypeDetailedData[] = [
  // Family A: Strategists
  {
    id: 'a1',
    familyId: 'a',
    name: 'Savvy Healthcare Navigators',
    familyName: 'Strategists',
    color: 'orange',
    
    // Level 1: Summary for home page cards
    summary: {
      description: 'Effective at directing care appropriately, these are organizations that reduce emergency visits and hospital admissions by connecting members with timely specialist care.',
      keyCharacteristics: [
        'Technology-forward approach',
        'High percentage of knowledge workers'
      ]
    },
    
    // Level 2: Standard for archetype detail pages
    standard: {
      fullDescription: 'Effective at directing care appropriately, these are organizations that reduce emergency visits and hospital admissions by connecting members with timely specialist care, demonstrating sophisticated system knowledge despite relatively higher overall costs.',
      keyCharacteristics: [
        'Technology-forward approach',
        'High percentage of knowledge workers',
        'Comprehensive specialist networks',
        'Lower emergency utilization',
        'Higher specialist engagement',
        'Sophisticated digital solutions adoption'
      ],
      overview: 'Savvy Healthcare Navigators excel at guiding their members through the healthcare system efficiently. They invest in technology and care coordination to ensure members receive the right care at the right time, particularly focusing on appropriate specialist utilization to prevent avoidable emergency visits and hospitalizations.',
      keyStatistics: {
        emergencyUtilization: {
          value: '-18.2%',
          trend: 'down'
        },
        specialistUtilization: {
          value: '+14.3%',
          trend: 'up'
        },
        healthcareSpend: {
          value: '+10.1%',
          trend: 'up'
        },
        familySize: {
          value: '+7.2%',
          trend: 'up'
        }
      },
      keyInsights: [
        'Members receive more coordinated specialty care, reducing emergency visits',
        'Higher initial investment in specialist care prevents costly hospitalizations',
        'Digital navigation tools show strong adoption and effective utilization',
        'Mental health services are accessed at higher rates than peer organizations'
      ]
    },
    
    // Level 3: Enhanced for full reports
    enhanced: {
      riskProfile: {
        score: '0.92',
        comparison: '-2.3% below archetype average',
        conditions: [
          {
            name: 'Infertility',
            value: '+126%',
            barWidth: '12.6%'
          },
          {
            name: 'Vitamin D Deficiency',
            value: '+38%',
            barWidth: '9.5%'
          },
          {
            name: 'Substance Use Disorders',
            value: '-27%',
            barWidth: '6.75%'
          }
        ]
      },
      strategicPriorities: [
        {
          number: '1',
          title: 'Specialist Network Optimization',
          description: 'Implement programs to optimize specialist utilization and reduce unnecessary referrals.'
        },
        {
          number: '2',
          title: 'Preventive Care Enhancement',
          description: 'Strengthen preventive care pathways to maintain your population's low emergency utilization.'
        },
        {
          number: '3',
          title: 'Mental Health Integration',
          description: 'Expand mental health offerings to address anxiety and improve wellbeing.'
        },
        {
          number: '4',
          title: 'Digital Health Adoption',
          description: 'Leverage digital health solutions to enhance care coordination and access.'
        }
      ],
      swot: {
        strengths: [
          'Lower emergency utilization (-18.2%)',
          'Strong preventive care engagement',
          'Effective specialist referral pathways',
          'High healthcare literacy'
        ],
        weaknesses: [
          'Higher healthcare spend (+10.1%)',
          'Elevated specialist utilization (+14.3%)',
          'Increased infertility treatment costs (+126%)',
          'Higher vitamin D deficiency rates (+38%)'
        ],
        opportunities: [
          'Specialist steerage optimization',
          'Digital health platform integration',
          'Preventive care enhancement',
          'Virtual care expansion'
        ],
        threats: [
          'Continued cost escalation',
          'Network adequacy challenges',
          'Workforce competition for benefits',
          'Provider consolidation impacts'
        ]
      },
      costSavings: [
        {
          title: 'Specialist Network Optimization',
          description: 'Direct patients to high-quality, cost-effective specialists and strengthen primary care referral patterns.'
        },
        {
          title: 'Digital Health Integration',
          description: 'Expand virtual care options and digital health tools to improve access and reduce costs.'
        },
        {
          title: 'Preventive Care Enhancement',
          description: 'Strengthen screenings and early intervention to maintain low emergency utilization.'
        }
      ]
    }
  },
  
  // Complex Condition Managers (a2)
  {
    id: 'a2',
    familyId: 'a',
    name: 'Complex Condition Managers',
    familyName: 'Strategists',
    color: 'teal',
    
    summary: {
      description: 'Adept at managing clinical complexity, these are organizations that face populations with elevated risk scores and high-cost specialty conditions.',
      keyCharacteristics: [
        'Effectively manages populations with higher clinical risk',
        'Coordinates care for complex specialty conditions'
      ]
    },
    
    standard: {
      fullDescription: 'Adept at managing clinical complexity, these are organizations that face populations with elevated risk scores and high-cost specialty conditions. They implement comprehensive digital health programs to address complex chronic diseases, successfully reducing emergency utilization through coordinated care approaches.',
      keyCharacteristics: [
        'Effectively manages populations with higher clinical risk',
        'Coordinates care for complex specialty conditions',
        'Sophisticated clinical management programs',
        'Data-driven intervention strategies',
        'Chronic condition management expertise',
        'Strong care coordination infrastructure'
      ],
      overview: 'Complex Condition Managers face populations with significant health challenges and elevated risk profiles, yet they achieve better-than-expected outcomes through sophisticated clinical management approaches. They excel at identifying high-risk members early and implementing targeted interventions to manage complex conditions effectively.',
      keyStatistics: {
        emergencyUtilization: {
          value: '-17.0%',
          trend: 'down'
        },
        specialistUtilization: {
          value: '+9.8%',
          trend: 'up'
        },
        healthcareSpend: {
          value: '+14.0%',
          trend: 'up'
        },
        familySize: {
          value: '+8.7%',
          trend: 'up'
        }
      },
      keyInsights: [
        'Despite higher risk population, emergency utilization is controlled through proactive management',
        'Specialty pharmacy management shows significant cost containment',
        'Care coordination programs demonstrate exceptional engagement rates',
        'Data-driven interventions show measurable improvements in condition management metrics'
      ]
    },
    
    enhanced: {
      riskProfile: {
        score: '1.03',
        comparison: '+8.8% above archetype average',
        conditions: [
          {
            name: 'Multiple Sclerosis',
            value: '+31%',
            barWidth: '7.75%'
          },
          {
            name: 'Anxiety Disorders',
            value: '+23%',
            barWidth: '5.75%'
          },
          {
            name: 'Diabetes',
            value: '-18%',
            barWidth: '4.5%'
          }
        ]
      },
      strategicPriorities: [
        {
          number: '1',
          title: 'Digital Health Optimization',
          description: 'Enhance digital health programs to better manage specialty conditions and chronic diseases.'
        },
        {
          number: '2',
          title: 'Specialty Rx Management',
          description: 'Implement targeted specialty pharmacy programs for high-cost conditions like Multiple Sclerosis.'
        },
        {
          number: '3',
          title: 'Mental Health Support',
          description: 'Expand mental health resources to address elevated anxiety prevalence.'
        },
        {
          number: '4',
          title: 'Care Coordination Enhancement',
          description: 'Strengthen coordination between specialists to avoid fragmentation and duplication.'
        }
      ],
      swot: {
        strengths: [
          'Lower emergency utilization (-17.0%)',
          'Effective digital health engagement',
          'Strong specialty condition management',
          'Comprehensive benefits design'
        ],
        weaknesses: [
          'Higher healthcare spend (+14.0%)',
          'Elevated specialty Rx costs',
          'High multiple sclerosis prevalence (+31%)',
          'Increased mental health needs'
        ],
        opportunities: [
          'Digital therapeutics implementation',
          'Value-based specialty care arrangements',
          'Mental health integration',
          'Care coordination enhancement'
        ],
        threats: [
          'Specialty drug cost escalation',
          'Complex condition management challenges',
          'Provider network adequacy for specialists',
          'Benefit sustainability concerns'
        ]
      },
      costSavings: [
        {
          title: 'Specialty Rx Management',
          description: 'Implement specialty pharmacy management programs with formulary optimization for high-cost conditions.'
        },
        {
          title: 'Digital Health Platform Integration',
          description: 'Leverage integrated digital health solutions to improve condition management and reduce costs.'
        },
        {
          title: 'Centers of Excellence Implementation',
          description: 'Establish partnerships with high-performing providers for complex conditions and procedures.'
        }
      ]
    }
  },
  
  // Proactive Care Consumers (a3)
  {
    id: 'a3',
    familyId: 'a',
    name: 'Proactive Care Consumers',
    familyName: 'Strategists',
    color: 'yellow',
    
    summary: {
      description: 'Focused on prevention and early intervention, these are organizations with younger populations, larger families, and high specialty care demand.',
      keyCharacteristics: [
        'Focuses intensively on prevention and early intervention',
        'Supports larger families with comprehensive benefits'
      ]
    },
    
    standard: {
      fullDescription: 'Focused on prevention and early intervention, these are organizations with younger populations, larger families, and high specialty care demand. They prioritize preventive approaches and early interventions, achieving dramatically lower emergency utilization through accessible care pathways.',
      keyCharacteristics: [
        'Focuses intensively on prevention and early intervention',
        'Supports larger families with comprehensive benefits',
        'Achieves dramatically lower emergency utilization',
        'Provides accessible care pathways',
        'Demonstrates high digital adoption rates',
        'Maintains strong preventive care engagement'
      ],
      overview: 'Proactive Care Consumers represent organizations with younger populations and larger families who excel at prevention and early intervention. They leverage digital health solutions and comprehensive benefits to ensure members access appropriate care early, resulting in significantly reduced emergency utilization despite higher overall healthcare spending.',
      keyStatistics: {
        emergencyUtilization: {
          value: '-24.3%',
          trend: 'down'
        },
        specialistUtilization: {
          value: '+21.8%',
          trend: 'up'
        },
        healthcareSpend: {
          value: '+21.2%',
          trend: 'up'
        },
        familySize: {
          value: '+12.9%',
          trend: 'up'
        }
      },
      keyInsights: [
        'Exceptional performance in avoiding emergency care through proactive specialist engagement',
        'Digital health solutions show high adoption rates and strong engagement',
        'Family-focused benefits drive high satisfaction but contribute to increased costs',
        'Infertility treatment represents a significant cost driver in this population'
      ]
    },
    
    enhanced: {
      riskProfile: {
        score: '0.85',
        comparison: '-10.4% below archetype average',
        conditions: [
          {
            name: 'Infertility',
            value: '+196%',
            barWidth: '19.6%'
          },
          {
            name: 'Vitamin D Deficiency',
            value: '+76%',
            barWidth: '7.6%'
          },
          {
            name: 'Substance Use Disorders',
            value: '-62%',
            barWidth: '15.5%'
          }
        ]
      },
      strategicPriorities: [
        {
          number: '1',
          title: 'Specialty Care Navigation',
          description: 'Implement programs to optimize specialist utilization and reduce unnecessary referrals.'
        },
        {
          number: '2',
          title: 'Fertility Benefits Optimization',
          description: 'Review and optimize fertility treatment coverage to manage high utilization costs.'
        },
        {
          number: '3',
          title: 'Digital Health Enhancement',
          description: 'Expand digital health offerings to leverage high tech adoption rates in your population.'
        },
        {
          number: '4',
          title: 'Preventive Care Coordination',
          description: 'Strengthen preventive care pathways to maintain your population's low emergency utilization.'
        }
      ],
      swot: {
        strengths: [
          'Lower emergency utilization (-24.3%)',
          'High preventive care engagement',
          'Strong digital health adoption (+48%)',
          'Effective early intervention pathways'
        ],
        weaknesses: [
          'Higher healthcare spend (+21.2%)',
          'Excessive specialist utilization (+21.8%)',
          'High infertility treatment costs (+196%)',
          'Elevated anxiety prevalence (+42%)'
        ],
        opportunities: [
          'Specialist steerage optimization',
          'Condition-specific benefit design',
          'Digital mental health expansion',
          'Virtual care platform integration'
        ],
        threats: [
          'Continued cost escalation',
          'Specialty pharmacy trend acceleration',
          'Workforce competition for benefits',
          'Provider consolidation in networks'
        ]
      },
      costSavings: [
        {
          title: 'Specialist Network Optimization',
          description: 'Direct patients to high-quality, cost-effective specialists and strengthen primary care referral patterns.'
        },
        {
          title: 'Specialty Rx Management',
          description: 'Implement formulary optimization and specialty drug utilization management programs.'
        },
        {
          title: 'Centers of Excellence Implementation',
          description: 'Establish partnerships with high-performing providers for complex procedures and conditions.'
        }
      ]
    }
  }
];
