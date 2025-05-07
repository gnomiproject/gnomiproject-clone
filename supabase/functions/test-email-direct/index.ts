
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Handle CORS preflight requests
function handleCors(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }
  return null;
}

serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  
  try {
    // Get the destination email from request
    let recipientEmail;
    let reportData: any = {};
    
    try {
      const body = await req.json();
      recipientEmail = body.email;
      reportData = body.reportData || {};
    } catch {
      // If parsing fails, try to get email from URL params
      const url = new URL(req.url);
      recipientEmail = url.searchParams.get("email");
    }
    
    if (!recipientEmail) {
      return new Response(
        JSON.stringify({ 
          error: "Email address is required",
          success: false 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }
    
    // Check for the Resend API key
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("Missing RESEND_API_KEY environment variable");
    }
    
    console.log("Environment check passed, initializing Resend with API key");
    
    // Initialize Resend with the API key
    const resend = new Resend(resendApiKey);
    
    // Generate simple test report URL and tracking pixel
    const baseUrl = Deno.env.get("SUPABASE_URL") || "https://qsecdncdiykzuimtaosp.supabase.co";
    const reportUrl = reportData.reportUrl || `${baseUrl}/test-report/12345`;
    const trackingPixel = `${baseUrl}/functions/v1/send-report-email/track-access/12345/test-token`;
    
    // Create test email content similar to the main function
    const archetypeName = reportData.archetypeName || "Test Archetype";
    const recipientName = reportData.recipientName || "Test User";
    
    // Create HTML email content matching the format in emailTemplate.ts
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Your Healthcare Archetype Report</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            line-height: 1.6;
            color: #333; 
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
          }
          .container { background-color: #ffffff; border-radius: 8px; padding: 30px; }
          .header { margin-bottom: 24px; }
          .logo { max-width: 180px; margin-bottom: 20px; }
          h1 { color: #4263eb; font-size: 24px; margin-top: 0; }
          .content { margin-bottom: 30px; }
          .button {
            background-color: #4263eb;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
            font-weight: bold;
          }
          .footer { font-size: 12px; color: #666; margin-top: 30px; }
          .tracking { opacity: 0; position: absolute; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your ${archetypeName} Report is Ready</h1>
          </div>
          
          <div class="content">
            <p>Hello ${recipientName},</p>
            <p>Thank you for your interest in our Healthcare Archetype Report. Your report has been created and is now available to view.</p>
            <p>Click the button below to access your report:</p>
            <p>
              <a href="${reportUrl}" class="button">View Your Report</a>
            </p>
            <p>This link will be valid for 30 days.</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Healthcare Archetype Analysis</p>
          </div>
        </div>
        <img src="${trackingPixel}" alt="" class="tracking" />
      </body>
      </html>
    `;
    
    // Log email parameters
    console.log(`SENDING TEST EMAIL with parameters:
      TO: ${recipientEmail}
      FROM: Gnomi <gnomi@onenomi.com>
      SUBJECT: Test Email - Your ${archetypeName} Report is Ready
      TRACKING_URL: ${trackingPixel}
    `);
    
    // Send test email with parameters matching the main function
    const emailResult = await resend.emails.send({
      from: "Gnomi <gnomi@onenomi.com>",
      to: [recipientEmail],
      subject: `Test Email - Your ${archetypeName} Report is Ready`,
      html: emailHtml
    });
    
    console.log("Direct test email result:", JSON.stringify(emailResult));
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Test email sent directly!",
        from: "Gnomi <gnomi@onenomi.com>",
        to: recipientEmail,
        emailResult
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error sending test email:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
