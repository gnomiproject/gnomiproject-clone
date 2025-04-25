import { ArchetypeDetailedData } from '../types/archetype';
import { getArchetypeColorHex } from './colors';

export const archetypesDetailed: ArchetypeDetailedData[] = [
  // Family A: Strategists
  {
    id: 'a1',
    familyId: 'a',
    name: 'Savvy Healthcare Navigators',
    familyName: 'Strategists',
    color: 'orange',
    hexColor: getArchetypeColorHex('a1'),
    short_description: 'Effective at directing care appropriately, these are organizations that reduce emergency visits and hospital admissions by connecting members with timely specialist care.',
    long_description: 'Effective at directing care appropriately, these are organizations that reduce emergency visits and hospital admissions by connecting members with timely specialist care, demonstrating sophisticated system knowledge despite relatively higher overall costs.',
    key_characteristics: [
      'Lower emergency utilization (-18.2%)',
      'Higher specialist utilization (+14.3%)',
      'Technology-forward approach',
      'Comprehensive specialist networks'
    ],
    keyFindings: [
      'Lower emergency utilization (-18.2%)',
      'Higher specialist utilization (+14.3%)',
      'Technology-forward approach',
      'Comprehensive specialist networks'
    ],
    
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
          description: 'Strengthen preventive care pathways to maintain your population\'s low emergency utilization.'
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
    hexColor: getArchetypeColorHex('a2'),
    short_description: 'Adept at managing clinical complexity, these are organizations that face populations with elevated risk scores and high-cost specialty conditions.',
    long_description: 'Adept at managing clinical complexity, these are organizations that face populations with elevated risk scores and high-cost specialty conditions.',
    key_characteristics: [
      'Lower emergency utilization (-17.0%)',
      'Higher specialist utilization (+9.8%)',
      'Higher risk population',
      'Strong care coordination'
    ],
    keyFindings: [
      'Lower emergency utilization (-17.0%)',
      'Higher specialist utilization (+9.8%)',
      'Higher risk population',
      'Strong care coordination'
    ],
    
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
    hexColor: getArchetypeColorHex('a3'),
    short_description: 'Focused on prevention and early intervention, these are organizations with younger populations, larger families, and high specialty care demand.',
    long_description: 'Focused on prevention and early intervention, these are organizations with younger populations, larger families, and high specialty care demand.',
    key_characteristics: [
      'Lower emergency utilization (-24.3%)',
      'Higher specialist utilization (+21.8%)',
      'Larger family sizes (+12.9%)',
      'Strong preventive care engagement'
    ],
    keyFindings: [
      'Lower emergency utilization (-24.3%)',
      'Higher specialist utilization (+21.8%)',
      'Larger family sizes (+12.9%)',
      'Strong preventive care engagement'
    ],
    
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
          description: 'Strengthen preventive care pathways to maintain your population\'s low emergency utilization.'
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
  },
  
  // Family B: Pragmatists
  {
    id: 'b1',
    familyId: 'b',
    name: 'Resourceful Adapters',
    familyName: 'Pragmatists',
    color: 'blue',
    hexColor: getArchetypeColorHex('b1'),
    short_description: 'Skilled at overcoming access barriers, these are organizations operating in environments with significant socioeconomic factors.',
    long_description: 'Skilled at overcoming access barriers, these are organizations operating in environments with significant socioeconomic factors.',
    key_characteristics: [
      'Higher emergency utilization (+18.2%)',
      'Lower specialist utilization (-16.2%)',
      'Average healthcare costs',
      'Strong adaptability to constraints'
    ],
    keyFindings: [
      'Higher emergency utilization (+18.2%)',
      'Lower specialist utilization (-16.2%)',
      'Average healthcare costs',
      'Strong adaptability to constraints'
    ],
    
    summary: {
      description: 'Skilled at overcoming access barriers, these are organizations operating in environments with significant socioeconomic factors.',
      keyCharacteristics: [
        'Strong adaptability to constraints',
        'Effective SDOH intervention programs'
      ]
    },
    
    // Level 2: Standard for archetype detail pages
    standard: {
      fullDescription: 'Skilled at overcoming access barriers, these are organizations operating in environments with significant socioeconomic factors. They develop tailored care delivery models that work within constraints, transforming access limitations into opportunities for targeted health interventions.',
      keyCharacteristics: [
        'Strong adaptability to constraints',
        'Moderate healthcare costs',
        'Practical benefits design',
        'Effective SDOH intervention programs',
        'Resourceful approach to care delivery',
        'Creative solutions to access challenges'
      ],
      overview: 'Resourceful Adapters operate in environments with significant socioeconomic and access barriers, yet find innovative ways to deliver care effectively. They excel at developing practical solutions that address social determinants of health while maintaining reasonable cost efficiency despite operational challenges.',
      keyStatistics: {
        emergencyUtilization: {
          value: '+18.2%',
          trend: 'up'
        },
        specialistUtilization: {
          value: '-16.2%',
          trend: 'down'
        },
        healthcareSpend: {
          value: '+0.8%',
          trend: 'neutral'
        },
        familySize: {
          value: '+2.4%',
          trend: 'neutral'
        }
      },
      keyInsights: [
        'Social determinants of health factors significantly impact access to appropriate care',
        'Higher emergency utilization reflects access barriers to primary and specialty care',
        'Cost-effective adaptation to challenges keeps overall spend near benchmark average',
        'COPD and substance use disorders require targeted intervention programs'
      ]
    },
    
    // Level 3: Enhanced for full reports
    enhanced: {
      riskProfile: {
        score: '0.96',
        comparison: '+1.4% above archetype average',
        conditions: [
          {
            name: 'COPD',
            value: '+27%',
            barWidth: '6.75%'
          },
          {
            name: 'Substance Use Disorders',
            value: '+19%',
            barWidth: '4.75%'
          },
          {
            name: 'Heart Disease',
            value: '+12%',
            barWidth: '3%'
          }
        ]
      },
      strategicPriorities: [
        {
          number: '1',
          title: 'SDOH Barriers Reduction',
          description: 'Address social determinants of health factors that limit access to appropriate care.'
        },
        {
          number: '2',
          title: 'Specialist Access Enhancement',
          description: 'Improve access to specialty care to reduce reliance on emergency services.'
        },
        {
          number: '3',
          title: 'Chronic Condition Management',
          description: 'Implement targeted programs for prevalent conditions like COPD and heart disease.'
        },
        {
          number: '4',
          title: 'Behavioral Health Integration',
          description: 'Expand substance use disorder services and behavioral health support.'
        }
      ],
      swot: {
        strengths: [
          'Strong adaptability to constraints',
          'Moderate healthcare costs (+0.8%)',
          'Practical benefits design',
          'Effective SDOH intervention programs'
        ],
        weaknesses: [
          'Higher emergency utilization (+18.2%)',
          'Lower specialist utilization (-16.2%)',
          'Elevated COPD prevalence (+27%)',
          'Higher substance use disorder rates (+19%)'
        ],
        opportunities: [
          'Mobile health expansion',
          'Telehealth access enhancement',
          'Community-based care partnerships',
          'Targeted SDOH intervention programs'
        ],
        threats: [
          'Healthcare access disparities',
          'Provider shortages in key areas',
          'Rising chronic condition burden',
          'Care deferral leading to higher acuity'
        ]
      },
      costSavings: [
        {
          title: 'Emergency Alternatives',
          description: 'Implement urgent care and telehealth alternatives to reduce high-cost emergency utilization.'
        },
        {
          title: 'Chronic Care Management',
          description: 'Deploy targeted programs for COPD, heart disease, and other prevalent conditions.'
        },
        {
          title: 'Transportation Solutions',
          description: 'Address SDOH barriers with transportation assistance to appropriate care settings.'
        }
      ]
    }
  },
  
  // Healthcare Pragmatists (b2)
  {
    id: 'b2',
    familyId: 'b',
    name: 'Healthcare Pragmatists',
    familyName: 'Pragmatists',
    color: 'purple',
    hexColor: getArchetypeColorHex('b2'),
    short_description: 'Cost-effective and practical, these are organizations balancing populations with elevated substance use disorder rates.',
    long_description: 'Cost-effective and practical, these are organizations balancing populations with elevated substance use disorder rates.',
    key_characteristics: [
      'Higher emergency utilization (+19.8%)',
      'Lower specialist utilization (-16.3%)',
      'Lower healthcare spend (-11.0%)',
      'Practical benefits design'
    ],
    keyFindings: [
      'Higher emergency utilization (+19.8%)',
      'Lower specialist utilization (-16.3%)',
      'Lower healthcare spend (-11.0%)',
      'Practical benefits design'
    ],
    
    summary: {
      description: 'Cost-effective and practical, these are organizations balancing populations with elevated substance use disorder rates.',
      keyCharacteristics: [
        'Practical benefits design',
        'Strong cost-effectiveness orientation'
      ]
    },
    
    standard: {
      fullDescription: 'Cost-effective and practical, these are organizations balancing populations with elevated substance use disorder rates. They focus resources precisely on essential services addressing critical workforce health needs, achieving notable cost efficiency through practical benefit design.',
      keyCharacteristics: [
        'Lower healthcare spend',
        'Practical benefits design',
        'Strong cost-effectiveness orientation',
        'Focused approach to essential services',
        'Targeted intervention programs',
        'Efficient resource allocation'
      ],
      overview: 'Healthcare Pragmatists demonstrate exceptional ability to control costs while addressing challenging health conditions. They excel at focusing resources on high-impact interventions, maintaining a lean benefits portfolio that addresses essential needs while avoiding excessive spending on less critical services.',
      keyStatistics: {
        emergencyUtilization: {
          value: '+19.8%',
          trend: 'up'
        },
        specialistUtilization: {
          value: '-16.3%',
          trend: 'down'
        },
        healthcareSpend: {
          value: '-11.0%',
          trend: 'down'
        },
        familySize: {
          value: '-6.7%',
          trend: 'down'
        }
      },
      keyInsights: [
        'Significantly lower healthcare spend demonstrates strong cost management despite challenges',
        'Higher emergency utilization reflects access barriers and care deferral patterns',
        'Substance use disorders represent a significant health challenge requiring targeted intervention',
        'Musculoskeletal conditions suggest opportunities for focused case management'
      ]
    },
    
    enhanced: {
      riskProfile: {
        score: '0.92',
        comparison: '-2.0% below archetype average',
        conditions: [
          {
            name: 'Substance Use Disorders',
            value: '+44%',
            barWidth: '11%'
          },
          {
            name: 'Musculoskeletal Conditions',
            value: '+24%',
            barWidth: '6%'
          },
          {
            name: 'Cancer',
            value: '-17%',
            barWidth: '4.25%'
          }
        ]
      },
      strategicPriorities: [
        {
          number: '1',
          title: 'Chronic Condition Management',
          description: 'Implement practical, high-impact programs for prevalent chronic conditions.'
        },
        {
          number: '2',
          title: 'Substance Use Disorder Support',
          description: 'Expand access to substance use treatment and recovery services.'
        },
        {
          number: '3',
          title: 'MSK Care Pathway Optimization',
          description: 'Develop effective care pathways for musculoskeletal conditions common in this population.'
        },
        {
          number: '4',
          title: 'Emergency Alternatives',
          description: 'Create accessible alternatives to emergency department utilization.'
        }
      ],
      swot: {
        strengths: [
          'Lower healthcare spend (-11.0%)',
          'Practical benefits design',
          'Strong cost-effectiveness orientation',
          'Focused approach to essential services'
        ],
        weaknesses: [
          'Higher emergency utilization (+19.8%)',
          'Lower specialist utilization (-16.3%)',
          'Elevated substance use disorder rates (+44%)',
          'Higher musculoskeletal condition prevalence (+24%)'
        ],
        opportunities: [
          'Targeted substance use disorder programs',
          'MSK condition management enhancement',
          'Urgent care/telehealth expansion',
          'Site of care optimization'
        ],
        threats: [
          'Care deferral leading to higher acuity',
          'Rising substance use disorder impacts',
          'Workforce productivity challenges',
          'Provider network access limitations'
        ]
      },
      costSavings: [
        {
          title: 'Emergency Alternatives Implementation',
          description: 'Deploy urgent care and telehealth options to reduce high-cost emergency utilization.'
        },
        {
          title: 'Substance Use Disorder Program',
          description: 'Implement effective substance use disorder management and prevention initiatives.'
        },
        {
          title: 'MSK Care Management',
          description: 'Develop targeted programs for musculoskeletal conditions to reduce disability and costs.'
        }
      ]
    }
  },
  
  // Care Channel Optimizers (b3)
  {
    id: 'b3',
    familyId: 'b',
    name: 'Care Channel Optimizers',
    familyName: 'Pragmatists',
    color: 'green',
    hexColor: getArchetypeColorHex('b3'),
    short_description: 'Effective across geographic boundaries, these are organizations skilled at creating consistent experiences in multiple regions.',
    long_description: 'Effective across geographic boundaries, these are organizations skilled at creating consistent experiences in multiple regions.',
    key_characteristics: [
      'Moderate emergency utilization (+8.3%)',
      'Average specialist utilization (-0.3%)',
      'Average healthcare costs',
      'Strong multi-region coordination'
    ],
    keyFindings: [
      'Moderate emergency utilization (+8.3%)',
      'Average specialist utilization (-0.3%)',
      'Average healthcare costs',
      'Strong multi-region coordination'
    ],
    
    summary: {
      description: 'Effective across geographic boundaries, these are organizations skilled at creating consistent experiences in multiple regions.',
      keyCharacteristics: [
        'Effective multi-region coordination',
        'Consistent benefits implementation'
      ]
    },
    
    standard: {
      fullDescription: 'Effective across geographic boundaries, these are organizations skilled at creating consistent experiences in multiple regions. They maintain cohesive benefits strategies despite operational complexity, delivering cost-effective care while successfully navigating regional healthcare variations.',
      keyCharacteristics: [
        'Effective multi-region coordination',
        'Consistent benefits implementation',
        'Average healthcare costs',
        'Strong program standardization',
        'Regional network management',
        'Cross-boundary care coordination'
      ],
      overview: 'Care Channel Optimizers excel at creating consistent healthcare experiences across geographic boundaries. These organizations successfully implement standardized approaches to benefits and care delivery despite regional variations in healthcare systems, achieving remarkable consistency in outcomes across their diverse operational footprint.',
      keyStatistics: {
        emergencyUtilization: {
          value: '+8.3%',
          trend: 'up'
        },
        specialistUtilization: {
          value: '-0.3%',
          trend: 'neutral'
        },
        healthcareSpend: {
          value: '-0.1%',
          trend: 'neutral'
        },
        familySize: {
          value: '+5.3%',
          trend: 'up'
        }
      },
      keyInsights: [
        'Moderate emergency utilization increase reflects regional access variations',
        'Near-benchmark healthcare costs demonstrate effective multi-region management',
        'Chronic conditions like diabetes and hypertension present opportunities for standardized approaches',
        'Digital health solutions show strong potential for addressing geographic barriers'
      ]
    },
    
    enhanced: {
      riskProfile: {
        score: '0.94',
        comparison: '+0.1% above archetype average',
        conditions: [
          {
            name: 'Diabetes',
            value: '+14%',
            barWidth: '3.5%'
          },
          {
            name: 'Hypertension',
            value: '+12%',
            barWidth: '3%'
          },
          {
            name: 'Asthma',
            value: '+9%',
            barWidth: '2.25%'
          }
        ]
      },
      strategicPriorities: [
        {
          number: '1',
          title: 'Multi-State Coordination',
          description: 'Optimize care delivery across geographic regions with consistent approaches.'
        },
        {
          number: '2',
          title: 'Chronic Condition Management',
          description: 'Implement standardized programs for diabetes, hypertension, and other prevalent conditions.'
        },
        {
          number: '3',
          title: 'Network Optimization',
          description: 'Ensure consistent provider network quality across all regions.'
        },
        {
          number: '4',
          title: 'Digital Health Integration',
          description: 'Leverage digital solutions to create consistency across geographic boundaries.'
        }
      ],
      swot: {
        strengths: [
          'Effective multi-region coordination',
          'Consistent benefits implementation',
          'Average healthcare costs (-0.1%)',
          'Strong program standardization'
        ],
        weaknesses: [
          'Higher emergency utilization (+8.3%)',
          'Average specialist utilization (-0.3%)',
          'Elevated diabetes prevalence (+14%)',
          'Regional variations in outcomes'
        ],
        opportunities: [
          'Telehealth expansion across regions',
          'Standardized chronic care programs',
          'Digital health platform integration',
          'Regional center of excellence development'
        ],
        threats: [
          'Geographic provider network variations',
          'Regional healthcare cost disparities',
          'Operational complexity across areas',
          'Inconsistent care quality across regions'
        ]
      },
      costSavings: [
        {
          title: 'Region-Specific Network Optimization',
          description: 'Develop targeted network strategies for each region while maintaining consistent quality standards.'
        },
        {
          title: 'Standardized Chronic Care Programs',
          description: 'Implement consistent chronic condition management approaches across all regions.'
        },
        {
          title: 'Virtual Care Platform Expansion',
          description: 'Leverage telehealth to ensure consistent access regardless of geographic location.'
        }
      ]
    }
  },
  
  // Family C: Logisticians
  {
    id: 'c1',
    familyId: 'c',
    name: 'Scalable Access Architects',
    familyName: 'Logisticians',
    color: 'red',
    hexColor: getArchetypeColorHex('c1'),
    short_description: 'Adaptable to varying schedules, these are organizations managing workforces with variable schedules and smaller household sizes.',
    long_description: 'Adaptable to varying schedules, these are organizations managing workforces with variable schedules and smaller household sizes.',
    key_characteristics: [
      'Moderate emergency utilization (+7.1%)',
      'Lower specialist utilization (-8.4%)',
      'Lower healthcare spend (-15.0%)',
      'Smaller household sizes (-12.6%)'
    ],
    keyFindings: [
      'Moderate emergency utilization (+7.1%)',
      'Lower specialist utilization (-8.4%)',
      'Lower healthcare spend (-15.0%)',
      'Smaller household sizes (-12.6%)'
    ],
    
    // Ensure this section is properly closed and follows the ArchetypeDetailedData type
    summary: {
      description: 'Adaptable to varying schedules, these are organizations managing workforces with variable schedules and smaller household sizes.',
      keyCharacteristics: [
        'Adaptable to varying schedules',
        'Operational efficiency across locations'
      ]
    },
    
    standard: {
      fullDescription: 'Adaptable to varying schedules, these are organizations managing workforces with variable schedules and smaller household sizes. They create access frameworks that function effectively across diverse locations and shifts, accommodating fluctuating work patterns while maintaining care continuity.',
      keyCharacteristics: [
        'Adaptable to varying schedules',
        'Operational efficiency across locations',
        'Lower healthcare spend',
        'Flexible access solutions',
        'Effective scalable programs',
        'Smaller household sizes'
      ],
      overview: 'Scalable Access Architects excel at creating healthcare frameworks that accommodate variable schedules and diverse locations. They achieve remarkable cost efficiency while maintaining necessary care quality, effectively addressing the unique challenges of workforces with fluctuating patterns and higher turnover dynamics.',
