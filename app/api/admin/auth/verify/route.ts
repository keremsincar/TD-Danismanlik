import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminCookieOptions, approveAdminLogin, createAdminSession, sendAdminLoginNotice } from "@/lib/admin";

export async function POST(request:Request){
  const origin=request.headers.get("origin");
  if(origin&&origin!==new URL(request.url).origin)return NextResponse.redirect(new URL("/admin/login?error=İstek doğrulanamadı.",request.url),303);
  const form=await request.formData();
  const challenge=String(form.get("challenge")||"").slice(0,200);
  const code=String(form.get("code")||"").replace(/\D/g,"").slice(0,6);
  const ip=(request.headers.get("cf-connecting-ip")||request.headers.get("x-forwarded-for")||"unknown").split(",")[0].trim();
  const userAgent=request.headers.get("user-agent")||"Bilinmeyen cihaz";
  if(!challenge||code.length!==6)return NextResponse.redirect(new URL(`/admin/verify?challenge=${encodeURIComponent(challenge)}&error=${encodeURIComponent("6 haneli doğrulama kodunu girin.")}`,request.url),303);
  const approval=await approveAdminLogin(challenge,code,ip);
  if("error" in approval)return NextResponse.redirect(new URL(`/admin/verify?challenge=${encodeURIComponent(challenge)}&error=${encodeURIComponent(approval.error)}`,request.url),303);
  const session=await createAdminSession(approval.user.id);
  await sendAdminLoginNotice(approval.user,ip,userAgent);
  const response=NextResponse.redirect(new URL("/admin",request.url),303);
  response.cookies.set(ADMIN_COOKIE,session.token,adminCookieOptions(session.expires));
  return response;
}
