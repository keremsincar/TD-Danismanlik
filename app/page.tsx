import { PublicHome } from "@/components/PublicHome";
import { getFaqs, getHomeCopy, getReviews, getServices, getSettings, getSiteImages, getUniversities } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title:"TD Danışmanlık | Eğitim ve Resmî İşlem Danışmanlığı", description:"Üniversite seçiminden ikamet ve vatandaşlık işlemlerine kadar güvenilir, çok dilli danışmanlık." };

export default async function Home(){ const [settings,homeCopy,images,reviews,services,universities,faqs]=await Promise.all([getSettings(),getHomeCopy(),getSiteImages(),getReviews(),getServices(),getUniversities(),getFaqs()]); return <PublicHome {...{settings,homeCopy,images,reviews,services,universities,faqs}} locale="tr"/>; }
