// Public iletişim formu endpoint'i.
// Mesajı messages tablosuna yazar; Resend API key varsa email bildirimi gönderir.
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body.name ?? "").toString().trim();
    const email = (body.email ?? "").toString().trim();
    const phone = body.phone ? body.phone.toString().trim() : null;
    const service = body.service ? body.service.toString().trim() : null;
    const message = (body.message ?? "").toString().trim();

    // Hata gövdesi dil-nötr kod döner; kullanıcıya gösterilen metin istemcide
    // sözlükten seçilir (yanıt dili siteyle karışmasın diye).
    if (!name || name.length < 2)
      return NextResponse.json({ code: "name" }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ code: "email" }, { status: 400 });
    if (!message || message.length < 20)
      return NextResponse.json({ code: "message" }, { status: 400 });

    const supabase = createServiceClient();

    // 1) DB'ye kaydet
    const { error: insErr } = await supabase.from("messages").insert({
      name,
      email,
      phone,
      service,
      message,
      ip_address: req.headers.get("x-forwarded-for") ?? null,
      user_agent: req.headers.get("user-agent") ?? null,
    });
    if (insErr) {
      console.error("messages insert:", insErr);
      return NextResponse.json({ code: "submit" }, { status: 500 });
    }

    // 2) Resend ile mail gönder (varsa)
    const { data: secrets } = await supabase
      .from("site_secrets")
      .select("*")
      .eq("id", 1)
      .single();
    const { data: settings } = await supabase
      .from("site_settings")
      .select("brand_name,email")
      .eq("id", 1)
      .single();

    const apiKey = secrets?.resend_api_key;
    const fromEmail = secrets?.resend_from_email || "onboarding@resend.dev";
    const toEmail =
      secrets?.contact_form_to_email || settings?.email || null;

    if (apiKey && toEmail) {
      try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: `${settings?.brand_name ?? "Site"} <${fromEmail}>`,
          to: [toEmail],
          replyTo: email,
          subject: `Yeni iletişim formu: ${name}${service ? ` — ${service}` : ""}`,
          html: `
            <div style="font-family:system-ui,sans-serif;line-height:1.5;max-width:560px">
              <h2>Yeni iletişim formu mesajı</h2>
              <table style="border-collapse:collapse;width:100%;margin:16px 0">
                <tr><td style="padding:4px 8px;color:#555">Ad</td><td>${escapeHtml(name)}</td></tr>
                <tr><td style="padding:4px 8px;color:#555">E-posta</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
                ${phone ? `<tr><td style="padding:4px 8px;color:#555">Telefon</td><td>${escapeHtml(phone)}</td></tr>` : ""}
                ${service ? `<tr><td style="padding:4px 8px;color:#555">Hizmet</td><td>${escapeHtml(service)}</td></tr>` : ""}
              </table>
              <p style="white-space:pre-wrap;background:#f7f7f8;padding:16px;border-radius:8px">${escapeHtml(message)}</p>
            </div>
          `,
        });
      } catch (mailErr) {
        // Mail başarısız olsa bile DB'ye yazıldı — başarı dön
        console.error("resend send failed:", mailErr);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact form error:", err);
    return NextResponse.json({ code: "submit" }, { status: 500 });
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
