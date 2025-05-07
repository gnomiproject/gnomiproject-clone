
/**
 * Create simplified text-focused HTML email template for report notifications
 * Designed for maximum deliverability with minimal formatting
 */
export function createEmailHtml(userName: string, reportUrl: string, trackingPixelUrl?: string) {
  // Get current year for copyright notice
  const currentYear = new Date().getFullYear();
  
  // Extract just the path portion of the URL to avoid domain mismatches
  let reportPath = '';
  try {
    const urlObj = new URL(reportUrl);
    reportPath = urlObj.pathname + urlObj.search + urlObj.hash;
  } catch (e) {
    // If URL parsing fails, use the full URL as fallback
    reportPath = reportUrl;
  }
  
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
          line-height: 1.5;
          color: #333; 
          padding: 10px;
          max-width: 600px;
          margin: 0 auto;
        }
        p { margin: 10px 0; }
        .footer { font-size: 11px; color: #666; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; }
      </style>
    </head>
    <body>
      <p>Hello ${userName},</p>
      <p>Your Healthcare Report is now available to view.</p>
      <p>Please visit your account portal and go to: ${reportPath}</p>
      <p>This link will be valid for 30 days.</p>
      
      <div class="footer">
        <p>© ${currentYear} Healthcare Archetype Analysis</p>
        <p>This email was sent to you based on your request for a healthcare report.</p>
        <p>To unsubscribe from these emails, please reply with "unsubscribe" in the subject line.</p>
        <p>Healthcare Archetype Analysis, 123 Main St, Suite 100, Salt Lake City, UT 84101</p>
      </div>
    </body>
    </html>
  `;
}
