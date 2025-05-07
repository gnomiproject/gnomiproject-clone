
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.3";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { handleTracking } from "./tracking.ts";
import { createEmailHtml } from "./emailTemplate.ts";
import { processPendingReports } from "./reportProcessor.ts";
import { corsHeaders } from "./cors.ts";

// Initialize Resend client with API key
const resendApiKey = Deno.env.get("RESEND_API_KEY");
if (!resendApiKey) {
  console.error("Missing RESEND_API_KEY environment variable");
}
const resend = new Resend(resendApiKey);

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
  console.log("Function called with method:", req.method);
  
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Get Supabase credentials from environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase URL or service role key");
    }

    console.log("Initializing Supabase client with URL:", supabaseUrl);
    console.log("Service key starts with:", supabaseServiceKey.substring(0, 5) + "...");
    
    // Check if this is an access tracking request
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    
    if (pathParts.includes("track-access") && pathParts.length > 3) {
      return handleTracking(pathParts, supabaseUrl, supabaseServiceKey, corsHeaders);
    }
    
    // Parse the JSON body if it exists
    let requestBody: any = {};
    if (req.method === "POST") {
      try {
        requestBody = await req.json();
        console.log("Received request body:", JSON.stringify(requestBody));
      } catch (e) {
        console.log("No JSON body or invalid JSON");
      }
    }
    
    // Log environment variables (safe parts only)
    console.log("Environment check:");
    console.log("- SUPABASE_URL set:", !!supabaseUrl);
    console.log("- SUPABASE_SERVICE_ROLE_KEY set:", !!supabaseServiceKey);
    console.log("- RESEND_API_KEY set:", !!resendApiKey);
    
    // Process pending reports
    console.log("Starting to process pending reports");
    const result = await processPendingReports(supabaseUrl, supabaseServiceKey, resend);
    console.log("Process result:", JSON.stringify(result));
    
    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Stack trace:", error.stack);
    return new Response(
      JSON.stringify({ error: error.message, stack: error.stack }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
