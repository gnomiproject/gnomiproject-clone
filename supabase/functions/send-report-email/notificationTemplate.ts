
/**
 * Create HTML template for internal team notification emails
 * With authentic, helpful follow-up template
 */ 
export function createNotificationEmailHtml(report) {
  // Format dates and data
  const currentDate = new Date().toLocaleString();
  const employeeCount = report.exact_employee_count ? report.exact_employee_count.toLocaleString() : 'Not provided';
  const requestTimestamp = report.email_sent_at ? new Date(report.email_sent_at).toLocaleString() : new Date().toLocaleString();
  
  // Format archetype name if available (fallback to ID if not)
  const archetypeName = report.archetype_name || report.archetype_id || 'Unknown';
  
  // Parse assessment answers if available
  let assessmentHtml = '<p>No assessment data available</p>';
  if (report.assessment_answers && typeof report.assessment_answers === 'object') {
    try {
      const answers = report.assessment_answers;
      let answerRows = '';
      
      // Loop through the assessment answers and format for display
      Object.entries(answers).forEach(([key, value]) => {
        // Format the answer value more readably
        let formattedValue = value;
        if (typeof value === 'object') {
          formattedValue = JSON.stringify(value, null, 2)
            .replace(/[{}"]/g, '')
            .replace(/,/g, ', ')
            .trim();
        }
        
        answerRows += `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; vertical-align: top;">${key}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; vertical-align: top;">${formattedValue}</td>
          </tr>
        `;
      });
      
      // Create table for assessment data if we have rows
      if (answerRows) {
        assessmentHtml = `
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #ddd; background-color: #f3f4f6;">Question</th>
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #ddd; background-color: #f3f4f6;">Answer</th>
            </tr>
            ${answerRows}
          </table>
        `;
      }
    } catch (e) {
      assessmentHtml = `<p>Error parsing assessment data: ${e.message}</p>`;
    }
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>New ${archetypeName} Archetype Request</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          padding: 15px;
          max-width: 800px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .header {
          background-color: #46E0D3;
          background: linear-gradient(135deg, #46E0D3 0%, #0D41C0 100%);
          color: white;
          padding: 20px;
          border-radius: 5px 5px 0 0;
          margin-bottom: 0;
        }
        .content {
          background-color: #ffffff;
          padding: 25px;
          border: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 5px 5px;
        }
        h1 {
          margin-top: 0;
          font-size: 24px;
          margin-bottom: 10px;
        }
        h2 {
          color: #0D41C0;
          font-size: 18px;
          margin-top: 25px;
          margin-bottom: 15px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 10px;
        }
        .info-section {
          background-color: #f9fafb;
          padding: 20px;
          margin: 15px 0;
          border-radius: 5px;
          border-left: 4px solid #0D41C0;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 160px auto;
          gap: 10px;
        }
        .label {
          font-weight: bold;
          color: #4b5563;
        }
        .value {
          word-break: break-word;
        }
        .report-link {
          display: inline-block;
          background-color: #0D41C0;
          color: white !important;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 4px;
          margin: 15px 0;
          font-weight: bold;
        }
        .report-link:hover {
          background-color: #0A3399;
        }
        .timestamp {
          color: #6b7280;
          font-size: 14px;
          margin-top: 25px;
          font-style: italic;
          border-top: 1px solid #eee;
          padding-top: 15px;
        }
        .report-url {
          word-break: break-all;
          font-family: monospace;
          background-color: #f3f4f6;
          padding: 12px;
          border-radius: 4px;
          margin: 10px 0;
        }
        .summary-box {
          background-color: #f0f9ff;
          border-left: 4px solid #3b82f6;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .follow-up {
          background-color: #f0fdf4;
          border-left: 4px solid #22c55e;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .email-template {
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 20px;
          margin: 15px 0;
          font-family: Arial, sans-serif;
          line-height: 1.5;
          color: #333;
        }
        .email-note {
          color: #6b7280;
          font-style: italic;
          margin-bottom: 10px;
        }
        @media (max-width: 600px) {
          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>New ${archetypeName} Archetype Request</h1>
      </div>

      <div class="content">
        <div class="summary-box">
          <p><strong>Quick Summary:</strong> ${report.name || 'A user'} from ${report.organization || 'an organization'} has requested an archetype report and was matched with the <strong>${archetypeName}</strong> archetype.</p>
        </div>
        
        <div class="info-section">
          <h2>User Information</h2>
          <div class="info-grid">
            <div class="label">Name:</div>
            <div class="value">${report.name || 'Not provided'}</div>
            
            <div class="label">Email:</div>
            <div class="value">${report.email || 'Not provided'}</div>
            
            <div class="label">Organization:</div>
            <div class="value">${report.organization || 'Not provided'}</div>
            
            <div class="label">Employee Count:</div>
            <div class="value">${employeeCount}</div>
          </div>
        </div>
        
        <div class="info-section">
          <h2>Archetype Details</h2>
          <div class="info-grid">
            <div class="label">Report ID:</div>
            <div class="value">${report.id || 'Unknown'}</div>
            
            <div class="label">Archetype:</div>
            <div class="value">${archetypeName}</div>
            
            <div class="label">Request Time:</div>
            <div class="value">${requestTimestamp}</div>
            
            <div class="label">Status:</div>
            <div class="value">${report.status || 'Unknown'}</div>
          </div>
        </div>
        
        <div class="info-section">
          <h2>Archetype Report Link</h2>
          <p>The following link was sent to the user:</p>
          <div class="report-url">${report.access_url || 'URL not available'}</div>
          
          <a href="${report.access_url || '#'}" target="_blank" class="report-link">
            View Archetype Report
          </a>
        </div>
        
        <h2>Assessment Information</h2>
        <div class="info-section">
          ${assessmentHtml}
        </div>
        
        <div class="follow-up">
          <h2>Suggested Follow-up</h2>
          <p>Follow up in 2-3 days if they haven't accessed the report. Here's a suggested follow-up email template:</p>
          
          <div class="email-template">
            <p class="email-note">Copy and paste this text to send a follow-up email:</p>
            <p><strong>Subject:</strong> Quick question about your ${archetypeName} Archetype Report</p>
            <p>Hello ${report.name || 'there'},</p>
            <p>I noticed you recently accessed our ${archetypeName} archetype report. I hope you found some interesting insights in there.</p>
            <p>I'm reaching out because many people find it helpful to discuss how these archetypes might relate to their specific situation. The report provides general patterns we've observed, but the real value often comes from understanding how your organization's unique approach aligns or differs from these patterns.</p>
            <p>If you're interested, I'd be happy to chat briefly about what aspects of the report resonated with you, and perhaps share some approaches other ${archetypeName} organizations have found effective. No pressure at all - just an offer to discuss if you found the information valuable.</p>
            <p>Would a 15-minute conversation be helpful? Let me know what you think.</p>
          </div>
        </div>
        
        <div class="timestamp">
          This notification was generated at ${currentDate}
        </div>
      </div>
    </body>
    </html>
  `;
}
