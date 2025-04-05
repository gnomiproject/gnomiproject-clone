
import { ArchetypeId } from '../types/archetype';
import { assessmentQuestions } from '../data/assessmentQuestions';
import { AssessmentResult } from '../types/assessment';

/**
 * Calculates the archetype result based on the answers provided in the assessment
 * @param answers Record of question ids and selected option ids
 * @returns AssessmentResult with the best matching archetypes
 */
export const calculateArchetypeMatch = (answers: Record<string, string>): AssessmentResult => {
  const archetypeScores: Record<ArchetypeId, number> = {
    'a1': 0, 'a2': 0, 'a3': 0,
    'b1': 0, 'b2': 0, 'b3': 0,
    'c1': 0, 'c2': 0, 'c3': 0
  };

  // Calculate scores for each archetype based on answers
  Object.keys(answers).forEach(questionId => {
    const question = assessmentQuestions.find(q => q.id === questionId);
    if (!question) return;

    const selectedOption = question.options.find(option => option.id === answers[questionId]);
    if (!selectedOption) return;

    // Add weights to archetype scores
    Object.entries(selectedOption.archetypeWeights).forEach(([archetype, weight]) => {
      archetypeScores[archetype as ArchetypeId] += weight;
    });
  });

  // Sort archetypes by score
  const sortedArchetypes = Object.keys(archetypeScores)
    .sort((a, b) => archetypeScores[b as ArchetypeId] - archetypeScores[a as ArchetypeId])
    .map(id => ({ id, score: archetypeScores[id as ArchetypeId] }));

  // Calculate max possible score to derive percentage match
  const maxPossibleScore = Object.keys(answers).length; // Assuming perfect 1.0 weights
  const topScore = sortedArchetypes[0].score;
  const percentageMatch = Math.round((topScore / maxPossibleScore) * 100);

  // Determine result tier based on percentage match
  let resultTier: 'Basic' | 'Detailed' | 'Comprehensive';
  if (percentageMatch >= 85) {
    resultTier = 'Comprehensive';
  } else if (percentageMatch >= 70) {
    resultTier = 'Detailed';
  } else {
    resultTier = 'Basic';
  }

  return {
    primaryArchetype: sortedArchetypes[0].id as ArchetypeId,
    secondaryArchetype: sortedArchetypes[1]?.id as ArchetypeId || null,
    tertiaryArchetype: sortedArchetypes[2]?.id as ArchetypeId || null,
    score: topScore,
    percentageMatch,
    resultTier
  };
};

/**
 * Gets the list of questions with their options for the assessment
 * @returns Array of assessment questions
 */
export const getAssessmentQuestions = () => {
  return assessmentQuestions;
};

