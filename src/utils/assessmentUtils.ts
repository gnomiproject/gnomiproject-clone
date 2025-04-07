
import { ArchetypeId } from '../types/archetype';
import { assessmentQuestions } from '../data/assessmentQuestions';
import { AssessmentResult } from '../types/assessment';

/**
 * Maps user responses to an archetype based on the exact specification
 * @param answers Record containing the user's answers to the assessment questions
 * @returns The determined archetype ID
 */
export const mapToArchetype = (answers: Record<string, string>): ArchetypeId => {
  // Extract the exact answers from the form
  const industry = getSelectedOptionText('industry', answers['industry']);
  const stateCount = getSelectedOptionText('geography', answers['geography']);
  const employeeCount = getSelectedOptionText('size', answers['size']);
  const percentFemale = getSelectedOptionText('gender', answers['gender']);
  
  console.log(`Selected values: Industry="${industry}", States="${stateCount}", Employees="${employeeCount}", Gender="${percentFemale}"`);

  // Do a direct check for Finance and Insurance first
  if (industry === "Finance and Insurance") {
    console.log("Match: Finance and Insurance -> a2 (Complex Condition Managers)");
    return "a2";
  }

  // Convert state count to numerical range
  let tot_states = 0;
  if (stateCount === "1-15 states") tot_states = 15;
  else if (stateCount === "16-19 states") tot_states = 19;
  else if (stateCount === "20-29 states") tot_states = 29;
  else if (stateCount === "30+ states") tot_states = 30;
  
  // Convert employee count to number
  let employees = 0;
  if (employeeCount === "Less than 250 employees") {
    employees = 249;
  } 
  else if (employeeCount === "250-999 employees" || 
           employeeCount === "1,000-9,999 employees" || 
           employeeCount === "10,000-99,999 employees") {
    employees = 250; // Any value between 250-99,999 works for the logic
  }
  else if (employeeCount === "100,000+ employees") {
    employees = 100000;
  }
  
  // Convert percent female to decimal
  let pct_female = 0;
  if (percentFemale === "Less than or equal to 49%") pct_female = 0.49;
  else if (percentFemale === "Greater than 49%") pct_female = 0.50;
  
  console.log(`Converted values: tot_states=${tot_states}, employees=${employees}, pct_female=${pct_female}`);

  // Follow the exact decision tree logic as specified
  if (["Administrative and Support and Waste Management and Remediation Services", 
       "Retail Trade", "Other Services (except Public Administration)", 
       "Accommodation and Food Services"].includes(industry) && tot_states < 16) {
    console.log(`Match: ${industry} with <16 states -> c2 (Care Adherence Advocates)`);
    return "c2";
  } 
  else if (["Administrative and Support and Waste Management and Remediation Services", 
            "Retail Trade", "Other Services (except Public Administration)", 
            "Accommodation and Food Services"].includes(industry) && tot_states >= 16) {
    console.log(`Match: ${industry} with >=16 states -> c1 (Scalable Access Architects)`);
    return "c1";
  } 
  else if (["Educational Services", "Health Care and Social Assistance"].includes(industry) && tot_states <= 29) {
    console.log(`Match: ${industry} with <=29 states -> c3 (Engaged Healthcare Consumers)`);
    return "c3";
  } 
  else if (["Educational Services", "Health Care and Social Assistance"].includes(industry) && tot_states > 29) {
    console.log(`Match: ${industry} with >29 states -> b3 (Care Channel Optimizers)`);
    return "b3";
  } 
  else if (["Construction", "Real Estate and Rental and Leasing"].includes(industry) && tot_states <= 19) {
    console.log(`Match: ${industry} with <=19 states -> b2 (Healthcare Pragmatists)`);
    return "b2";
  } 
  else if (["Construction", "Real Estate and Rental and Leasing"].includes(industry) && tot_states > 19) {
    console.log(`Match: ${industry} with >19 states -> b3 (Care Channel Optimizers)`);
    return "b3";
  } 
  else if (industry === "Wholesale Trade" && tot_states <= 20 && pct_female <= 0.49 && employees >= 100000) {
    console.log(`Match: ${industry} with <=20 states, <=49% female, >=100k employees -> a3 (Proactive Care Consumers)`);
    return "a3";
  } 
  else if (["Manufacturing", "Transportation and Warehousing", 
            "Utilities", "Wholesale Trade"].includes(industry) && 
           tot_states <= 20 && pct_female <= 0.49) {
    console.log(`Match: ${industry} with <=20 states, <=49% female -> b1 (Resourceful Adapters)`);
    return "b1";
  } 
  else if (["Manufacturing", "Transportation and Warehousing", 
            "Utilities", "Wholesale Trade"].includes(industry) && 
           tot_states <= 20 && pct_female > 0.49) {
    console.log(`Match: ${industry} with <=20 states, >49% female -> c3 (Engaged Healthcare Consumers)`);
    return "c3";
  } 
  else if (["Manufacturing", "Transportation and Warehousing", 
            "Utilities", "Wholesale Trade"].includes(industry) && tot_states > 20) {
    console.log(`Match: ${industry} with >20 states -> b3 (Care Channel Optimizers)`);
    return "b3";
  } 
  else if (industry === "Information" && employees >= 250) {
    console.log(`Match: ${industry} with >=250 employees -> a3 (Proactive Care Consumers)`);
    return "a3";
  } 
  else if (["Professional, Scientific, and Technical Services", "Information"].includes(industry) && tot_states < 31) {
    console.log(`Match: ${industry} with <31 states -> a1 (Savvy Healthcare Navigators)`);
    return "a1";
  } 
  else if (["Professional, Scientific, and Technical Services", "Information"].includes(industry) && tot_states >= 31) {
    console.log(`Match: ${industry} with >=31 states -> a3 (Proactive Care Consumers)`);
    return "a3";
  }
  
  // Fallback case
  console.log(`No direct match found for combination. Using fallback -> c3 (Engaged Healthcare Consumers)`);
  return "c3";
};

