import { redirect } from "next/navigation";
import Link from "@/components/NativeLink";
import { getAdmin } from "@/lib/admin";

export const dynamic="force-dynamic";
export const metadata={title:"Giriş Doğrulama | TD Danışmanlık",robots:{index:false,follow:false}};

export default async function VerifyPage({searchParams}:{searchParams:Promise<{challenge?:string;email?:string;error?:string}>}){
  if(await getAdmin())redirect("/admin");
  const {challenge,email,error}=await searchParams;
  if(!challenge)redirect("/admin/login?error=Doğrulama oturumu bulunamadı.");
  return <main className="login-page admin-verify-page">
    <section>
      <Link className="login-brand" href="/"><span>TD</span><b>TD Danışmanlık</b></Link>
      <p className="section-index">İKİ AŞAMALI GİRİŞ</p>
      <h1>E-postanızı<br/><em>onaylayın.</em></h1>
      <p><strong>{email||"Yönetici e-postası"}</strong> adresine 6 haneli güvenlik kodu gönderdik. Kod 10 dakika geçerlidir.</p>
      {error&&<div className="login-error" role="alert">{error}</div>}
      <form className="admin-login-form admin-code-form" action="/api/admin/auth/verify" method="post">
        <input type="hidden" name="challenge" value={challenge}/>
        <label>Güvenlik kodu<input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" minLength={6} maxLength={6} required placeholder="000000"/></label>
        <button className="button button-primary">Girişi doğrula</button>
      </form>
      <Link className="setup-link" href="/admin/login">Giriş ekranına dön</Link>
      <small>Kod doğrulanmadan yönetici oturumu oluşturulmaz. Başarılı girişte hesabınıza ayrıca güvenlik bildirimi gönderilir.</small>
    </section>
    <aside><div><span>01</span><b>Şifre kontrolü</b><p>İlk aşamada yönetici parolanız doğrulanır.</p></div><div><span>02</span><b>E-posta onayı</b><p>Yalnızca yönetici hesabının e-postasına gelen tek kullanımlık kod kabul edilir.</p></div><div><span>03</span><b>Giriş bildirimi</b><p>Başarılı girişin zamanı, IP adresi ve cihaz bilgisi e-posta ile bildirilir.</p></div></aside>
  </main>;
}
