import type { Metadata } from "next";
import { IBM_Plex_Sans, Manrope, Newsreader } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const sans = Manrope({ variable: "--font-sans", subsets: ["latin"] });
const serif = Newsreader({ variable: "--font-serif", subsets: ["latin"] });
const plex = IBM_Plex_Sans({ variable: "--font-plex", subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"] });

export async function generateMetadata():Promise<Metadata>{const h=await headers();const host=h.get("host")||"tddanismanlik.com";const protocol=host.includes("localhost")?"http":"https";const origin=`${protocol}://${host}`;const title="TD Danışmanlık | Eğitim ve Resmî İşlem Danışmanlığı";const description="Üniversite seçiminden ikamet ve vatandaşlık işlemlerine kadar güvenilir, çok dilli danışmanlık.";return{metadataBase:new URL(origin),title,description,applicationName:"TD Danışmanlık",openGraph:{type:"website",locale:"tr_TR",siteName:"TD Danışmanlık",title,description,url:origin,images:[{url:`${origin}/og.png`,width:1714,height:909,alt:"TD Danışmanlık — Doğru adım. Net bir gelecek."}]},twitter:{card:"summary_large_image",title,description,images:[`${origin}/og.png`]},verification:{google:process.env.GOOGLE_SITE_VERIFICATION},icons:{icon:"/og.png"}}}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr" suppressHydrationWarning><body className={`${sans.variable} ${serif.variable} ${plex.variable}`}>{children}</body></html>;
}
