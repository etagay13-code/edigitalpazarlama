// Public iletişim formu endpoint'i.
// Mesajı messages tablosuna yazar; Resend API key varsa müşteriye teşekkür ve
// ajansa bildirim e-postası gönderir.
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/server";
import { isLocale, type Locale } from "@/i18n/config";
import { localizeHref } from "@/i18n/routes";
import {
  buildAdminNotification,
  buildThankYouEmail,
  type AuditPayload,
  type FormType,
} from "@/lib/email/templates";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body.name ?? "").toString().trim();
    const email = (body.email ?? "").toString().trim();
    const phone = body.phone ? body.phone.toString().trim() : null;
    const service = body.service ? body.service.toString().trim() : null;
    const message = (body.message ?? "").toString().trim();
    // Denetim formu aynı uçtan gelir; yapılandırılmış cevaplar payload'da saklanır.
    // Bal küpü doluysa bot demektir. Hata dönmüyoruz — bot uyarlanmasın diye
    // başarı görünümü veriliyor, ama kayıt açılmıyor.
    if (typeof body.website2 === "string" && body.website2.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    const formType = body.formType === "audit" ? "audit" : "contact";
    const payload = formType === "audit" && body.payload ? body.payload : null;
    const locale = typeof body.locale === "string" ? body.locale.slice(0, 2) : "tr";

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
      form_type: formType,
      payload,
      locale,
      ip_address: req.headers.get("x-forwarded-for") ?? null,
      user_agent: req.headers.get("user-agent") ?? null,
    });
    if (insErr) {
      console.error("messages insert:", insErr);
      return NextResponse.json({ code: "submit" }, { status: 500 });
    }

    // 2) E-postalar (Resend anahtarı varsa): önce müşteriye teşekkür, sonra
    // ajansa bildirim. Mail başarısız olsa bile kayıt DB'de — başarı dönülür.
    await sendFormEmails({
      supabase,
      formType,
      locale: isLocale(locale) ? locale : "tr",
      name,
      email,
      phone,
      service,
      message,
      payload,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact form error:", err);
    return NextResponse.json({ code: "submit" }, { status: 500 });
  }
}


async function sendFormEmails(o: {
  supabase: ReturnType<typeof createServiceClient>;
  formType: FormType;
  locale: Locale;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  payload: AuditPayload | null;
}) {
  const { supabase } = o;
  const [{ data: secrets }, { data: settings }, { data: posts }] = await Promise.all([
    supabase.from("site_secrets").select("*").eq("id", 1).single(),
    supabase
      .from("site_settings")
      .select("brand_name,email,phone,url,instagram_url")
      .eq("id", 1)
      .single(),
    supabase
      .from("blog_posts")
      .select("slug,title,reading_min")
      .eq("locale", o.locale)
      .eq("status", "published")
      .is("redirect_to", null)
      .order("published_at", { ascending: false })
      .limit(3),
  ]);

  // DB (admin → Entegrasyonlar) önceliklidir; boşsa ortam değişkenine düşülür.
  const apiKey = secrets?.resend_api_key || process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const fromEmail =
    (secrets?.resend_from_email !== "onboarding@resend.dev" && secrets?.resend_from_email) ||
    process.env.RESEND_FROM_EMAIL ||
    "onboarding@resend.dev";
  const toEmail = secrets?.contact_form_to_email || settings?.email || null;

  const base = (settings?.url || "https://www.etruemarketing.com").replace(/\/$/, "");
  const brand = {
    name: settings?.brand_name ?? "True EDigital Marketing",
    url: base,
    email: settings?.email ?? "info@etruemarketing.com",
    phone: settings?.phone ?? "",
    instagram: settings?.instagram_url ?? null,
  };
  const from = `${brand.name} <${fromEmail}>`;
  const resend = new Resend(apiKey);

  let customerEmailSent = false;
  try {
    const mail = buildThankYouEmail({
      locale: o.locale,
      formType: o.formType,
      name: o.name,
      service: o.service,
      message: o.message,
      payload: o.payload,
      brand,
      posts: (posts ?? []).map((p) => ({
        title: p.title,
        url: base + localizeHref(o.locale, `/blog/${p.slug}`),
        readingMin: p.reading_min,
      })),
    });
    const { error } = await resend.emails.send({
      from,
      to: [o.email],
      replyTo: brand.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });
    if (error) throw new Error(error.message);
    customerEmailSent = true;
  } catch (e) {
    console.error("teşekkür e-postası gönderilemedi:", e);
  }

  if (!toEmail) return;
  try {
    const mail = buildAdminNotification({
      formType: o.formType,
      locale: o.locale,
      name: o.name,
      email: o.email,
      phone: o.phone,
      service: o.service,
      message: o.message,
      payload: o.payload,
      adminUrl: `${base}/admin/messages`,
      customerEmailSent,
    });
    const { error } = await resend.emails.send({
      from,
      to: [toEmail],
      replyTo: o.email,
      subject: mail.subject,
      html: mail.html,
    });
    if (error) throw new Error(error.message);
  } catch (e) {
    console.error("bildirim e-postası gönderilemedi:", e);
  }
}
