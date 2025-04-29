
import React from 'react';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { Shield } from 'lucide-react';

interface ContactSectionProps {
  userData: any;
  isAdminView?: boolean;
}

const ContactSection = ({ userData, isAdminView = false }: ContactSectionProps) => {
  // Format the date if available
  const reportCreated = userData?.created_at 
    ? format(new Date(userData.created_at), 'MMM d, yyyy')
    : 'N/A';
    
  // Calculate expiration date (30 days from creation or from userData.expires_at)
  const expiryDate = userData?.expires_at 
    ? format(new Date(userData.expires_at), 'MMM d, yyyy')
    : userData?.created_at
      ? format(new Date(new Date(userData.created_at).getTime() + 30 * 24 * 60 * 60 * 1000), 'MMM d, yyyy')
      : 'N/A';
      
  // Generate a "report ID" based on data or random if in admin view
  const reportId = isAdminView 
    ? "ADMIN-VIEW-ONLY" 
    : userData?.id 
      ? userData.id.substring(0, 8).toUpperCase()
      : (Math.random().toString(36).substring(2, 10)).toUpperCase();
      
  // Get access information
  const accessCount = userData?.access_count || 1; // Default to 1 for first view
  const lastAccessed = userData?.last_accessed
    ? format(new Date(userData.last_accessed), 'MMM d, yyyy')
    : 'First view';

  return (
    <section className="my-12 print:my-8">
      <h2 className="text-2xl font-bold mb-6 print:mb-4">Contact Information</h2>
      
      <Card className="p-6 bg-gray-50 border border-gray-200 mb-8">
        {isAdminView ? (
          <div className="bg-yellow-50 border-yellow-200 border p-4 rounded mb-4">
            <p className="text-yellow-800"><strong>Admin View Note:</strong> This contact information is generated as a placeholder. In a real user report, this would show the actual user details who requested the report.</p>
          </div>
        ) : null}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Report Details</h3>
            <p className="text-gray-600 mb-1">Report Generated: {reportCreated}</p>
            <p className="text-gray-600 mb-1">Report ID: {reportId}</p>
            <p className="text-gray-600 mb-1">Valid Until: {expiryDate}</p>
            <p className="text-gray-600">Access Count: {accessCount} {accessCount > 1 ? 'views' : 'view'}</p>
            {accessCount > 1 && (
              <p className="text-gray-600">Last Viewed: {lastAccessed}</p>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact Info</h3>
            <p className="text-gray-600 mb-1">Name: {userData?.name || 'N/A'}</p>
            <p className="text-gray-600 mb-1">Email: {userData?.email || 'N/A'}</p>
            <p className="text-gray-600">Organization: {userData?.organization || 'N/A'}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Additional Support</h3>
          <p className="text-gray-700">
            For additional information or to discuss this report in more detail, please contact our customer support team at <a href="mailto:support@example.com" className="text-blue-600 hover:underline">support@example.com</a>.
          </p>
        </div>
        
        <div className="mt-6 p-4 border border-gray-200 rounded-md bg-white">
          <div className="flex items-center mb-2">
            <Shield className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-md font-semibold">Data Privacy Notice</h3>
          </div>
          <p className="text-sm text-gray-600">
            This report contains confidential information specific to your organization. All data is encrypted and stored securely.
            Your access link is unique and will expire on {expiryDate}.
          </p>
        </div>
      </Card>
      
      <div className="text-center text-gray-500 text-sm mt-8 print:mt-4">
        <p>This report is confidential and intended only for the recipient. Not for redistribution.</p>
        <p className="mt-1">© {new Date().getFullYear()} HealthArchetypes - All rights reserved.</p>
      </div>
    </section>
  );
};

export default ContactSection;
