
/**
 * Create improved HTML email template for report notifications
 * Designed for maximum deliverability with clean formatting
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
          line-height: 1.6;
          color: #333; 
          padding: 15px;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .header {
          margin-bottom: 25px;
          border-bottom: 1px solid #eee;
          padding-bottom: 15px;
        }
        h1 {
          color: #2563EB;
          font-size: 24px;
          margin-bottom: 15px;
        }
        .content {
          background-color: #ffffff;
          padding: 20px 0;
        }
        p { margin: 15px 0; font-size: 16px; }
        .button {
          display: inline-block;
          background-color: #2563EB;
          color: white !important;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 4px;
          margin: 20px 0;
          font-weight: bold;
        }
        .button:hover {
          background-color: #1E40AF;
        }
        .footer { 
          font-size: 12px; 
          color: #666; 
          margin-top: 30px; 
          border-top: 1px solid #eee; 
          padding-top: 15px;
          line-height: 1.4;
        }
        .important-info {
          font-weight: 500;
          color: #444;
        }
        .link-info {
          background-color: #f9fafb;
          padding: 10px;
          margin: 15px 0;
          border-left: 3px solid #2563EB;
          font-family: monospace;
          word-break: break-all;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Healthcare Report</h1>
      </div>

      <div class="content">
        <p>Hello ${userName},</p>
        
        <p>Your Healthcare Report is now available to view.</p>
        
        <p>Please visit your account portal using the link below:</p>
        
        <div class="link-info">${reportPath}</div>
        
        <p class="important-info">This link will be valid for 30 days.</p>
      </div>
      
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
