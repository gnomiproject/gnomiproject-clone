
import React from 'react';

interface PrintButtonProps {
  contentRef: React.RefObject<HTMLDivElement>;
  documentTitle: string;
}

// Removed print button functionality as requested
const PrintButton: React.FC<PrintButtonProps> = () => {
  // Return null to remove the button from the UI
  return null;
};

export default PrintButton;
