import { NextResponse } from "next/server";
import { ADMIN_COOKIE, revokeAdminSession } from "@/lib/admin";

export async function POST(request:Request) {
  const origin=request.headers.get("origin");
  if(origin&&origin!==new URL(request.url).origin)return NextResponse.json({error:"İstek doğrulanamadı."},{status:403});
  await revokeAdminSession();
  const response=NextResponse.redirect(new URL("/admin/login",request.url),303);
  response.cookies.set(ADMIN_COOKIE,"",{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:0});
  return response;
}
