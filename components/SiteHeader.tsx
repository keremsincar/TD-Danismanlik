import Link from "@/components/NativeLink";
import type { SiteSettings } from "@/lib/content";
import { languageLabels, shortLanguageLabels } from "@/lib/i18n";
import { LanguageMenu } from "./LanguageMenu";

export function SiteHeader({settings,locale="tr"}:{settings:SiteSettings;locale?:string}) {
  const home=`/${locale}`;
  const t=languageLabels(locale);
  const short=shortLanguageLabels(locale);
  return <header className="site-header elab-header">
    <Link className="brand elab-brand" href={home} aria-label={`${settings.siteName} ana sayfa`}><span className="brand-mark">TD</span><span>{settings.siteName.replace(/^TD\s+/i,"")}</span></Link>
    <details className="elab-main-menu">
      <summary><span className="elab-menu-icon" aria-hidden="true"><i/><i/><i/></span><span>{t.menu}</span></summary>
      <nav className="elab-nav" aria-label="Ana menü">
        <div className="nav-group"><Link href={`${home}/hizmetler`}>{t.services} <span aria-hidden="true">↗</span></Link><div className="nav-submenu"><Link href={`${home}/hizmetler/universite-bolum-secimi`}>{short.choice}</Link><Link href={`${home}/hizmetler/kayit-sureci`}>{short.registration}</Link><Link href={`${home}/hizmetler/ikamet-izni`}>{short.residence}</Link><Link href={`${home}/hizmetler`}>{t.allServices}</Link></div></div>
        <div className="nav-group"><Link href={`${home}/universiteler`}>{t.universities} <span aria-hidden="true">↗</span></Link><div className="nav-submenu"><Link href={`${home}/universiteler`}>{t.universities}</Link><Link href={`${home}/bolumler`}>{t.programs}</Link></div></div>
        <Link href={`${home}/surec`}>{t.process} <span aria-hidden="true">↗</span></Link>
        <Link href={`${home}/yorumlar`}>{t.reviews} <span aria-hidden="true">↗</span></Link>
        <Link href={`${home}/sss`}>{t.faq} <span aria-hidden="true">↗</span></Link>
        <Link href={`/${locale}/iletisim`}>{t.contact} <span aria-hidden="true">↗</span></Link>
        <Link href="/admin/login">{t.admin} <span aria-hidden="true">↗</span></Link>
      </nav>
    </details>
    <div className="header-actions elab-header-actions">
      <LanguageMenu locale={locale}/>
      <Link className="button button-primary header-consult" href={`/${locale}/danismanlik-talebi`}>{t.request} <span aria-hidden="true">↗</span></Link>
    </div>
  </header>;
}
