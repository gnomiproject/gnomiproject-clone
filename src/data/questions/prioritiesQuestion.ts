
import { AssessmentQuestion } from '../../types/assessment';

export const prioritiesQuestion: AssessmentQuestion = {
  id: 'priorities',
  text: 'Which of the following are priorities for your organization\'s healthcare strategy? Select all that apply.',
  type: 'multi-select', // Adding a type field to distinguish from single-select questions
  options: [
    {
      id: 'reduce_costs',
      text: 'Reducing overall healthcare costs',
      archetypeWeights: {} // Empty as this doesn't affect mapping
    },
    {
      id: 'improve_outcomes',
      text: 'Improving employee health outcomes',
      archetypeWeights: {}
    },
    {
      id: 'enhance_access',
      text: 'Enhancing access to care',
      archetypeWeights: {}
    },
    {
      id: 'manage_conditions',
      text: 'Managing specific high-cost conditions',
      archetypeWeights: {}
    },
    {
      id: 'attract_talent',
      text: 'Attracting and retaining talent through benefits',
      archetypeWeights: {}
    },
    {
      id: 'mental_health',
      text: 'Addressing mental health needs',
      archetypeWeights: {}
    },
    {
      id: 'digital_solutions',
      text: 'Implementing digital health solutions',
      archetypeWeights: {}
    },
    {
      id: 'data_strategies',
      text: 'Developing data-driven healthcare strategies',
      archetypeWeights: {}
    },
    {
      id: 'other',
      text: 'Other/Not sure',
      archetypeWeights: {}
    }
  ]
};
