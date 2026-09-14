import Link from "next/link";
import type { SiteSettings } from "@/lib/content";
import { MapEmbed } from "./MapEmbed";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function ContactPage({settings,locale}:{settings:SiteSettings;locale:string}) {
  const whatsapp=`https://wa.me/${settings.whatsapp.replace(/\D/g,"")}?text=${encodeURIComponent("Merhaba TD Danışmanlık, danışmanlık hizmetleriniz hakkında bilgi almak istiyorum.")}`;
  return <main className="contact-page">
    <section className="contact-page-hero"><p className="elab-kicker">TD Danışmanlık / İletişim</p><h1>BİR MERHABA<br/>İLE BAŞLAYALIM.</h1><p>Eğitim planınız veya resmî işlemleriniz hakkında konuşmak için bize ulaşın. Size uygun iletişim yolunu seçebilirsiniz.</p><div><a className="elab-pill elab-pill-blue" href={whatsapp} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={19}/> WhatsApp’tan yazın</a><Link className="elab-pill elab-pill-neutral" href={`/${locale}/danismanlik-talebi`}>Danışmanlık talebi ↗</Link></div></section>
    <section className="contact-page-details"><div><p className="elab-kicker">Bize ulaşın</p><h2>İSTANBUL’DA<br/>BULUŞALIM.</h2><dl><div><dt>Adres</dt><dd>{settings.address}</dd></div><div><dt>Telefon</dt><dd><a href={`tel:${settings.phone.replace(/\s/g,"")}`}>{settings.phone}</a></dd></div><div><dt>WhatsApp</dt><dd><a href={whatsapp} target="_blank" rel="noopener noreferrer">Mesaj hazırlayın ↗</a></dd></div><div><dt>E-posta</dt><dd><a href={`mailto:${settings.email}`}>{settings.email}</a></dd></div><div><dt>Çalışma saatleri</dt><dd>{settings.hours}</dd></div></dl></div><MapEmbed address={settings.address}/></section>
  </main>;
}
