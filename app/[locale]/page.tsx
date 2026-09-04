import { notFound } from "next/navigation";
import { PublicHome } from "@/components/PublicHome";
import { getFaqs, getPrograms, getServices, getSettings, getUniversities } from "@/lib/content";
const locales=["tr","en","ru","ar"] as const; type Locale=typeof locales[number];
export const dynamic="force-dynamic";
export async function generateMetadata({params}:{params:Promise<{locale:string}>}){ const {locale}=await params; const settings=await getSettings(); return {title:`${settings.siteName} | Eğitim ve Resmî İşlem Danışmanlığı`,description:settings.heroDescription,alternates:{canonical:`/${locale}`,languages:{tr:"/tr",en:"/en",ru:"/ru",ar:"/ar"}}}; }
export default async function LocaleHome({params}:{params:Promise<{locale:string}>}){ const {locale}=await params;if(!locales.includes(locale as Locale))notFound();const [settings,services,universities,programs,faqs]=await Promise.all([getSettings(),getServices(),getUniversities(),getPrograms(),getFaqs()]);return <PublicHome {...{settings,services,universities,programs,faqs}} locale={locale as Locale}/>; }
