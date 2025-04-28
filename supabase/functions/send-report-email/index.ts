
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
        // Generate report access URL
        const baseUrl = new URL(req.url).origin;
        const reportUrl = `${baseUrl}/report/${report.archetype_id}/${report.access_token}`;
        
        // Send email (in production, you'd integrate with an email service here)
        // For now, just log the email that would be sent
        console.log(`Would send email to ${report.email} with report link: ${reportUrl}`);
        
        // In a real implementation, you would:
        // 1. Use an email service API like Resend, SendGrid, etc.
        // 2. Create a nice HTML email template with the report link
        // 3. Send the email with proper formatting
        
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
