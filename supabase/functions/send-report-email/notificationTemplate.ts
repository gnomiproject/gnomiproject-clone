
/**
 * Create HTML template for internal team notification emails
 */
export function createNotificationEmailHtml(report: any) {
  // Get current date/time in a readable format
  const currentDate = new Date().toLocaleString();
  
  // Format employee count for display
  const employeeCount = report.exact_employee_count 
    ? report.exact_employee_count.toLocaleString() 
    : 'Not provided';
  
  // Create a formatted timestamp from email_sent_at or current time
  const requestTimestamp = report.email_sent_at 
    ? new Date(report.email_sent_at).toLocaleString() 
    : new Date().toLocaleString();
  
  // Parse assessment answers if available
  let assessmentHtml = '<p>No assessment data available</p>';
  if (report.assessment_answers && typeof report.assessment_answers === 'object') {
    try {
      const answers = report.assessment_answers;
      let answerRows = '';
      
      // Loop through the assessment answers and format for display
      Object.entries(answers).forEach(([key, value]) => {
        answerRows += `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${key}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${JSON.stringify(value)}</td>
          </tr>
        `;
      });
      
      // Create table for assessment data if we have rows
      if (answerRows) {
        assessmentHtml = `
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd; background-color: #f3f4f6;">Question</th>
              <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd; background-color: #f3f4f6;">Answer</th>
            </tr>
            ${answerRows}
          </table>
        `;
      }
    } catch (e) {
      assessmentHtml = '<p>Error parsing assessment data</p>';
    }
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>New Report Request Notification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          padding: 15px;
          max-width: 800px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .header {
          background-color: #2563EB;
          color: white;
          padding: 15px 20px;
          border-radius: 5px 5px 0 0;
          margin-bottom: 0;
        }
        .content {
          background-color: #ffffff;
          padding: 20px;
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
          color: #2563EB;
          font-size: 18px;
          margin-top: 20px;
          margin-bottom: 10px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 8px;
        }
        .info-section {
          background-color: #f9fafb;
          padding: 15px;
          margin: 15px 0;
          border-radius: 5px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 150px auto;
          gap: 8px;
        }
        .label {
          font-weight: bold;
          color: #4b5563;
        }
        .report-link {
          display: inline-block;
          background-color: #2563EB;
          color: white !important;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 4px;
          margin: 15px 0;
          font-weight: bold;
        }
        .report-link:hover {
          background-color: #1E40AF;
        }
        .timestamp {
          color: #6b7280;
          font-size: 14px;
          margin-top: 20px;
          font-style: italic;
        }
        .report-url {
          word-break: break-all;
          font-family: monospace;
          background-color: #f3f4f6;
          padding: 10px;
          border-radius: 4px;
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
        <h1>New Report Request Notification</h1>
      </div>

      <div class="content">
        <p>A new healthcare report has been generated and sent to the user. Here are the details:</p>
        
        <h2>User Information</h2>
        <div class="info-section info-grid">
          <div class="label">Name:</div>
          <div>${report.name || 'Not provided'}</div>
          
          <div class="label">Email:</div>
          <div>${report.email || 'Not provided'}</div>
          
          <div class="label">Organization:</div>
          <div>${report.organization || 'Not provided'}</div>
          
          <div class="label">Employee Count:</div>
          <div>${employeeCount}</div>
        </div>
        
        <h2>Report Details</h2>
        <div class="info-section info-grid">
          <div class="label">Report ID:</div>
          <div>${report.id || 'Unknown'}</div>
          
          <div class="label">Archetype:</div>
          <div>${report.archetype_id || 'Unknown'}</div>
          
          <div class="label">Request Time:</div>
          <div>${requestTimestamp}</div>
          
          <div class="label">Status:</div>
          <div>${report.status || 'Unknown'}</div>
        </div>
        
        <h2>Report Access Link</h2>
        <div class="info-section">
          <p>The following link was sent to the user:</p>
          <div class="report-url">${report.access_url || 'URL not available'}</div>
          
          <a href="${report.access_url || '#'}" target="_blank" class="report-link">
            View Report
          </a>
        </div>
        
        <h2>Assessment Information</h2>
        <div class="info-section">
          ${assessmentHtml}
        </div>
        
        <div class="timestamp">
          This notification was generated at ${currentDate}
        </div>
      </div>
    </body>
    </html>
  `;
}
