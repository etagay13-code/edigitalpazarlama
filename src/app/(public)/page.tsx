import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Hero } from "@/components/Hero";
import { BrandStrip } from "@/components/BrandStrip";
import { ServicesGrid } from "@/components/ServicesGrid";
import { Stats } from "@/components/Stats";
import { Process } from "@/components/Process";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CTASection } from "@/components/CTASection";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import {
  listServicesPublic,
  listTestimonialsPublic,
  listFaqsPublic,
} from "@/lib/data";

export default async function HomePage() {
  const [services, testimonials, faqs] = await Promise.all([
    listServicesPublic(),
    listTestimonialsPublic(),
    listFaqsPublic("home"),
  ]);

  const serviceItems = services.map((s) => ({
    slug: s.slug,
    title: s.title,
    short: s.short,
    icon: s.icon,
    accent: s.accent,
  }));

  return (
    <>
      <Hero />
      <BrandStrip />

      <section className="section">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeader
              eyebrow="Hizmetler"
              title="Markanızı büyütecek tüm uzmanlıklar"
              description="Reklamdan SEO'ya, mobil uygulamadan SaaS geliştirmeye — markanız büyüdükçe ihtiyaç duyacağınız her hizmet kendi içinde uzmanlaşmış ekiplerle sunuluyor."
            />
            <Reveal delay={0.2}>
              <Link href="/hizmetler" className="btn-ghost">
                Tüm hizmetler
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-12">
            <ServicesGrid items={serviceItems} limit={6} />
          </div>
        </div>
      </section>

      <Stats />
      <Process />
      <Testimonials items={testimonials} />
      <FAQ items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
      <CTASection />
    </>
  );
}
