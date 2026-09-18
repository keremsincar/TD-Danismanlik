import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import { ensureDatabase, rawDatabase } from "@/lib/content";

const types:Record<string,string>={"image/jpeg":"jpg","image/png":"png","image/webp":"webp"};
export async function POST(request:Request) {
  const admin=await getAdmin();
  if(!admin)return NextResponse.json({error:"Yönetici girişi gerekli."},{status:401});
  const origin=request.headers.get("origin");
  if(origin&&origin!==new URL(request.url).origin)return NextResponse.json({error:"İstek doğrulanamadı."},{status:403});
  const form=await request.formData().catch(()=>null);
  const slot=form?.get("slot");const file=form?.get("file");
  if(slot!=="hero"&&slot!=="about")return NextResponse.json({error:"Geçersiz görsel alanı."},{status:400});
  if(!(file instanceof File)||!types[file.type]||file.size>8_000_000||file.size<100)return NextResponse.json({error:"En fazla 8 MB boyutunda JPG, PNG veya WebP yükleyin."},{status:400});
  const bucket=(env as unknown as {MEDIA?:R2Bucket}).MEDIA;
  if(!bucket)return NextResponse.json({error:"Görsel depolama kullanılamıyor."},{status:503});
  const key=`${slot}/${crypto.randomUUID()}.${types[file.type]}`;
  await bucket.put(key,await file.arrayBuffer(),{httpMetadata:{contentType:file.type}});
  const url=`/api/media/${key}`;
  await ensureDatabase();
  const now=new Date().toISOString();
  await rawDatabase().batch([
    rawDatabase().prepare("INSERT INTO home_content (key,value,updated_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at").bind(slot==="hero"?"imageHero":"imageAbout",url,now),
    rawDatabase().prepare("INSERT INTO audit_logs (actor,action,detail,created_at) VALUES (?,?,?,?)").bind(admin.email,"UPDATE_IMAGE",slot,now),
  ]);
  return NextResponse.json({ok:true,url});
}
