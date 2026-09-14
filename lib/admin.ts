import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";

export async function getAdmin() {
  const user = await getChatGPTUser();
  if (!user) return null;
  const configured = (env as unknown as { ADMIN_EMAIL?:string }).ADMIN_EMAIL || "info@tddanismanlik.com";
  const allowedEmails = configured.split(/[;,\s]+/).map(email => email.trim().toLowerCase()).filter(Boolean);
  return allowedEmails.includes(user.email.toLowerCase()) ? user : null;
}
