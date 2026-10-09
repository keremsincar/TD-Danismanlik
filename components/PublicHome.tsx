/* eslint-disable @next/next/no-img-element -- Local, size-bounded photography is served directly by the Site. */
import Link from "@/components/NativeLink";
import type { HomeCopy, Service, SiteImages, SiteSettings, University } from "@/lib/content";
import { CookieBanner } from "./CookieBanner";
import { ConsentAnalytics } from "./ConsentAnalytics";
import { SiteHeader } from "./SiteHeader";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { RevealMotion } from "./RevealMotion";
import { languageLabels } from "@/lib/i18n";
import { FaqAccordion } from "./FaqAccordion";
import { AdvisorBot } from "./AdvisorBot";
import { UniversityMark } from "./UniversityMark";

type FAQ={id:number;question:string;answer:string;category:string;active:number;sortOrder:number};
const local={
 tr:{discover:"Bölümünü keşfet",discoverLead:"Bölüm, üniversite ve eğitim dili seçeneklerini tek ekranda karşılaştırın.",query:"Bölüm adı yazın",all:"Tüm üniversiteler",go:"Bölümleri göster",featured:"Öne çıkan üniversiteler",legal:["KVKK Aydınlatma Metni","Gizlilik Politikası","Çerez Politikası","Kullanım Şartları"],about:"Hakkımızda",wa:"Merhaba TD Danışmanlık, hizmetleriniz hakkında bilgi almak istiyorum."},
 en:{discover:"Discover your program",discoverLead:"Compare programs, universities, teaching languages and tuition information in one place.",query:"Enter a program",all:"All universities",go:"Show programs",featured:"Featured universities",legal:["Personal Data Notice","Privacy Policy","Cookie Policy","Terms of Use"],about:"About us",wa:"Hello TD Consultancy, I would like information about your services."},
 ru:{discover:"Найдите свою программу",discoverLead:"Сравните программы, университеты, языки обучения и стоимость в одном месте.",query:"Введите программу",all:"Все университеты",go:"Показать программы",featured:"Популярные университеты",legal:["Уведомление о данных","Политика конфиденциальности","Политика cookie","Условия использования"],about:"О нас",wa:"Здравствуйте, TD Consultancy. Я хотел(а) бы получить информацию о ваших услугах."},
 ar:{discover:"اكتشف تخصصك",discoverLead:"قارن البرامج والجامعات ولغات الدراسة ومعلومات الرسوم في مكان واحد.",query:"اكتب اسم البرنامج",all:"كل الجامعات",go:"عرض البرامج",featured:"جامعات مميزة",legal:["إشعار حماية البيانات","سياسة الخصوصية","سياسة ملفات الارتباط","شروط الاستخدام"],about:"من نحن",wa:"مرحباً TD Consultancy، أرغب في الحصول على معلومات عن خدماتكم."}
} as const;

export function PublicHome({settings,homeCopy,images,services,universities,faqs,locale="tr"}:{settings:SiteSettings;homeCopy:HomeCopy;images:SiteImages;services:Service[];universities:University[];faqs:FAQ[];locale?:string}) {
  const home=`/${locale}`,t=languageLabels(locale),l=local[(locale in local?locale:"tr") as keyof typeof local];
  const whatsapp=`https://wa.me/${settings.whatsapp.replace(/\D/g,"")}?text=${encodeURIComponent(l.wa)}`;
  const heroBreak=settings.heroTitle.indexOf(". ");
  const universityCompare=(a:University,b:University)=>a.name.trim().localeCompare(b.name.trim(),"tr-TR",{sensitivity:"base"});
  const featuredUniversities=[...universities].filter(u=>u.featured===1).sort(universityCompare).slice(0,8);
  const visibleUniversities=(featuredUniversities.length?featuredUniversities:[...universities].sort(universityCompare).slice(0,8));
  const featuredLabel=featuredUniversities.length?l.featured:(locale==="tr"?"Üniversitelerden bazıları":locale==="en"?"Some universities":locale==="ru"?"Некоторые университеты":"بعض الجامعات");
  const faqSchema={"@context":"https://schema.org","@type":"FAQPage",mainEntity:faqs.slice(0,3).map(f=>({"@type":"Question",name:f.question,acceptedAnswer:{"@type":"Answer",text:f.answer}}))};
  return <div className="site-page elab-page compact-home" dir={locale==="ar"?"rtl":"ltr"} style={{"--primary":settings.primaryColor,"--accent":settings.accentColor,"--site-heading-font":settings.headingFont==="Newsreader"?"var(--font-serif)":settings.headingFont==="IBM Plex Sans"?"var(--font-plex)":"var(--font-sans)","--site-body-font":settings.bodyFont==="Newsreader"?"var(--font-serif)":settings.bodyFont==="IBM Plex Sans"?"var(--font-plex)":"var(--font-sans)"} as React.CSSProperties}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema)}}/><SiteHeader settings={settings} locale={locale}/><RevealMotion/>
    <main>
      <section className="elab-hero" aria-labelledby="hero-title"><div className="elab-hero-copy"><p className="elab-kicker">{homeCopy.heroEyebrow}</p><h1 id="hero-title">{heroBreak>=0?<><span className="elab-hero-first">{settings.heroTitle.slice(0,heroBreak+1)}</span><span className="elab-hero-second">{settings.heroTitle.slice(heroBreak+2)}</span></>:settings.heroTitle}</h1><p className="elab-hero-lead">{settings.heroDescription}</p><div className="elab-hero-actions"><Link className="elab-pill elab-pill-blue" href={`/${locale}/danismanlik-talebi`}>{settings.ctaText} </Link><a className="elab-pill elab-pill-whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={19}/>{t.whatsapp}</a></div></div><div className="elab-hero-photo"><img src={images.hero} alt="Üniversite danışmanlığı" loading="eager" fetchPriority="high" decoding="async"/></div></section>

