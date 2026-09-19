import { NextResponse } from "next/server";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { ADMIN_COOKIE, PRIMARY_ADMIN_EMAIL, adminCookieOptions, createAdminSession, createOwner, hasAdminUsers } from "@/lib/admin";
import { env } from "cloudflare:workers";

export async function POST(request:Request) {
  const origin=request.headers.get("origin");
  if(origin&&origin!==new URL(request.url).origin)return NextResponse.redirect(new URL("/admin/setup?error=İstek doğrulanamadı.",request.url),303);
  const user=await getChatGPTUser();
  const bootstrap=(env as unknown as {ADMIN_EMAIL?:string}).ADMIN_EMAIL?.trim().toLowerCase();
  if(!user||!bootstrap||user.email.toLowerCase()!==bootstrap)return NextResponse.redirect(new URL("/admin/setup?error=Bu hesabın ilk kurulum yetkisi yok.",request.url),303);
  if(await hasAdminUsers())return NextResponse.redirect(new URL("/admin/login",request.url),303);
  const form=await request.formData(),password=String(form.get("password")||""),confirm=String(form.get("confirm")||"");
  if(password.length<12)return NextResponse.redirect(new URL("/admin/setup?error=Şifre en az 12 karakter olmalıdır.",request.url),303);
  if(password!==confirm)return NextResponse.redirect(new URL("/admin/setup?error=Şifreler eşleşmiyor.",request.url),303);
  const userId=await createOwner(password,user.email),session=await createAdminSession(userId);
  const response=NextResponse.redirect(new URL("/admin",request.url),303);
  response.cookies.set(ADMIN_COOKIE,session.token,adminCookieOptions(session.expires));
  response.headers.set("x-admin-account",PRIMARY_ADMIN_EMAIL);
  return response;
}
