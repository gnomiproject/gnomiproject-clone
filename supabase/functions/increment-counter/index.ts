
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.3';

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
    // Parse the request body
    let archetypeId, accessToken;
    
    try {
      const body = await req.json();
      archetypeId = body.archetypeId;
      accessToken = body.accessToken;
    } catch (e) {
      // If we can't parse JSON, try to extract from URL for tracking pixel fallback
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/');
      if (pathParts.length >= 5) {
        archetypeId = pathParts[pathParts.length - 2];
        accessToken = pathParts[pathParts.length - 1];
      }
    }
    
    if (!archetypeId || !accessToken) {
      return new Response(
        JSON.stringify({ error: "Missing archetypeId or accessToken" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase URL or service role key');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Update the access count and last accessed timestamp
    const { data, error } = await supabase
      .from('report_requests')
      .update({
        access_count: supabase.sql`access_count + 1`,
        last_accessed: new Date().toISOString()
      })
      .eq('archetype_id', archetypeId)
      .eq('access_token', accessToken)
      .select('access_count');
    
    if (error) {
      throw new Error(`Error incrementing access count: ${error.message}`);
    }
    
    // For tracking pixel requests, return a 1x1 transparent GIF
    if (req.headers.get('accept')?.includes('image/')) {
      return new Response(
        Uint8Array.from([
          0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 
          0x80, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0x00, 0x2C, 
          0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 
          0x02, 0x44, 0x01, 0x00, 0x3B
        ]),
        {
          headers: { 
            ...corsHeaders, 
            "Content-Type": "image/gif",
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
          },
          status: 200,
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        message: "Access count incremented", 
        access_count: data?.[0]?.access_count || 0 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
