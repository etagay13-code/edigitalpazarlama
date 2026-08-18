"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";

// WhatsApp düğmesi — sayfanın SOL altında.
//
// Sağ alt köşe sohbet balonuna ait; iki yuvarlak düğmeyi üst üste koymak
// mobilde ikisini de zor tıklanır yapıyor. Solda durunca mobildeki yapışkan
// CTA çubuğunun da üstünde kalması gerekiyor, o yüzden alt boşluk mobilde
// daha yüksek.
//
// Hazır mesaj dile göre değişir (sözlükten gelir): ziyaretçi WhatsApp'ı
// açtığında yazı kutusunda kendi dilinde bir cümle hazır bekler, bu ilk
// mesajı yazma eşiğini kaldırır.

export function WhatsAppFab({
  phone,
  locale,
  dict,
}: {
  phone: string;
  locale: Locale;
  dict: Dict["whatsapp"];
}) {
  // Düğme sayfa yerleşir yerleşmez değil, kısa bir gecikmeyle belirir:
  // ilk boyamada yarışmasın, LCP'ye karışmasın.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // wa.me yalnızca rakam kabul eder: "+90 546 976 1513" → "905469761513"
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(dict.message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={dict.aria}
      onClick={() => track({ event: "whatsapp_click", locale })}
      className={`group fixed bottom-24 left-4 z-[85] flex items-center gap-0 transition-all duration-500 sm:left-6 lg:bottom-5 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      {/* Dönen ışıklı çekirdek */}
      <span className="wa-fab grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#0b3f24] shadow-[0_10px_30px_-8px_rgba(37,211,102,0.55)]">
        <span className="grid h-[3.05rem] w-[3.05rem] place-items-center rounded-full bg-gradient-to-br from-[#25d366] to-[#128c50]">
          <WhatsAppGlyph />
        </span>
      </span>

      {/* Etiket yalnızca imleçle gelen cihazlarda ve hover'da açılır;
          mobilde ekranın dibinde sürekli duran bir şerit olmaz. */}
      <span className="pointer-events-none ml-0 hidden max-w-0 overflow-hidden whitespace-nowrap rounded-full text-sm font-medium text-white opacity-0 transition-all duration-300 group-hover:ml-3 group-hover:max-w-[16rem] group-hover:opacity-100 lg:block">
        <span className="glass-strong inline-block rounded-full px-4 py-2">{dict.label}</span>
      </span>
    </a>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}
