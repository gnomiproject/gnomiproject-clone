
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';  // Add uuid import
import { 
  PhoneCall, 
  Mail, 
  CalendarDays, 
  FileText, 
  Share2,
  Download
} from 'lucide-react';

interface DeepReportNextStepsProps {
  archetypeData: any;
}

const DeepReportNextSteps = ({ archetypeData }: DeepReportNextStepsProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);

  const handleContactRequest = (type: string) => {
    // Mock contact request
    toast({
      title: "Contact Request Sent",
      description: `Your ${type} request has been sent to our team.`,
    });
  };

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    
    // Mock PDF generation
    setTimeout(() => {
      toast({
        title: "PDF Generated",
        description: "Your PDF report has been generated and downloaded.",
      });
      setIsGenerating(false);
    }, 2000);
  };

  const handleShareReport = async () => {
    try {
      // Generate a unique token for sharing
      const shareToken = uuidv4(); 
      
      // Instead of accessing the database directly, we'll log the intention
      // and generate a mock share link
      console.log('Generating shareable report link with token:', shareToken);
      
      // Create a shareable link based on the current URL
      const baseUrl = window.location.origin;
      const newShareLink = `${baseUrl}/shared-report/${archetypeData.id}?token=${shareToken}`;
      
      setShareLink(newShareLink);
      
      toast({
        title: "Share Link Generated",
        description: "A shareable link has been created. Copy it to share with others.",
      });
    } catch (error) {
      console.error("Error generating share link:", error);
      toast({
        title: "Error",
        description: "Failed to generate a share link. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const copyShareLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      toast({
        title: "Copied",
        description: "The share link has been copied to your clipboard.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6">Next Steps</h2>
      
      <p className="text-gray-600 mb-8">
        Now that you've reviewed your archetype analysis, take action to optimize your healthcare strategy:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Discuss With Our Team</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-gray-600">
              Schedule a consultation with our healthcare experts to discuss how to apply these insights.
            </p>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleContactRequest('call')}
              >
                <PhoneCall className="mr-2 h-4 w-4" />
                Request a Call
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleContactRequest('email')}
              >
                <Mail className="mr-2 h-4 w-4" />
                Email Consultation
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleContactRequest('meeting')}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Export & Share</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-gray-600">
              Download this report or share it with your team members.
            </p>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleDownloadPDF}
                disabled={isGenerating}
              >
                <Download className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating PDF..." : "Download PDF Report"}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleShareReport}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Create Share Link
              </Button>
              
              {shareLink && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Share link:</p>
                  <div className="flex">
                    <input 
                      type="text"
                      readOnly 
                      value={shareLink}
                      className="flex-1 text-xs p-2 border rounded-l-md focus:outline-none bg-white"
                    />
                    <Button 
                      size="sm"
                      className="rounded-l-none"
                      onClick={copyShareLink}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <FileText className="h-8 w-8 text-blue-500 mb-2" />
              <h3 className="font-semibold mb-1">Archetype Case Studies</h3>
              <p className="text-sm text-gray-600">
                Read how similar organizations have implemented strategies for {archetypeData.name}.
              </p>
              <Button variant="link" className="p-0 mt-2" size="sm">
                View Case Studies
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <FileText className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="font-semibold mb-1">Implementation Guide</h3>
              <p className="text-sm text-gray-600">
                Step-by-step guide to implement recommendations for your organization.
              </p>
              <Button variant="link" className="p-0 mt-2" size="sm">
                Download Guide
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepReportNextSteps;
