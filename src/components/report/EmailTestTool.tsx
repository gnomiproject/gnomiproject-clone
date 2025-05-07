
import React, { useState } from 'react';
import { useEmailService } from '@/hooks';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2, Send, Users } from 'lucide-react';
import ReportEmailTest from './ReportEmailTest';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const EmailTestTool: React.FC = () => {
  // Set the default email to gnomi@onenomi.com
  const [recipientEmail, setRecipientEmail] = useState('gnomi@onenomi.com');
  const [testMultipleProviders, setTestMultipleProviders] = useState(false);
  const [isTestingProviders, setIsTestingProviders] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const { sendTestEmail, processPendingReports, isSending, lastResult } = useEmailService();
  
  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendTestEmail({ recipientEmail });
  };
  
  const handleProcessReports = async () => {
    await processPendingReports();
  };
  
  const testMultipleEmailProviders = async () => {
    if (!recipientEmail) {
      toast.error('Please enter a primary email address');
      return;
    }
    
    setIsTestingProviders(true);
    setTestResults(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('test-email-providers', {
        body: { 
          email: recipientEmail,
          testMultipleProviders
        }
      });
      
      if (error) {
        throw error;
      }
      
      setTestResults(data);
      
      if (data.success) {
        toast.success(`${data.successCount} of ${data.totalSent} test emails sent successfully`);
      } else {
        toast.error(`Failed to send test emails: ${data.error}`);
      }
    } catch (err: any) {
      console.error('Error testing email providers:', err);
      toast.error(`Error: ${err.message}`);
      setTestResults({
        success: false,
        error: err.message
      });
    } finally {
      setIsTestingProviders(false);
    }
  };
  
  return (
    <Card className="p-6 max-w-md mx-auto">
      <Tabs defaultValue="simple-test">
        <TabsList className="mb-4">
          <TabsTrigger value="simple-test">Simple Test</TabsTrigger>
          <TabsTrigger value="direct-test">Direct Email Test</TabsTrigger>
          <TabsTrigger value="provider-test">Provider Test</TabsTrigger>
        </TabsList>
        
        <TabsContent value="simple-test">
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
        </TabsContent>
        
        <TabsContent value="direct-test">
          <ReportEmailTest />
        </TabsContent>
        
        <TabsContent value="provider-test">
          <h2 className="text-xl font-bold mb-4">Email Provider Testing</h2>
          <p className="text-sm text-gray-600 mb-4">
            Test email deliverability across multiple email providers.
          </p>
          
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="test-email" className="block text-sm font-medium mb-1">
                Primary Email Address
              </label>
              <Input
                id="test-email"
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="test-multiple"
                checked={testMultipleProviders}
                onCheckedChange={(checked) => 
                  setTestMultipleProviders(checked === true)
                }
              />
              <label
                htmlFor="test-multiple"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Test multiple email providers
              </label>
            </div>
            
            <Button 
              onClick={testMultipleEmailProviders}
              disabled={isTestingProviders || !recipientEmail}
              className="w-full"
            >
              {isTestingProviders ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Test Email Deliverability
                </>
              )}
            </Button>
          </div>
          
          {testResults && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Test Results</h3>
              <div className="bg-gray-50 p-3 rounded text-sm overflow-auto max-h-60">
                <div className="mb-2 font-medium">
                  {testResults.successCount}/{testResults.totalSent} emails sent successfully
                </div>
                
                {testResults.results?.map((result: any, index: number) => (
                  <div key={index} className={`p-2 mb-1 rounded ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex justify-between">
                      <div>{result.email}</div>
                      <div>{result.success ? '✅ Sent' : '❌ Failed'}</div>
                    </div>
                    {!result.success && <div className="text-red-600 text-xs mt-1">{result.error}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default EmailTestTool;
