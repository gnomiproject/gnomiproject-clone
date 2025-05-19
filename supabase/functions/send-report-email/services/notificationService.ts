
import { createNotificationEmailHtml } from "../notificationTemplate.ts";
import { log, logError } from "../utils/logging.ts";

/**
 * Send notification email to team about a new report being generated
 */
export async function sendTeamNotification(resend: any, report: any) {
  try {
    // Don't send team notification in test mode
    if (report.email && report.email.includes('test@')) {
      log(`Skipping team notification for test email: ${report.email}`);
      return { success: true, skipped: true };
    }
    
    // Use brian.woods@nomihealth.com instead of the default team email
    const teamNotificationEmail = Deno.env.get("TEAM_NOTIFICATION_EMAIL") || "brian.woods@nomihealth.com";
    
    // Generate HTML for team notification
    try {
      const html = createNotificationEmailHtml(report);
      
      // Send notification to team
      const { data, error } = await resend.emails.send({
        from: 'Report Notification <reports@g.nomihealth.com>',
        to: [teamNotificationEmail],
        subject: `New Report Request: ${report.archetype_name || report.archetype_id}`,
        html: html
      });
      
      if (error) {
        throw new Error(`Failed to send team notification: ${error.message}`);
      }
      
      log(`Team notification email sent for report ${report.id}`);
      return { success: true, id: data.id };
    } catch (templateErr) {
      // Catch specific template generation errors to provide better diagnostics
      logError(`Error generating notification email template for report ${report.id}`, templateErr);
      
      // Send a simplified fallback notification instead
      const { data, error } = await resend.emails.send({
        from: 'Report Notification <reports@g.nomihealth.com>',
        to: [teamNotificationEmail],
        subject: `New Report Request: ${report.archetype_name || report.archetype_id} (FALLBACK)`,
        html: `<h1>New Report Request</h1>
               <p>A new report was requested, but there was an error generating the detailed notification.</p>
               <p>Report ID: ${report.id}</p>
               <p>Email: ${report.email || 'Not provided'}</p>
               <p>Archetype: ${report.archetype_name || report.archetype_id}</p>
               <p>Error: ${templateErr.message}</p>`
      });
      
      if (error) {
        throw new Error(`Failed to send fallback team notification: ${error.message}`);
      }
      
      log(`Fallback team notification email sent for report ${report.id}`);
      return { success: true, id: data.id, fallback: true };
    }
  } catch (err) {
    // Log error but don't fail the whole process
    logError(`Error sending team notification for report ${report.id}`, err);
    return { success: false, error: err.message };
  }
}
