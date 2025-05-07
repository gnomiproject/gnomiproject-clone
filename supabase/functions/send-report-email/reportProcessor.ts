
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.3";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createEmailHtml } from "./emailTemplate.ts";

/**
 * Process and send emails for pending report requests
 */
export async function processPendingReports(
  supabaseUrl: string, 
  supabaseServiceKey: string,
  resend: Resend
) {
  console.log("Fetching pending report requests");
  
  try {
    // Create a Supabase client with the correct parameters
    // Fix: Updated the client initialization to use the latest supported syntax in Deno
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
    
    // Log the URL and service key (first few chars only for security)
    console.log(`Initializing Supabase client with URL: ${supabaseUrl}`);
    console.log(`Service key starts with: ${supabaseServiceKey.substring(0, 5)}...`);
    
    // Extra logging to help debug
    console.log("Executing query for pending report requests with status='pending'");
    
    // Get pending report requests that need email notifications
    const { data: pendingReports, error } = await supabase
      .from("report_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(20); // Process in batches
    
    if (error) {
      console.error("Error fetching report requests:", error);
      throw new Error(`Error fetching report requests: ${error.message}`);
    }
    
    console.log(`Found ${pendingReports?.length || 0} pending report requests`);
    
    if (!pendingReports || pendingReports.length === 0) {
      // Log raw counts to confirm database state
      const { count, error: countError } = await supabase
        .from("report_requests")
        .select("*", { count: 'exact', head: true });
      
      console.log(`Total report requests in database: ${count || 'unknown'}`);
      
      if (countError) {
        console.error("Error counting report requests:", countError);
      }
      
      // Check if there are any with status that might be capitalized differently
      const { data: altStatusReports, error: altError } = await supabase
        .from("report_requests")
        .select("id, status")
        .ilike("status", "%pend%");
      
      if (altError) {
        console.error("Error checking for alternate status formats:", altError);
      } else if (altStatusReports?.length) {
        console.log("Found reports with similar status:", 
          altStatusReports.map(r => `${r.id}: ${r.status}`).join(", "));
      }
      
      return { 
        message: "No pending reports found.", 
        processed: 0,
        totalCount: count || 0
      };
    }
    
    // Process each report request
    const results = [];
    for (const report of pendingReports) {
      try {
        console.log(`Processing report: ${report.id} for ${report.email}`);
        
        // Update attempts tracking in the database
        const { error: updateAttemptError } = await supabase
          .from("report_requests")
          .update({ 
            email_send_attempts: (report.email_send_attempts || 0) + 1,
            last_attempt_at: new Date().toISOString()
          })
          .eq("id", report.id);
          
        if (updateAttemptError) {
          console.warn(`Warning: Failed to update email_send_attempts: ${updateAttemptError.message}`);
        }
        
        // Access the stored URL or generate it if not available
        let reportUrl = report.access_url;
        if (!reportUrl) {
          const baseUrl = new URL(supabaseUrl).origin;
          reportUrl = `${baseUrl}/report/${report.archetype_id}/${report.access_token}`;
          
          // Update the report with the URL
          const { error: urlUpdateError } = await supabase
            .from("report_requests")
            .update({ access_url: reportUrl })
            .eq("id", report.id);
            
          if (urlUpdateError) {
            console.warn(`Warning: Failed to update access_url: ${urlUpdateError.message}`);
          }
        }
        
        // Add tracking pixel to email
        const trackingPixel = `${new URL(supabaseUrl).origin}/functions/v1/send-report-email/track-access/${report.archetype_id}/${report.access_token}`;
        
        console.log("Tracking pixel URL:", trackingPixel);
        
        // Get archetype name if available
        let archetypeName = "Healthcare Archetype";
        if (report.archetype_id) {
          try {
            const { data: archetypeData } = await supabase
              .from("level4_deepdive_report_data")
              .select("archetype_name")
              .eq("archetype_id", report.archetype_id)
              .maybeSingle();
              
            if (archetypeData?.archetype_name) {
              archetypeName = archetypeData.archetype_name;
            }
          } catch (nameError) {
            console.warn(`Could not fetch archetype name: ${nameError.message}`);
          }
        }
        
        // Create email content
        const emailHtml = createEmailHtml(report.name || "there", reportUrl, trackingPixel);
        
        // Check if RESEND_API_KEY is set
        const resendApiKey = Deno.env.get("RESEND_API_KEY");
        if (!resendApiKey) {
          throw new Error("Missing RESEND_API_KEY environment variable");
        }
        
        // Log email parameters before sending
        console.log(`SENDING EMAIL with parameters:
          TO: ${report.email}
          FROM: Gnomi <gnomi@onenomi.com>
          SUBJECT: Your ${archetypeName} Deep Dive Report is Ready
          ARCHETYPE: ${archetypeName}
          REPORT_URL: ${reportUrl}
          TRACKING_URL: ${trackingPixel}
        `);
        
        // Send the actual email - UPDATED FROM ADDRESS
        const emailResult = await resend.emails.send({
          from: "Gnomi <gnomi@onenomi.com>",
          to: [report.email],
          subject: `Your ${archetypeName} Deep Dive Report is Ready`,
          html: emailHtml
        });
        
        console.log(`Email send result:`, JSON.stringify(emailResult));
        
        if (!emailResult || emailResult.error) {
          throw new Error(`Resend API error: ${emailResult?.error?.message || "Unknown error"}`);
        }
        
        // Update the report status and record the email ID
        const { error: updateError } = await supabase
          .from("report_requests")
          .update({ 
            status: "active",
            email_id: emailResult.id,
            email_sent_at: new Date().toISOString()
          })
          .eq("id", report.id);
          
        if (updateError) {
          throw new Error(`Error updating report status: ${updateError.message}`);
        }
        
        console.log(`Successfully sent email for report ${report.id} with Resend ID: ${emailResult.id}`);
        
        results.push({
          id: report.id,
          email: report.email,
          status: "processed",
          email_id: emailResult.id,
          url: reportUrl
        });
      } catch (reportError) {
        console.error(`Error processing report ${report.id}:`, reportError);
        
        // Update the report with error information
        try {
          await supabase
            .from("report_requests")
            .update({
              email_error: reportError.message,
              email_error_at: new Date().toISOString()
            })
            .eq("id", report.id);
        } catch (errorUpdateError) {
          console.error("Failed to update error information:", errorUpdateError);
        }
        
        results.push({
          id: report.id,
          email: report.email,
          status: "error",
          error: reportError.message
        });
      }
    }
    
    return { 
      processed: results.length,
      results
    };
  } catch (mainError) {
    console.error("Error in processPendingReports:", mainError);
    return { 
      processed: 0,
      error: mainError.message,
      success: false
    };
  }
}
