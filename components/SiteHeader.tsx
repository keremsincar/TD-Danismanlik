import Link from "@/components/NativeLink";
import type { SiteSettings } from "@/lib/content";

const languages = [{code:"tr",label:"Türkçe"},{code:"en",label:"English"},{code:"ru",label:"Русский"},{code:"ar",label:"العربية"}];

export function SiteHeader({settings,locale="tr"}:{settings:SiteSettings;locale?:string}) {
  const home=`/${locale}`;
  return <header className="site-header elab-header">
    <Link className="brand elab-brand" href={home} aria-label={`${settings.siteName} ana sayfa`}><span className="brand-mark">TD</span><span>{settings.siteName.replace(/^TD\s+/i,"")}</span></Link>
    <details className="elab-main-menu">
      <summary><span className="elab-menu-icon" aria-hidden="true"><i/><i/><i/></span><span>Menü</span></summary>
      <nav className="elab-nav" aria-label="Ana menü">
        <Link href={`${home}#hizmetler`}>Hizmetler <span aria-hidden="true">↗</span></Link>
        <Link href={`${home}#universiteler`}>Üniversiteler <span aria-hidden="true">↗</span></Link>
        <Link href={`${home}#surec`}>Süreç <span aria-hidden="true">↗</span></Link>
        <Link href={`${home}#yorumlar`}>Yorumlar <span aria-hidden="true">↗</span></Link>
        <Link href={`${home}#sss`}>SSS <span aria-hidden="true">↗</span></Link>
        <Link href={`/${locale}/iletisim`}>İletişim <span aria-hidden="true">↗</span></Link>
      </nav>
    </details>
    <div className="header-actions elab-header-actions">
      <details className="language-menu elab-language"><summary aria-label="Dil seçin">{locale.toUpperCase()} <span aria-hidden="true">⌄</span></summary><div>{languages.map(item=><a href={`/${item.code}`} key={item.code} lang={item.code}>{item.label}</a>)}</div></details>
      <Link className="button button-primary header-consult" href={`/${locale}/danismanlik-talebi`}>Danışmanlık talebi <span aria-hidden="true">↗</span></Link>
    </div>
  </header>;
}
