import { createEmailHtml } from "../emailTemplate.ts";
import { log, logError } from "../utils/logging.ts";

/**
 * Update the attempt count and timestamp for a report
 */
export async function updateReportAttemptInfo(supabase: any, reportId: string, currentAttempts: number) {
  const { error } = await supabase
    .from("report_requests")
    .update({
      email_send_attempts: (currentAttempts || 0) + 1,
      last_attempt_at: new Date().toISOString()
    })
    .eq("id", reportId);
    
  if (error) {
    logError(`Error updating report attempt info for ${reportId}`, error);
  }
}

/**
 * Fetch archetype name for a given archetype ID
 */
export async function fetchArchetypeName(supabase: any, archetypeId: string) {
  try {
    const { data, error } = await supabase
      .from("Core_Archetype_Overview")
      .select("name")
      .eq("id", archetypeId)
      .maybeSingle();
      
    if (error) {
      logError(`Error fetching archetype name for ${archetypeId}`, error);
      return archetypeId; // Fallback to using the ID if we can't get the name
    }
    
    return data?.name || archetypeId;
  } catch (err) {
    logError(`Exception fetching archetype name for ${archetypeId}`, err);
    return archetypeId; // Fallback to ID
  }
}

/**
 * Send report email to the user
 */
export async function sendUserEmail(resend: any, report: any, recipientName: string) {
  const archetypeName = report.archetype_name || "Healthcare Archetype";
  
  log(`Sending report email to ${report.email} for ${archetypeName}`);
  
  // Generate a tracking pixel URL if needed
  let trackingPixelUrl;
  if (report.id) {
    // Format could be customized based on your tracking implementation
    const baseUrl = new URL(report.access_url || "https://g.nomihealth.com").origin;
    trackingPixelUrl = `${baseUrl}/functions/v1/send-report-email/track-access/${report.id}/pixel`;
  }
  
  // Use the improved email template
  const html = createEmailHtml(
    recipientName,
    report.access_url,
    trackingPixelUrl,
    archetypeName
  );
  
  const { data, error } = await resend.emails.send({
    from: 'Nomi Health <reports@g.nomihealth.com>',
    to: [report.email],
    subject: `Your ${archetypeName} Archetype Report is Ready`,
    html: html
  });
  
  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
  
  log(`Email sent successfully to ${report.email}, ID: ${data.id}`);
  
  return data;
}

/**
 * Update report status to active after email is sent
 */
export async function updateReportStatus(supabase: any, reportId: string) {
  const { error } = await supabase
    .from("report_requests")
    .update({
      status: "active",
      email_sent_at: new Date().toISOString()
    })
    .eq("id", reportId);
    
  if (error) {
    throw new Error(`Failed to update report status: ${error.message}`);
  }
}

/**
 * Record error information on the report
 */
export async function recordReportError(supabase: any, reportId: string, errorMessage: string) {
  try {
    const { error } = await supabase
      .from("report_requests")
      .update({
        email_error: errorMessage,
        email_error_at: new Date().toISOString()
      })
      .eq("id", reportId);
      
    if (error) {
      logError(`Error recording report error for ${reportId}`, error);
    }
  } catch (err) {
    logError(`Exception recording report error for ${reportId}`, err);
  }
}

// The createReportEmailHtml function is no longer needed as we're using createEmailHtml from emailTemplate.ts
