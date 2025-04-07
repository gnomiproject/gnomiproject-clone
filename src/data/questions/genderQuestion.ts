
import { AssessmentQuestion } from '../../types/assessment';

export const genderQuestion: AssessmentQuestion = {
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
};
