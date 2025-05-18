
/**
 * Create improved HTML email template for report notifications
 * Designed to generate interest and curiosity as a lead generation tool
 */ 
export function createEmailHtml(userName: string, reportUrl: string, trackingPixelUrl?: string, archetypeName: string = "Healthcare") {
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
      <title>Your ${archetypeName} Archetype Report is Ready</title>
      <style>
        body { 
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
          line-height: 1.6;
          color: #1B2432; 
          padding: 0;
          margin: 0;
          background-color: #ffffff;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 0;
        }
        .header {
          padding: 25px 30px;
          background-color: #46E0D3;
          background: linear-gradient(135deg, #46E0D3 0%, #0D41C0 100%);
        }
        .header-logo {
          font-size: 24px;
          font-weight: bold;
          color: white;
          margin: 0;
        }
        .content {
          background-color: #ffffff;
          padding: 30px;
        }
        h1 {
          color: #0D41C0;
          font-size: 24px;
          margin-top: 0;
          margin-bottom: 20px;
          font-weight: 600;
        }
        p { 
          margin: 15px 0; 
          font-size: 16px; 
          color: #1B2432;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          display: inline-block;
          background-color: #0D41C0;
          color: white !important;
          text-decoration: none;
          padding: 14px 30px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 16px;
        }
        .button:hover {
          background-color: #0A3399;
        }
        .features {
          background-color: #F8FAFA;
          border-radius: 8px;
          padding: 20px 25px;
          margin: 25px 0;
        }
        .feature-list {
          padding-left: 25px;
          margin: 15px 0;
        }
        .feature-list li {
          margin-bottom: 10px;
          position: relative;
        }
        .archetype-highlight {
          background-color: #F0F7FF;
          border-left: 4px solid #0D41C0;
          padding: 15px 20px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .curiosity {
          margin-top: 25px;
          background-color: #F8FAFA;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #FFC600;
        }
        .curiosity a {
          color: #0D41C0;
          text-decoration: none;
          font-weight: 500;
        }
        .footer { 
          font-size: 14px; 
          color: #6A7380; 
          padding: 25px 30px;
          background-color: #F8FAFA;
          text-align: center;
        }
        .expire-notice {
          font-size: 14px;
          color: #6A7380;
          font-style: italic;
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #E5E7EB;
        }
        @media only screen and (max-width: 600px) {
          .content, .header {
            padding: 20px;
          }
          .features, .curiosity {
            padding: 15px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-logo">Nomi Health</div>
        </div>

        <div class="content">
          <h1>Your ${archetypeName} Archetype Report is Ready</h1>
          
          <p>Hello ${userName},</p>
          
          <div class="archetype-highlight">
            <p>Based on the information you provided, your organization matches the <strong>${archetypeName}</strong> employer archetype. This report reveals patterns, benchmarks, and strategies common among organizations with similar healthcare profiles.</p>
          </div>
          
          <p>Our analysis of hundreds of employers has identified distinct healthcare archetypes, each with unique cost structures and optimization opportunities. This report provides valuable insights into the typical patterns seen in your archetype group.</p>
          
          <div class="button-container">
            <a href="${reportUrl}" class="button">View Archetype Report</a>
          </div>
          
          <div class="features">
            <p><strong>The archetype report includes:</strong></p>
            <ul class="feature-list">
              <li>Typical demographic and risk profiles for your archetype</li>
              <li>Common cost drivers and optimization opportunities</li>
              <li>Benchmark utilization patterns</li>
              <li>Strategic approaches that have worked for similar employers</li>
            </ul>
          </div>
          
          <div class="curiosity">
            <p><strong>Curious how your organization compares?</strong></p>
            <p>Wonder if your healthcare spending and utilization patterns align with the ${archetypeName} archetype? Contact Amanda Kueh at <a href="mailto:amanda.kueh@nomihealth.com">amanda.kueh@nomihealth.com</a> to discuss how your specific data compares to the benchmark and which strategies might yield the greatest impact for your organization.</p>
          </div>
          
          <div class="expire-notice">
            <p>This report link is valid for 30 days. Please save or bookmark the report if you wish to access it beyond this period.</p>
          </div>
        </div>
        
        <div class="footer">
          <p>© ${currentYear} Nomi Health. All rights reserved.</p>
          ${trackingPixelUrl ? `<img src="${trackingPixelUrl}" width="1" height="1" alt="" />` : ''}
        </div>
      </div>
    </body>
    </html>
  `;
}
