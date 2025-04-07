
import { AssessmentQuestion } from '../../types/assessment';

export const industryQuestion: AssessmentQuestion = {
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
};
