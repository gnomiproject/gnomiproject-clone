
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

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
    const { email, reportData } = await req.json();
    
    if (!email) {
      throw new Error("Email address is required");
    }

    // Set up default values
    const archetypeName = reportData?.archetypeName || "Healthcare Archetype";
    const recipientName = reportData?.recipientName || "there";
    const reportUrl = reportData?.reportUrl || "https://onenomi.com";
    
    // Generate tracking pixel URL for test
    const trackingUrl = `${new URL(req.url).origin}/functions/v1/send-report-email/track-access/12345/test-token`;
    
    // Log params for debugging
    console.log(`SENDING TEST EMAIL with parameters:
      TO: ${email}
      FROM: Gnomi <gnomi@onenomi.com>
      SUBJECT: Test Email - Your ${archetypeName} Report is Ready
      TRACKING_URL: ${trackingUrl}
    `);

    // Create the email HTML content
    const emailHtml = `
      <html>
        <body>
          <h1>Your ${archetypeName} Deep Dive Report is Ready</h1>
          <p>Hello ${recipientName},</p>
          <p>Your detailed healthcare archetype report is now available. Click the link below to access it:</p>
          <p><a href="${reportUrl}">View Your Report</a></p>
          <p>This is a test email sent from the diagnostic tool.</p>
          <img src="${trackingUrl}" alt="" width="1" height="1" style="display:none;" />
        </body>
      </html>
    `;

    // Send the email
    const data = await resend.emails.send({
      from: "Gnomi <gnomi@onenomi.com>",
      to: [email],
      subject: `Test Email - Your ${archetypeName} Report is Ready`,
      html: emailHtml,
    });

    console.log("Direct test email result:", JSON.stringify(data));

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in test-email-direct function:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: error.stack,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
