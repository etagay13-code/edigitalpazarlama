import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import {
  DEFAULT_LOCALE,
  isLocale,
  localeFromCountry,
  type Locale,
} from "@/i18n/config";
import { externalToInternal, localizeHref } from "@/i18n/routes";

const YEAR = 60 * 60 * 24 * 365;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin → mevcut auth/session akışı (locale dışı).
  if (pathname.startsWith("/admin")) {
    return updateSession(request);
  }

  // API, sitemap, robots, dahili dosyalar → dokunma.
  if (
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

  // 2) Önek yok → cookie/geo'ya göre dil belirle.
  const cookieLoc = request.cookies.get("NEXT_LOCALE")?.value;
  const country = request.headers.get("x-vercel-ip-country");
  const target: Locale = isLocale(cookieLoc)
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
    "/((?!_next/static|_next/image|favicon|logo|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
