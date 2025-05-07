
/**
 * Create HTML email template for report notifications
 */
export function createEmailHtml(userName: string, reportUrl: string, trackingPixelUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Your Healthcare Archetype Report</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
          line-height: 1.6;
          color: #333; 
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
        }
        .container { background-color: #ffffff; border-radius: 8px; padding: 30px; }
        .header { margin-bottom: 24px; }
        .logo { max-width: 180px; margin-bottom: 20px; }
        h1 { color: #4263eb; font-size: 24px; margin-top: 0; }
        .content { margin-bottom: 30px; }
        .button {
          background-color: #4263eb;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          display: inline-block;
          font-weight: bold;
        }
        .footer { font-size: 12px; color: #666; margin-top: 30px; }
        .tracking { opacity: 0; position: absolute; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Healthcare Archetype Report is Ready</h1>
        </div>
        
        <div class="content">
          <p>Hello ${userName},</p>
          <p>Thank you for your interest in our Healthcare Archetype Deep Dive Report. Your report has been created and is now available to view.</p>
          <p>Click the button below to access your detailed report:</p>
          <p>
            <a href="${reportUrl}" class="button">View Your Report</a>
          </p>
          <p>This link will be valid for 30 days. If you have any questions about your report, please don't hesitate to reach out.</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Healthcare Archetype Analysis. All rights reserved.</p>
        </div>
      </div>
      <img src="${trackingPixelUrl}" alt="" class="tracking" />
    </body>
    </html>
  `;
}
