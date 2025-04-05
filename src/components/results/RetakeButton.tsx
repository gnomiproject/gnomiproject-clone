
import React from 'react';
import Button from '@/components/shared/Button';
import { RefreshCw } from 'lucide-react';

interface RetakeButtonProps {
  onClick: () => void;
}

const RetakeButton = ({ onClick }: RetakeButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="flex items-center text-sm"
      size="sm"
    >
      <RefreshCw className="mr-2 h-4 w-4" /> Retake Assessment
    </Button>
  );
};

export default RetakeButton;
