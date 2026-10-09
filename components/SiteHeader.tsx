import Link from "@/components/NativeLink";
import type { SiteSettings } from "@/lib/content";
import { languageLabels } from "@/lib/i18n";
import { LanguageMenu } from "./LanguageMenu";

export function SiteHeader({settings,locale="tr"}:{settings:SiteSettings;locale?:string}) {
  const home=`/${locale}`;
  const t=languageLabels(locale);
  const preference={tr:"Tercih Robotu",en:"Program Matcher",ru:"Подбор программы",ar:"اختيار التخصص"}[locale]||"Tercih Robotu";
  const links=[
    [`${home}/hizmetler`,t.services],
    [`${home}/universiteler`,t.universities],
    [`${home}/bolumler`,t.programs],
    [`${home}/tercih-robotu`,preference],
    [`${home}/surec`,t.process],
    [`${home}/yorumlar`,t.reviews],
    [`${home}/sss`,t.faq],
    [`${home}/iletisim`,t.contact],
  ] as const;
  return <header className="site-header elab-header">
    <Link className="brand elab-brand" href={home} aria-label={`${settings.siteName} ana sayfa`}><span className="brand-mark">TD</span><span>{settings.siteName.replace(/^TD\s+/i,"")}</span></Link>
    <nav className="elab-nav elab-top-nav" aria-label={t.menu}>
      {links.map(([href,label])=><Link href={href} key={href}>{label}</Link>)}
      <Link className="top-nav-request" href={`${home}/danismanlik-talebi`}>{t.request}</Link>
    </nav>
    <div className="header-actions elab-header-actions"><LanguageMenu locale={locale}/></div>
    <details className="mobile-site-menu">
      <summary aria-label={t.menu}><span>{t.menu}</span><b aria-hidden="true">＋</b></summary>
      <div className="mobile-site-menu-panel">
        <nav>{links.map(([href,label],index)=><Link href={href} key={href}><span>{String(index+1).padStart(2,"0")}</span>{label}</Link>)}<Link className="mobile-request" href={`${home}/danismanlik-talebi`}>{t.request}<b aria-hidden="true">↗</b></Link></nav>
        <LanguageMenu locale={locale}/>
      </div>
    </details>
  </header>;
}
