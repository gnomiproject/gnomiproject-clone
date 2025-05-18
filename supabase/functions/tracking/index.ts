
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.3";
import { handleTracking } from "../send-report-email/tracking.ts";

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

  // Get environment variables
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(
      JSON.stringify({ error: "Missing Supabase configuration" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }

  try {
    // Extract archetype_id and token from URL path
    // We expect URLs like /tracking/{archetype_id}/{token}
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    
    // Log the received path for debugging
    console.log(`Received tracking request for path: ${url.pathname}`);
    console.log(`Path parts: ${JSON.stringify(pathParts)}`);

    return handleTracking(
      pathParts, 
      supabaseUrl,
      supabaseServiceKey,
      corsHeaders
    );
  } catch (error) {
    console.error("Error in tracking function:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
