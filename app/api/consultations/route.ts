import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { ensureDatabase, getSettings, rawDatabase } from "@/lib/content";

const clean = (value:unknown,max=500) => typeof value === "string" ? value.trim().slice(0,max) : "";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d][\d\s()-]{7,20}$/;

export async function POST(request:Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) return NextResponse.json({error:"Geçersiz istek."},{status:415});
  const origin=request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({error:"İstek doğrulanamadı."},{status:403});
  const body=await request.json().catch(()=>null) as Record<string,unknown>|null;
  if (!body) return NextResponse.json({error:"Form okunamadı."},{status:400});
  if (clean(body.website)) return NextResponse.json({ok:true});
  const data={name:clean(body.name,100),phone:clean(body.phone,30),whatsapp:clean(body.whatsapp,30),email:clean(body.email,160).toLowerCase(),service:clean(body.service,100),university:clean(body.university,120),program:clean(body.program,120),message:clean(body.message,1200),preferredContact:clean(body.preferredContact,30)||"Telefon"};
  if (data.name.length<2 || !phonePattern.test(data.phone) || !emailPattern.test(data.email) || !data.service || data.message.length<10 || body.kvkk!==true) return NextResponse.json({error:"Lütfen zorunlu alanları doğru doldurun ve KVKK metnini onaylayın."},{status:400});
  await ensureDatabase(); const d1=rawDatabase();
  const ip=request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "anonymous";
  const key=`consult:${ip}`; const now=Date.now(); const limit=await d1.prepare("SELECT count,reset_at AS resetAt FROM rate_limits WHERE key=?").bind(key).first<{count:number;resetAt:number}>();
  if (limit && limit.resetAt>now && limit.count>=5) return NextResponse.json({error:"Çok fazla talep gönderdiniz. Lütfen daha sonra tekrar deneyin."},{status:429});
  if (!limit || limit.resetAt<=now) await d1.prepare("INSERT INTO rate_limits (key,count,reset_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=1,reset_at=excluded.reset_at").bind(key,now+3600000).run(); else await d1.prepare("UPDATE rate_limits SET count=count+1 WHERE key=?").bind(key).run();
  const createdAt=new Date().toISOString();
  await d1.prepare("INSERT INTO consultation_requests (name,phone,whatsapp,email,service,university,program,message,preferred_contact,kvkk_accepted_at,status,admin_note,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,'NEW','',?)").bind(data.name,data.phone,data.whatsapp,data.email,data.service,data.university||null,data.program||null,data.message,data.preferredContact,createdAt,createdAt).run();
  const settings=await getSettings();
  const resend=(env as unknown as {RESEND_API_KEY?:string}).RESEND_API_KEY;
  if (resend) {
    await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${resend}`,"Content-Type":"application/json"},body:JSON.stringify({from:"TD Danışmanlık <bildirim@tddanismanlik.com>",to:[settings.email],subject:`Yeni danışmanlık talebi — ${data.name}`,html:`<h2>Yeni Danışmanlık Talebi</h2><p><b>Ad Soyad:</b> ${escapeHtml(data.name)}</p><p><b>Telefon:</b> ${escapeHtml(data.phone)}</p><p><b>E-mail:</b> ${escapeHtml(data.email)}</p><p><b>Hizmet:</b> ${escapeHtml(data.service)}</p><p><b>Mesaj:</b> ${escapeHtml(data.message)}</p>`})}).catch(()=>null);
  }
  return NextResponse.json({ok:true});
}

function escapeHtml(value:string) { return value.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c] ?? c); }
