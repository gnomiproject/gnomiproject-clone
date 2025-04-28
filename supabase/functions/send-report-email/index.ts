
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
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase URL or service role key');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if this is an access tracking request
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    
    if (pathParts.includes('track-access') && pathParts.length > 3) {
      const reportId = pathParts[pathParts.length - 2];
      const accessToken = pathParts[pathParts.length - 1];
      
      // Update access count and last accessed timestamp
      const { error: updateError } = await supabase
        .from('report_requests')
        .update({
          access_count: supabase.rpc('increment_counter', { x: 1 }),
          last_accessed: new Date().toISOString()
        })
        .eq('archetype_id', reportId)
        .eq('access_token', accessToken);
        
      if (updateError) {
        console.error(`Error tracking access: ${updateError.message}`);
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
    
    // This function can be called directly or run on a schedule
    // We'll handle both report creation confirmation emails and notification emails
    
    // Get pending report requests that need email notifications
    const { data: pendingReports, error } = await supabase
      .from('report_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(20); // Process in batches
    
    if (error) {
      throw new Error(`Error fetching report requests: ${error.message}`);
    }
    
    console.log(`Found ${pendingReports?.length || 0} pending report requests`);
    
    if (!pendingReports || pendingReports.length === 0) {
      return new Response(
        JSON.stringify({ message: "No pending reports found." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }
    
    // Process each report request
    const results = [];
    for (const report of pendingReports) {
      try {
        // Access the stored URL or generate it if not available
        let reportUrl = report.access_url;
        if (!reportUrl) {
          const baseUrl = new URL(req.url).origin;
          reportUrl = `${baseUrl}/report/${report.archetype_id}/${report.access_token}`;
          
          // Update the report with the URL
          await supabase
            .from('report_requests')
            .update({ access_url: reportUrl })
            .eq('id', report.id);
        }
        
        // Add tracking pixel to email
        const trackingPixel = `${new URL(req.url).origin}/functions/v1/send-report-email/track-access/${report.archetype_id}/${report.access_token}`;
        
        // Send email (in production, you'd integrate with an email service here)
        // For now, just log the email that would be sent
        console.log(`Would send email to ${report.email} with report link: ${reportUrl}`);
        console.log(`Would include tracking pixel: ${trackingPixel}`);
        
        // In a real implementation, you would:
        // 1. Use an email service API like Resend, SendGrid, etc.
        // 2. Create a nice HTML email template with the report link
        // 3. Include an img tag with src set to the tracking pixel
        // 4. Send the email with proper formatting
        
        // Update the report status
        const { error: updateError } = await supabase
          .from('report_requests')
          .update({ status: 'active' })
          .eq('id', report.id);
          
        if (updateError) {
          throw new Error(`Error updating report status: ${updateError.message}`);
        }
        
        results.push({
          id: report.id,
          email: report.email,
          status: 'processed',
          url: reportUrl
        });
      } catch (reportError) {
        console.error(`Error processing report ${report.id}:`, reportError);
        results.push({
          id: report.id,
          email: report.email,
          status: 'error',
          error: reportError.message
        });
      }
    }
    
    return new Response(
      JSON.stringify({ 
        processed: results.length,
        results
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
