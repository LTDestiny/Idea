// @ts-nocheck
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { join_request_id } = await req.json();

    if (!join_request_id) {
      return new Response(
        JSON.stringify({ error: "join_request_id is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Create admin supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Fetch join request with idea and profiles
    const { data: joinReq, error: joinErr } = await supabaseAdmin
      .from("join_requests")
      .select(
        `
        *,
        ideas!inner(id, title, creator_id, profiles!creator_id(email, full_name)),
        profiles!requester_id(email, full_name)
      `,
      )
      .eq("id", join_request_id)
      .single();

    if (joinErr || !joinReq) {
      return new Response(JSON.stringify({ error: "Join request not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const idea = joinReq.ideas;
    const ownerProfile = idea.profiles;
    const requesterProfile = joinReq.profiles;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const APP_URL = Deno.env.get("APP_URL") || "http://localhost:3000";

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Build skills HTML
    const skillsHtml = joinReq.relevant_skills?.length
      ? `<p style="margin: 12px 0;"><strong>Skills:</strong> ${joinReq.relevant_skills
          .map(
            (s: string) =>
              `<span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 12px; font-size: 13px; margin-right: 4px;">${s}</span>`,
          )
          .join(" ")}</p>`
      : "";

    // Build message HTML
    const messageHtml = joinReq.message
      ? `<p style="margin: 12px 0; padding: 12px; background: #f8fafc; border-left: 3px solid #3b82f6; border-radius: 4px; font-style: italic;">"${joinReq.message}"</p>`
      : "";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #e2e8f0;">
          <h1 style="font-size: 24px; margin: 0;">💡 STEAM_TUI</h1>
        </div>
        
        <div style="padding: 24px 0;">
          <h2 style="font-size: 20px; color: #1e293b;">Có người muốn tham gia ý tưởng của bạn! 🎉</h2>
          
          <div style="padding: 16px; background: #f8fafc; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Người xin tham gia:</strong> ${requesterProfile.full_name || "N/A"} (${requesterProfile.email})</p>
            ${skillsHtml}
            ${messageHtml}
            <p style="margin: 4px 0;"><strong>Ý tưởng:</strong> "${idea.title}"</p>
          </div>
          
          <div style="text-align: center; margin: 24px 0;">
            <a href="${APP_URL}/ideas/${idea.id}" 
               style="display: inline-block; background: #2563eb; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Xem yêu cầu tham gia
            </a>
          </div>
        </div>
        
        <div style="padding: 16px 0; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 13px;">
          <p>STEAM_TUI · Bạn nhận mail này vì bạn là chủ ý tưởng</p>
        </div>
      </body>
      </html>
    `;

    // Send email via Resend
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "STEAM_TUI <noreply@resend.dev>",
        to: ownerProfile.email,
        subject: `[STEAM_TUI] ${requesterProfile.full_name || "Ai đó"} muốn tham gia ý tưởng "${idea.title}"`,
        html: emailHtml,
      }),
    });

    const resendData = await resendRes.json();

    return new Response(JSON.stringify({ success: true, data: resendData }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
