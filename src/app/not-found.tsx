import Link from "next/link";
import { ArrowUpRight, Home } from "lucide-react";
import { GradientBlobs } from "@/components/GradientBlob";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden py-24">
      <GradientBlobs />
      <div className="container-x text-center">
        <p className="font-display text-[8rem] font-semibold leading-none sm:text-[12rem]">
          <span className="gradient-text">404</span>
        </p>
        <h1 className="mt-4 h-display text-3xl font-semibold sm:text-4xl">
          Aradığınız sayfa bulunamadı
        </h1>
        <p className="mx-auto mt-4 max-w-md text-white/60">
          Sayfa taşınmış ya da hiç var olmamış olabilir. Endişelenmeyin —
          ihtiyacınız olan her şeye anasayfadan ulaşabilirsiniz.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            <Home className="h-4 w-4" />
            Anasayfaya Dön
          </Link>
          <Link href="/iletisim" className="btn-ghost">
            Bize Yazın
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
