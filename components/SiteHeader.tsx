import Link from "next/link";
import type { SiteSettings } from "@/lib/content";

const languages = [{code:"tr",label:"Türkçe"},{code:"en",label:"English"},{code:"ru",label:"Русский"},{code:"ar",label:"العربية"}];

export function SiteHeader({settings,locale="tr"}:{settings:SiteSettings;locale?:string}) {
  const home=`/${locale}`;
  return <header className="site-header elab-header">
    <Link className="brand elab-brand" href={home} aria-label={`${settings.siteName} ana sayfa`}><span className="brand-mark">TD</span><span>{settings.siteName.replace(/^TD\s+/i,"")}</span></Link>
    <nav className="desktop-nav elab-nav" aria-label="Ana menü">
      <Link href={`${home}#hizmetler`}>Hizmetler</Link>
      <Link href={`${home}#universiteler`}>Üniversiteler</Link>
      <Link href={`${home}#surec`}>Süreç</Link>
      <Link href={`${home}#yorumlar`}>Yorumlar</Link>
      <Link href={`${home}#sss`}>SSS</Link>
      <Link href={`/${locale}/iletisim`}>İletişim</Link>
    </nav>
    <div className="header-actions elab-header-actions">
      <details className="language-menu elab-language"><summary aria-label="Dil seçin">{locale.toUpperCase()} <span aria-hidden="true">⌄</span></summary><div>{languages.map(item=><a href={`/${item.code}`} key={item.code} lang={item.code}>{item.label}</a>)}</div></details>
      <Link className="button button-primary header-consult" href={`/${locale}/danismanlik-talebi`}>Danışmanlık talebi <span aria-hidden="true">↗</span></Link>
    </div>
  </header>;
}
