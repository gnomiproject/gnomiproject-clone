
import { AssessmentQuestion } from '../../types/assessment';

export const geographyQuestion: AssessmentQuestion = {
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
};
