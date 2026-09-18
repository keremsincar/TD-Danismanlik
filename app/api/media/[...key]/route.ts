import { env } from "cloudflare:workers";

export async function GET(_request:Request,{params}:{params:Promise<{key:string[]}>}) {
  const {key:parts}=await params;
  const key=parts.join("/");
  if(!/^(hero|about)\/[a-f0-9-]+\.(jpg|png|webp)$/.test(key))return new Response("Not found",{status:404});
  const bucket=(env as unknown as {MEDIA?:R2Bucket}).MEDIA;
  if(!bucket)return new Response("Storage unavailable",{status:503});
  const object=await bucket.get(key);
  if(!object)return new Response("Not found",{status:404});
  const headers=new Headers({"Cache-Control":"public, max-age=31536000, immutable","X-Content-Type-Options":"nosniff"});
  object.writeHttpMetadata(headers);
  return new Response(object.body,{headers});
}
