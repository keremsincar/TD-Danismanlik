import { cookies } from "next/headers";
import { env } from "cloudflare:workers";
import { ensureDatabase, rawDatabase } from "@/lib/content";

export const ADMIN_COOKIE = "td_admin_session";
export const PRIMARY_ADMIN_EMAIL = "info@tddanismanlik.com";
const SESSION_DAYS = 7;
const PASSWORD_ITERATIONS = 100_000;
const LEGACY_PASSWORD_ITERATIONS = 210_000;

export type AdminRole = "owner" | "admin" | "editor";
export type AdminAccount = {
  id:number; email:string; name:string; role:AdminRole; active:number;
  createdAt:string; updatedAt:string; lastLoginAt:string|null;
};

const encoder = new TextEncoder();
const base64 = (bytes:Uint8Array) => btoa(String.fromCharCode(...bytes));
const unbase64 = (value:string) => Uint8Array.from(atob(value), char=>char.charCodeAt(0));
const randomToken = (size:number) => { const bytes=new Uint8Array(size);crypto.getRandomValues(bytes);return base64(bytes).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,""); };

async function sha256(value:string) {
  return base64(new Uint8Array(await crypto.subtle.digest("SHA-256",encoder.encode(value))));
}

async function derivePassword(password:string,salt:Uint8Array,iterations:number) {
  const key=await crypto.subtle.importKey("raw",encoder.encode(password),"PBKDF2",false,["deriveBits"]);
  const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt:Uint8Array.from(salt).buffer,iterations,hash:"SHA-256"},key,256);
  return base64(new Uint8Array(bits));
}

export async function makePassword(password:string,saltValue?:string) {
  const salt=saltValue?unbase64(saltValue):crypto.getRandomValues(new Uint8Array(16));
  const hash=await derivePassword(password,salt,PASSWORD_ITERATIONS);
  return {hash:`pbkdf2$${PASSWORD_ITERATIONS}$${hash}`,salt:base64(salt)};
}

export async function verifyPassword(password:string,salt:string,expected:string) {
  const parts=expected.split("$"),versioned=parts.length===3&&parts[0]==="pbkdf2",iterations=versioned?Number(parts[1]):LEGACY_PASSWORD_ITERATIONS,target=versioned?parts[2]:expected;
  if(!Number.isInteger(iterations)||iterations<50_000||iterations>1_000_000)return false;
  const actual=await derivePassword(password,unbase64(salt),iterations);
  if(actual.length!==target.length)return false;
  let difference=0;for(let i=0;i<actual.length;i++)difference|=actual.charCodeAt(i)^target.charCodeAt(i);
  return difference===0;
}

let bootstrapReady:Promise<void>|null=null;
async function ensureBootstrapOwner(){
  await ensureDatabase();
  if(bootstrapReady)return bootstrapReady;
  bootstrapReady=(async()=>{const d1=rawDatabase(),runtime=env as unknown as {ADMIN_BOOTSTRAP_PASSWORD?:string;ADMIN_BOOTSTRAP_REVISION?:string};const password=runtime.ADMIN_BOOTSTRAP_PASSWORD||"",revision=runtime.ADMIN_BOOTSTRAP_REVISION||"";if(password.length<12||!revision)return;const marker=`BOOTSTRAP_OWNER_${revision}`;if(await d1.prepare("SELECT id FROM audit_logs WHERE action=? LIMIT 1").bind(marker).first())return;const {hash,salt}=await makePassword(password),now=new Date().toISOString(),existing=await d1.prepare("SELECT id FROM admin_users WHERE email=?").bind(PRIMARY_ADMIN_EMAIL).first<{id:number}>();if(existing){await d1.batch([d1.prepare("UPDATE admin_users SET name=?,password_hash=?,password_salt=?,role='owner',active=1,updated_at=? WHERE id=?").bind("TD Danışmanlık",hash,salt,now,existing.id),d1.prepare("DELETE FROM admin_sessions WHERE user_id=?").bind(existing.id),d1.prepare("INSERT INTO audit_logs (actor,action,detail,created_at) VALUES (?,?,?,?)").bind("system",marker,"Ana yönetici hesabı güvenli biçimde etkinleştirildi",now)]);}else{await d1.batch([d1.prepare("INSERT INTO admin_users (email,name,password_hash,password_salt,role,active,created_by,created_at,updated_at) VALUES (?,?,?,?, 'owner',1,?,?,?)").bind(PRIMARY_ADMIN_EMAIL,"TD Danışmanlık",hash,salt,"secure-bootstrap",now,now),d1.prepare("INSERT INTO audit_logs (actor,action,detail,created_at) VALUES (?,?,?,?)").bind("system",marker,"Ana yönetici hesabı güvenli biçimde oluşturuldu",now)]);}})().catch(error=>{console.error("Admin hesabı başlatılamadı",error instanceof Error?error.message:String(error));});
  return bootstrapReady;
}

