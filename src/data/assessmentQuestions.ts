
import { AssessmentQuestion } from '../types/assessment';

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'industry',
    text: 'Which industry best describes your organization?',
    options: [
      {
        id: 'professional',
        text: 'Professional Services (Legal, Consulting, Architecture)',
        archetypeWeights: {
          'a1': 0.8,
          'a2': 0.5,
          'a3': 0.3,
          'b1': 0.3,
          'b2': 0.4,
          'b3': 0.3,
          'c1': 0.3,
          'c2': 0.6,
          'c3': 0.4
        }
      },
      {
        id: 'finance',
        text: 'Finance & Insurance',
        archetypeWeights: {
          'a1': 0.6,
          'a2': 0.4,
          'a3': 0.3,
          'b1': 0.5,
          'b2': 0.5,
          'b3': 0.3,
          'c1': 0.4,
          'c2': 0.7,
          'c3': 0.6
        }
      },
      {
        id: 'technology',
        text: 'Technology & Information',
        archetypeWeights: {
          'a1': 0.9,
          'a2': 0.4,
          'a3': 0.5,
          'b1': 0.4,
          'b2': 0.3,
          'b3': 0.2,
          'c1': 0.3,
          'c2': 0.8,
          'c3': 0.3
        }
      },
      {
        id: 'manufacturing',
        text: 'Manufacturing & Production',
        archetypeWeights: {
          'a1': 0.3,
          'a2': 0.5,
          'a3': 0.4,
          'b1': 0.7,
          'b2': 0.6,
          'b3': 0.8,
          'c1': 0.6,
          'c2': 0.4,
          'c3': 0.5
        }
      },
      {
        id: 'construction',
        text: 'Construction & Real Estate',
        archetypeWeights: {
          'a1': 0.2,
          'a2': 0.4,
          'a3': 0.5,
          'b1': 0.6,
          'b2': 0.6,
          'b3': 0.8,
          'c1': 0.5,
          'c2': 0.3,
          'c3': 0.4
        }
      },
      {
        id: 'retail',
        text: 'Retail & Services',
        archetypeWeights: {
          'a1': 0.3,
          'a2': 0.3,
          'a3': 0.6,
          'b1': 0.8,
          'b2': 0.7,
          'b3': 0.6,
          'c1': 0.5,
          'c2': 0.4,
          'c3': 0.4
        }
      },
      {
        id: 'education',
        text: 'Education & Healthcare',
        archetypeWeights: {
          'a1': 0.5,
          'a2': 0.7,
          'a3': 0.8,
          'b1': 0.3,
          'b2': 0.4,
          'b3': 0.4,
          'c1': 0.6,
          'c2': 0.5,
          'c3': 0.7
        }
      }
    ]
  },
  {
    id: 'geography',
    text: 'How would you describe your organization\'s geographic footprint?',
    options: [
      {
        id: 'single_state',
        text: 'Single state or limited regional presence (1-5 states)',
        archetypeWeights: {
          'a1': 0.4,
          'a2': 0.5,
          'a3': 0.6,
          'b1': 0.6,
          'b2': 0.7,
          'b3': 0.6,
          'c1': 0.5,
          'c2': 0.3,
          'c3': 0.5
        }
      },
      {
        id: 'regional',
        text: 'Regional presence (6-15 states)',
        archetypeWeights: {
          'a1': 0.6,
          'a2': 0.6,
          'a3': 0.5,
          'b1': 0.7,
          'b2': 0.6,
          'b3': 0.5,
          'c1': 0.6,
          'c2': 0.5,
          'c3': 0.6
        }
      },
      {
        id: 'national',
        text: 'National presence (16-30 states)',
        archetypeWeights: {
          'a1': 0.8,
          'a2': 0.7,
          'a3': 0.5,
          'b1': 0.5,
          'b2': 0.5,
          'b3': 0.4,
          'c1': 0.7,
          'c2': 0.7,
          'c3': 0.7
        }
      },
      {
        id: 'multi_national',
        text: 'Multi-regional/national presence (31+ states)',
        archetypeWeights: {
          'a1': 0.9,
          'a2': 0.6,
          'a3': 0.4,
          'b1': 0.4,
          'b2': 0.4,
          'b3': 0.3,
          'c1': 0.6,
          'c2': 0.8,
          'c3': 0.8
        }
      }
    ]
  },
  {
    id: 'size',
    text: 'Approximately how many employees does your organization have?',
    options: [
      {
        id: 'small',
        text: 'Small (Under 500)',
        archetypeWeights: {
          'a1': 0.3,
          'a2': 0.3,
          'a3': 0.5,
          'b1': 0.8,
          'b2': 0.7,
          'b3': 0.5,
          'c1': 0.4,
          'c2': 0.3,
          'c3': 0.4
        }
      },
      {
        id: 'medium',
        text: 'Medium (500-2,499)',
        archetypeWeights: {
          'a1': 0.5,
          'a2': 0.5,
          'a3': 0.6,
          'b1': 0.7,
          'b2': 0.8,
          'b3': 0.7,
          'c1': 0.6,
          'c2': 0.5,
          'c3': 0.6
        }
      },
      {
        id: 'large',
        text: 'Large (2,500-9,999)',
        archetypeWeights: {
          'a1': 0.7,
          'a2': 0.7,
          'a3': 0.5,
          'b1': 0.5,
          'b2': 0.6,
          'b3': 0.8,
          'c1': 0.8,
          'c2': 0.7,
          'c3': 0.7
        }
      },
      {
        id: 'enterprise',
        text: 'Enterprise (10,000+)',
        archetypeWeights: {
          'a1': 0.9,
          'a2': 0.8,
          'a3': 0.4,
          'b1': 0.3,
          'b2': 0.4,
          'b3': 0.5,
          'c1': 0.7,
          'c2': 0.9,
          'c3': 0.8
        }
      }
    ]
  },
  {
    id: 'gender',
    text: 'Which best describes your workforce gender distribution?',
    options: [
      {
        id: 'male_dominated',
        text: 'Predominantly male (less than 35% female)',
        archetypeWeights: {
          'a1': 0.5,
          'a2': 0.4,
          'a3': 0.3,
          'b1': 0.6,
          'b2': 0.5,
          'b3': 0.8,
          'c1': 0.6,
          'c2': 0.5,
          'c3': 0.5
        }
      },
      {
        id: 'balanced',
        text: 'Mixed (35-65% female)',
        archetypeWeights: {
          'a1': 0.7,
          'a2': 0.6,
          'a3': 0.6,
          'b1': 0.5,
          'b2': 0.7,
          'b3': 0.5,
          'c1': 0.5,
          'c2': 0.7,
          'c3': 0.6
        }
      },
      {
        id: 'female_dominated',
        text: 'Predominantly female (more than 65% female)',
        archetypeWeights: {
          'a1': 0.4,
          'a2': 0.7,
          'a3': 0.9,
          'b1': 0.3,
          'b2': 0.4,
          'b3': 0.3,
          'c1': 0.4,
          'c2': 0.5,
          'c3': 0.7
        }
      }
    ]
  },
  {
    id: 'priorities',
    text: 'What is your organization\'s primary focus in healthcare benefits?',
    options: [
      {
        id: 'cost',
        text: 'Cost containment and efficiency',
        archetypeWeights: {
          'a1': 0.3,
          'a2': 0.2,
          'a3': 0.3,
          'b1': 0.9,
          'b2': 0.7,
          'b3': 0.6,
          'c1': 0.5,
          'c2': 0.6,
          'c3': 0.5
        }
      },
      {
        id: 'access',
        text: 'Comprehensive access to care options',
        archetypeWeights: {
          'a1': 0.9,
          'a2': 0.7,
          'a3': 0.6,
          'b1': 0.3,
          'b2': 0.5,
          'b3': 0.4,
          'c1': 0.6,
          'c2': 0.5,
          'c3': 0.4
        }
      },
      {
        id: 'quality',
        text: 'Quality outcomes and condition management',
        archetypeWeights: {
          'a1': 0.6,
          'a2': 0.9,
          'a3': 0.5,
          'b1': 0.4,
          'b2': 0.6,
          'b3': 0.5,
          'c1': 0.8,
          'c2': 0.7,
          'c3': 0.6
        }
      },
      {
        id: 'experience',
        text: 'Employee experience and satisfaction',
        archetypeWeights: {
          'a1': 0.7,
          'a2': 0.5,
          'a3': 0.8,
          'b1': 0.5,
          'b2': 0.8,
          'b3': 0.7,
          'c1': 0.4,
          'c2': 0.4,
          'c3': 0.5
        }
      },
      {
        id: 'balanced',
        text: 'Balancing multiple priorities equally',
        archetypeWeights: {
          'a1': 0.5,
          'a2': 0.6,
          'a3': 0.5,
          'b1': 0.5,
          'b2': 0.6,
          'b3': 0.6,
          'c1': 0.7,
          'c2': 0.6,
          'c3': 0.8
        }
      }
    ]
  }
];

