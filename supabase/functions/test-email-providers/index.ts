
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Configure CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Resend with the API key
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Validate environment
    if (!Deno.env.get("RESEND_API_KEY")) {
      throw new Error("Missing RESEND_API_KEY environment variable");
    }
    console.log("Environment check passed, initializing Resend with API key");

    // Parse request body
    const { email, testMultipleProviders } = await req.json();
    
    if (!email) {
      throw new Error("Email address is required");
    }

    // Default test email providers
    let testEmails = [email];
    
    // If testing multiple providers, add some common email domains
    if (testMultipleProviders) {
      // Take the username from the provided email
      const username = email.split('@')[0];
      
      // Only add these if they're different from the provided email
      const providers = [
        'gmail.com',
        'outlook.com',
        'yahoo.com',
        'protonmail.com',
        'aol.com'
      ];
      
      for (const provider of providers) {
        const testEmail = `${username}@${provider}`;
        if (testEmail !== email && !testEmails.includes(testEmail)) {
          testEmails.push(testEmail);
        }
      }
    }
    
    // Log the test participants
    console.log(`Testing email deliverability to ${testEmails.length} addresses:`, testEmails);
    
    const results = [];
    
    // Generate basic HTML content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Email Deliverability Test</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>This is a test email to verify deliverability.</p>
        <p>If you received this email, please reply or check the dashboard for confirmation.</p>
        <p>Time sent: ${new Date().toISOString()}</p>
        <p style="font-size: 12px; color: #666; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
          To unsubscribe from these emails, please reply with "unsubscribe" in the subject line.<br>
          Your address was used only for this test and won't be stored.
        </p>
      </body>
      </html>
    `;
    
    // Send emails to all test recipients
    for (const testEmail of testEmails) {
      try {
        console.log(`Sending test email to ${testEmail}`);
        
        const data = await resend.emails.send({
          from: "Gnomi <gnomi@onenomi.com>",
          to: [testEmail],
          subject: `Email Deliverability Test`,
          html: emailHtml,
          text: "This is a test email to verify deliverability. If you received this email, please reply or check the dashboard for confirmation.",
        });
        
        console.log(`Result for ${testEmail}:`, JSON.stringify(data));
        results.push({ 
          email: testEmail, 
          success: !data.error, 
          id: data.id,
          error: data.error?.message 
        });
      } catch (error) {
        console.error(`Error sending to ${testEmail}:`, error);
        results.push({ 
          email: testEmail, 
          success: false, 
          error: error.message 
        });
      }
    }

    // Return collected results
    return new Response(
      JSON.stringify({ 
        success: true,
        results,
        totalSent: results.length,
        successCount: results.filter(r => r.success).length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in test-email-providers function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
