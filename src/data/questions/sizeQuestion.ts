
import { AssessmentQuestion } from '../../types/assessment';

export const sizeQuestion: AssessmentQuestion = {
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
};
