import { PublicHome } from "@/components/PublicHome";
import { getFaqs, getPrograms, getServices, getSettings, getUniversities } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title:"TD Danışmanlık | Eğitim ve Resmî İşlem Danışmanlığı", description:"Üniversite seçiminden ikamet ve vatandaşlık işlemlerine kadar güvenilir, çok dilli danışmanlık." };

export default async function Home(){ const [settings,services,universities,programs,faqs]=await Promise.all([getSettings(),getServices(),getUniversities(),getPrograms(),getFaqs()]); return <PublicHome {...{settings,services,universities,programs,faqs}} locale="tr"/>; }
