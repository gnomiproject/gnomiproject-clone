
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.3";

// Simple in-memory rate limiter
// This will be reset when the edge function restarts, but provides basic protection
const recentAccesses = new Map<string, number>();
const RATE_LIMIT_SECONDS = 30; // Minimum time between access count increments

/**
 * Increments the access count for a report with rate limiting
 */
export async function incrementAccessCount(
  supabaseUrl: string, 
  supabaseKey: string, 
  archetypeId: string, 
  accessToken: string,
  requestId: string
) {
  try {
    // Generate a unique key for this report/token combination
    const accessKey = `${archetypeId}:${accessToken}`;
    const now = Date.now();
    
    // Check if this combination was accessed recently
    const lastAccess = recentAccesses.get(accessKey);
    if (lastAccess && (now - lastAccess) < RATE_LIMIT_SECONDS * 1000) {
      console.log(`[${requestId}] Rate limited access for ${archetypeId}. Last access was ${(now - lastAccess) / 1000}s ago.`);
      return { success: true, rateLimit: true, message: "Rate limited" };
    }
    
    // Update the last access time
    recentAccesses.set(accessKey, now);
    
    // Clean up old entries in the rate limiter (basic garbage collection)
    if (recentAccesses.size > 1000) {
      const cutoff = now - (RATE_LIMIT_SECONDS * 2 * 1000);
      for (const [key, timestamp] of recentAccesses.entries()) {
        if (timestamp < cutoff) {
          recentAccesses.delete(key);
        }
      }
    }
    
    console.log(`[${requestId}] Incrementing access count for archetype: ${archetypeId}, token: ${accessToken.substring(0, 5)}...`);
    
    // Create a fresh Supabase client for this operation
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // First try using the RPC function (most reliable way)
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'increment_report_access',
      { p_access_token: accessToken, p_archetype_id: archetypeId }
    );
    
    if (rpcError) {
      console.error(`[${requestId}] Error using RPC increment_report_access:`, rpcError);
      
      // Fallback to direct update if RPC fails
      // Get current count first
      const { data: currentData, error: selectError } = await supabase
        .from("report_requests")
        .select("access_count")
        .eq("archetype_id", archetypeId)
        .eq("access_token", accessToken)
        .maybeSingle();
        
      if (selectError) {
        console.error(`[${requestId}] Error fetching current access count:`, selectError);
        return { success: false, error: selectError.message };
      }
      
      // Increment count with a simple update
      const currentCount = currentData?.access_count || 0;
      const newCount = currentCount + 1;
      
      const { data, error } = await supabase
        .from("report_requests")
        .update({
          access_count: newCount,
          last_accessed: new Date().toISOString()
        })
        .eq("archetype_id", archetypeId)
        .eq("access_token", accessToken)
        .select();
      
      if (error) {
        console.error(`[${requestId}] Error in incrementAccessCount:`, error);
        return { success: false, error: error.message };
      }
      
      console.log(`[${requestId}] Successfully updated access count from ${currentCount} to ${newCount}`);
      return { success: true, data, newCount };
    }
    
    // Extract access_count safely from rpcData
    let accessCount: number | string | null = null;
    if (rpcData && typeof rpcData === 'object') {
      accessCount = 'access_count' in rpcData ? rpcData.access_count : null;
    }
    
    console.log(`[${requestId}] Successfully updated access count via RPC to ${accessCount}`);
    return { success: true, data: rpcData, newCount: accessCount };
  } catch (error) {
    console.error(`[${requestId}] Exception in incrementAccessCount:`, error);
    return { success: false, error: String(error) };
  }
}

/**
 * Handle tracking requests and return a tracking pixel
 */
export async function handleTracking(
  pathParts: string[], 
  supabaseUrl: string, 
  supabaseServiceKey: string, 
  corsHeaders: Record<string, string>,
  requestId: string
) {
  // Check if we have enough path parts
  if (pathParts.length < 4) {
    console.error(`[${requestId}] Invalid tracking path format:`, pathParts);
    return new Response(
      JSON.stringify({ error: "Invalid tracking path" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
  
  const reportId = pathParts[pathParts.length - 2];
  const accessToken = pathParts[pathParts.length - 1];
  
  console.log(`[${requestId}] Tracking access for report: ${reportId}, with token: ${accessToken.substring(0, 5)}...`);
  
  try {
    // Use the direct increment function
    const result = await incrementAccessCount(
      supabaseUrl,
      supabaseServiceKey,
      reportId,
      accessToken,
      requestId
    );
      
    if (!result.success) {
      console.error(`[${requestId}] Error tracking access: ${result.error}`);
    } else if (result.rateLimit) {
      console.log(`[${requestId}] Access tracking rate limited`);
    } else {
      console.log(`[${requestId}] Successfully tracked access, new count: ${result.newCount}`);
    }
  } catch (trackError) {
    console.error(`[${requestId}] Error in tracking access:`, trackError);
  }
  
  // Set strong cache control headers to prevent browser from making duplicate requests
  const cacheHeaders = {
    ...corsHeaders,
    "Content-Type": "image/gif",
    "Cache-Control": "private, max-age=86400", // Cache for 24 hours
    "Pragma": "private",
    "Expires": new Date(Date.now() + 86400000).toUTCString(), // 24 hours in the future
    "X-Tracking-ID": requestId
  };
  
  // Respond with a 1x1 transparent GIF
  return new Response(
    new Uint8Array([
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xFF, 0xFF, 0xFF,
      0x00, 0x00, 0x00, 0x21, 0xF9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2C, 0x00, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3B
    ]),
    {
      headers: cacheHeaders
    }
  );
}
