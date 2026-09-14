import Link from "@/components/NativeLink";
import type { SiteSettings } from "@/lib/content";
import { SiteHeader } from "./SiteHeader";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function InnerPage({settings,locale="tr",crumbs,children}:{settings:SiteSettings;locale?:string;crumbs:{label:string;href?:string}[];children:React.ReactNode}) {
  const whatsapp=`https://wa.me/${settings.whatsapp.replace(/\D/g,"")}?text=${encodeURIComponent("Merhaba TD Danışmanlık, bilgi almak istiyorum.")}`;
  const schema={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:crumbs.map((item,i)=>({"@type":"ListItem",position:i+1,name:item.label,item:item.href?`https://tddanismanlik.com${item.href}`:undefined}))};
  return <div className="elab-inner-page" dir={locale==="ar"?"rtl":"ltr"} style={{"--primary":settings.primaryColor,"--accent":settings.accentColor,"--site-heading-font":settings.headingFont==="Newsreader"?"var(--font-serif)":settings.headingFont==="IBM Plex Sans"?"var(--font-plex)":"var(--font-sans)","--site-body-font":settings.bodyFont==="Newsreader"?"var(--font-serif)":settings.bodyFont==="IBM Plex Sans"?"var(--font-plex)":"var(--font-sans)"} as React.CSSProperties}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
    <SiteHeader settings={settings} locale={locale}/>
    <div className="breadcrumb">{crumbs.map((item,i)=><span key={`${item.label}-${i}`}>{i>0&&<i>／</i>}{item.href?<Link href={item.href}>{item.label}</Link>:item.label}</span>)}</div>
    {children}
    <footer className="elab-footer inner-elab-footer"><div className="elab-footer-grid"><div><Link className="elab-footer-brand" href={`/${locale}`}>TD <span>DANIŞMANLIK</span></Link><p>Eğitim ve resmî işlemlerde net, özenli danışmanlık.</p></div><div><strong>Keşfedin</strong><Link href={`/${locale}#hizmetler`}>Hizmetler</Link><Link href={`/${locale}#universiteler`}>Üniversiteler</Link><Link href={`/${locale}#yorumlar`}>Yorumlar</Link><Link href={`/${locale}#sss`}>Sık sorulanlar</Link></div><div><strong>İletişim</strong><Link href={`/${locale}/iletisim`}>Ofis ve harita</Link><a href={`tel:${settings.phone.replace(/\s/g,"")}`}>{settings.phone}</a><a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href={`mailto:${settings.email}`}>{settings.email}</a></div><div><strong>Yasal</strong><Link href={`/${locale}/kvkk-aydinlatma-metni`}>KVKK</Link><Link href={`/${locale}/gizlilik-politikasi`}>Gizlilik</Link><Link href={`/${locale}/cerez-politikasi`}>Çerezler</Link><Link href={`/${locale}/kullanim-sartlari`}>Kullanım Şartları</Link></div></div><div className="elab-footer-bottom"><span>© {new Date().getFullYear()} TD Danışmanlık</span><span>İstanbul, Türkiye</span></div></footer>
    <a className="whatsapp-float" href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp üzerinden TD Danışmanlık’a yazın"><WhatsAppIcon/></a>
    <div className="mobile-cta"><a href={`tel:${settings.phone.replace(/\s/g,"")}`}>Ara</a><a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a><Link href={`/${locale}/danismanlik-talebi`}>Talep oluştur</Link></div>
  </div>;
}
