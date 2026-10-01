import Link from "@/components/NativeLink";
import type { SiteSettings } from "@/lib/content";
import { MapEmbed } from "./MapEmbed";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { languageLabels } from "@/lib/i18n";
import { ContactEmailForm } from "./ContactEmailForm";

const copy={
 tr:{hero:"İletişim ve",heroSecond:"danışmanlık.",lead:"Eğitim planı, üniversite başvurusu ve resmî işlemlere ilişkin taleplerinizi ekibimize iletebilirsiniz.",reach:"İletişim bilgileri",meet:"Ofis ve ulaşım bilgileri.",message:"WhatsApp üzerinden iletişim",visit:"Randevulu ofis görüşmesi",visitBody:"Belge teslimi ve yüz yüze değerlendirmeler randevu ile gerçekleştirilmektedir.",transport:"Toplu taşıma",transportBody:"Ofis, M1A hattındaki Dünya Ticaret Merkezi–İstanbul Fuar Merkezi durağına yürüme mesafesindedir.",directions:"Yol tarifi",direct:"E-posta"},
 en:{hero:"Contact and",heroSecond:"consultancy.",lead:"Submit enquiries concerning education planning, university applications and official procedures to our team.",reach:"Contact details",meet:"Office and transport information.",message:"Contact via WhatsApp",visit:"Appointments at the office",visitBody:"Document delivery and in-person assessments are conducted by appointment.",transport:"Public transport",transportBody:"The office is within walking distance of the World Trade Center–Istanbul Expo Center stop on the M1A line.",directions:"Directions",direct:"Email"},
 ru:{hero:"Контакты и",heroSecond:"консультации.",lead:"Направьте команде запрос по вопросам обучения, поступления в университет или официальных процедур.",reach:"Контактные данные",meet:"Офис и транспорт.",message:"Связаться через WhatsApp",visit:"Приём в офисе",visitBody:"Передача документов и очные консультации проводятся по предварительной записи.",transport:"Общественный транспорт",transportBody:"Офис находится в пешей доступности от станции World Trade Center–Istanbul Expo Center линии M1A.",directions:"Маршрут",direct:"Электронная почта"},
 ar:{hero:"التواصل و",heroSecond:"الاستشارات.",lead:"يمكنك إرسال طلباتك المتعلقة بالتخطيط الدراسي والتقديم الجامعي والمعاملات الرسمية إلى فريقنا.",reach:"بيانات التواصل",meet:"معلومات المكتب والوصول.",message:"التواصل عبر واتساب",visit:"المراجعة في المكتب",visitBody:"يتم تسليم المستندات والتقييم الحضوري بموعد مسبق.",transport:"النقل العام",transportBody:"يقع المكتب على مسافة مشي من محطة مركز التجارة العالمي–مركز إسطنبول للمعارض على خط M1A.",directions:"الاتجاهات",direct:"البريد الإلكتروني"}
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
  return <main className="contact-page">
    <section className="contact-page-hero"><p className="elab-kicker">TD Danışmanlık / {t.contact}</p><h1>{c.hero}<br/>{c.heroSecond}</h1><p>{c.lead}</p><div><a className="elab-pill elab-pill-whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={19}/> {t.whatsapp}</a><Link className="elab-pill elab-pill-neutral" href={`/${locale}/danismanlik-talebi`}>{t.request}</Link></div></section>
    <section className="contact-page-details"><div><p className="elab-kicker">{c.reach}</p><h2>{c.meet}</h2><dl><div><dt>{t.address}</dt><dd>{settings.address}</dd></div><div><dt>{t.phone}</dt><dd><a href={`tel:${settings.phone.replace(/\s/g,"")}`}>{settings.phone}</a></dd></div><div><dt>WhatsApp</dt><dd><a href={whatsapp} target="_blank" rel="noopener noreferrer">{c.message}</a></dd></div><div><dt>{c.direct}</dt><dd><a href={`mailto:${settings.email}`}>{settings.email}</a></dd></div></dl><div className="contact-route-notes"><article><strong>{c.visit}</strong><p>{c.visitBody}</p></article><article><strong>{c.transport}</strong><p>{c.transportBody}</p></article></div></div><MapEmbed address={settings.address} locale={locale}/></section>
    <ContactEmailForm locale={locale}/>
  </main>;
}
