
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createEmailHtml } from "../emailTemplate.ts";
import { sendTeamNotification } from "./notificationService.ts";
import { log, logError } from "../utils/logging.ts";

/**
 * Updates a report's attempt information
 */
export async function updateReportAttemptInfo(supabase: any, reportId: string, currentAttempts: number) {
  try {
    log(`Updating attempt information for report ${reportId}`);
    const { data: attemptData, error: attemptErr } = await supabase
      .from("report_requests")
      .update({ 
        last_attempt_at: new Date().toISOString(),
        email_send_attempts: (currentAttempts || 0) + 1
      })
      .eq("id", reportId)
      .select();
      
    if (attemptErr) {
      logError(`Warning: Could not update attempt counter for report ${reportId}`, attemptErr);
      return false;
    } else {
      log(`Successfully updated attempt information for report ${reportId}`);
      return true;
    }
  } catch (attemptErr) {
    logError(`Warning: Could not update attempt counter: ${attemptErr.message}`, attemptErr);
    return false;
  }
}

/**
 * Fetches the archetype name for a report
 */
export async function fetchArchetypeName(supabase: any, archetypeId: string) {
  try {
    const { data } = await supabase
      .from("level4_deepdive_report_data")
      .select("archetype_name")
      .eq("archetype_id", archetypeId)
      .maybeSingle();
      
    return data?.archetype_name || "Healthcare Report";
  } catch (nameErr) {
    log(`Could not fetch archetype name: ${nameErr.message}`);
    return "Healthcare Report";
  }
}

/**
 * Sends the report email to the user
 */
export async function sendUserEmail(resend: Resend, report: any, recipientName: string) {
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
  
  return emailResult;
}

/**
 * Updates a report status to active
 */
export async function updateReportStatus(supabase: any, reportId: string) {
  log(`Updating report ${reportId} status to active after successful email send`);
  const updateResult = await supabase
    .from("report_requests")
    .update({
      status: "active",
      email_sent_at: new Date().toISOString()
    })
    .eq("id", reportId)
    .select();
  
  if (updateResult.error) {
    logError(`Failed to update report ${reportId} status to active`, updateResult.error);
    
    // Try a simplified update as fallback
    log(`Attempting simplified status update for report ${reportId}`);
    const fallbackUpdate = await supabase
      .from("report_requests")
      .update({ status: "active" })
      .eq("id", reportId);
      
    if (fallbackUpdate.error) {
      logError(`Fallback update also failed for report ${reportId}`, fallbackUpdate.error);
      return false;
    } else {
      log(`Fallback update succeeded for report ${reportId}`);
      return true;
    }
  } else {
    log(`Successfully updated report ${reportId} status to active`);
    return true;
  }
}

/**
 * Records error information for a report without changing its status
 */
export async function recordReportError(supabase: any, reportId: string, errorMessage: string) {
  try {
    log(`Recording error information for report ${reportId}`);
    await supabase
      .from("report_requests")
      .update({
        email_error: errorMessage,
        email_error_at: new Date().toISOString()
      })
      .eq("id", reportId);
    return true;
  } catch (errorUpdateError) {
    logError(`Failed to update error information for report ${reportId}`, errorUpdateError);
    return false;
  }
}
