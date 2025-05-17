
// Import directly from esm.sh using the proper Deno import pattern
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { log, logError } from "./utils/logging.ts";
import { sendTeamNotification } from "./services/notificationService.ts";
import { 
  updateReportAttemptInfo,
  fetchArchetypeName,
  sendUserEmail,
  updateReportStatus,
  recordReportError
} from "./services/reportService.ts";

/**
 * Process and send emails for pending report requests
 */
export async function processPendingReports(
  supabaseUrl: string, 
  supabaseServiceKey: string,
  resend: Resend
) {
  log("Starting processPendingReports function");
  
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
    log(`Initializing Supabase with URL: ${supabaseUrl}`);
    
    // Create Supabase client with minimal options
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });
    
    log("Supabase client successfully initialized");
  } catch (initError) {
    logError("Failed to initialize Supabase client", initError);
    return { 
      processed: 0,
      success: false,
      error: `Failed to initialize Supabase client: ${initError.message}`,
      details: initError
    };
  }
  
  // Attempt to get pending report requests
  try {
    log("Querying for pending report requests...");
    
    // Use a simple, direct query with minimal nesting or complexity
    const { data: pendingReports, error: fetchError } = await supabase
      .from("report_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(10);
    
    if (fetchError) {
      logError("Error fetching pending reports", fetchError);
      return { 
        success: false, 
        error: `Error fetching pending reports: ${fetchError.message}`,
        processed: 0
      };
    }
    
    log(`Found ${pendingReports?.length || 0} pending reports to process`);
    
    // Handle case with no pending reports
    if (!pendingReports || pendingReports.length === 0) {
      log("No pending reports found");
      return { 
        message: "No pending reports found to process", 
        processed: 0,
        success: true
      };
    }
    
    // Process each report
    for (const report of pendingReports) {
      log(`Processing report ID: ${report.id} for ${report.email}`);
      
      try {
        // Update attempt count and timestamp
        await updateReportAttemptInfo(supabase, report.id, report.email_send_attempts);
        
        // Generate report URL if not already set
        if (!report.access_url) {
          report.access_url = `${new URL(supabaseUrl).origin}/report/${report.archetype_id}/${report.access_token}`;
        }
        
        // Get a simple name for personalization
        const recipientName = report.name || "there";
        
        // Get a basic archetype name
        const archetypeName = await fetchArchetypeName(supabase, report.archetype_id);
        
        // Send the email to the user
        const emailResult = await sendUserEmail(resend, report, recipientName);
        
        // Update report status to active
        await updateReportStatus(supabase, report.id);
        
        // Send notification email to the team (don't block main flow)
        await sendTeamNotification(resend, report);
        
        log(`Successfully processed report ${report.id}`);
        
        // Add to successful results
        result.results.push({
          id: report.id,
          email: report.email,
          status: "processed",
          email_id: emailResult.id
        });
        
        result.processed++;
        
      } catch (reportError) {
        logError(`Error processing report ${report.id}`, reportError);
        
        // Update report with error info but don't change status
        await recordReportError(supabase, report.id, reportError.message);
        
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
    logError("CRITICAL ERROR in processPendingReports", mainError);
    return { 
      processed: 0,
      error: mainError.message,
      success: false,
      stack: mainError.stack
    };
  }
}
