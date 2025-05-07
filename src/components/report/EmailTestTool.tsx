
import React, { useState } from 'react';
import { useEmailService } from '@/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

const EmailTestTool: React.FC = () => {
  // Set the default email to gnomi@onenomi.com
  const [recipientEmail, setRecipientEmail] = useState('gnomi@onenomi.com');
  const { sendTestEmail, processPendingReports, isSending, lastResult } = useEmailService();
  
  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendTestEmail({ recipientEmail });
  };
  
  const handleProcessReports = async () => {
    await processPendingReports();
  };
  
  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Email Testing Tool</h2>
      
      <form onSubmit={handleSendTestEmail} className="space-y-4 mb-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Recipient Email
          </label>
          <Input
            id="email"
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="Enter email address"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isSending || !recipientEmail}
          className="w-full"
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Test Email'
          )}
        </Button>
      </form>
      
      <Separator className="my-4" />
      
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Process Pending Reports</h3>
        <p className="text-sm text-gray-600 mb-4">
          Manually trigger processing of pending report emails.
        </p>
        
        <Button 
          onClick={handleProcessReports}
          disabled={isSending}
          variant="outline"
          className="w-full"
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Process Pending Reports'
          )}
        </Button>
      </div>
      
      {lastResult && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Last Result</h3>
          <div className="bg-gray-50 p-3 rounded text-sm overflow-auto max-h-40">
            <pre>{JSON.stringify(lastResult, null, 2)}</pre>
          </div>
        </div>
      )}
    </Card>
  );
};

export default EmailTestTool;
