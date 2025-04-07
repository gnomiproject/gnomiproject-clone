
import { AssessmentQuestion } from '../types/assessment';

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'industry',
    text: 'Which industry best describes your organization?',
    options: [
      {
        id: 'accommodation',
        text: 'Accommodation and Food Services (NAICS 72)',
        archetypeWeights: {
          'a1': 0.2, 'a2': 0.2, 'a3': 0.2,
          'b1': 0.2, 'b2': 0.2, 'b3': 0.2,
          'c1': 0.5, 'c2': 0.8, 'c3': 0.2
        }
      },
      {
        id: 'administrative',
        text: 'Administrative and Support Services (NAICS 561)',
        archetypeWeights: {
          'a1': 0.2, 'a2': 0.2, 'a3': 0.2,
          'b1': 0.2, 'b2': 0.2, 'b3': 0.2,
          'c1': 0.5, 'c2': 0.8, 'c3': 0.2
        }
      },
      {
        id: 'construction',
        text: 'Construction (NAICS 23)',
        archetypeWeights: {
          'a1': 0.2, 'a2': 0.2, 'a3': 0.2,
          'b1': 0.4, 'b2': 0.7, 'b3': 0.5,
          'c1': 0.2, 'c2': 0.2, 'c3': 0.2
        }
      },
      {
        id: 'education',
        text: 'Educational Services (NAICS 61)',
        archetypeWeights: {
          'a1': 0.2, 'a2': 0.2, 'a3': 0.2,
          'b1': 0.2, 'b2': 0.2, 'b3': 0.5,
          'c1': 0.2, 'c2': 0.2, 'c3': 0.8
        }
      },
      {
        id: 'finance_insurance',
        text: 'Finance and Insurance (NAICS 52)',
        archetypeWeights: {
          'a1': 0.2, 'a2': 0.9, 'a3': 0.2,
          'b1': 0.2, 'b2': 0.2, 'b3': 0.2,
          'c1': 0.2, 'c2': 0.2, 'c3': 0.2
        }
      },
      {
        id: 'healthcare',
        text: 'Health Care and Social Assistance (NAICS 62)',
        archetypeWeights: {
          'a1': 0.2, 'a2': 0.2, 'a3': 0.2,
          'b1': 0.2, 'b2': 0.2, 'b3': 0.5,
          'c1': 0.2, 'c2': 0.2, 'c3': 0.8
        }
      },
      {
        id: 'information',
        text: 'Information (NAICS 51)',
        archetypeWeights: {
          'a1': 0.6, 'a2': 0.2, 'a3': 0.7,
          'b1': 0.2, 'b2': 0.2, 'b3': 0.2,
          'c1': 0.2, 'c2': 0.2, 'c3': 0.2
        }
      },
      {
        id: 'manufacturing',
        text: 'Manufacturing (NAICS 31-33)',
        archetypeWeights: {
          'a1': 0.2, 'a2': 0.2, 'a3': 0.2,
          'b1': 0.7, 'b2': 0.2, 'b3': 0.5,
          'c1': 0.2, 'c2': 0.2, 'c3': 0.5
        }
      },
      {
        id: 'professional',
        text: 'Professional, Scientific, and Technical Services (NAICS 54)',
        archetypeWeights: {
          'a1': 0.8, 'a2': 0.2, 'a3': 0.5,
          'b1': 0.2, 'b2': 0.2, 'b3': 0.2,
          'c1': 0.2, 'c2': 0.2, 'c3': 0.2
        }
      },
      {
        id: 'real_estate',
        text: 'Real Estate and Rental and Leasing (NAICS 53)',
        archetypeWeights: {
          'a1': 0.2, 'a2': 0.2, 'a3': 0.2,
          'b1': 0.4, 'b2': 0.7, 'b3': 0.5,
          'c1': 0.2, 'c2': 0.2, 'c3': 0.2
        }
      },
      {
        id: 'retail',
        text: 'Retail Trade (NAICS 44-45)',
        archetypeWeights: {
          'a1': 0.2, 'a2': 0.2, 'a3': 0.2,
          'b1': 0.2, 'b2': 0.2, 'b3': 0.2,
          'c1': 0.5, 'c2': 0.8, 'c3': 0.2
        }
      },
      {
        id: 'transportation',
        text: 'Transportation and Warehousing (NAICS 48-49)',
        archetypeWeights: {
          'a1': 0.2, 'a2': 0.2, 'a3': 0.2,
          'b1': 0.7, 'b2': 0.2, 'b3': 0.5,
          'c1': 0.2, 'c2': 0.2, 'c3': 0.5
        }
      },
      {
        id: 'utilities',
        text: 'Utilities (NAICS 22)',
        archetypeWeights: {
          'a1': 0.2, 'a2': 0.2, 'a3': 0.2,
          'b1': 0.7, 'b2': 0.2, 'b3': 0.5,
          'c1': 0.2, 'c2': 0.2, 'c3': 0.5
        }
      },
      {
        id: 'waste_management',
        text: 'Waste Management and Remediation Services (NAICS 562)',
        archetypeWeights: {
          'a1': 0.2, 'a2': 0.2, 'a3': 0.2,
          'b1': 0.2, 'b2': 0.2, 'b3': 0.2,
          'c1': 0.5, 'c2': 0.8, 'c3': 0.2
        }
      },
      {
        id: 'wholesale',
        text: 'Wholesale Trade (NAICS 42)',
        archetypeWeights: {
          'a1': 0.2, 'a2': 0.2, 'a3': 0.5,
          'b1': 0.7, 'b2': 0.2, 'b3': 0.5,
          'c1': 0.2, 'c2': 0.2, 'c3': 0.5
        }
      },
      {
        id: 'other_services',
        text: 'Other Services (except Public Administration) (NAICS 81)',
        archetypeWeights: {
          'a1': 0.2, 'a2': 0.2, 'a3': 0.2,
          'b1': 0.2, 'b2': 0.2, 'b3': 0.2,
          'c1': 0.5, 'c2': 0.8, 'c3': 0.2
        }
      }
    ]
  },
  {
    id: 'geography',
    text: 'In how many states does your organization operate?',
    options: [
      {
        id: '1_to_15',
        text: '1-15 states',
        archetypeWeights: {
          'a1': 0.4, 'a2': 0.5, 'a3': 0.3,
          'b1': 0.7, 'b2': 0.7, 'b3': 0.3,
          'c1': 0.3, 'c2': 0.8, 'c3': 0.5
        }
      },
      {
        id: '16_to_19',
        text: '16-19 states',
        archetypeWeights: {
          'a1': 0.6, 'a2': 0.5, 'a3': 0.4,
          'b1': 0.5, 'b2': 0.7, 'b3': 0.4,
          'c1': 0.7, 'c2': 0.4, 'c3': 0.5
        }
      },
      {
        id: '20_to_29',
        text: '20-29 states',
        archetypeWeights: {
          'a1': 0.7, 'a2': 0.6, 'a3': 0.4,
          'b1': 0.4, 'b2': 0.3, 'b3': 0.7,
          'c1': 0.6, 'c2': 0.3, 'c3': 0.6
        }
      },
      {
        id: '30_plus',
        text: '30+ states',
        archetypeWeights: {
          'a1': 0.3, 'a2': 0.6, 'a3': 0.8,
          'b1': 0.2, 'b2': 0.2, 'b3': 0.8,
          'c1': 0.7, 'c2': 0.2, 'c3': 0.3
        }
      }
    ]
  },
  {
    id: 'size',
    text: 'What is the approximate size of your organization?',
    options: [
      {
        id: 'less_than_250',
        text: 'Less than 250 employees',
        archetypeWeights: {
          'a1': 0.3, 'a2': 0.3, 'a3': 0.3,
          'b1': 0.7, 'b2': 0.6, 'b3': 0.3,
          'c1': 0.4, 'c2': 0.7, 'c3': 0.5
        }
      },
      {
        id: '250_to_999',
        text: '250-999 employees',
        archetypeWeights: {
          'a1': 0.5, 'a2': 0.5, 'a3': 0.5,
          'b1': 0.6, 'b2': 0.5, 'b3': 0.5,
          'c1': 0.5, 'c2': 0.5, 'c3': 0.5
        }
      },
      {
        id: '1000_to_9999',
        text: '1,000-9,999 employees',
        archetypeWeights: {
          'a1': 0.6, 'a2': 0.6, 'a3': 0.6,
          'b1': 0.5, 'b2': 0.5, 'b3': 0.6,
          'c1': 0.5, 'c2': 0.5, 'c3': 0.5
        }
      },
      {
        id: '10000_to_99999',
        text: '10,000-99,999 employees',
        archetypeWeights: {
          'a1': 0.7, 'a2': 0.7, 'a3': 0.7,
          'b1': 0.4, 'b2': 0.4, 'b3': 0.6,
          'c1': 0.5, 'c2': 0.4, 'c3': 0.5
        }
      },
      {
        id: '100000_plus',
        text: '100,000+ employees',
        archetypeWeights: {
          'a1': 0.8, 'a2': 0.8, 'a3': 0.8,
          'b1': 0.3, 'b2': 0.3, 'b3': 0.5,
          'c1': 0.6, 'c2': 0.3, 'c3': 0.4
        }
      }
    ]
  },
  {
    id: 'gender',
    text: 'What percentage of your workforce is female?',
    options: [
      {
        id: 'less_than_equal_49',
        text: 'Less than or equal to 49%',
        archetypeWeights: {
          'a1': 0.5, 'a2': 0.5, 'a3': 0.5,
          'b1': 0.8, 'b2': 0.6, 'b3': 0.5,
          'c1': 0.5, 'c2': 0.5, 'c3': 0.4
        }
      },
      {
        id: 'greater_than_49',
        text: 'Greater than 49%',
        archetypeWeights: {
          'a1': 0.5, 'a2': 0.5, 'a3': 0.5,
          'b1': 0.3, 'b2': 0.5, 'b3': 0.5,
          'c1': 0.5, 'c2': 0.5, 'c3': 0.7
        }
      }
    ]
  }
];