export async function hasAdminUsers() {
  await ensureBootstrapOwner();
  const row=await rawDatabase().prepare("SELECT COUNT(*) AS count FROM admin_users").first<{count:number}>();
  return Boolean(row?.count);
}

export async function getAdmin():Promise<AdminAccount|null> {
  await ensureBootstrapOwner();
  const token=(await cookies()).get(ADMIN_COOKIE)?.value;
  if(!token)return null;
  const tokenHash=await sha256(token);
  return await rawDatabase().prepare("SELECT u.id,u.email,u.name,u.role,u.active,u.created_at AS createdAt,u.updated_at AS updatedAt,u.last_login_at AS lastLoginAt FROM admin_sessions s JOIN admin_users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.active=1").bind(tokenHash,new Date().toISOString()).first<AdminAccount>();
}

export async function getAdminUsers():Promise<AdminAccount[]> {
  await ensureBootstrapOwner();
  return (await rawDatabase().prepare("SELECT id,email,name,role,active,created_at AS createdAt,updated_at AS updatedAt,last_login_at AS lastLoginAt FROM admin_users ORDER BY CASE role WHEN 'owner' THEN 0 WHEN 'admin' THEN 1 ELSE 2 END,name").all<AdminAccount>()).results;
}

export async function getNotificationAdminEmails():Promise<string[]> {
  await ensureBootstrapOwner();
  const row=await rawDatabase().prepare("SELECT email FROM admin_users WHERE active=1 AND role IN ('owner','admin') ORDER BY CASE WHEN last_login_at IS NULL THEN 1 ELSE 0 END,last_login_at DESC,CASE role WHEN 'owner' THEN 0 ELSE 1 END,id LIMIT 1").first<{email:string}>();
  return row?.email?.trim()?[row.email.trim().toLowerCase()]:[];
}

export async function createAdminSession(userId:number) {
  await ensureDatabase();
  const token=randomToken(32),tokenHash=await sha256(token),now=new Date(),expires=new Date(now.getTime()+SESSION_DAYS*86400000);
  await rawDatabase().batch([
    rawDatabase().prepare("INSERT INTO admin_sessions (token_hash,user_id,expires_at,created_at) VALUES (?,?,?,?)").bind(tokenHash,userId,expires.toISOString(),now.toISOString()),
    rawDatabase().prepare("UPDATE admin_users SET last_login_at=?,updated_at=? WHERE id=?").bind(now.toISOString(),now.toISOString(),userId),
    rawDatabase().prepare("DELETE FROM admin_sessions WHERE expires_at<=?").bind(now.toISOString()),
  ]);
  return {token,expires};
}

async function ensureAdminLoginChallengeTable(){
  await ensureDatabase();
  await rawDatabase().prepare(`CREATE TABLE IF NOT EXISTS admin_login_challenges (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    email TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    ip TEXT NOT NULL,
    user_agent TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  )`).run();
}

function maskEmail(email:string){
  const [local,domain]=email.split("@");
  if(!domain)return email;
  const visible=local.slice(0,Math.min(2,local.length));
  return `${visible}${"*".repeat(Math.max(3,local.length-visible.length))}@${domain}`;
}

