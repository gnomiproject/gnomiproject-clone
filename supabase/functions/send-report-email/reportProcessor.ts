
// Import directly from esm.sh using the proper Deno import pattern
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createEmailHtml } from "./emailTemplate.ts";

/**
 * Process and send emails for pending report requests
 */
export async function processPendingReports(
  supabaseUrl: string, 
  supabaseServiceKey: string,
  resend: Resend
) {
  console.log("Starting processPendingReports function");
  
  // Store results in this object
  const result = {
    processed: 0,
    results: [] as any[],
    success: true,
    message: ""
  };
  
  // Initialize Supabase client
  let supabase;
  try {
    console.log(`Initializing Supabase with URL: ${supabaseUrl}`);
    console.log(`Service key (first 5 chars): ${supabaseServiceKey.slice(0, 5)}...`);
    
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    console.log("Supabase client successfully initialized");
  } catch (initError) {
    console.error("CRITICAL ERROR: Failed to initialize Supabase client:", initError);
    return { 
      processed: 0,
      success: false,
      error: `Failed to initialize Supabase client: ${initError.message}`,
      details: initError
    };
  }
  
  // Attempt to get pending report requests
  try {
    console.log("Querying for pending report requests...");
    
    // Use a simple, direct query with minimal nesting or complexity
    const { data: pendingReports, error: fetchError } = await supabase
      .from("report_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(10);
    
    if (fetchError) {
      console.error("Error fetching pending reports:", fetchError);
      return { 
        success: false, 
        error: `Error fetching pending reports: ${fetchError.message}`,
        processed: 0
      };
    }
    
    console.log(`Found ${pendingReports?.length || 0} pending reports to process`);
    
    // Handle case with no pending reports
    if (!pendingReports || pendingReports.length === 0) {
      console.log("No pending reports found");
      
      // Get total count as a sanity check
      try {
        const { count, error: countError } = await supabase
          .from("report_requests")
          .select("*", { count: 'exact', head: true });
        
        if (!countError) {
          console.log(`Total report requests in database: ${count || 0}`);
        }
      } catch (countErr) {
        console.warn("Failed to get total count:", countErr);
      }
      
      return { 
        message: "No pending reports found to process", 
        processed: 0,
        success: true
      };
    }
    
    // Process each report
    for (const report of pendingReports) {
      console.log(`Processing report ID: ${report.id} for ${report.email}`);
      
      try {
        // 1. Update attempt counters first
        const attemptUpdate = await updateAttemptCounters(supabase, report.id);
        if (!attemptUpdate.success) {
          console.warn(`Warning: Failed to update attempt counters: ${attemptUpdate.error}`);
          // Continue anyway
        }
        
        // 2. Generate report URL if needed
        const reportUrl = generateReportUrl(supabaseUrl, report);
        
        // 3. Get archetype name for personalization
        const archetypeName = await getArchetypeName(supabase, report.archetype_id) || "Healthcare Archetype";
        
        // 4. Generate tracking pixel URL
        const trackingPixel = `${new URL(supabaseUrl).origin}/functions/v1/send-report-email/track-access/${report.archetype_id}/${report.access_token}`;
        console.log(`Tracking pixel URL: ${trackingPixel}`);
        
        // 5. Create email content
        const emailHtml = createEmailHtml(report.name || "there", reportUrl, trackingPixel);
        
        // 6. Log all parameters before sending email
        console.log(`SENDING EMAIL with parameters:
          TO: ${report.email}
          FROM: Gnomi <gnomi@onenomi.com>
          SUBJECT: Your ${archetypeName} Deep Dive Report is Ready
          ARCHETYPE: ${archetypeName}
          REPORT_URL: ${reportUrl}
          TRACKING_URL: ${trackingPixel}
        `);
        
        // 7. Send the email
        const emailResult = await resend.emails.send({
          from: "Gnomi <gnomi@onenomi.com>",
          to: [report.email],
          subject: `Your ${archetypeName} Deep Dive Report is Ready`,
          html: emailHtml
        });
        
        console.log(`Email send result:`, JSON.stringify(emailResult));
        
        if (!emailResult || emailResult.error) {
          throw new Error(`Resend API error: ${emailResult?.error?.message || "Unknown error"}`);
        }
        
        // 8. Update report status to active
        const { error: updateError } = await supabase
          .from("report_requests")
          .update({ 
            status: "active",
            email_id: emailResult.id,
            email_sent_at: new Date().toISOString(),
            email_error: null
          })
          .eq("id", report.id);
        
        if (updateError) {
          console.warn(`Warning: Report status updated but database update failed: ${updateError.message}`);
        }
        
        console.log(`Successfully processed report ${report.id}`);
        
        // Add to successful results
        result.results.push({
          id: report.id,
          email: report.email,
          status: "processed",
          email_id: emailResult.id
        });
        
        result.processed++;
        
      } catch (reportError) {
        console.error(`Error processing report ${report.id}:`, reportError);
        
        // Update report with error info but don't change status
        try {
          await supabase
            .from("report_requests")
            .update({
              email_error: reportError.message,
              email_error_at: new Date().toISOString()
            })
            .eq("id", report.id);
        } catch (errorUpdateError) {
          console.error("Failed to update error information:", errorUpdateError);
        }
        
        // Add to results
        result.results.push({
          id: report.id,
          email: report.email,
          status: "error",
          error: reportError.message
        });
      }
    }
    
    return result;
    
  } catch (mainError) {
    console.error("CRITICAL ERROR in processPendingReports:", mainError);
    return { 
      processed: 0,
      error: mainError.message,
      success: false,
      stack: mainError.stack
    };
  }
}

/**
 * Helper function to update attempt counters
 */
async function updateAttemptCounters(supabase, reportId) {
  try {
    const { error } = await supabase
      .from("report_requests")
      .update({ 
        email_send_attempts: supabase.rpc('increment', { row_id: reportId, increment_by: 1, column_name: 'email_send_attempts' }),
        last_attempt_at: new Date().toISOString()
      })
      .eq("id", reportId);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Helper function to generate report URL
 */
function generateReportUrl(supabaseUrl, report) {
  // Use existing URL if available
  if (report.access_url) {
    return report.access_url;
  }
  
  // Generate new URL
  const baseUrl = new URL(supabaseUrl).origin;
  return `${baseUrl}/report/${report.archetype_id}/${report.access_token}`;
}

/**
 * Helper function to get archetype name
 */
async function getArchetypeName(supabase, archetypeId) {
  if (!archetypeId) return null;
  
  try {
    // Try to get archetype name from level4 data
    const { data, error } = await supabase
      .from("level4_deepdive_report_data")
      .select("archetype_name")
      .eq("archetype_id", archetypeId)
      .maybeSingle();
    
    if (!error && data?.archetype_name) {
      return data.archetype_name;
    }
    
    // Fallback to Core_Archetype_Overview
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("Core_Archetype_Overview")
      .select("name")
      .eq("id", archetypeId)
      .maybeSingle();
    
    if (!fallbackError && fallbackData?.name) {
      return fallbackData.name;
    }
  } catch (error) {
    console.warn(`Could not fetch archetype name: ${error.message}`);
  }
  
  return null;
}
