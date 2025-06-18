
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Cache-Control': 'private, max-age=86400',
  'Content-Type': 'image/gif',
};

// Simple in-memory rate limiter
const recentAccesses = new Map<string, number>();
const RATE_LIMIT_SECONDS = 30;

async function incrementAccessCount(
  supabaseUrl: string, 
  supabaseKey: string, 
  archetypeId: string, 
  accessToken: string,
  requestId: string
) {
  try {
    const accessKey = `${archetypeId}:${accessToken}`;
    const now = Date.now();
    
    // Check rate limiting
    const lastAccess = recentAccesses.get(accessKey);
    if (lastAccess && (now - lastAccess) < RATE_LIMIT_SECONDS * 1000) {
      console.log(`[${requestId}] Rate limited access for ${archetypeId}`);
      return { success: true, rateLimit: true };
    }
    
    recentAccesses.set(accessKey, now);
    
    // Clean up old entries
    if (recentAccesses.size > 1000) {
      const cutoff = now - (RATE_LIMIT_SECONDS * 2 * 1000);
      for (const [key, timestamp] of recentAccesses.entries()) {
        if (timestamp < cutoff) {
          recentAccesses.delete(key);
        }
      }
    }
    
    console.log(`[${requestId}] Incrementing access for ${archetypeId}`);
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Use RPC function for access increment
    const { data, error } = await supabase.rpc(
      'increment_report_access',
      { p_access_token: accessToken, p_archetype_id: archetypeId }
    );
    
    if (error) {
      console.error(`[${requestId}] RPC error:`, error);
      return { success: false, error: error.message };
    }
    
    console.log(`[${requestId}] Access incremented successfully`);
    return { success: true, data };
  } catch (error) {
    console.error(`[${requestId}] Exception:`, error);
    return { success: false, error: String(error) };
  }
}

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID().substring(0, 8);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(part => part.length > 0);
    
    // Expected format: /functions/v1/tracking/{archetypeId}/{token}
    if (pathParts.length < 4) {
      console.error(`[${requestId}] Invalid path:`, pathParts);
      return new Response(null, { 
        headers: { ...corsHeaders, 'X-Error': 'Invalid path' },
        status: 400 
      });
    }
    
    const archetypeId = pathParts[pathParts.length - 2];
    const accessToken = pathParts[pathParts.length - 1];
    
    console.log(`[${requestId}] Tracking request for ${archetypeId}`);
    
    // Get Supabase credentials
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error(`[${requestId}] Missing Supabase credentials`);
      return new Response(null, { 
        headers: { ...corsHeaders, 'X-Error': 'Configuration error' },
        status: 500 
      });
    }
    
    // Increment access count (don't await to return pixel immediately)
    incrementAccessCount(
      supabaseUrl,
      supabaseServiceKey,
      archetypeId,
      accessToken,
      requestId
    ).catch(err => {
      console.error(`[${requestId}] Background tracking error:`, err);
    });
    
    // Return 1x1 transparent GIF immediately
    const pixelData = new Uint8Array([
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xFF, 0xFF, 0xFF,
      0x00, 0x00, 0x00, 0x21, 0xF9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2C, 0x00, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3B
    ]);
    
    return new Response(pixelData, {
      headers: {
        ...corsHeaders,
        'X-Request-ID': requestId
      }
    });
  } catch (error) {
    console.error(`[${requestId}] Request error:`, error);
    return new Response(null, { 
      headers: { ...corsHeaders, 'X-Error': 'Internal error' },
      status: 500 
    });
  }
});
