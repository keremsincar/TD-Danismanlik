import { NextResponse } from "next/server";
import { authenticateAdmin, beginAdminLoginApproval } from "@/lib/admin";

export async function POST(request:Request) {
  const origin=request.headers.get("origin");
  if(origin&&origin!==new URL(request.url).origin)return NextResponse.redirect(new URL("/admin/login?error=İstek doğrulanamadı.",request.url),303);
  const form=await request.formData();
  const email=String(form.get("email")||"").trim().toLowerCase().slice(0,160);
  const password=String(form.get("password")||"").slice(0,200);
  const ip=(request.headers.get("cf-connecting-ip")||request.headers.get("x-forwarded-for")||"unknown").split(",")[0].trim();
  const userAgent=request.headers.get("user-agent")||"Bilinmeyen cihaz";
  if(!email||!password)return NextResponse.redirect(new URL("/admin/login?error=E-posta ve şifre gereklidir.",request.url),303);
  const result=await authenticateAdmin(email,password,ip);
  if("error" in result&&result.error)return NextResponse.redirect(new URL(`/admin/login?error=${encodeURIComponent(result.error)}`,request.url),303);
  const approval=await beginAdminLoginApproval(result.user,ip,userAgent);
  if("error" in approval)return NextResponse.redirect(new URL(`/admin/login?error=${encodeURIComponent(approval.error)}`,request.url),303);
  return NextResponse.redirect(new URL(`/admin/verify?challenge=${encodeURIComponent(approval.challengeId)}&email=${encodeURIComponent(approval.maskedEmail)}`,request.url),303);
}
