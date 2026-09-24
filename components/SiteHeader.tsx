import Link from "@/components/NativeLink";
import type { SiteSettings } from "@/lib/content";
import { languageLabels, shortLanguageLabels } from "@/lib/i18n";
import { LanguageMenu } from "./LanguageMenu";

export function SiteHeader({settings,locale="tr"}:{settings:SiteSettings;locale?:string}) {
  const home=`/${locale}`;
  const t=languageLabels(locale);
  const short=shortLanguageLabels(locale);
  const aria=locale==="en"?"Main navigation":locale==="ru"?"Основная навигация":locale==="ar"?"التنقل الرئيسي":"Ana menü";
  const explore=locale==="en"?"Explore":locale==="ru"?"Перейти":locale==="ar"?"استكشف":"İncele";
  const corporate=locale==="en"?"Company":locale==="ru"?"О компании":locale==="ar"?"عن الشركة":"Kurumsal";
  const brandTagline=locale==="en"?"Education & official procedures":locale==="ru"?"Образование и документы":locale==="ar"?"التعليم والإجراءات الرسمية":"Eğitim & resmî işlemler";

  return <header className="site-header elab-header td-header">
    <Link className="brand elab-brand td-brand" href={home} aria-label={`${settings.siteName} — ${t.home}`}>
      <span className="td-brand-monogram">TD</span>
      <span className="td-brand-name">Danışmanlık<small>{brandTagline}</small></span>
    </Link>

    <nav className="td-desktop-nav" aria-label={aria}>
      <Link href={home}>{t.home}</Link>
      <details className="td-nav-popover">
        <summary>{t.services}<span aria-hidden="true">⌄</span></summary>
        <div className="td-nav-panel td-nav-panel-services">
          <span className="td-nav-panel-label">{t.services}</span>
          <div>
            <Link href={`${home}/hizmetler/universite-bolum-secimi`}><b>{short.choice}</b><small>01</small></Link>
            <Link href={`${home}/hizmetler/kayit-sureci`}><b>{short.registration}</b><small>02</small></Link>
            <Link href={`${home}/hizmetler/ikamet-izni`}><b>{short.residence}</b><small>03</small></Link>
            <Link href={`${home}/hizmetler`} className="td-nav-panel-all"><b>{t.allServices}</b><span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </details>
      <details className="td-nav-popover">
        <summary>{t.universities}<span aria-hidden="true">⌄</span></summary>
        <div className="td-nav-panel td-nav-panel-universities">
          <span className="td-nav-panel-label">{t.educationKicker}</span>
          <div>
            <Link href={`${home}/universiteler`}><b>{t.allUniversities}</b><small>01</small></Link>
            <Link href={`${home}/bolumler`}><b>{t.allPrograms}</b><small>02</small></Link>
            <Link href={`${home}/danismanlik-talebi`} className="td-nav-panel-all"><b>{t.request}</b><span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </details>
      <Link href={`${home}/surec`}>{t.process}</Link>
      <Link href={`${home}/yorumlar`}>{t.reviews}</Link>
      <Link href={`${home}/sss`}>{t.faq}</Link>
      <Link href={`${home}/iletisim`}>{t.contact}</Link>
    </nav>

    <div className="header-actions elab-header-actions td-header-actions">
      <LanguageMenu locale={locale}/>
      <Link className="button button-primary header-consult td-consult" href={`${home}/danismanlik-talebi`}>{t.request}<span aria-hidden="true">↗</span></Link>
      <details className="td-mobile-menu">
        <summary aria-label={t.menu}><span>{t.menu}</span><i aria-hidden="true"/><i aria-hidden="true"/></summary>
        <nav className="td-mobile-panel" aria-label={aria}>
          <div className="td-mobile-panel-head"><span>{corporate}</span><small>TD / 2026</small></div>
          <div className="td-mobile-links">
            <Link href={home}><span>01</span><b>{t.home}</b></Link>
            <Link href={`${home}/hizmetler`}><span>02</span><b>{t.services}</b><small>{explore} ↗</small></Link>
            <div className="td-mobile-sublinks"><Link href={`${home}/hizmetler/universite-bolum-secimi`}>{short.choice}</Link><Link href={`${home}/hizmetler/kayit-sureci`}>{short.registration}</Link><Link href={`${home}/hizmetler/ikamet-izni`}>{short.residence}</Link></div>
            <Link href={`${home}/universiteler`}><span>03</span><b>{t.universities}</b><small>{explore} ↗</small></Link>
            <div className="td-mobile-sublinks"><Link href={`${home}/universiteler`}>{t.allUniversities}</Link><Link href={`${home}/bolumler`}>{t.allPrograms}</Link></div>
            <Link href={`${home}/surec`}><span>04</span><b>{t.process}</b></Link>
            <Link href={`${home}/yorumlar`}><span>05</span><b>{t.reviews}</b></Link>
            <Link href={`${home}/sss`}><span>06</span><b>{t.faq}</b></Link>
            <Link href={`${home}/iletisim`}><span>07</span><b>{t.contact}</b></Link>
          </div>
          <div className="td-mobile-panel-foot">
            <LanguageMenu locale={locale}/>
            <Link href={`${home}/danismanlik-talebi`}>{t.request}<span aria-hidden="true">↗</span></Link>
            <Link href="/admin/login">{t.admin}</Link>
          </div>
        </nav>
      </details>
    </div>
  </header>;
}
