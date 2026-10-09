import Link from "@/components/NativeLink";
import type { SiteSettings } from "@/lib/content";
import { MapEmbed } from "./MapEmbed";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { languageLabels } from "@/lib/i18n";
import { ContactEmailForm } from "./ContactEmailForm";

const copy={
 tr:{hero:"İletişim ve danışmanlık.",lead:"Eğitim planı, üniversite başvurusu ve resmî işlemler için doğru kanaldan bize ulaşın.",reach:"İletişim",meet:"Ofis, telefon ve e-posta.",message:"WhatsApp üzerinden yazın",visit:"Randevulu görüşme",visitBody:"Belge teslimi ve yüz yüze değerlendirmeler randevu ile gerçekleştirilir.",transport:"Ulaşım",transportBody:"Ofis, M1A hattındaki Dünya Ticaret Merkezi–İstanbul Fuar Merkezi durağına yürüme mesafesindedir.",directions:"Yol tarifi",direct:"E-posta",primary:"Danışmanlık talebi",secondary:"WhatsApp"},
 en:{hero:"Contact and consultancy.",lead:"Reach us through the right channel for education planning, university applications and official procedures.",reach:"Contact",meet:"Office, phone and email.",message:"Message on WhatsApp",visit:"Office appointment",visitBody:"Document delivery and in-person assessments are conducted by appointment.",transport:"Getting here",transportBody:"The office is within walking distance of the World Trade Center–Istanbul Expo Center stop on the M1A line.",directions:"Directions",direct:"Email",primary:"Request a consultation",secondary:"WhatsApp"},
 ru:{hero:"Контакты и консультации.",lead:"Свяжитесь с нами по удобному каналу по вопросам обучения, поступления и официальных процедур.",reach:"Контакты",meet:"Офис, телефон и e-mail.",message:"Написать в WhatsApp",visit:"Приём в офисе",visitBody:"Передача документов и очные консультации проводятся по предварительной записи.",transport:"Как добраться",transportBody:"Офис находится в пешей доступности от станции World Trade Center–Istanbul Expo Center линии M1A.",directions:"Маршрут",direct:"Электронная почта",primary:"Запросить консультацию",secondary:"WhatsApp"},
 ar:{hero:"التواصل والاستشارات.",lead:"تواصل معنا عبر القناة المناسبة للتخطيط الدراسي والتقديم الجامعي والمعاملات الرسمية.",reach:"التواصل",meet:"المكتب والهاتف والبريد الإلكتروني.",message:"راسلنا عبر واتساب",visit:"موعد في المكتب",visitBody:"يتم تسليم المستندات والتقييم الحضوري بموعد مسبق.",transport:"الوصول",transportBody:"يقع المكتب على مسافة مشي من محطة مركز التجارة العالمي–مركز إسطنبول للمعارض على خط M1A.",directions:"الاتجاهات",direct:"البريد الإلكتروني",primary:"طلب استشارة",secondary:"واتساب"}
} as const;
const whatsappCopy={
 tr:"Merhaba TD Danışmanlık, danışmanlık hizmetleriniz hakkında bilgi almak istiyorum.",
 en:"Hello TD Consultancy, I would like information about your consultancy services.",
 ru:"Здравствуйте, TD Consultancy. Я хотел(а) бы получить информацию о ваших консультационных услугах.",
 ar:"مرحباً TD Consultancy، أرغب في الحصول على معلومات عن خدماتكم الاستشارية.",
} as const;

export function ContactPage({settings,locale}:{settings:SiteSettings;locale:string}) {
  const t=languageLabels(locale),c=copy[(locale in copy?locale:"tr") as keyof typeof copy];
  const wa=whatsappCopy[(locale in whatsappCopy?locale:"tr") as keyof typeof whatsappCopy];
  const whatsapp=`https://wa.me/${settings.whatsapp.replace(/\D/g,"")}?text=${encodeURIComponent(wa)}`;
  return <main className="contact-page contact-premium">
    <section className="contact-page-hero">
      <div className="contact-hero-copy"><p className="elab-kicker">TD DANIŞMANLIK · {t.contact}</p><h1>{c.hero}</h1><p>{c.lead}</p></div>
      <div className="contact-hero-actions"><Link className="contact-primary-action" href={`/${locale}/danismanlik-talebi`}><span>{c.primary}</span><b aria-hidden="true">↗</b></Link><a className="contact-whatsapp-action" href={whatsapp} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={18}/><span>{c.secondary}</span></a></div>
    </section>

    <section className="contact-page-details">
      <div className="contact-details-copy">
        <p className="elab-kicker">{c.reach}</p><h2>{c.meet}</h2>
        <dl>
          <div><dt>{t.address}</dt><dd>{settings.address}</dd></div>
          <div><dt>{t.phone}</dt><dd><a href={`tel:${settings.phone.replace(/\s/g,"")}`}>{settings.phone}</a></dd></div>
          <div><dt>{c.direct}</dt><dd><a href={`mailto:${settings.email}`}>{settings.email}</a></dd></div>
          <div><dt>WhatsApp</dt><dd><a href={whatsapp} target="_blank" rel="noopener noreferrer">{c.message}</a></dd></div>
        </dl>
        <div className="contact-route-notes"><article><span>01</span><strong>{c.visit}</strong><p>{c.visitBody}</p></article><article><span>02</span><strong>{c.transport}</strong><p>{c.transportBody}</p></article></div>
      </div>
      <div className="contact-map-shell"><MapEmbed address={settings.address} locale={locale}/></div>
    </section>

    <section className="contact-direct-form"><div><p className="elab-kicker">{c.direct}</p><h2>{locale==="tr"?"Bize doğrudan yazın.":locale==="en"?"Write to us directly.":locale==="ru"?"Напишите нам напрямую.":"راسلنا مباشرة."}</h2></div><ContactEmailForm locale={locale}/></section>
  </main>;
}
