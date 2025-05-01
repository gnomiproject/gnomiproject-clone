
import { useState, useEffect } from 'react';

interface FormFocusManagerResult {
  isFormVisible: boolean;
}

const useFormFocusDetection = (): FormFocusManagerResult => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  // Detect when user is focusing on form inputs
  useEffect(() => {
    const formInputs = document.querySelectorAll('input, textarea, select');
    
    const handleFocus = () => setIsFormVisible(true);
    const handleBlur = () => {
      // Set a small delay to avoid flickering when switching between form fields
      setTimeout(() => {
        // Check if any form element is still focused
        if (!document.activeElement || 
            (document.activeElement.tagName !== 'INPUT' && 
             document.activeElement.tagName !== 'TEXTAREA' &&
             document.activeElement.tagName !== 'SELECT')) {
          setIsFormVisible(false);
        }
      }, 100);
    };
    
    formInputs.forEach(input => {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });
    
    return () => {
      formInputs.forEach(input => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      });
    };
  }, []);
  
  return { isFormVisible };
};

export default useFormFocusDetection;
