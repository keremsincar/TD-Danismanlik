import { PublicHome } from "@/components/PublicHome";
import { getCatalogUniversities, getFaqs, getHomeCopy, getReviews, getServices, getSettings, getSiteImages } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title:"TD Danışmanlık | Eğitim ve Resmî İşlem Danışmanlığı", description:"Üniversite seçiminden ikamet ve vatandaşlık işlemlerine kadar güvenilir, çok dilli danışmanlık." };

export default async function Home(){ const [settings,homeCopy,images,services,universities,faqs,reviews]=await Promise.all([getSettings(),getHomeCopy(),getSiteImages(),getServices(),getCatalogUniversities(),getFaqs(),getReviews()]); return <PublicHome {...{settings,homeCopy,images,services,universities,faqs,reviews}} locale="tr"/>; }