async function sendSecurityEmail(to:string,subject:string,html:string){
  const runtime=env as unknown as {RESEND_API_KEY?:string};
  if(!runtime.RESEND_API_KEY)return false;
  const response=await fetch("https://api.resend.com/emails",{
    method:"POST",
    headers:{Authorization:`Bearer ${runtime.RESEND_API_KEY}`,"Content-Type":"application/json"},
    body:JSON.stringify({from:"TD Danışmanlık <bildirim@tddanismanlik.com>",to:[to],subject,html})
  }).catch(()=>null);
  return Boolean(response?.ok);
}

export async function beginAdminLoginApproval(user:AdminAccount,ip:string,userAgent:string){
  await ensureAdminLoginChallengeTable();
  const code=String((crypto.getRandomValues(new Uint32Array(1))[0]%900000)+100000);
  const id=randomToken(24);
  const codeHash=await sha256(`${id}:${code}`);
  const now=new Date();
  const expires=new Date(now.getTime()+10*60_000);
  await rawDatabase().batch([
    rawDatabase().prepare("DELETE FROM admin_login_challenges WHERE user_id=? OR expires_at<=?").bind(user.id,now.toISOString()),
    rawDatabase().prepare("INSERT INTO admin_login_challenges (id,user_id,email,code_hash,ip,user_agent,expires_at,attempts,created_at) VALUES (?,?,?,?,?,?,?,?,?)").bind(id,user.id,user.email,codeHash,ip,userAgent.slice(0,500),expires.toISOString(),0,now.toISOString())
  ]);
  const sent=await sendSecurityEmail(
    user.email,
    "TD Danışmanlık yönetici girişi doğrulama kodu",
    `<h2>Yönetici girişi doğrulaması</h2><p>TD Danışmanlık yönetim paneline giriş yapılmak isteniyor.</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p><p>Bu kod 10 dakika geçerlidir.</p><p><b>IP:</b> ${ip.replace(/[<>&"]/g,"")}</p><p>Bu giriş size ait değilse şifrenizi değiştirin ve aktif oturumları sonlandırın.</p>`
  );
  if(!sent){
    await rawDatabase().prepare("DELETE FROM admin_login_challenges WHERE id=?").bind(id).run();
    return {error:"Güvenli giriş kodu e-posta ile gönderilemedi. E-posta servisi ayarlarını kontrol edin."} as const;
  }
  return {challengeId:id,maskedEmail:maskEmail(user.email)} as const;
}

export async function approveAdminLogin(challengeId:string,code:string,ip:string){
  await ensureAdminLoginChallengeTable();
  const now=new Date().toISOString();
  const challenge=await rawDatabase().prepare("SELECT id,user_id AS userId,email,code_hash AS codeHash,ip,expires_at AS expiresAt,attempts,user_agent AS userAgent FROM admin_login_challenges WHERE id=?").bind(challengeId).first<{id:string;userId:number;email:string;codeHash:string;ip:string;expiresAt:string;attempts:number;userAgent:string}>();
  if(!challenge||challenge.expiresAt<=now){
    if(challenge)await rawDatabase().prepare("DELETE FROM admin_login_challenges WHERE id=?").bind(challengeId).run();
    return {error:"Doğrulama isteğinin süresi doldu. Lütfen yeniden giriş yapın."} as const;
  }
  if(challenge.attempts>=5)return {error:"Çok fazla hatalı kod denemesi yapıldı. Lütfen yeniden giriş yapın."} as const;
  if(challenge.ip!==ip)return {error:"Giriş doğrulaması farklı bir ağdan tamamlanamaz. Lütfen yeniden giriş yapın."} as const;
  const actual=await sha256(`${challengeId}:${code.trim()}`);
  let difference=actual.length===challenge.codeHash.length?0:1;
  if(!difference)for(let i=0;i<actual.length;i++)difference|=actual.charCodeAt(i)^challenge.codeHash.charCodeAt(i);
  if(difference!==0){
    await rawDatabase().prepare("UPDATE admin_login_challenges SET attempts=attempts+1 WHERE id=?").bind(challengeId).run();
    return {error:"Doğrulama kodu hatalı."} as const;
  }
  await rawDatabase().prepare("DELETE FROM admin_login_challenges WHERE id=?").bind(challengeId).run();
  const user=await rawDatabase().prepare("SELECT id,email,name,role,active,created_at AS createdAt,updated_at AS updatedAt,last_login_at AS lastLoginAt FROM admin_users WHERE id=? AND active=1").bind(challenge.userId).first<AdminAccount>();
  if(!user)return {error:"Yönetici hesabı artık aktif değil."} as const;
  return {user,userAgent:challenge.userAgent} as const;
}

