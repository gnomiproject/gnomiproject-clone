
import React, { useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrintButtonProps {
  contentRef: React.RefObject<HTMLDivElement>;
  documentTitle: string;
}

const PrintButton: React.FC<PrintButtonProps> = ({ contentRef, documentTitle }) => {
  const [showPrintButton, setShowPrintButton] = useState(false);
  
  // Setup print handler with correct properties according to react-to-print API
  const handlePrint = useReactToPrint({
    documentTitle,
    onBeforePrint: () => {
      document.body.classList.add('printing');
      return Promise.resolve();
    },
    onAfterPrint: () => {
      document.body.classList.remove('printing');
    },
    // Use the contentRef property
    contentRef,
  });

  // Show print button only after report is fully loaded
  useEffect(() => {
    if (contentRef.current) {
      setShowPrintButton(true);
    }
  }, [contentRef]);

  if (!showPrintButton) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-10 print:hidden">
      <Button 
        onClick={handlePrint}
        className="flex items-center gap-2 bg-white border shadow-md hover:bg-gray-50"
      >
        <Printer size={18} />
        <span>Print Report</span>
      </Button>
    </div>
  );
};

export default PrintButton;
