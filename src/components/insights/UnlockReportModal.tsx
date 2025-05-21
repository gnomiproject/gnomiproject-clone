
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Lock, Unlock } from 'lucide-react';
import { UnlockFormData } from '@/hooks/useReportUnlock';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  organization: z.string().min(1, 'Organization is required'),
  email: z.string().email('Invalid email address'),
});

interface UnlockReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UnlockFormData) => Promise<{ success: boolean; data?: any; error?: any }>;
  isSubmitting: boolean;
  archetypeId: string;
  archetypeName: string;
  employeeCount?: number | null;
  assessmentAnswers?: any;
  submissionError?: string | null;
}

const UnlockReportModal: React.FC<UnlockReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  archetypeId,
  archetypeName,
  employeeCount,
  assessmentAnswers,
  submissionError,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      organization: '',
      email: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    // Create the formData with required properties
    const formData: UnlockFormData = {
      name: values.name,
      organization: values.organization,
      email: values.email,
      archetypeId,
      employeeCount,
      assessmentAnswers,
    };
    
    const result = await onSubmit(formData);
    if (result.success) {
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Unlock className="h-5 w-5 text-blue-600" />
            Unlock Your Full {archetypeName} Report
          </DialogTitle>
          <DialogDescription>
            Get complete access to all insights and analysis by providing a few details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-blue-50 text-blue-800 p-3 rounded-md mb-4 text-sm">
          <p className="font-medium mb-1">Why unlock the full report?</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>Access detailed metrics and benchmarks</li>
            <li>View comprehensive SWOT analysis</li>
            <li>Explore disease &amp; care insights</li>
            <li>Completely free, no credit card required</li>
          </ul>
        </div>
        
        {submissionError && (
          <Alert variant="destructive" className="mb-4 animate-in fade-in-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {submissionError}
            </AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Company" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={onClose} 
                type="button"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Unlocking...
                  </>
                ) : (
                  'Unlock Full Report'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UnlockReportModal;
