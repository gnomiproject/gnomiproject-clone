
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
  
  const { data, error } = await resend.emails.send({
    from: 'Healthcare Report <reports@example.com>',
    to: [report.email],
    subject: `Your ${archetypeName} Healthcare Report is Ready`,
    html: createReportEmailHtml({
      recipientName,
      archetypeName,
      reportUrl: report.access_url
    })
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

/**
 * Create HTML template for report emails
 */
function createReportEmailHtml(data: { 
  recipientName: string,
  archetypeName: string, 
  reportUrl: string 
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Your Healthcare Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #4f46e5;
          padding: 20px;
          color: white;
          text-align: center;
          border-radius: 4px 4px 0 0;
        }
        .content {
          background-color: #ffffff;
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 4px 4px;
        }
        .button {
          display: inline-block;
          background-color: #4f46e5;
          color: white;
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 4px;
          margin-top: 20px;
          font-weight: bold;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Healthcare Report is Ready</h1>
        </div>
        <div class="content">
          <p>Hello ${data.recipientName},</p>
          
          <p>Your requested healthcare report for <strong>${data.archetypeName}</strong> is now available! This report contains valuable insights and analysis based on your organization's profile and needs.</p>
          
          <p>To view your report, simply click the button below:</p>
          
          <div style="text-align: center;">
            <a href="${data.reportUrl}" class="button">View My Report</a>
          </div>
          
          <p>This report includes:</p>
          <ul>
            <li>Detailed demographic analysis</li>
            <li>Cost optimization opportunities</li>
            <li>Utilization patterns and insights</li>
            <li>Strategic recommendations</li>
          </ul>
          
          <p>If you have any questions about your report, please don't hesitate to contact our team.</p>
          
          <p>Thank you for using our healthcare analytics solution!</p>
        </div>
        <div class="footer">
          <p>This report link is valid for 30 days. Please save or bookmark the report if you wish to access it beyond this period.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
