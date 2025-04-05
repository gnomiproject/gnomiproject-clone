import React from 'react';
import Button from '@/components/shared/Button';
import SectionTitle from '@/components/shared/SectionTitle';
import { RefreshCw } from 'lucide-react';
import { useAssessment } from '../hooks/useAssessment';

const Assessment = () => {
  const { 
    currentQuestion, 
    totalQuestions, 
    answers, 
    setAnswer, 
    goToNext, 
    goToPrevious 
  } = useAssessment();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-10">
          <SectionTitle
            title={currentQuestion === totalQuestions ? "Healthcare Priorities" : 
                  currentQuestion === 4 ? "Workforce Demographics" : 
                  currentQuestion === 3 ? "Workforce Size" :
                  currentQuestion === 2 ? "Geographic Presence" :
                  "Industry Classification"}
            center
          />
        </header>
        
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="mb-6">
            <div className="text-gray-600 mb-2">
              Question {currentQuestion} of {totalQuestions}
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full" 
                style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {currentQuestion === 1 && (
            <QuestionOne
              value={answers['industry'] || ''}
              onChange={(value) => setAnswer('industry', value)}
            />
          )}
          
          {currentQuestion === 2 && (
            <QuestionTwo
              value={answers['geography'] || ''}
              onChange={(value) => setAnswer('geography', value)}
            />
          )}
          
          {currentQuestion === 3 && (
            <QuestionThree
              value={answers['size'] || ''}
              onChange={(value) => setAnswer('size', value)}
            />
          )}
          
          {currentQuestion === 4 && (
            <QuestionFour
              value={answers['gender'] || ''}
              onChange={(value) => setAnswer('gender', value)}
            />
          )}
          
          {currentQuestion === 5 && (
            <QuestionFive
              value={answers['priorities'] || ''}
              onChange={(value) => setAnswer('priorities', value)}
            />
          )}
          
          <div className="flex justify-between mt-8">
            <Button
              onClick={goToPrevious}
              variant="outline"
              className="px-4 py-2"
            >
              Back
            </Button>
            
            {currentQuestion === totalQuestions ? (
              <Button
                onClick={goToNext}
                className="px-8"
              >
                See Results
              </Button>
            ) : (
              <Button
                onClick={goToNext}
                className="px-8"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface QuestionProps {
  value: string;
  onChange: (value: string) => void;
}

const QuestionOne = ({ value, onChange }: QuestionProps) => {
  const options = [
    'Professional Services (Legal, Consulting, Architecture)',
    'Finance & Insurance',
    'Technology & Information',
    'Manufacturing & Production',
    'Construction & Real Estate',
    'Retail & Services',
    'Education & Healthcare'
  ];
  
  return (
    <div>
      <h3 className="text-xl mb-6 text-gray-700">Which industry best describes your organization?</h3>
      {options.map(option => (
        <div key={option} className="mb-4">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              className="form-radio h-5 w-5 text-blue-500"
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <span className="ml-2">{option}</span>
          </label>
        </div>
      ))}
    </div>
  );
};

const QuestionTwo = ({ value, onChange }: QuestionProps) => {
  const options = [
    'Single state or limited regional presence (1-5 states)',
    'Regional presence (6-15 states)',
    'National presence (16-30 states)',
    'Multi-regional/national presence (31+ states)'
  ];
  
  return (
    <div>
      <h3 className="text-xl mb-6 text-gray-700">How would you describe your organization's geographic footprint?</h3>
      {options.map(option => (
        <div key={option} className="mb-4">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              className="form-radio h-5 w-5 text-blue-500"
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <span className="ml-2">{option}</span>
          </label>
        </div>
      ))}
    </div>
  );
};

const QuestionThree = ({ value, onChange }: QuestionProps) => {
  const options = [
    'Small (Under 500)',
    'Medium (500-2,499)',
    'Large (2,500-9,999)',
    'Enterprise (10,000+)',
  ];
  
  return (
    <div>
      <h3 className="text-xl mb-6 text-gray-700">Approximately how many employees does your organization have?</h3>
      {options.map(option => (
        <div key={option} className="mb-4">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              className="form-radio h-5 w-5 text-blue-500"
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <span className="ml-2">{option}</span>
          </label>
        </div>
      ))}
    </div>
  );
};

const QuestionFour = ({ value, onChange }: QuestionProps) => {
  const options = [
    'Predominantly male (less than 35% female)',
    'Mixed (35-65% female)',
    'Predominantly female (more than 65% female)'
  ];
  
  return (
    <div>
      <h3 className="text-xl mb-6 text-gray-700">Which best describes your workforce gender distribution?</h3>
      {options.map(option => (
        <div key={option} className="mb-4">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              className="form-radio h-5 w-5 text-blue-500"
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <span className="ml-2">{option}</span>
          </label>
        </div>
      ))}
    </div>
  );
};

const QuestionFive = ({ value, onChange }: QuestionProps) => {
  const options = [
    'Cost containment and efficiency',
    'Comprehensive access to care options',
    'Quality outcomes and condition management',
    'Employee experience and satisfaction',
    'Balancing multiple priorities equally'
  ];
  
  return (
    <div>
      <h3 className="text-xl mb-6 text-gray-700">What is your organization's primary focus in healthcare benefits?</h3>
      {options.map(option => (
        <div key={option} className="mb-4">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              className="form-radio h-5 w-5 text-blue-500"
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <span className="ml-2">{option}</span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default Assessment;
