import Link from "next/link";
import { ChromeScene } from "@/components/v2/ChromeScene";
import { ActOne } from "@/components/v2/ActOne";
import { ServiceStages } from "@/components/v2/ServiceStages";
import {
  Manifesto,
  ServicesIndex,
  Numbers,
  FinalCTA,
  FooterV2,
} from "@/components/v2/sections";

function TopBar() {
  return (
    <header className="v2-topbar">
      <Link href="/v2" className="v2-label" data-cursor="hot">
        E&nbsp;TRUE
      </Link>
      <span className="v2-pill hidden sm:inline-flex">Tasarım prototipi</span>
      <Link href="/iletisim" className="v2-label" data-cursor="hot">
        İletişim
      </Link>
    </header>
  );
}

export default function V2Page() {
  return (
    <>
      <TopBar />
      <ChromeScene />
      <div className="relative z-10">
        <ActOne />
        <div className="v2-seam" />
        <Manifesto />
        <ServicesIndex />
        <div className="v2-seam-up" />
        <ServiceStages />
        <div className="v2-seam" />
        <Numbers />
        <div className="v2-seam-up" />
        <FinalCTA />
        <FooterV2 />
      </div>
    </>
  );
}
