import { redirect } from "next/navigation";
import Link from "@/components/NativeLink";
import { chatGPTSignInPath, getChatGPTUser } from "@/app/chatgpt-auth";
import { hasAdminUsers, PRIMARY_ADMIN_EMAIL } from "@/lib/admin";
import { env } from "cloudflare:workers";

export const dynamic="force-dynamic";
export const metadata={title:"Ana Yönetici Kurulumu | TD Danışmanlık",robots:{index:false,follow:false}};

export default async function Setup({searchParams}:{searchParams:Promise<{error?:string}>}) {
  if(await hasAdminUsers())redirect("/admin/login");
  const [{error},user]=await Promise.all([searchParams,getChatGPTUser()]);
  if(!user)redirect(chatGPTSignInPath("/admin/setup"));
  const bootstrap=(env as unknown as {ADMIN_EMAIL?:string}).ADMIN_EMAIL?.trim().toLowerCase();
  if(!bootstrap||user.email.toLowerCase()!==bootstrap)return <main className="access-denied"><span>TD</span><h1>Kurulum yetkisi bulunmuyor.</h1><p>İlk kurulum yalnızca sitenin mevcut sahibi tarafından tamamlanabilir.</p><Link href="/signout-with-chatgpt?return_to=/admin/setup">Farklı hesapla doğrulayın</Link></main>;
  return <main className="login-page setup-page"><section><Link className="login-brand" href="/"><span>TD</span><b>TD Danışmanlık</b></Link><p className="section-index">TEK SEFERLİK KURULUM</p><h1>Ana yönetici<br/><em>şifresini belirleyin.</em></h1><p><strong>{PRIMARY_ADMIN_EMAIL}</strong> ana yönetici hesabı olarak oluşturulacak. Bundan sonraki girişler bu e-posta ve belirleyeceğiniz şifreyle yapılacak.</p>{error&&<div className="login-error" role="alert">{error}</div>}<form className="admin-login-form" action="/api/admin/auth/setup" method="post"><label>Yeni şifre<input name="password" type="password" autoComplete="new-password" minLength={12} required/><small>En az 12 karakter kullanın.</small></label><label>Yeni şifre tekrar<input name="confirm" type="password" autoComplete="new-password" minLength={12} required/></label><button className="button button-primary">Hesabı oluştur ve giriş yap </button></form></section><aside><div><span>✓</span><b>Sahip doğrulandı</b><p>{user.email} hesabıyla güvenli sahip doğrulaması tamamlandı.</p></div><div><span>✓</span><b>Şifreli giriş</b><p>Sonraki girişlerde e-posta ve şifre kullanılacak.</p></div><div><span>✓</span><b>Yetki yönetimi</b><p>Dashboard’dan yönetici ve editör hesapları oluşturabileceksiniz.</p></div></aside></main>;
}
