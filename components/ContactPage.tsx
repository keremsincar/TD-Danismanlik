import Link from "@/components/NativeLink";
import type { SiteSettings } from "@/lib/content";
import { MapEmbed } from "./MapEmbed";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { languageLabels } from "@/lib/i18n";

const copy={
 tr:{hero:"Bir sorunuz mu var?",heroSecond:"Konuşalım.",lead:"Eğitim planınız veya resmî işlemleriniz hakkında konuşmak için bize ulaşın. Size uygun iletişim yolunu seçebilirsiniz.",reach:"Bize ulaşın",meet:"Yeşilköy’de görüşelim.",message:"Mesaj hazırlayın"},
 en:{hero:"Have a question?",heroSecond:"Let's talk.",lead:"Contact us about your education plans or official procedures. Choose the way that works best for you.",reach:"Contact us",meet:"Visit us in Yeşilköy.",message:"Send a message"},
 ru:{hero:"Есть вопрос?",heroSecond:"Давайте обсудим.",lead:"Свяжитесь с нами по вопросам обучения или официальных процедур. Выберите удобный способ связи.",reach:"Связаться с нами",meet:"Встретимся в Йешилькёе.",message:"Написать сообщение"},
 ar:{hero:"هل لديك سؤال؟",heroSecond:"لنتحدث.",lead:"تواصل معنا بشأن خطتك الدراسية أو الإجراءات الرسمية بالطريقة الأنسب لك.",reach:"تواصل معنا",meet:"زرنا في يشيلكوي.",message:"أرسل رسالة"}
} as const;


export function ContactPage({settings,locale}:{settings:SiteSettings;locale:string}) {
  const t=languageLabels(locale),c=copy[(locale in copy?locale:"tr") as keyof typeof copy];
  const whatsapp=`https://wa.me/${settings.whatsapp.replace(/\D/g,"")}?text=${encodeURIComponent("Merhaba TD Danışmanlık, danışmanlık hizmetleriniz hakkında bilgi almak istiyorum.")}`;
  return <main className="contact-page">
    <section className="contact-page-hero"><p className="elab-kicker">TD Danışmanlık / {t.contact}</p><h1>{c.hero}<br/>{c.heroSecond}</h1><p>{c.lead}</p><div><a className="elab-pill elab-pill-blue" href={whatsapp} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={19}/> {t.whatsapp}</a><Link className="elab-pill elab-pill-neutral" href={`/${locale}/danismanlik-talebi`}>{t.request} ↗</Link></div></section>
    <section className="contact-page-details"><div><p className="elab-kicker">{c.reach}</p><h2>{c.meet}</h2><dl><div><dt>{t.address}</dt><dd>{settings.address}</dd></div><div><dt>{t.phone}</dt><dd><a href={`tel:${settings.phone.replace(/\s/g,"")}`}>{settings.phone}</a></dd></div><div><dt>WhatsApp</dt><dd><a href={whatsapp} target="_blank" rel="noopener noreferrer">{c.message} ↗</a></dd></div><div><dt>{t.email}</dt><dd><a href={`mailto:${settings.email}`}>{settings.email}</a></dd></div></dl></div><MapEmbed address={settings.address} locale={locale}/></section>
  </main>;
}
