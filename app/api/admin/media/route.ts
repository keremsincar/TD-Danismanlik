import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import { ensureDatabase, rawDatabase } from "@/lib/content";

const types:Record<string,string>={"image/jpeg":"jpg","image/png":"png","image/webp":"webp"};
function resolveSlot(value:unknown){
  if(value==="hero")return {key:"imageHero",folder:"hero",label:"hero"};
  if(value==="about")return {key:"imageAbout",folder:"about",label:"about"};
  if(typeof value!=="string")return null;
  const match=/^(serviceImage|universityImage|universityLogo):([a-z0-9-]{2,140})$/.exec(value);
  if(!match)return null;
  const folders:Record<string,string>={serviceImage:"service",universityImage:"university-image",universityLogo:"university-logo"};
  return {key:value,folder:`${folders[match[1]]}/${match[2]}`,label:value};
}
export async function POST(request:Request) {
  const admin=await getAdmin();
  if(!admin)return NextResponse.json({error:"Yönetici girişi gerekli."},{status:401});
  const origin=request.headers.get("origin");
  if(origin&&origin!==new URL(request.url).origin)return NextResponse.json({error:"İstek doğrulanamadı."},{status:403});
  const form=await request.formData().catch(()=>null);
  const slot=resolveSlot(form?.get("slot"));const file=form?.get("file");
  if(!slot)return NextResponse.json({error:"Geçersiz görsel alanı."},{status:400});
  if(!(file instanceof File)||!types[file.type]||file.size>8_000_000||file.size<100)return NextResponse.json({error:"En fazla 8 MB boyutunda JPG, PNG veya WebP yükleyin."},{status:400});
  const bucket=(env as unknown as {MEDIA?:R2Bucket}).MEDIA;
  if(!bucket)return NextResponse.json({error:"Görsel depolama kullanılamıyor."},{status:503});
  const key=`${slot.folder}/${crypto.randomUUID()}.${types[file.type]}`;
  await bucket.put(key,await file.arrayBuffer(),{httpMetadata:{contentType:file.type}});
  const url=`/api/media/${key}`;
  await ensureDatabase();
  const now=new Date().toISOString();
  await rawDatabase().batch([
    rawDatabase().prepare("INSERT INTO home_content (key,value,updated_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at").bind(slot.key,url,now),
    rawDatabase().prepare("INSERT INTO audit_logs (actor,action,detail,created_at) VALUES (?,?,?,?)").bind(admin.email,"UPDATE_IMAGE",slot.label,now),
  ]);
  return NextResponse.json({ok:true,url,savedAt:now,persistence:"r2+d1"});
}

export async function DELETE(request:Request){
  const admin=await getAdmin();
  if(!admin)return NextResponse.json({error:"Yönetici girişi gerekli."},{status:401});
  const origin=request.headers.get("origin");
  if(origin&&origin!==new URL(request.url).origin)return NextResponse.json({error:"İstek doğrulanamadı."},{status:403});
  const body=await request.json().catch(()=>null) as {slot?:unknown}|null;
  const slot=resolveSlot(body?.slot);
  if(!slot)return NextResponse.json({error:"Geçersiz görsel alanı."},{status:400});
  await ensureDatabase();
  const current=await rawDatabase().prepare("SELECT value FROM home_content WHERE key=?").bind(slot.key).first<{value:string}>();
  const bucket=(env as unknown as {MEDIA?:R2Bucket}).MEDIA;
  const objectKey=current?.value?.startsWith("/api/media/")?current.value.slice("/api/media/".length):"";
  if(bucket&&objectKey)await bucket.delete(objectKey);
  const now=new Date().toISOString();
  await rawDatabase().batch([
    rawDatabase().prepare("DELETE FROM home_content WHERE key=?").bind(slot.key),
    rawDatabase().prepare("INSERT INTO audit_logs (actor,action,detail,created_at) VALUES (?,?,?,?)").bind(admin.email,"REMOVE_IMAGE",slot.label,now),
  ]);
  return NextResponse.json({ok:true,savedAt:now,persistence:"r2+d1"});
}
