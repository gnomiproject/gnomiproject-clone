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
    // Check for the Resend API key
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("Missing RESEND_API_KEY environment variable");
    }
    
    // Initialize Resend with the API key
    const resend = new Resend(resendApiKey);
    
    // Get destination email from query params or request body
    let destinationEmail;
    
    if (req.method === "POST") {
      const body = await req.json();
      destinationEmail = body.email;
    } else {
      const url = new URL(req.url);
      destinationEmail = url.searchParams.get("email");
    }
    
    if (!destinationEmail) {
      return new Response(
        JSON.stringify({ error: "Email address is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Send a test email
    console.log(`Sending test email to ${destinationEmail}`);
    
    const result = await resend.emails.send({
      from: "Reports <reports@g.nomihealth.com>",
      to: [destinationEmail],
      subject: "Resend Test Email",
      html: `
        <h1>Resend Email Test</h1>
        <p>This is a test email sent from your Supabase Edge Function.</p>
        <p>If you're seeing this, your email configuration is working!</p>
        <p>Time sent: ${new Date().toISOString()}</p>
      `
    });
    
    console.log("Email test result:", JSON.stringify(result));
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Test email sent successfully!",
        result 
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
