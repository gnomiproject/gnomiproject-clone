
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
    
    const teamNotificationEmail = Deno.env.get("TEAM_NOTIFICATION_EMAIL") || "team@g.nomihealth.com";
    
    // Generate HTML for team notification
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
    
  } catch (err) {
    // Log error but don't fail the whole process
    logError(`Error sending team notification for report ${report.id}`, err);
    return { success: false, error: err.message };
  }
}
