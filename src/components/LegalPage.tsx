import type { LegalDoc } from "@/lib/legal";

// Impressum / Datenschutz gibi düz metin sayfaları için ortak düzen.
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="container-x">
        <div className="mx-auto max-w-3xl">
          <h1 className="h-display text-3xl font-semibold sm:text-5xl">{doc.title}</h1>
          <p className="mt-4 text-sm text-white/45">{doc.updated}</p>
          <div className="prose-post mt-10">
            {doc.sections.map((s) => (
              <div key={s.h}>
                <h2>{s.h}</h2>
                {s.p?.map((para, i) => (
                  <p key={i} className={i === 0 ? "mt-4" : "mt-2"}>
                    {para}
                  </p>
                ))}
                {s.ul && (
                  <ul className="mt-4">
                    {s.ul.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
