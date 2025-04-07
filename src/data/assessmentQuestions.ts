
import { AssessmentQuestion } from '../types/assessment';
import { industryQuestion } from './questions/industryQuestion';
import { geographyQuestion } from './questions/geographyQuestion';
import { sizeQuestion } from './questions/sizeQuestion';
import { genderQuestion } from './questions/genderQuestion';

/**
 * Combined assessment questions from individual question modules
 */
export const assessmentQuestions: AssessmentQuestion[] = [
  industryQuestion,
  geographyQuestion,
  sizeQuestion,
  genderQuestion
];
