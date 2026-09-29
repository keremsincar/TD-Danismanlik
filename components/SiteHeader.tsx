import Link from "@/components/NativeLink";
import type { SiteSettings } from "@/lib/content";
import { languageLabels } from "@/lib/i18n";
import { LanguageMenu } from "./LanguageMenu";

export function SiteHeader({settings,locale="tr"}:{settings:SiteSettings;locale?:string}) {
  const home=`/${locale}`;
  const t=languageLabels(locale);
  return <header className="site-header elab-header">
    <Link className="brand elab-brand" href={home} aria-label={`${settings.siteName} ana sayfa`}><span className="brand-mark">TD</span><span>{settings.siteName.replace(/^TD\s+/i,"")}</span></Link>
    <nav className="elab-nav elab-top-nav" aria-label={t.menu}>
      <Link href={`${home}/hizmetler`}>{t.services}</Link>
      <Link href={`${home}/universiteler`}>{t.universities}</Link>
      <Link href={`${home}/bolumler`}>{t.programs}</Link>
      <Link href={`${home}/surec`}>{t.process}</Link>
      <Link href={`${home}/yorumlar`}>{t.reviews}</Link>
      <Link href={`${home}/sss`}>{t.faq}</Link>
      <Link href={`${home}/iletisim`}>{t.contact}</Link>
      <Link className="top-nav-request" href={`${home}/danismanlik-talebi`}>{t.request}</Link>
    </nav>
    <div className="header-actions elab-header-actions"><LanguageMenu locale={locale}/><Link className="admin-header-link" href="/admin/login">{t.admin}</Link></div>
  </header>;
}
