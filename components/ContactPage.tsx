import Link from "@/components/NativeLink";
import type { SiteSettings } from "@/lib/content";
import { MapEmbed } from "./MapEmbed";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { languageLabels } from "@/lib/i18n";
import { ContactEmailForm } from "./ContactEmailForm";

const copy={
 tr:{hero:"Bir sorunuz mu var?",heroSecond:"Konuşalım.",lead:"Eğitim planınız veya resmî işlemleriniz hakkında konuşmak için bize ulaşın. Size uygun iletişim yolunu seçebilirsiniz.",reach:"Bize ulaşın",meet:"Yeşilköy’de görüşelim.",message:"Mesaj hazırlayın",visit:"Ofis ziyareti",visitBody:"Belge teslimi ve yüz yüze görüşmeler için önceden randevu oluşturmanızı öneririz.",transport:"Toplu taşıma",transportBody:"M1A hattındaki Dünya Ticaret Merkezi–İstanbul Fuar Merkezi durağından ofis bölgesine ulaşabilirsiniz.",directions:"Konumu aç",direct:"Doğrudan e-posta"},
 en:{hero:"Have a question?",heroSecond:"Let's talk.",lead:"Contact us about your education plans or official procedures. Choose the way that works best for you.",reach:"Contact us",meet:"Visit us in Yeşilköy.",message:"Send a message",visit:"Office visits",visitBody:"We recommend arranging an appointment before document delivery or an in-person meeting.",transport:"Public transport",transportBody:"Use the World Trade Center–Istanbul Expo Center stop on the M1A line.",directions:"Open location",direct:"Direct email"},
 ru:{hero:"Есть вопрос?",heroSecond:"Давайте обсудим.",lead:"Свяжитесь с нами по вопросам обучения или официальных процедур. Выберите удобный способ связи.",reach:"Связаться с нами",meet:"Встретимся в Йешилькёе.",message:"Написать сообщение",visit:"Посещение офиса",visitBody:"Для передачи документов и личной встречи рекомендуем заранее записаться.",transport:"Общественный транспорт",transportBody:"Доехать можно до станции World Trade Center–Istanbul Expo Center линии M1A.",directions:"Открыть карту",direct:"Электронная почта"},
 ar:{hero:"هل لديك سؤال؟",heroSecond:"لنتحدث.",lead:"تواصل معنا بشأن خطتك الدراسية أو الإجراءات الرسمية بالطريقة الأنسب لك.",reach:"تواصل معنا",meet:"زرنا في يشيلكوي.",message:"أرسل رسالة",visit:"زيارة المكتب",visitBody:"ننصح بحجز موعد مسبقاً لتسليم المستندات أو الاجتماع المباشر.",transport:"النقل العام",transportBody:"يمكن الوصول عبر محطة مركز التجارة العالمي–مركز إسطنبول للمعارض على خط M1A.",directions:"فتح الموقع",direct:"البريد المباشر"}
} as const;


export function ContactPage({settings,locale}:{settings:SiteSettings;locale:string}) {
  const t=languageLabels(locale),c=copy[(locale in copy?locale:"tr") as keyof typeof copy];
  const whatsapp=`https://wa.me/${settings.whatsapp.replace(/\D/g,"")}?text=${encodeURIComponent("Merhaba TD Danışmanlık, danışmanlık hizmetleriniz hakkında bilgi almak istiyorum.")}`;
  return <main className="contact-page">
    <section className="contact-page-hero"><p className="elab-kicker">TD Danışmanlık / {t.contact}</p><h1>{c.hero}<br/>{c.heroSecond}</h1><p>{c.lead}</p><div><a className="elab-pill elab-pill-blue" href={whatsapp} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={19}/> {t.whatsapp}</a><Link className="elab-pill elab-pill-neutral" href={`/${locale}/danismanlik-talebi`}>{t.request} ↗</Link></div></section>
    <section className="contact-page-details"><div><p className="elab-kicker">{c.reach}</p><h2>{c.meet}</h2><dl><div><dt>{t.address}</dt><dd>{settings.address}</dd></div><div><dt>{t.phone}</dt><dd><a href={`tel:${settings.phone.replace(/\s/g,"")}`}>{settings.phone}</a></dd></div><div><dt>WhatsApp</dt><dd><a href={whatsapp} target="_blank" rel="noopener noreferrer">{c.message} ↗</a></dd></div><div><dt>{c.direct}</dt><dd><a href={`mailto:${settings.email}`}>{settings.email}</a></dd></div></dl><div className="contact-route-notes"><article><strong>{c.visit}</strong><p>{c.visitBody}</p></article><article><strong>{c.transport}</strong><p>{c.transportBody}</p></article></div></div><MapEmbed address={settings.address} locale={locale}/></section>
    <ContactEmailForm locale={locale}/>
  </main>;
}
