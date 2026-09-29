import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import { defaultHomeCopy, ensureDatabase, rawDatabase } from "@/lib/content";

const clean=(v:unknown,max=2000)=>typeof v==="string"?v.trim().slice(0,max):"";
const slugify=(value:string)=>value.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ı/g,"i").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

export async function POST(request:Request) {
  const admin=await getAdmin(); if(!admin) return NextResponse.json({error:"Yetkisiz erişim."},{status:401});
  const origin=request.headers.get("origin"); if(origin&&origin!==new URL(request.url).origin) return NextResponse.json({error:"İstek doğrulanamadı."},{status:403});
  const body=await request.json().catch(()=>null) as Record<string,unknown>|null; if(!body) return NextResponse.json({error:"İstek okunamadı."},{status:400});
  await ensureDatabase(); const d1=rawDatabase(); const action=clean(body.action,40); const now=new Date().toISOString();
  if(action==="settings") {
    const siteName=clean(body.siteName,80),heroTitle=clean(body.heroTitle,140),heroDescription=clean(body.heroDescription,500),ctaText=clean(body.ctaText,80),phone=clean(body.phone,30),whatsapp=clean(body.whatsapp,30),address=clean(body.address,300),hours=clean(body.hours,100),email=clean(body.email,160),headingFont=clean(body.headingFont,30),bodyFont=clean(body.bodyFont,30),primaryColor=clean(body.primaryColor,10),accentColor=clean(body.accentColor,10);
    if(!siteName||!heroTitle||!heroDescription||!ctaText||!email) return NextResponse.json({error:"Zorunlu alanları doldurun."},{status:400});
    await d1.prepare("UPDATE site_settings SET site_name=?,hero_title=?,hero_description=?,cta_text=?,phone=?,whatsapp=?,address=?,hours=?,email=?,heading_font=?,body_font=?,primary_color=?,accent_color=?,updated_at=? WHERE id=1").bind(siteName,heroTitle,heroDescription,ctaText,phone,whatsapp,address,hours,email,headingFont,bodyFont,primaryColor,accentColor,now).run();
    await log(admin.email,"UPDATE_SETTINGS","Site ayarları güncellendi",now); return NextResponse.json({ok:true,savedAt:now,persistence:"d1"});
  }
  if(action==="homeCopy") {
    const fields=Object.keys(defaultHomeCopy) as (keyof typeof defaultHomeCopy)[];
    const values=fields.map(key=>({key,value:clean(body[key],700)}));
    if(values.some(item=>!item.value)) return NextResponse.json({error:"Tüm ana sayfa metinlerini doldurun."},{status:400});
    await d1.batch(values.map(item=>d1.prepare("INSERT INTO home_content (key,value,updated_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at").bind(item.key,item.value,now)));
    await log(admin.email,"UPDATE_HOME_COPY","Ana sayfa yazıları güncellendi",now); return NextResponse.json({ok:true,savedAt:now,persistence:"d1"});
  }
  if(action==="review") {
    const id=Number(body.id)||0,author=clean(body.author,100),context=clean(body.context,100),quote=clean(body.quote,700),isExample=body.isExample===true?1:0,active=body.active===false?0:1;
    if(!author||!context||!quote) return NextResponse.json({error:"Yorum alanlarını doldurun."},{status:400});
    if(id) await d1.prepare("UPDATE reviews SET author=?,context=?,quote=?,is_example=?,active=?,updated_at=? WHERE id=?").bind(author,context,quote,isExample,active,now,id).run();
    else await d1.prepare("INSERT INTO reviews (author,context,quote,is_example,active,sort_order,updated_at) VALUES (?,?,?,?,?,99,?)").bind(author,context,quote,isExample,active,now).run();
    await log(admin.email,id?"UPDATE_REVIEW":"CREATE_REVIEW",author,now); return NextResponse.json({ok:true,savedAt:now,persistence:"d1"});
  }
  if(action==="faq") {
    const id=Number(body.id)||0,question=clean(body.question,300),answer=clean(body.answer,1600),category=clean(body.category,80)||"Genel",active=body.active===false?0:1,sortOrder=Number(body.sortOrder)||99;
    if(!question||!answer) return NextResponse.json({error:"Soru ve yanıtı doldurun."},{status:400});
    if(id) await d1.prepare("UPDATE faqs SET question=?,answer=?,category=?,active=?,sort_order=? WHERE id=?").bind(question,answer,category,active,sortOrder,id).run();
    else await d1.prepare("INSERT INTO faqs (question,answer,category,active,sort_order) VALUES (?,?,?,?,?)").bind(question,answer,category,active,sortOrder).run();
    await log(admin.email,id?"UPDATE_FAQ":"CREATE_FAQ",question,now); return NextResponse.json({ok:true,savedAt:now,persistence:"d1"});
  }
  if(action==="service") {
    const id=Number(body.id)||0,title=clean(body.title,120),summary=clean(body.summary,500),detail=clean(body.detail,3000),icon=clean(body.icon,4)||"•",slug=clean(body.slug,140)||slugify(title),active=body.active===false?0:1;
    if(!title||!summary||!detail||!slug) return NextResponse.json({error:"Hizmet alanlarını doldurun."},{status:400});
    if(id) await d1.prepare("UPDATE services SET slug=?,title=?,summary=?,detail=?,icon=?,active=?,updated_at=? WHERE id=?").bind(slug,title,summary,detail,icon,active,now,id).run(); else await d1.prepare("INSERT INTO services (slug,title,summary,detail,icon,active,sort_order,updated_at) VALUES (?,?,?,?,?,?,99,?)").bind(slug,title,summary,detail,icon,active,now).run();
    await log(admin.email,id?"UPDATE_SERVICE":"CREATE_SERVICE",title,now); return NextResponse.json({ok:true,savedAt:now,persistence:"d1"});
  }
  if(action==="university") {
    const id=Number(body.id)||0,name=clean(body.name,120),city=clean(body.city,80),country=clean(body.country,80)||"Türkiye",description=clean(body.description,2000),slug=clean(body.slug,140)||slugify(name),active=body.active===false?0:1,featured=body.featured===true?1:0;
    if(!name||!city||!description) return NextResponse.json({error:"Üniversite alanlarını doldurun."},{status:400});
    if(id) await d1.prepare("UPDATE universities SET slug=?,name=?,city=?,country=?,description=?,featured=?,active=?,updated_at=? WHERE id=?").bind(slug,name,city,country,description,featured,active,now,id).run(); else await d1.prepare("INSERT INTO universities (slug,name,city,country,description,featured,active,updated_at) VALUES (?,?,?,?,?,?,?,?)").bind(slug,name,city,country,description,featured,active,now).run();
    await log(admin.email,id?"UPDATE_UNIVERSITY":"CREATE_UNIVERSITY",name,now); return NextResponse.json({ok:true,savedAt:now,persistence:"d1"});
  }
  if(action==="program") {
    const id=Number(body.id)||0,universityId=Number(body.universityId),name=clean(body.name,120),slug=clean(body.slug,140)||slugify(name),degreeType=clean(body.degreeType,40),language=clean(body.language,40),duration=clean(body.duration,40),tuitionFee=clean(body.tuitionFee,80),description=clean(body.description,2000),active=body.active===false?0:1;
    if(!universityId||!name||!degreeType||!language||!duration||!description) return NextResponse.json({error:"Program alanlarını doldurun."},{status:400});
    if(id) await d1.prepare("UPDATE programs SET university_id=?,slug=?,name=?,degree_type=?,language=?,duration=?,tuition_fee=?,description=?,active=?,updated_at=? WHERE id=?").bind(universityId,slug,name,degreeType,language,duration,tuitionFee,description,active,now,id).run(); else await d1.prepare("INSERT INTO programs (university_id,slug,name,degree_type,language,duration,tuition_fee,description,active,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)").bind(universityId,slug,name,degreeType,language,duration,tuitionFee,description,active,now).run();
    await log(admin.email,id?"UPDATE_PROGRAM":"CREATE_PROGRAM",name,now); return NextResponse.json({ok:true,savedAt:now,persistence:"d1"});
  }
  if(action==="lead") {
    const id=Number(body.id),status=clean(body.status,30),note=clean(body.adminNote,800); if(!id||!["NEW","CONTACTED","IN_PROGRESS","COMPLETED","CANCELLED"].includes(status)) return NextResponse.json({error:"Geçersiz talep."},{status:400});
    await d1.prepare("UPDATE consultation_requests SET status=?,admin_note=? WHERE id=?").bind(status,note,id).run(); await log(admin.email,"UPDATE_LEAD",`Talep #${id}: ${status}`,now); return NextResponse.json({ok:true,savedAt:now,persistence:"d1"});
  }
  if(action==="toggle") {
    const table=clean(body.table,30),id=Number(body.id),active=body.active===true?1:0; if(!["services","universities","programs","reviews","faqs"].includes(table)||!id) return NextResponse.json({error:"Geçersiz işlem."},{status:400});
    if(table==="faqs") await d1.prepare("UPDATE faqs SET active=? WHERE id=?").bind(active,id).run();
    else await d1.prepare(`UPDATE ${table} SET active=?,updated_at=? WHERE id=?`).bind(active,now,id).run();
    await log(admin.email,"TOGGLE_CONTENT",`${table} #${id}`,now); return NextResponse.json({ok:true,savedAt:now,persistence:"d1"});
  }
  return NextResponse.json({error:"Geçersiz işlem."},{status:400});
}

async function log(actor:string,action:string,detail:string,createdAt:string){ await rawDatabase().prepare("INSERT INTO audit_logs (actor,action,detail,created_at) VALUES (?,?,?,?)").bind(actor,action,detail,createdAt).run(); }
