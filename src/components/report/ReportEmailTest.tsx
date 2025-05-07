
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ReportEmailTest = () => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const handleSendDirectTest = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }
    
    setIsSending(true);
    setResult(null);
    
    try {
      console.log(`Sending direct test email to ${email}`);
      
      const { data, error } = await supabase.functions.invoke('test-email-direct', {
        body: { 
          email,
          reportData: {
            archetypeName: "Healthcare Archetype",
            recipientName: "Test User"
          }
        }
      });
      
      if (error) {
        throw new Error(`Error invoking function: ${error.message}`);
      }
      
      console.log('Direct test email result:', data);
      setResult(data);
      
      if (data.success) {
        toast.success('Direct test email sent successfully!');
      } else {
        toast.error(`Failed to send test email: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error('Error sending test email:', err);
      toast.error(`Error: ${err.message}`);
      setResult({
        error: err.message,
        success: false
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Direct Email Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={handleSendDirectTest}
          disabled={isSending || !email}
          className="w-full"
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Direct Test Email
            </>
          )}
        </Button>
        
        {result && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Result:</h3>
            <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportEmailTest;
