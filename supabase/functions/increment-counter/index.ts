
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
    const { archetypeId, accessToken } = await req.json();
    
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
        access_count: supabase.rpc('increment_counter', { x: 1 }),
        last_accessed: new Date().toISOString()
      })
      .eq('archetype_id', archetypeId)
      .eq('access_token', accessToken)
      .select('access_count');
    
    if (error) {
      throw new Error(`Error incrementing access count: ${error.message}`);
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