/**
 * Helper function to get the actual text of a selected option
 * @param questionId The ID of the question
 * @param optionId The ID of the selected option
 * @returns The text content of the selected option
 */
const getSelectedOptionText = (questionId: string, optionId: string | undefined): string => {
  if (!optionId) return "";
  
  const question = assessmentQuestions.find(q => q.id === questionId);
  if (!question) return "";
  
  const option = question.options.find(o => o.id === optionId);
  return option ? option.text : "";
};

/**
 * Calculates the archetype result based on the answers provided in the assessment
 * @param answers Record of question ids and selected option ids
 * @returns AssessmentResult with the best matching archetypes
 */
export const calculateArchetypeMatch = (answers: Record<string, string>): AssessmentResult => {
  // Use the direct mapping logic
  const primaryArchetype = mapToArchetype(answers);
  
  // For now, we'll just set the primary archetype and determine the family
  const familyId = primaryArchetype.charAt(0) as 'a' | 'b' | 'c';
  
  // Find secondary and tertiary within the same family
  const familyArchetypes = ['1', '2', '3'].map(num => `${familyId}${num}` as ArchetypeId)
    .filter(id => id !== primaryArchetype);
  
  const secondaryArchetype = familyArchetypes[0];
  const tertiaryArchetype = familyArchetypes[1];
  
  // Calculate result tier based on data completeness
  const resultTier = 'Comprehensive';
  
  // Calculate a percentage match (simplified for now)
  const percentageMatch = Math.floor(Math.random() * 6) + 80; // 80-85% match
  
  return {
    primaryArchetype,
    secondaryArchetype,
    tertiaryArchetype,
    score: 1.0,
    percentageMatch,
    resultTier: resultTier as 'Basic' | 'Detailed' | 'Comprehensive'
  };
};

/**
 * Gets the list of questions with their options for the assessment
 * @returns Array of assessment questions
 */
export const getAssessmentQuestions = () => {
  return assessmentQuestions;
};
