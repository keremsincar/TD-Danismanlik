import { NextResponse } from "next/server";
import { getAdmin, makePassword, verifyPassword, type AdminRole } from "@/lib/admin";
import { ensureDatabase, rawDatabase } from "@/lib/content";

const clean=(value:unknown,max:number)=>typeof value==="string"?value.trim().slice(0,max):"";

export async function POST(request:Request) {
  const admin=await getAdmin();
  if(!admin||admin.role!=="owner")return NextResponse.json({error:"Bu işlem yalnızca ana yöneticiye açıktır."},{status:403});
  const origin=request.headers.get("origin");if(origin&&origin!==new URL(request.url).origin)return NextResponse.json({error:"İstek doğrulanamadı."},{status:403});
  const body=await request.json().catch(()=>null) as Record<string,unknown>|null;if(!body)return NextResponse.json({error:"İstek okunamadı."},{status:400});
  await ensureDatabase();const d1=rawDatabase(),action=clean(body.action,30),now=new Date().toISOString();
  if(action==="changePassword"){
    const currentPassword=typeof body.currentPassword==="string"?body.currentPassword.slice(0,200):"",password=typeof body.password==="string"?body.password.slice(0,200):"",confirm=typeof body.confirm==="string"?body.confirm.slice(0,200):"";
    if(password.length<12||password!==confirm)return NextResponse.json({error:"Yeni şifre en az 12 karakter olmalı ve tekrar alanıyla eşleşmelidir."},{status:400});
    const account=await d1.prepare("SELECT password_hash AS hash,password_salt AS salt FROM admin_users WHERE id=?").bind(admin.id).first<{hash:string;salt:string}>();
    if(!account||!await verifyPassword(currentPassword,account.salt,account.hash))return NextResponse.json({error:"Mevcut şifre hatalı."},{status:400});
    const next=await makePassword(password);await d1.batch([d1.prepare("UPDATE admin_users SET password_hash=?,password_salt=?,updated_at=? WHERE id=?").bind(next.hash,next.salt,now,admin.id),d1.prepare("DELETE FROM admin_sessions WHERE user_id=?").bind(admin.id),d1.prepare("INSERT INTO audit_logs (actor,action,detail,created_at) VALUES (?,?,?,?)").bind(admin.email,"CHANGE_PASSWORD","Yönetici şifresi değiştirildi",now)]);return NextResponse.json({ok:true,reauthenticate:true});
  }
  if(action==="create"){
    const name=clean(body.name,100),email=clean(body.email,160).toLowerCase(),password=typeof body.password==="string"?body.password.slice(0,200):"",role=clean(body.role,20) as AdminRole;
    if(!name||!email.includes("@")||password.length<12||!["admin","editor"].includes(role))return NextResponse.json({error:"Ad, geçerli e-posta, rol ve en az 12 karakterli şifre gereklidir."},{status:400});
    const exists=await d1.prepare("SELECT id FROM admin_users WHERE email=?").bind(email).first<{id:number}>();if(exists)return NextResponse.json({error:"Bu e-posta ile bir kullanıcı zaten var."},{status:409});
    const {hash,salt}=await makePassword(password);
    await d1.batch([
      d1.prepare("INSERT INTO admin_users (email,name,password_hash,password_salt,role,active,created_by,created_at,updated_at) VALUES (?,?,?,?,?,1,?,?,?)").bind(email,name,hash,salt,role,admin.email,now,now),
      d1.prepare("INSERT INTO audit_logs (actor,action,detail,created_at) VALUES (?,?,?,?)").bind(admin.email,"CREATE_ADMIN_USER",`${email} · ${role}`,now),
    ]);
    return NextResponse.json({ok:true});
  }
  if(action==="update"){
    const id=Number(body.id),role=clean(body.role,20) as AdminRole,active=body.active===true?1:0,password=typeof body.password==="string"?body.password.slice(0,200):"";
    const target=await d1.prepare("SELECT id,email,role FROM admin_users WHERE id=?").bind(id).first<{id:number;email:string;role:AdminRole}>();
    if(!target)return NextResponse.json({error:"Kullanıcı bulunamadı."},{status:404});
    if(target.role==="owner")return NextResponse.json({error:"Ana yönetici hesabı değiştirilemez."},{status:400});
    if(!["admin","editor"].includes(role))return NextResponse.json({error:"Geçersiz rol."},{status:400});
    if(password&&password.length<12)return NextResponse.json({error:"Yeni şifre en az 12 karakter olmalıdır."},{status:400});
    if(password){const {hash,salt}=await makePassword(password);await d1.prepare("UPDATE admin_users SET role=?,active=?,password_hash=?,password_salt=?,updated_at=? WHERE id=?").bind(role,active,hash,salt,now,id).run();await d1.prepare("DELETE FROM admin_sessions WHERE user_id=?").bind(id).run();}
    else await d1.prepare("UPDATE admin_users SET role=?,active=?,updated_at=? WHERE id=?").bind(role,active,now,id).run();
    await d1.prepare("INSERT INTO audit_logs (actor,action,detail,created_at) VALUES (?,?,?,?)").bind(admin.email,"UPDATE_ADMIN_USER",`${target.email} · ${role} · ${active?"aktif":"pasif"}`,now).run();
    return NextResponse.json({ok:true});
  }
  return NextResponse.json({error:"Geçersiz işlem."},{status:400});
}
