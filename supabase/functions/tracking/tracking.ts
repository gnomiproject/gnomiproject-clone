
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.3";

/**
 * Increments the access count for a report
 */
export async function incrementAccessCount(supabaseUrl: string, supabaseKey: string, archetypeId: string, accessToken: string) {
  try {
    console.log(`Incrementing access count for archetype: ${archetypeId}, token: ${accessToken.substring(0, 5)}...`);
    
    // Create a fresh Supabase client for this operation
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // First try using the RPC function (most reliable way)
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'increment_report_access',
      { p_access_token: accessToken, p_archetype_id: archetypeId }
    );
    
    if (rpcError) {
      console.error("Error using RPC increment_report_access:", rpcError);
      
      // Fallback to direct update if RPC fails
      // Get current count first
      const { data: currentData, error: selectError } = await supabase
        .from("report_requests")
        .select("access_count")
        .eq("archetype_id", archetypeId)
        .eq("access_token", accessToken)
        .maybeSingle();
        
      if (selectError) {
        console.error("Error fetching current access count:", selectError);
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
        console.error("Error in incrementAccessCount:", error);
        return { success: false, error: error.message };
      }
      
      console.log(`Successfully updated access count from ${currentCount} to ${newCount}`);
      return { success: true, data, newCount };
    }
    
    console.log(`Successfully updated access count via RPC to ${rpcData.access_count}`);
    return { success: true, data: rpcData, newCount: rpcData.access_count };
  } catch (error) {
    console.error("Exception in incrementAccessCount:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Handle tracking requests and return a tracking pixel
 */
export async function handleTracking(pathParts: string[], supabaseUrl: string, supabaseServiceKey: string, corsHeaders: Record<string, string>) {
  // Check if we have enough path parts
  if (pathParts.length < 4) {
    console.error("Invalid tracking path format:", pathParts);
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
  
  console.log("Tracking access for report:", reportId, "with token:", accessToken.substring(0, 5) + "...");
  
  try {
    // Use the direct increment function
    const result = await incrementAccessCount(
      supabaseUrl,
      supabaseServiceKey,
      reportId,
      accessToken
    );
      
    if (!result.success) {
      console.error(`Error tracking access: ${result.error}`);
    } else {
      console.log("Successfully tracked access, new count:", result.newCount);
    }
  } catch (trackError) {
    console.error("Error in tracking access:", trackError);
  }
  
  // Respond with a 1x1 transparent GIF
  return new Response(
    new Uint8Array([
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xFF, 0xFF, 0xFF,
      0x00, 0x00, 0x00, 0x21, 0xF9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2C, 0x00, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3B
    ]),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "image/gif",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    }
  );
}
