import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin";
import { getDashboardData, getPrograms, getServices, getSettings, getUniversities } from "@/lib/content";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { AdminDashboard } from "@/components/AdminDashboard";
import Link from "next/link";
export const dynamic="force-dynamic"; export const metadata={title:"Yönetim Paneli | TD Danışmanlık",robots:{index:false,follow:false}};
export default async function AdminPage(){const user=await getChatGPTUser();if(!user)redirect("/admin/login");const admin=await getAdmin();if(!admin)return <main className="access-denied"><span>TD</span><h1>Bu hesap için erişim tanımlı değil.</h1><p>Yönetici e-mail adresinizin site ayarlarında tanımlı olduğundan emin olun.</p><Link href="/signout-with-chatgpt?return_to=/admin/login">Farklı hesapla giriş yapın</Link></main>;const [settings,services,universities,programs,dashboard]=await Promise.all([getSettings(),getServices(false),getUniversities(false),getPrograms(undefined,false),getDashboardData()]);return <AdminDashboard adminEmail={admin.email} {...{settings,services,universities,programs,dashboard}}/>}
