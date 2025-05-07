import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

// Initialize Resend client with API key
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Handle CORS preflight requests
function handleCors(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }
  return null;
}

// Create HTML email template for report notifications
function createEmailHtml(userName: string, reportUrl: string, trackingPixelUrl: string) {
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

// Simplified function to increment access count
async function incrementAccessCount(supabaseUrl: string, supabaseKey: string, archetypeId: string, accessToken: string) {
  try {
    console.log(`Incrementing access count for archetype: ${archetypeId}, token: ${accessToken.substring(0, 5)}...`);
    
    const client = createClient(supabaseUrl, supabaseKey);
    
    // Get current count first
    const { data: currentData, error: selectError } = await client
      .from("report_requests")
      .select("access_count")
      .eq("archetype_id", archetypeId)
      .eq("access_token", accessToken)
      .single();
      
    if (selectError) {
      console.error("Error fetching current access count:", selectError);
      return { success: false, error: selectError.message };
    }
    
    // Increment count with a simple update
    const currentCount = currentData?.access_count || 0;
    const newCount = currentCount + 1;
    
    const { data, error } = await client
      .from("report_requests")
      .update({
        access_count: newCount,
        last_accessed: new Date().toISOString()
      })
      .eq("archetype_id", archetypeId)
      .eq("access_token", accessToken)
      .select();
    
    if (error) {
      console.error("Error in incrementAccessCount:", error);
      return { success: false, error: error.message };
    }
    
    console.log(`Successfully updated access count from ${currentCount} to ${newCount}`);
    return { success: true, data, newCount };
  } catch (error) {
    console.error("Exception in incrementAccessCount:", error);
    return { success: false, error: String(error) };
  }
}

serve(async (req: Request) => {
  console.log("Function called with method:", req.method);
  
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Create Supabase client with explicit environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase URL or service role key");
    }

    console.log("Initializing Supabase client with URL:", supabaseUrl);
    
    // Create the Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if this is an access tracking request
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    
    if (pathParts.includes("track-access") && pathParts.length > 3) {
      const reportId = pathParts[pathParts.length - 2];
      const accessToken = pathParts[pathParts.length - 1];
      
      console.log("Tracking access for report:", reportId, "with token:", accessToken.substring(0, 5) + "...");
      
      try {
        // Use the direct increment function
        const result = await incrementAccessCount(
          supabaseUrl,
          supabaseServiceKey,
          reportId,
          accessToken
        );
          
        if (!result.success) {
          console.error(`Error tracking access: ${result.error}`);
        } else {
          console.log("Successfully tracked access, new count:", result.newCount);
        }
      } catch (trackError) {
        console.error("Error in tracking access:", trackError);
      }
      
      // Respond with a 1x1 transparent GIF
      return new Response(
        new Uint8Array([
          0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xFF, 0xFF, 0xFF,
          0x00, 0x00, 0x00, 0x21, 0xF9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2C, 0x00, 0x00, 0x00, 0x00,
          0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3B
        ]),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "image/gif",
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
          }
        }
      );
    }
    
    console.log("Fetching pending report requests");
    
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
      return new Response(
        JSON.stringify({ message: "No pending reports found." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }
    
    // Process each report request
    const results = [];
    for (const report of pendingReports) {
      try {
        console.log(`Processing report: ${report.id} for ${report.email}`);
        
        // Access the stored URL or generate it if not available
        let reportUrl = report.access_url;
        if (!reportUrl) {
          const baseUrl = new URL(req.url).origin;
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
        const trackingPixel = `${new URL(req.url).origin}/functions/v1/send-report-email/track-access/${report.archetype_id}/${report.access_token}`;
        
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
    
    return new Response(
      JSON.stringify({ 
        processed: results.length,
        results
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