export async function sendAdminLoginNotice(user:AdminAccount,ip:string,userAgent:string){
  const when=new Date().toLocaleString("tr-TR",{timeZone:"Europe/Istanbul"});
  await sendSecurityEmail(
    user.email,
    "TD Danışmanlık yönetici paneline giriş yapıldı",
    `<h2>Başarılı yönetici girişi</h2><p><b>Hesap:</b> ${user.email}</p><p><b>Tarih:</b> ${when}</p><p><b>IP:</b> ${ip.replace(/[<>&"]/g,"")}</p><p><b>Cihaz:</b> ${userAgent.replace(/[<>&"]/g,"").slice(0,300)}</p><p>Bu giriş size ait değilse hemen şifrenizi değiştirin ve oturumları sonlandırın.</p>`
  );
}

export async function authenticateAdmin(email:string,password:string,requestKey:string) {
  await ensureBootstrapOwner();const d1=rawDatabase(),now=Date.now(),key=`admin-login:${requestKey}:${email}`;
  const limit=await d1.prepare("SELECT count,reset_at AS resetAt FROM rate_limits WHERE key=?").bind(key).first<{count:number;resetAt:number}>();
  if(limit&&limit.resetAt>now&&limit.count>=8)return {error:"Çok fazla deneme yapıldı. Lütfen 15 dakika sonra tekrar deneyin."} as const;
  const user=await d1.prepare("SELECT id,email,name,role,active,password_hash AS passwordHash,password_salt AS passwordSalt,created_at AS createdAt,updated_at AS updatedAt,last_login_at AS lastLoginAt FROM admin_users WHERE email=?").bind(email).first<AdminAccount&{passwordHash:string;passwordSalt:string}>();
  const valid=Boolean(user?.active)&&Boolean(user&&await verifyPassword(password,user.passwordSalt,user.passwordHash));
  if(!valid||!user){const resetAt=limit&&limit.resetAt>now?limit.resetAt:now+15*60_000;const count=limit&&limit.resetAt>now?limit.count+1:1;await d1.prepare("INSERT INTO rate_limits (key,count,reset_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET count=excluded.count,reset_at=excluded.reset_at").bind(key,count,resetAt).run();return {error:"E-posta veya şifre hatalı."} as const;}
  await d1.prepare("DELETE FROM rate_limits WHERE key=?").bind(key).run();
  return {user} as const;
}

export async function createOwner(password:string,createdBy:string) {
  await ensureDatabase();if(await hasAdminUsers())throw new Error("Yönetici hesabı zaten oluşturulmuş.");
  const {hash,salt}=await makePassword(password),now=new Date().toISOString();
  const result=await rawDatabase().prepare("INSERT INTO admin_users (email,name,password_hash,password_salt,role,active,created_by,created_at,updated_at) VALUES (?,?,?,?, 'owner',1,?,?,?) RETURNING id").bind(PRIMARY_ADMIN_EMAIL,"TD Danışmanlık",hash,salt,createdBy,now,now).first<{id:number}>();
  if(!result)throw new Error("Ana yönetici hesabı oluşturulamadı.");return result.id;
}

export const adminCookieOptions=(expires:Date)=>({httpOnly:true,secure:true,sameSite:"lax" as const,path:"/",expires});

export async function revokeAdminSession() {
  const store=await cookies(),token=store.get(ADMIN_COOKIE)?.value;
  if(token){await ensureDatabase();await rawDatabase().prepare("DELETE FROM admin_sessions WHERE token_hash=?").bind(await sha256(token)).run();}
}
