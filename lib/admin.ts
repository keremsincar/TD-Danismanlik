import { cookies } from "next/headers";
import { env } from "cloudflare:workers";
import { ensureDatabase, rawDatabase } from "@/lib/content";

export const ADMIN_COOKIE = "td_admin_session";
export const PRIMARY_ADMIN_EMAIL = "info@tddanismanlik.com";
const SESSION_DAYS = 7;
const PASSWORD_ITERATIONS = 210_000;

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

export async function makePassword(password:string,saltValue?:string) {
  const salt=saltValue?unbase64(saltValue):crypto.getRandomValues(new Uint8Array(16));
  const key=await crypto.subtle.importKey("raw",encoder.encode(password),"PBKDF2",false,["deriveBits"]);
  const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt,iterations:PASSWORD_ITERATIONS,hash:"SHA-256"},key,256);
  return {hash:base64(new Uint8Array(bits)),salt:base64(salt)};
}

export async function verifyPassword(password:string,salt:string,expected:string) {
  const actual=(await makePassword(password,salt)).hash;
  if(actual.length!==expected.length)return false;
  let difference=0;for(let i=0;i<actual.length;i++)difference|=actual.charCodeAt(i)^expected.charCodeAt(i);
  return difference===0;
}

let bootstrapReady:Promise<void>|null=null;
async function ensureBootstrapOwner(){
  await ensureDatabase();
  if(bootstrapReady)return bootstrapReady;
  bootstrapReady=(async()=>{const d1=rawDatabase(),runtime=env as unknown as {ADMIN_BOOTSTRAP_PASSWORD?:string;ADMIN_BOOTSTRAP_REVISION?:string};const password=runtime.ADMIN_BOOTSTRAP_PASSWORD||"",revision=runtime.ADMIN_BOOTSTRAP_REVISION||"";if(password.length<12||!revision)return;const marker=`BOOTSTRAP_OWNER_${revision}`;if(await d1.prepare("SELECT id FROM audit_logs WHERE action=? LIMIT 1").bind(marker).first())return;const {hash,salt}=await makePassword(password),now=new Date().toISOString(),existing=await d1.prepare("SELECT id FROM admin_users WHERE email=?").bind(PRIMARY_ADMIN_EMAIL).first<{id:number}>();if(existing){await d1.batch([d1.prepare("UPDATE admin_users SET name=?,password_hash=?,password_salt=?,role='owner',active=1,updated_at=? WHERE id=?").bind("TD Danışmanlık",hash,salt,now,existing.id),d1.prepare("DELETE FROM admin_sessions WHERE user_id=?").bind(existing.id),d1.prepare("INSERT INTO audit_logs (actor,action,detail,created_at) VALUES (?,?,?,?)").bind("system",marker,"Ana yönetici hesabı güvenli biçimde etkinleştirildi",now)]);}else{await d1.batch([d1.prepare("INSERT INTO admin_users (email,name,password_hash,password_salt,role,active,created_by,created_at,updated_at) VALUES (?,?,?,?, 'owner',1,?,?,?)").bind(PRIMARY_ADMIN_EMAIL,"TD Danışmanlık",hash,salt,"secure-bootstrap",now,now),d1.prepare("INSERT INTO audit_logs (actor,action,detail,created_at) VALUES (?,?,?,?)").bind("system",marker,"Ana yönetici hesabı güvenli biçimde oluşturuldu",now)]);}})();
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
