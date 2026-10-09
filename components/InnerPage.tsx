import Link from "@/components/NativeLink";
import type { SiteSettings } from "@/lib/content";
import { SiteHeader } from "./SiteHeader";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { RevealMotion } from "./RevealMotion";
import { languageLabels } from "@/lib/i18n";
import { CookieBanner } from "./CookieBanner";

const footerCopy={
 tr:{tagline:"Eğitim ve resmî işlemlerde sistematik, şeffaf danışmanlık.",office:"Ofis ve ulaşım",privacy:"Gizlilik Politikası",cookies:"Çerez Politikası",terms:"Kullanım Şartları",location:"İstanbul, Türkiye",call:"Telefon",request:"Talep oluştur",wa:"Merhaba TD Danışmanlık, bilgi almak istiyorum."},
 en:{tagline:"Structured, transparent consultancy for education and official procedures.",office:"Office and directions",privacy:"Privacy Policy",cookies:"Cookie Policy",terms:"Terms of Use",location:"Istanbul, Türkiye",call:"Call",request:"Submit request",wa:"Hello TD Consultancy, I would like to request information."},
 ru:{tagline:"Системное и прозрачное сопровождение обучения и официальных процедур.",office:"Офис и маршрут",privacy:"Политика конфиденциальности",cookies:"Политика cookie",terms:"Условия использования",location:"Стамбул, Турция",call:"Позвонить",request:"Отправить запрос",wa:"Здравствуйте, TD Consultancy. Я хотел(а) бы получить информацию."},
 ar:{tagline:"استشارات منظمة وشفافة للتعليم والمعاملات الرسمية.",office:"المكتب والاتجاهات",privacy:"سياسة الخصوصية",cookies:"سياسة ملفات الارتباط",terms:"شروط الاستخدام",location:"إسطنبول، تركيا",call:"اتصال",request:"إرسال طلب",wa:"مرحباً TD Consultancy، أرغب في طلب المعلومات."},
} as const;

export function InnerPage({settings,locale="tr",crumbs,children}:{settings:SiteSettings;locale?:string;crumbs:{label:string;href?:string}[];children:React.ReactNode}) {
  const t=languageLabels(locale);
  const f=footerCopy[(locale in footerCopy?locale:"tr") as keyof typeof footerCopy];
  const whatsapp=`https://wa.me/${settings.whatsapp.replace(/\D/g,"")}?text=${encodeURIComponent(f.wa)}`;
  const schema={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:crumbs.map((item,i)=>({"@type":"ListItem",position:i+1,name:item.label,item:item.href?`https://tddanismanlik.com${item.href}`:undefined}))};
  return <div className="elab-inner-page" dir={locale==="ar"?"rtl":"ltr"} style={{"--primary":settings.primaryColor,"--accent":settings.accentColor,"--site-heading-font":settings.headingFont==="Newsreader"?"var(--font-serif)":settings.headingFont==="IBM Plex Sans"?"var(--font-plex)":"var(--font-sans)","--site-body-font":settings.bodyFont==="Newsreader"?"var(--font-serif)":settings.bodyFont==="IBM Plex Sans"?"var(--font-plex)":"var(--font-sans)"} as React.CSSProperties}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
    <SiteHeader settings={settings} locale={locale}/><RevealMotion/>
    <div className="breadcrumb">{crumbs.map((item,i)=><span key={`${item.label}-${i}`}>{i>0&&<i>／</i>}{item.href?<Link href={item.href}>{item.label}</Link>:item.label}</span>)}</div>
    {children}
    <footer className="elab-footer inner-elab-footer"><div className="elab-footer-grid"><div><Link className="elab-footer-brand" href={`/${locale}`}>TD <span>DANIŞMANLIK</span></Link><p>{f.tagline}</p></div><div><strong>{t.footerDiscover}</strong><Link href={`/${locale}/hizmetler`}>{t.services}</Link><Link href={`/${locale}/universiteler`}>{t.universities}</Link><Link href={`/${locale}/bolumler`}>{t.programs}</Link><Link href={`/${locale}/yorumlar`}>{t.reviews}</Link><Link href={`/${locale}/sss`}>{t.faq}</Link></div><div><strong>{t.contact}</strong><Link href={`/${locale}/iletisim`}>{f.office}</Link><a href={`tel:${settings.phone.replace(/\s/g,"")}`}>{settings.phone}</a><a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href={`mailto:${settings.email}`}>{settings.email}</a></div><div><strong>{t.footerLegal}</strong><Link href={`/${locale}/kvkk-aydinlatma-metni`}>KVKK</Link><Link href={`/${locale}/gizlilik-politikasi`}>{f.privacy}</Link><Link href={`/${locale}/cerez-politikasi`}>{f.cookies}</Link><Link href={`/${locale}/kullanim-sartlari`}>{f.terms}</Link></div></div><div className="elab-footer-bottom"><span>© {new Date().getFullYear()} TD Danışmanlık</span><span>{f.location}</span></div></footer>
    <a className="whatsapp-float" href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp üzerinden TD Danışmanlık’a yazın"><WhatsAppIcon/></a>
    <div className="mobile-cta"><a href={`tel:${settings.phone.replace(/\s/g,"")}`}>{f.call}</a><a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a><Link href={`/${locale}/danismanlik-talebi`}>{f.request}</Link></div>
    <CookieBanner locale={locale}/>
  </div>;
}
