
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createNotificationEmailHtml } from "../notificationTemplate.ts";
import { log, logError } from "../utils/logging.ts";

/**
 * Function to send notification email to the team
 */
export async function sendTeamNotification(resend: Resend, report: any) {
  try {
    log(`Sending notification email for report ${report.id}`);
    
    // Generate the notification email HTML using the report data
    const notificationHtml = createNotificationEmailHtml(report);
    
    // Format the subject line with report ID and organization for easy identification
    const emailSubject = `New Report Request: ${report.organization} [${report.archetype_id}]`;
    
    // Send the notification email to the team
    const emailResult = await resend.emails.send({
      from: "Reports <reports@g.nomihealth.com>",
      to: ["brian.woods@nomihealth.com"],
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
