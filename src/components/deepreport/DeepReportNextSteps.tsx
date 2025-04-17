
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getArchetypeColorHex } from '@/data/colors';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Download, Mail, Users, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DeepReportNextStepsProps {
  archetypeData: any;
}

const DeepReportNextSteps: React.FC<DeepReportNextStepsProps> = ({ archetypeData }) => {
  const { toast } = useToast();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  
  if (!archetypeData) {
    return <div>Loading archetype data...</div>;
  }
  
  const archetypeColor = getArchetypeColorHex(archetypeData.id);
  
  const handleDownloadReport = () => {
    toast({
      title: "Download Initiated",
      description: "Your report download will begin shortly.",
      duration: 3000,
    });
    
    // Implement PDF report download functionality here
    // For now, we'll just show a toast message
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !organization) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Store the report request in the database
      const { error } = await supabase.from('report_requests').insert({
        name,
        email,
        organization,
        comments: comment,
        archetype_id: archetypeData.id,
      });
      
      if (error) {
        throw new Error(`Error submitting request: ${error.message}`);
      }
      
      // Success! Show confirmation
      setFormSubmitted(true);
      toast({
        title: "Request Submitted",
        description: "We've received your request and will be in touch soon.",
        duration: 5000,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="mb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Next Steps</h1>
        <div 
          className="h-1 w-24 rounded-full mb-6"
          style={{ backgroundColor: archetypeColor }}
        ></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download Your Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">
              Save a copy of this comprehensive {archetypeData.name} archetype report for reference 
              and sharing with your team.
            </p>
            <Button 
              className="w-full"
              style={{ backgroundColor: archetypeColor }}
              onClick={handleDownloadReport}
            >
              Download PDF Report <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule a Consultation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">
              Discuss your archetype report with our healthcare strategy experts and get personalized insights.
            </p>
            <Button variant="outline" className="w-full">
              Schedule Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Contact form */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Request Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!formSubmitted ? (
            <>
              <p className="text-gray-700 mb-6">
                Have questions about your archetype or want to learn more about how we can help optimize 
                your healthcare strategy? Complete this form and one of our experts will contact you.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                    Organization *
                  </label>
                  <Input
                    id="organization"
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    required
                    placeholder="Enter your organization name"
                  />
                </div>
                
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                    Questions or Comments
                  </label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Let us know what information you're interested in"
                    rows={4}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  style={{ backgroundColor: archetypeColor }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center py-8">
              <div 
                className="h-16 w-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${archetypeColor}20` }}
              >
                <Check className="h-8 w-8" style={{ color: archetypeColor }} />
              </div>
              <h3 className="text-xl font-bold mb-2">Request Submitted</h3>
              <p className="text-gray-700 text-center mb-6">
                Thank you for your interest! One of our experts will contact you soon about the {archetypeData.name} archetype.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setFormSubmitted(false)}
              >
                Submit Another Request
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Additional resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Additional Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-6">
            Explore these additional resources to learn more about healthcare archetypes and optimization strategies:
          </p>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <h3 className="text-lg font-semibold mb-1">Archetype Comparison Guide</h3>
              <p className="text-gray-600 mb-2">
                Compare key metrics and characteristics across all nine healthcare archetypes
              </p>
              <a 
                href="#" 
                className="text-sm font-medium inline-flex items-center"
                style={{ color: archetypeColor }}
              >
                Download Guide <ArrowRight className="ml-1 h-3 w-3" />
              </a>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <h3 className="text-lg font-semibold mb-1">Healthcare Strategy Webinar Series</h3>
              <p className="text-gray-600 mb-2">
                Join our experts for deep dives into key healthcare strategy topics
              </p>
              <a 
                href="#" 
                className="text-sm font-medium inline-flex items-center"
                style={{ color: archetypeColor }}
              >
                Register Now <ArrowRight className="ml-1 h-3 w-3" />
              </a>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <h3 className="text-lg font-semibold mb-1">Healthcare Benchmarking White Paper</h3>
              <p className="text-gray-600 mb-2">
                Learn how archetype-based benchmarking outperforms traditional approaches
              </p>
              <a 
                href="#" 
                className="text-sm font-medium inline-flex items-center"
                style={{ color: archetypeColor }}
              >
                Download White Paper <ArrowRight className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepReportNextSteps;
