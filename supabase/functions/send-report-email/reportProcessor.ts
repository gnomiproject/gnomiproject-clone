
// Import directly from esm.sh using the proper Deno import pattern
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createEmailHtml } from "./emailTemplate.ts";
import { createNotificationEmailHtml } from "./notificationTemplate.ts";

// Helper for logging with timestamps
const log = (message: string) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

// Helper for error logging with timestamps
const logError = (message: string, error: any) => {
  console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error);
};

// Function to send notification email to the team
async function sendTeamNotification(resend: Resend, report: any) {
  try {
    log(`Sending notification email for report ${report.id}`);
    
    // Generate the notification email HTML using the report data
    const notificationHtml = createNotificationEmailHtml(report);
    
    // Format the subject line with report ID and organization for easy identification
    const emailSubject = `New Report Request: ${report.organization} [${report.archetype_id}]`;
    
    // Send the notification email to the team
    const emailResult = await resend.emails.send({
      from: "Reports <reports@g.nomihealth.com>",
      to: ["artemis@nomihealth.com"],
      subject: emailSubject,
      html: notificationHtml,
      text: `New report request from ${report.name} (${report.email}) for organization ${report.organization}, archetype ${report.archetype_id}. Access URL: ${report.access_url || 'Not available'}`,
    });
    
    if (emailResult.error) {
      throw new Error(`Failed to send team notification: ${emailResult.error.message}`);
    }
    
    log(`Team notification email sent successfully for report ${report.id}`);
    return true;
  } catch (error) {
    // Log the error but don't disrupt the main flow
    logError(`Failed to send team notification for report ${report.id}`, error);
    return false;
  }
}

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
        try {
          log(`Updating attempt information for report ${report.id}`);
          const { data: attemptData, error: attemptErr } = await supabase
            .from("report_requests")
            .update({ 
              last_attempt_at: new Date().toISOString(),
              email_send_attempts: (report.email_send_attempts || 0) + 1
            })
            .eq("id", report.id)
            .select();
            
          if (attemptErr) {
            logError(`Warning: Could not update attempt counter for report ${report.id}`, attemptErr);
            // Continue with processing despite this error
          } else {
            log(`Successfully updated attempt information for report ${report.id}`);
          }
        } catch (attemptErr) {
          logError(`Warning: Could not update attempt counter: ${attemptErr.message}`, attemptErr);
          // Continue with processing despite this error
        }
        
        // Generate report URL if not already set
        if (!report.access_url) {
          report.access_url = `${new URL(supabaseUrl).origin}/report/${report.archetype_id}/${report.access_token}`;
        }
        
        // Get a simple name for personalization
        const recipientName = report.name || "there";
        
        // Get a basic archetype name
        let archetypeName = "Healthcare Report";
        try {
          const { data } = await supabase
            .from("level4_deepdive_report_data")
            .select("archetype_name")
            .eq("archetype_id", report.archetype_id)
            .maybeSingle();
            
          if (data?.archetype_name) {
            archetypeName = data.archetype_name;
          }
        } catch (nameErr) {
          log(`Could not fetch archetype name: ${nameErr.message}`);
          // Continue with default name
        }
        
        // Create email content - no tracking pixel for deliverability
        const emailHtml = createEmailHtml(recipientName, report.access_url);
        
        // Create a simple, direct subject line without special characters
        const emailSubject = `Healthcare Report Now Available`;
        
        // Log all parameters before sending email
        log(`Preparing email with parameters:
          TO: ${report.email}
          FROM: Reports <reports@g.nomihealth.com>
          SUBJECT: ${emailSubject}
        `);
        
        // Send the email with minimal formatting
        const emailResult = await resend.emails.send({
          from: "Reports <reports@g.nomihealth.com>",
          to: [report.email],
          subject: emailSubject,
          html: emailHtml,
          text: `Hello ${recipientName}, your healthcare report is now available. Please check your account portal for access. If you have questions, please contact support.`,
        });
        
        log(`Email send result: ${JSON.stringify(emailResult)}`);
        
        if (!emailResult || emailResult.error) {
          throw new Error(`Resend API error: ${emailResult?.error?.message || "Unknown error"}`);
        }
        
        // Update report status to active with better error handling
        log(`Updating report ${report.id} status to active after successful email send`);
        const updateResult = await supabase
          .from("report_requests")
          .update({
            status: "active",
            email_sent_at: new Date().toISOString()
          })
          .eq("id", report.id)
          .select();
        
        if (updateResult.error) {
          logError(`Failed to update report ${report.id} status to active`, updateResult.error);
          
          // Try a simplified update as fallback
          log(`Attempting simplified status update for report ${report.id}`);
          const fallbackUpdate = await supabase
            .from("report_requests")
            .update({ status: "active" })
            .eq("id", report.id);
            
          if (fallbackUpdate.error) {
            logError(`Fallback update also failed for report ${report.id}`, fallbackUpdate.error);
            // Record the error but continue processing other reports
          } else {
            log(`Fallback update succeeded for report ${report.id}`);
          }
        } else {
          log(`Successfully updated report ${report.id} status to active`);
        }
        
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
        try {
          log(`Recording error information for report ${report.id}`);
          await supabase
            .from("report_requests")
            .update({
              email_error: reportError.message,
              email_error_at: new Date().toISOString()
            })
            .eq("id", report.id);
        } catch (errorUpdateError) {
          logError(`Failed to update error information for report ${report.id}`, errorUpdateError);
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
    logError("CRITICAL ERROR in processPendingReports", mainError);
    return { 
      processed: 0,
      error: mainError.message,
      success: false,
      stack: mainError.stack
    };
  }
}
