
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
      className="flex items-center text-sm text-gray-500 border-gray-300 hover:bg-gray-50"
      size="sm"
    >
      <RefreshCw className="mr-2 h-3 w-3" /> Retake Assessment
    </Button>
  );
};

export default RetakeButton;
