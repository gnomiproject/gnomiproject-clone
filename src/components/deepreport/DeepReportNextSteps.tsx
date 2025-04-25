import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArchetypeDetailedData } from '@/types/archetype';
import { ArrowRight, Clipboard, Mail, Phone } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import SectionTitle from '@/components/shared/SectionTitle';

interface DeepReportNextStepsProps {
  archetypeData: ArchetypeDetailedData;
}

const DeepReportNextSteps = ({ archetypeData }: DeepReportNextStepsProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const color = `archetype-${archetypeData.id}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and email.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Instead of submitting to database, just log the request
      console.log('Contact Request:', {
        name,
        email,
        company,
        message,
        archetypeId: archetypeData.id,
        timestamp: new Date().toISOString()
      });
      
      // Show success message
      toast({
        title: "Request Sent",
        description: "Thank you for your interest! We'll be in touch soon.",
      });
      
      setIsSubmitted(true);
      // Reset form
      setName('');
      setEmail('');
      setCompany('');
      setMessage('');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error",
        description: "There was an issue submitting your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-8">
        <SectionTitle 
          title="Thanks for your interest!"
          subtitle="We'll be in touch with you soon about next steps for your organization."
          center
        />
      </div>
    );
  }

  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardHeader className="space-y-1">
        <SectionTitle 
          title="Ready to take the next steps?"
          subtitle="Contact us to learn how we can help your organization."
        />
      </CardHeader>
      <CardContent className="grid gap-6">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium block mb-2">
                Your Name
              </label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium block mb-2">
                Your Email
              </label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="company" className="text-sm font-medium block mb-2">
              Company Name
            </label>
            <Input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Corp"
            />
          </div>
          <div>
            <label htmlFor="message" className="text-sm font-medium block mb-2">
              Message
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help you?"
              rows={4}
            />
          </div>
          <Button disabled={isSubmitting} className={`bg-${color} hover:bg-${color}/90 text-white w-full`}>
            {isSubmitting ? (
              <>
                Submitting <ArrowRight className="ml-2 h-4 w-4 animate-pulse" />
              </>
            ) : (
              <>
                Contact Us <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">
            Connect With Us
          </h3>
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <Mail className="h-5 w-5" />
              Email
            </a>
            <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <Phone className="h-5 w-5" />
              Call
            </a>
            <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <Clipboard className="h-5 w-5" />
              Request a Demo
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeepReportNextSteps;
