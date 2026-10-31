import { Reveal } from "./Reveal";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /**
   * Basilacak baslik etiketi. Sayfanin en ustundeki SectionHeader "h1" almali:
   * bu bilesen her yerde h2 basiyordu ve ana sayfa disinda hicbir sayfada H1
   * kalmiyordu (Search Console: /de/leistungen, /de/ueber-uns "tarandi, dizine
   * eklenmedi"). Sayfa ici bolumler varsayilan h2'de kalir.
   */
  as?: "h1" | "h2";
};

export function SectionHeader({ eyebrow, title, description, align = "left", as = "h2" }: Props) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  const Baslik = as;
  return (
    <div className={`${alignCls} max-w-3xl`}>
      {eyebrow && (
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
      )}
      {title && (
        <Reveal delay={0.08}>
          <Baslik className="mt-5 h-display text-3xl font-semibold leading-[1.1] sm:text-4xl md:text-5xl">
            {title}
          </Baslik>
        </Reveal>
      )}
      {description && (
        <Reveal delay={0.15}>
          <p className="mt-5 text-base text-white/65 sm:text-lg">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