<section className="elab-section elab-services" id="hizmetler"><div className="elab-section-head"><p className="elab-kicker">{t.serviceKicker}</p><h2>{homeCopy.servicesTitle}</h2><p>{homeCopy.servicesIntro}</p></div><div className="elab-service-grid">{services.map(service=><Link className="elab-service-card" href={`/${locale}/hizmetler/${service.slug}`} key={service.id}><div className="service-card-photo"><img src={service.image} alt="" loading="lazy" decoding="async"/></div><div className="elab-service-card-top"><span>{service.title}</span></div><div><p>{service.summary}</p><span className="elab-card-cta">{t.viewService}</span></div></Link>)}</div><Link className="elab-section-more action-link" href={`/${locale}/hizmetler`}>{t.allServices}</Link></section>

      <section className="elab-section elab-finder" id="universiteler"><div className="elab-section-head"><p className="elab-kicker">{featuredLabel}</p><h2>{homeCopy.finderTitle}</h2><p>{homeCopy.finderIntro}</p></div><div className="elab-university-grid">{visibleUniversities.map(university=><Link href={`/${locale}/universiteler/${university.slug}`} key={university.id}><div className="home-university-meta"><UniversityMark name={university.name} logoUrl={university.logoUrl}/><span>{university.city}</span></div><strong>{university.name}</strong><b>{t.viewUniversity}</b></Link>)}</div><div className="home-catalog-actions"><Link className="elab-section-more action-link" href={`/${locale}/bolumler`}>{t.allPrograms}</Link></div></section>

      <section className="elab-section elab-faq home-faq-compact" id="sss"><div><p className="elab-kicker">{t.faqKicker}</p><h2>{t.qPrompt}</h2><p>{t.qLead}</p><Link className="elab-section-more" href={`/${locale}/sss`}>{t.allFaq}</Link></div><FaqAccordion className="home-faq-accordion" items={faqs.slice(0,5)}/></section>

      <section className="compact-contact"><div><p className="elab-kicker">{t.contactKicker}</p><h2>{homeCopy.contactTitle}</h2><p>{homeCopy.contactBody}</p></div><div><a className="elab-pill elab-pill-whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={19}/> {t.whatsapp}</a><Link className="elab-pill elab-pill-neutral" href={`/${locale}/iletisim`}>{t.contact}</Link></div></section>
    </main>
    <footer className="elab-footer"><div className="elab-footer-grid"><div><Link className="elab-footer-brand" href={home}>TD <span>DANIŞMANLIK</span></Link><p>{settings.email}<br/>{settings.phone}</p></div><div><strong>{t.footerDiscover}</strong><Link href={`${home}/hizmetler`}>{t.services}</Link><Link href={`${home}/universiteler`}>{t.universities}</Link><Link href={`${home}/bolumler`}>{t.programs}</Link><Link href={`${home}/sss`}>{t.faq}</Link></div><div><strong>{t.footerCorporate}</strong><Link href={`/${locale}/hakkimizda`}>{l.about}</Link><Link href={`/${locale}/iletisim`}>{t.contact}</Link><Link href={`/${locale}/danismanlik-talebi`}>{t.request}</Link></div><div><strong>{t.footerLegal}</strong><Link href={`/${locale}/kvkk-aydinlatma-metni`}>{l.legal[0]}</Link><Link href={`/${locale}/gizlilik-politikasi`}>{l.legal[1]}</Link><Link href={`/${locale}/cerez-politikasi`}>{l.legal[2]}</Link><Link href={`/${locale}/kullanim-sartlari`}>{l.legal[3]}</Link></div></div><div className="elab-footer-bottom"><span>© {new Date().getFullYear()} TD Danışmanlık</span></div></footer>
    <AdvisorBot locale={locale} whatsapp={whatsapp} questions={faqs.slice(0,3).map(item=>item.question)}/><a className="whatsapp-float" href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><WhatsAppIcon/></a><div className="mobile-cta"><a href={`tel:${settings.phone.replace(/\s/g,"")}`}>{t.phone}</a><a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a><Link href={`/${locale}/danismanlik-talebi`}>{t.request}</Link></div><CookieBanner locale={locale}/><ConsentAnalytics measurementId={process.env.NEXT_PUBLIC_GA_ID}/>
  </div>;
}
