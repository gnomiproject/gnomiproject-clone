
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper for logging with timestamps
const log = (message: string) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

// Helper for error logging with timestamps
const logError = (message: string, error: any) => {
  console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error);
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase URL or service role key");
    }

    // Parse the request body
    const { reportId, newStatus = "active", sendNotification = false } = await req.json();
    
    if (!reportId) {
      return new Response(
        JSON.stringify({ success: false, message: "Report ID is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    log(`Processing status update request for report ID: ${reportId}`);
    log(`Setting status to: ${newStatus}`);
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });
    
    // First, retrieve the current report data
    const { data: currentReport, error: fetchError } = await supabase
      .from("report_requests")
      .select("*")
      .eq("id", reportId)
      .maybeSingle();
    
    if (fetchError) {
      logError(`Error fetching report ${reportId}`, fetchError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Error fetching report: ${fetchError.message}`,
          error: fetchError 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
    
    if (!currentReport) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Report with ID ${reportId} not found`
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }
    
    log(`Current report data: ${JSON.stringify(currentReport)}`);
    
    // Update the report status
    const { data: updatedReport, error: updateError } = await supabase
      .from("report_requests")
      .update({
        status: newStatus,
        email_sent_at: new Date().toISOString()
      })
      .eq("id", reportId)
      .select();
    
    if (updateError) {
      logError(`Error updating report status`, updateError);
      return new Response(
        JSON.stringify({
          success: false, 
          message: `Error updating report status: ${updateError.message}`,
          error: updateError
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
    
    log(`Status update successful: ${JSON.stringify(updatedReport)}`);
    
    // If requested, trigger the email sending function
    if (sendNotification) {
      try {
        log("Triggering email sending function");
        const emailResult = await fetch(`${supabaseUrl}/functions/v1/send-report-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseServiceKey}`
          },
          body: JSON.stringify({ trigger: "manual", reportId })
        });
        
        const emailResponse = await emailResult.json();
        log(`Email function response: ${JSON.stringify(emailResponse)}`);
      } catch (emailError) {
        logError("Error triggering email function", emailError);
      }
    }
    
    // Return the updated report data
    return new Response(
      JSON.stringify({
        success: true,
        message: `Report status updated to ${newStatus}`,
        previousStatus: currentReport.status,
        newStatus: newStatus,
        updatedReport: updatedReport[0],
        emailTriggered: sendNotification
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
    
  } catch (error) {
    logError("Error in test-status-update function", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message,
        stack: error.stack
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
