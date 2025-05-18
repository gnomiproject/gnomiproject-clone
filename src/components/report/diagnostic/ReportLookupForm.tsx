
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';

interface ReportLookupFormProps {
  archetypeId: string;
  accessToken: string;
  onArchetypeIdChange: (value: string) => void;
  onAccessTokenChange: (value: string) => void;
  onLookup: () => void;
  isLoading: boolean;
}

const ReportLookupForm: React.FC<ReportLookupFormProps> = ({
  archetypeId,
  accessToken,
  onArchetypeIdChange,
  onAccessTokenChange,
  onLookup,
  isLoading
}) => {
  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div>
        <label htmlFor="archetype-id" className="block text-sm font-medium mb-1">
          Archetype ID
        </label>
        <Input
          id="archetype-id"
          value={archetypeId}
          onChange={(e) => onArchetypeIdChange(e.target.value)}
          placeholder="Enter archetype ID"
        />
      </div>
      
      <div>
        <label htmlFor="access-token" className="block text-sm font-medium mb-1">
          Access Token
        </label>
        <Input
          id="access-token"
          value={accessToken}
          onChange={(e) => onAccessTokenChange(e.target.value)}
          placeholder="Enter access token"
        />
      </div>
      
      <Button 
        onClick={onLookup}
        disabled={isLoading || !archetypeId || !accessToken}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Lookup Report
          </>
        )}
      </Button>
    </div>
  );
};

export default ReportLookupForm;
