import { redirect } from "next/navigation";
import { getAdmin, getAdminUsers } from "@/lib/admin";
import { getDashboardData, getFaqs, getHomeCopy, getPrograms, getReviews, getServices, getSettings, getSiteImages, getUniversities } from "@/lib/content";
import { AdminDashboard } from "@/components/AdminDashboard";
export const dynamic="force-dynamic"; export const metadata={title:"Yönetim Paneli | TD Danışmanlık",robots:{index:false,follow:false}};
export default async function AdminPage(){const admin=await getAdmin();if(!admin)redirect("/admin/login");const [settings,homeCopy,images,reviews,faqs,services,universities,programs,dashboard,users]=await Promise.all([getSettings(),getHomeCopy(),getSiteImages(),getReviews(false),getFaqs(false),getServices(false),getUniversities(false),getPrograms(undefined,false),getDashboardData(),admin.role==="owner"?getAdminUsers():Promise.resolve([])]);return <AdminDashboard admin={admin} {...{settings,homeCopy,images,reviews,faqs,services,universities,programs,dashboard,users}}/>}
