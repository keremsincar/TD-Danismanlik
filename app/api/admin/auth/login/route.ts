import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminCookieOptions, authenticateAdmin, createAdminSession } from "@/lib/admin";

export async function POST(request:Request) {
  const origin=request.headers.get("origin");
  if(origin&&origin!==new URL(request.url).origin)return NextResponse.redirect(new URL("/admin/login?error=İstek doğrulanamadı.",request.url),303);
  const form=await request.formData();
  const email=String(form.get("email")||"").trim().toLowerCase().slice(0,160);
  const password=String(form.get("password")||"").slice(0,200);
  const ip=(request.headers.get("cf-connecting-ip")||request.headers.get("x-forwarded-for")||"unknown").split(",")[0].trim();
  if(!email||!password)return NextResponse.redirect(new URL("/admin/login?error=E-posta ve şifre gereklidir.",request.url),303);
  const result=await authenticateAdmin(email,password,ip);
  if("error" in result&&result.error)return NextResponse.redirect(new URL(`/admin/login?error=${encodeURIComponent(result.error)}`,request.url),303);
  const session=await createAdminSession(result.user.id);
  const response=NextResponse.redirect(new URL("/admin",request.url),303);
  response.cookies.set(ADMIN_COOKIE,session.token,adminCookieOptions(session.expires));
  return response;
}
