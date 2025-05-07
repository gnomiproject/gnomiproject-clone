
/**
 * Create simplified HTML email template for report notifications
 * Designed for maximum deliverability
 */
export function createEmailHtml(userName: string, reportUrl: string, trackingPixelUrl?: string) {
  // Get current year for copyright notice
  const currentYear = new Date().getFullYear();
  
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
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
        }
        .content { margin-bottom: 20px; }
        .button {
          background-color: #4263eb;
          color: white;
          padding: 8px 16px;
          text-decoration: none;
          border-radius: 4px;
          display: inline-block;
        }
        .footer { font-size: 12px; color: #666; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; }
      </style>
    </head>
    <body>
      <div class="content">
        <p>Hello ${userName},</p>
        <p>Your Healthcare Report is now available to view.</p>
        <p>
          <a href="${reportUrl}" class="button">View Your Report</a>
        </p>
        <p>This link will be valid for 30 days.</p>
      </div>
      
      <div class="footer">
        <p>© ${currentYear} Healthcare Archetype Analysis</p>
        <p>To unsubscribe from these emails or manage your preferences, please reply to this email with "unsubscribe" in the subject line.</p>
        <p>Healthcare Archetype Analysis, 123 Main St, Suite 100, Salt Lake City, UT 84101</p>
      </div>
      ${trackingPixelUrl ? `<!-- No tracking pixel for improved deliverability -->` : ''}
    </body>
    </html>
  `;
}
