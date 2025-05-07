
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SendEmailParams {
  recipientEmail: string;
}

/**
 * Hook to handle sending emails through the test email service
 */
export function useEmailService() {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastResult, setLastResult] = useState<any>(null);

  const sendTestEmail = async ({ recipientEmail }: SendEmailParams) => {
    if (!recipientEmail) {
      toast.error('Email address is required');
      return { success: false };
    }
    
    setIsSending(true);
    setError(null);
    
    try {
      // Call the test-resend function with the recipient email
      const { data, error } = await supabase.functions.invoke('test-resend', {
        body: { email: recipientEmail }
      });
      
      if (error) {
        throw new Error(`Failed to send test email: ${error.message}`);
      }
      
      setLastResult(data);
      
      toast.success('Test email sent successfully!', {
        description: `Email sent to ${recipientEmail}`
      });
      
      return { success: true, data };
    } catch (err: any) {
      console.error('Error sending test email:', err);
      setError(err);
      
      toast.error('Failed to send test email', {
        description: err.message
      });
      
      return { success: false, error: err };
    } finally {
      setIsSending(false);
    }
  };

  const processPendingReports = async () => {
    setIsSending(true);
    setError(null);
    
    try {
      // Call the send-report-email function to process pending reports
      const { data, error } = await supabase.functions.invoke('send-report-email', {
        method: 'POST',
        body: { process: true }
      });
      
      if (error) {
        throw new Error(`Failed to process reports: ${error.message}`);
      }
      
      setLastResult(data);
      
      const processed = data?.processed || 0;
      if (processed > 0) {
        toast.success(`${processed} report emails processed successfully!`);
      } else {
        toast.info('No pending reports found to process.');
      }
      
      return { success: true, data };
    } catch (err: any) {
      console.error('Error processing report emails:', err);
      setError(err);
      
      toast.error('Failed to process report emails', {
        description: err.message
      });
      
      return { success: false, error: err };
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendTestEmail,
    processPendingReports,
    isSending,
    error,
    lastResult
  };
}

export default useEmailService;
