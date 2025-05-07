
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
    // Create a fresh Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
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
      return { message: "No pending reports found.", processed: 0 };
    }
    
    // Process each report request
    const results = [];
    for (const report of pendingReports) {
      try {
        console.log(`Processing report: ${report.id} for ${report.email}`);
        
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
        
        console.log(`Sending email for ${archetypeName} to ${report.email}`);
        
        // Create email content
        const emailHtml = createEmailHtml(report.name || "there", reportUrl, trackingPixel);
        
        // Check if RESEND_API_KEY is set
        const resendApiKey = Deno.env.get("RESEND_API_KEY");
        if (!resendApiKey) {
          throw new Error("Missing RESEND_API_KEY environment variable");
        }
        
        // Send the actual email
        const emailResult = await resend.emails.send({
          from: "Healthcare Reports <reports@onenomi.com>",
          to: [report.email],
          subject: `Your ${archetypeName} Deep Dive Report is Ready`,
          html: emailHtml
        });
        
        console.log(`Email sent to ${report.email}, result:`, JSON.stringify(emailResult));
        
        // Update the report status
        const { error: updateError } = await supabase
          .from("report_requests")
          .update({ status: "active" })
          .eq("id", report.id);
          
        if (updateError) {
          throw new Error(`Error updating report status: ${updateError.message}`);
        }
        
        results.push({
          id: report.id,
          email: report.email,
          status: "processed",
          url: reportUrl
        });
      } catch (reportError) {
        console.error(`Error processing report ${report.id}:`, reportError);
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
