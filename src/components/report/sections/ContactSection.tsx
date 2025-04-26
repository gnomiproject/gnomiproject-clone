
import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ContactSectionProps {
  userData: any;
}

const ContactSection = ({ userData }: ContactSectionProps) => {
  const [name, setName] = useState(userData?.name || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [organization, setOrganization] = useState(userData?.organization || '');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Gnome image
  const gnomeImage = '/assets/gnomes/gnome_righthand.png';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Here you would normally send the data to your backend
      // For now we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Your message has been sent!');
      setIsSubmitted(true);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Error submitting contact form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Success view after form submission
  if (isSubmitted) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-6">Thank You!</h1>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                <h2 className="text-xl font-semibold text-green-800">Message Received</h2>
              </div>
              <p className="text-green-700 mb-2">
                We've received your message and will get back to you shortly.
              </p>
              <p className="text-green-600">
                A confirmation has been sent to {email}.
              </p>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">What happens next?</h3>
              <ol className="space-y-3 list-decimal list-inside">
                <li>Our team will review your inquiry</li>
                <li>A specialist will reach out within 1-2 business days</li>
                <li>We'll schedule a follow-up discussion to explore your needs</li>
              </ol>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <img
              src={gnomeImage}
              alt="Contact Gnome"
              className="max-h-64 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/gnomes/placeholder.svg';
              }}
            />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <h2 className="text-xl text-blue-700 font-medium mb-6">
            Let's discuss how we can help your organization
          </h2>
          
          <p className="text-lg mb-6">
            Have questions about your report or want to learn more about implementing our recommendations?
            Our healthcare strategists are ready to assist you.
          </p>
        </div>
        <div className="md:w-1/3 flex justify-center">
          <img
            src={gnomeImage}
            alt="Contact Gnome"
            className="max-h-64 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/gnomes/placeholder.svg';
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MessageSquare className="mr-2 h-5 w-5 text-blue-600" />
                Send Us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input 
                    id="organization" 
                    value={organization} 
                    onChange={e => setOrganization(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">
                    Your Message
                  </Label>
                  <Textarea 
                    id="message" 
                    rows={5}
                    value={message} 
                    onChange={e => setMessage(e.target.value)} 
                    placeholder="Tell us about your specific needs or questions about the report..."
                    required 
                  />
                </div>
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Mail className="mr-2 h-5 w-5 text-blue-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Email Us</h3>
                <a 
                  href="mailto:support@healthmatch.ai" 
                  className="text-blue-600 hover:underline flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  support@healthmatch.ai
                </a>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Call Us</h3>
                <a 
                  href="tel:+18005551234" 
                  className="text-blue-600 hover:underline flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  1-800-555-1234
                </a>
                <p className="text-sm text-gray-600 mt-1">
                  Monday - Friday, 9am - 5pm ET
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Schedule a Consultation</h3>
                <p className="text-sm mb-3">
                  Want to dive deeper into your report with an expert?
                </p>
                <Button variant="outline" className="w-full">
                  Book a Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
