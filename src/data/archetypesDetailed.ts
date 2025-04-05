
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
      description: 'Organizations focused on innovation with knowledge workers and significant resources for benefits.',
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
          value: '18% below average',
          trend: 'down'
        },
        specialistUtilization: {
          value: '22% above average',
          trend: 'up'
        },
        healthcareSpend: {
          value: '8% above average',
          trend: 'up'
        },
        preventiveScreenings: {
          value: '15% above average',
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
        score: '7.2/10',
        comparison: '10% higher than average',
        conditions: [
          {
            name: 'Mental Health',
            value: '+28%',
            barWidth: '78%'
          },
          {
            name: 'Musculoskeletal',
            value: '+15%',
            barWidth: '65%'
          },
          {
            name: 'Cardiovascular',
            value: '+8%',
            barWidth: '58%'
          },
          {
            name: 'Diabetes',
            value: '-12%',
            barWidth: '38%'
          }
        ]
      },
      strategicPriorities: [
        {
          number: '01',
          title: 'Specialized Mental Health Access',
          description: 'Implement targeted solutions for high-stress environments with executive coaching and specialized mental health platforms.'
        },
        {
          number: '02',
          title: 'High-Performance Networks',
          description: 'Curate high-quality specialty networks and centers of excellence to address specific population health needs.'
        },
        {
          number: '03',
          title: 'Advanced Digital Solutions',
          description: 'Deploy sophisticated digital health platforms with personalized recommendations and integrated benefit solutions.'
        }
      ],
      swot: {
        strengths: [
          'Effective specialist care navigation',
          'High digital engagement',
          'Strong preventive care utilization',
          'Sophisticated member communications'
        ],
        weaknesses: [
          'Higher than average specialty costs',
          'Mental health service gaps',
          'Administrative complexity',
          'Benefit complexity for members'
        ],
        opportunities: [
          'Integrated mental health services',
          'Advanced care navigation tools',
          'Precision medicine adoption',
          'Value-based specialty arrangements'
        ],
        threats: [
          'Rising specialty care costs',
          'Provider consolidation',
          'Technology implementation fatigue',
          'Mental health provider shortages'
        ]
      },
      costSavings: [
        {
          title: 'Integrated Mental Health Platform',
          description: 'Potential 12% reduction in total mental health spend through comprehensive digital + in-person solutions tailored to high-tech workforce needs.'
        },
        {
          title: 'Advanced Navigation Program',
          description: 'Estimated 8-10% reduction in misdirected care through AI-powered navigation tools and high-touch concierge support for complex cases.'
        },
        {
          title: 'Specialty Care Network Optimization',
          description: 'Potential 15% savings on targeted specialty services through centers of excellence and value-based specialty care arrangements.'
        }
      ]
    }
  },
  
  // Adding another example: Complex Condition Managers (a2)
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
      fullDescription: 'These organizations excel at condition management despite challenging population health profiles. They implement sophisticated care coordination strategies to address complex medical needs while maintaining cost efficiency.',
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
          value: '5% below average',
          trend: 'down'
        },
        specialistUtilization: {
          value: '35% above average',
          trend: 'up'
        },
        healthcareSpend: {
          value: '18% above average',
          trend: 'up'
        },
        careCoordination: {
          value: '42% above average',
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
        score: '8.5/10',
        comparison: '25% higher than average',
        conditions: [
          {
            name: 'Cancer',
            value: '+45%',
            barWidth: '95%'
          },
          {
            name: 'Autoimmune',
            value: '+32%',
            barWidth: '82%'
          },
          {
            name: 'Diabetes',
            value: '+28%',
            barWidth: '78%'
          },
          {
            name: 'Cardiovascular',
            value: '+20%',
            barWidth: '70%'
          }
        ]
      },
      strategicPriorities: [
        {
          number: '01',
          title: 'Integrated Care Management Platforms',
          description: 'Deploy unified care management systems that coordinate across multiple conditions and provide real-time insights to care teams.'
        },
        {
          number: '02',
          title: 'Specialty Pharmacy Optimization',
          description: 'Implement comprehensive specialty pharmacy management strategies including formulary optimization and patient support programs.'
        },
        {
          number: '03',
          title: 'Predictive Analytics for Early Intervention',
          description: 'Leverage advanced analytics to identify deteriorating conditions before acute episodes, enabling proactive intervention.'
        }
      ],
      swot: {
        strengths: [
          'Advanced care coordination capabilities',
          'Strong data analytics infrastructure',
          'Effective complex case management',
          'High-performing clinical programs'
        ],
        weaknesses: [
          'High overall healthcare spend',
          'Administrative complexity',
          'Provider network limitations',
          'Care fragmentation in certain areas'
        ],
        opportunities: [
          'Predictive intervention models',
          'Virtual care integration',
          'Home-based care expansion',
          'Value-based specialty arrangements'
        ],
        threats: [
          'Rising specialty drug costs',
          'Clinical workforce shortages',
          'Complex regulatory environment',
          'New high-cost therapies entering market'
        ]
      },
      costSavings: [
        {
          title: 'Integrated Specialty Case Management',
          description: 'Potential 18% reduction in complex case costs through comprehensive case management that integrates medical, pharmacy, and behavioral health.'
        },
        {
          title: 'Advanced Predictive Analytics',
          description: 'Estimated 10-15% reduction in acute episodes through early identification and intervention for deteriorating conditions.'
        },
        {
          title: 'Home-Based Care Expansion',
          description: 'Potential 20% savings on select complex conditions by shifting care to home settings with appropriate monitoring and support.'
        }
      ]
    }
  }
  
  // Additional archetypes would be added here...
];

