
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

// Setup CORS headers for browser access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize Resend for sending emails
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface ProcessRequestsOptions {
  limit?: number;
  updateStatus?: boolean;
  sendEmails?: boolean;
}

serve(async (req: Request) => {
  // Handle preflight requests for CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Initialize Supabase client using environment variables
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !supabaseKey) {
    return new Response(
      JSON.stringify({ error: "Missing environment variables" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Parse request options
    const options: ProcessRequestsOptions = await req.json().catch(() => ({}));
    const limit = options.limit || 10;
    const updateStatus = options.updateStatus !== false; // Default to true
    const sendEmails = options.sendEmails !== false; // Default to true

    console.log("Processing report requests with options:", options);

    // Fetch pending report requests
    const { data: pendingRequests, error: fetchError } = await supabase
      .from("report_requests")
      .select("*")
      .eq("status", "active")  // Process active reports that should have emails sent
      .is("email_sent_at", null)  // That haven't had emails sent
      .limit(limit)
      .order("created_at", { ascending: true });

    if (fetchError) {
      console.error("Error fetching pending requests:", fetchError);
      return new Response(
        JSON.stringify({ error: fetchError.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Found ${pendingRequests?.length || 0} requests to process`);

    if (!pendingRequests || pendingRequests.length === 0) {
      return new Response(
        JSON.stringify({ message: "No pending requests to process", processed: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Process each request
    const results = await Promise.all(
      pendingRequests.map(async (request) => {
        try {
          console.log(`Processing request ${request.id} for ${request.email}`);

          // Generate access URL if not set
          const accessUrl = request.access_url || 
            `${new URL(supabaseUrl).origin}/report/${request.archetype_id}/${request.access_token}`;

          // Send email if enabled
          let emailResult = null;
          if (sendEmails) {
            try {
              emailResult = await resend.emails.send({
                from: "Archetype Insights <notifications@healthcare-archetypes.com>",
                to: [request.email],
                subject: `Your ${request.archetype_name || "Healthcare Archetype"} Report is Ready`,
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2563eb;">Your Report is Ready</h1>
                    <p>Hello ${request.name},</p>
                    <p>Thank you for unlocking the full insights for your healthcare archetype. Your report for <strong>${request.archetype_name || request.archetype_id}</strong> is now ready to view.</p>
                    <p>Click the button below to access your full report:</p>
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${accessUrl}" style="background-color: #2563eb; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Your Report</a>
                    </div>
                    <p>Or copy this link to access your report:</p>
                    <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">${accessUrl}</p>
                    <p>This report will be available for the next 30 days.</p>
                    <p>If you have any questions, please don't hesitate to contact our support team.</p>
                    <p>Best regards,<br>Healthcare Archetypes Team</p>
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
                      <p>This email was sent automatically. Please do not reply to this message.</p>
                    </div>
                  </div>
                `,
              });
              console.log(`Email sent for request ${request.id}:`, emailResult);
            } catch (emailError: any) {
              console.error(`Error sending email for request ${request.id}:`, emailError);
              
              // Update record with email error
              if (updateStatus) {
                await supabase
                  .from("report_requests")
                  .update({
                    email_error: emailError.message,
                    email_error_at: new Date().toISOString(),
                    email_send_attempts: (request.email_send_attempts || 0) + 1,
                    last_attempt_at: new Date().toISOString(),
                  })
                  .eq("id", request.id);
              }
              
              return {
                id: request.id,
                success: false,
                error: emailError.message,
                email: request.email,
              };
            }
          }

          // Update request status if enabled
          if (updateStatus) {
            const { error: updateError } = await supabase
              .from("report_requests")
              .update({
                email_sent_at: new Date().toISOString(),
                status: "active", // Keep status as active
                access_url: accessUrl,
                last_attempt_at: new Date().toISOString(),
                email_send_attempts: (request.email_send_attempts || 0) + 1,
              })
              .eq("id", request.id);

            if (updateError) {
              console.error(`Error updating request ${request.id}:`, updateError);
            }
          }

          return {
            id: request.id,
            success: true,
            emailId: emailResult?.id,
            email: request.email,
            archetypeId: request.archetype_id,
          };
        } catch (requestError: any) {
          console.error(`Error processing request ${request.id}:`, requestError);
          return {
            id: request.id,
            success: false,
            error: requestError.message,
            email: request.email,
          };
        }
      })
    );

    // Return processed results
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    return new Response(
      JSON.stringify({
        processed: results.length,
        successful: successCount,
        failed: failureCount,
        results,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error processing requests:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
