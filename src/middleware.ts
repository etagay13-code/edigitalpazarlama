import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import {
  DEFAULT_LOCALE,
  isLocale,
  localeFromCountry,
  type Locale,
} from "@/i18n/config";
import {
  externalToInternal,
  localizeHref,
  serviceSlugToInternal,
  serviceSlugToExternal,
} from "@/i18n/routes";

const YEAR = 60 * 60 * 24 * 365;

// Arama motoru / sosyal medya botları: coğrafi yönlendirme UYGULANMAZ.
// Googlebot ABD'den taradığı için aksi halde tüm Türkçe URL'ler İngilizceye
// yönleniyor ve Türkçe sayfalar dizine giremiyordu (hreflang de kırılıyordu).
const BOT_UA =
  /bot|crawler|spider|crawling|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandex|sogou|exabot|facebookexternalhit|facebot|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|petalbot|ahrefs|semrush|mj12bot|dotbot|screaming frog|gptbot|oai-searchbot|chatgpt-user|perplexitybot|claudebot|anthropic|ccbot|google-extended|bytespider/i;

function isBot(request: NextRequest): boolean {
  return BOT_UA.test(request.headers.get("user-agent") ?? "");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin → mevcut auth/session akışı (locale dışı).
  if (pathname.startsWith("/admin")) {
    return updateSession(request);
  }

  // API, sitemap, robots, dahili dosyalar → dokunma.
  // /v2 = tasarım prototipi (i18n dışı, kendi shell'i var) → dokunma.
  if (
    pathname.startsWith("/v2") ||
    pathname.startsWith("/api") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/manifest.webmanifest"
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  // 1) Açık dil öneki (/en, /de): dış kelimeleri iç (Türkçe) segmentlere çevir.
  if (first === "en" || first === "de") {
    const locale = first as Locale;
    const rest = segments.slice(1);
    const internalRest = rest.map((seg, i) =>
      i === 0 ? externalToInternal(locale, seg) : seg,
    );
    // Hizmet detayı: dış slug → kanonik slug
    if (internalRest[0] === "hizmetler" && internalRest[1]) {
      const internalSlug = serviceSlugToInternal(locale, internalRest[1]);
      // Kanonik (Türkçe) slug ile gelindiyse ve bu dilin kendi slug'ı farklıysa
      // eski adres demektir → 301 ile yerelleştirilmiş adrese taşı.
      const external = serviceSlugToExternal(locale, internalSlug);
      if (internalRest[1] === internalSlug && external !== internalSlug) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = localizeHref(
          locale,
          "/" + ["hizmetler", internalSlug, ...internalRest.slice(2)].join("/"),
        );
        return NextResponse.redirect(redirectUrl, 301);
      }
      internalRest[1] = internalSlug;
    }
    const url = request.nextUrl.clone();
    url.pathname = "/" + [locale, ...internalRest].join("/");
    const headers = new Headers(request.headers);
    headers.set("x-locale", locale);
    const res = NextResponse.rewrite(url, { request: { headers } });
    res.cookies.set("NEXT_LOCALE", locale, { path: "/", maxAge: YEAR });
    return res;
  }

  // /tr önekiyle gelen → öneksiz kanonik forma yönlendir (tr varsayılan).
  if (first === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = "/" + segments.slice(1).join("/");
    return NextResponse.redirect(url);
  }

  // 2) Önek yok → cookie/geo'ya göre dil belirle. Bot ise dokunma: istenen
  // (Türkçe kanonik) sayfa neyse o servis edilir, yönlendirme yapılmaz.
  const cookieLoc = request.cookies.get("NEXT_LOCALE")?.value;
  const country = request.headers.get("x-vercel-ip-country");
  const target: Locale = isBot(request)
    ? DEFAULT_LOCALE
    : isLocale(cookieLoc)
      ? cookieLoc
      : localeFromCountry(country);

  // Hedef tr değilse yerelleştirilmiş URL'ye yönlendir.
  if (target !== DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = localizeHref(target, "/" + segments.join("/"));
    const res = NextResponse.redirect(url);
    res.cookies.set("NEXT_LOCALE", target, { path: "/", maxAge: YEAR });
    return res;
  }

  // tr: iç olarak /tr/... 'a rewrite et (URL öneksiz kalır).
  const url = request.nextUrl.clone();
  url.pathname = "/" + ["tr", ...segments].join("/");
  const headers = new Headers(request.headers);
  headers.set("x-locale", "tr");
  const res = NextResponse.rewrite(url, { request: { headers } });
  res.cookies.set("NEXT_LOCALE", "tr", { path: "/", maxAge: YEAR });
  return res;
}

export const config = {
  matcher: [
    // Statik dosyaları atla; admin + public sayfalarda çalış.
    // Uzantı listesine video ve font da dahil: aksi halde /video/x.webm isteği
    // dil rewrite'ına girip /tr/video/x.webm olarak 404 dönüyordu.
    "/((?!_next/static|_next/image|favicon|logo|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|webm|mp4|woff|woff2|ttf)$).*)",
  ],
};
