import { notFound } from "next/navigation";
import { PublicHome } from "@/components/PublicHome";
import { getFaqs, getHomeCopy, getReviews, getServices, getSettings, getSiteImages, getUniversities } from "@/lib/content";
import { localizeFaqs, localizeHome } from "@/lib/i18n";
const locales=["tr","en","ru","ar"] as const; type Locale=typeof locales[number];
export const dynamic="force-dynamic";
export async function generateMetadata({params}:{params:Promise<{locale:string}>}){ const {locale}=await params; const settings=await getSettings(); return {title:`${settings.siteName} | Eğitim ve Resmî İşlem Danışmanlığı`,description:settings.heroDescription,alternates:{canonical:`/${locale}`,languages:{tr:"/tr",en:"/en",ru:"/ru",ar:"/ar"}}}; }
export default async function LocaleHome({params}:{params:Promise<{locale:string}>}){ const {locale}=await params;if(!locales.includes(locale as Locale))notFound();const [rawSettings,rawCopy,images,reviews,rawServices,universities,rawFaqs]=await Promise.all([getSettings(),getHomeCopy(),getSiteImages(),getReviews(),getServices(),getUniversities(),getFaqs()]);const {settings,copy:homeCopy,services}=localizeHome(locale,rawSettings,rawCopy,rawServices);const faqs=localizeFaqs(locale,rawFaqs);return <PublicHome {...{settings,homeCopy,images,reviews,services,universities,faqs}} locale={locale as Locale}/>; }
