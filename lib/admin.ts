import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";

export async function getAdmin() {
  const user = await getChatGPTUser();
  if (!user) return null;
  const configured = (env as unknown as { ADMIN_EMAIL?:string }).ADMIN_EMAIL?.trim().toLowerCase() || "info@tddanismanlik.com";
  return user.email.toLowerCase() === configured ? user : null;
}
