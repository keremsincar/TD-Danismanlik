import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { getFaqs,getServices } from "@/lib/content";
import { localizeFaqs,localizeService } from "@/lib/i18n";

const clean=(value:unknown,max:number)=>typeof value==="string"?value.trim().slice(0,max):"";
const normalize=(value:string)=>value.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ı/g,"i").replace(/[^a-z0-9ğüşöçıİâîû ]/gi," ");
const stop=new Set(["bir","ve","ile","icin","için","mi","mu","mı","mü","ne","nasil","nasıl","the","and","for","what","how"]);

export async function POST(request:Request){
  if(!request.headers.get("content-type")?.includes("application/json"))return NextResponse.json({error:"Geçersiz istek."},{status:415});
  const origin=request.headers.get("origin");if(origin&&origin!==new URL(request.url).origin)return NextResponse.json({error:"İstek doğrulanamadı."},{status:403});
  const body=await request.json().catch(()=>null) as Record<string,unknown>|null,question=clean(body?.question,500),locale=clean(body?.locale,5)||"tr";
  if(question.length<2)return NextResponse.json({error:"Lütfen sorunuzu yazın."},{status:400});
  const [rawFaqs,services]=await Promise.all([getFaqs(),getServices()]),faqs=localizeFaqs(locale,rawFaqs),serviceCopy=services.map(item=>localizeService(locale,item));
  const context=[...faqs.map(item=>`Soru: ${item.question}\nYanıt: ${item.answer}`),...serviceCopy.map(item=>`Hizmet: ${item.title}\nBilgi: ${item.summary}`)].join("\n\n");
  const key=(env as unknown as {OPENAI_API_KEY?:string}).OPENAI_API_KEY;
  if(key){try{const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-6-astra",reasoning:{effort:"low"},store:false,max_output_tokens:320,instructions:"Sen TD Danışmanlık web sitesi asistanısın. Yalnızca verilen site bilgisine dayan. Kesin kabul, süre, fiyat veya hukuki sonuç garantisi verme. Bilgi yoksa bunu açıkça söyle ve danışmanla görüşmeye yönlendir. Kullanıcının dilinde kısa, doğal ve profesyonel yanıt ver.",input:`Site bilgisi:\n${context}\n\nKullanıcı sorusu: ${question}`})});if(response.ok){const data=await response.json() as {output?:Array<{content?:Array<{type?:string;text?:string}>}>};const answer=data.output?.flatMap(item=>item.content||[]).find(item=>item.type==="output_text")?.text?.trim();if(answer)return NextResponse.json({answer,mode:"ai"})}}catch{/* Fall back to the verified site knowledge below. */}}
  const terms=normalize(question).split(/\s+/).filter(term=>term.length>2&&!stop.has(term));let best:{score:number;answer:string}|null=null;for(const item of faqs){const haystack=normalize(`${item.question} ${item.answer} ${item.category}`);const score=terms.reduce((total,term)=>total+(haystack.includes(term)?1:0),0);if(!best||score>best.score)best={score,answer:item.answer}}for(const item of serviceCopy){const haystack=normalize(`${item.title} ${item.summary}`);const score=terms.reduce((total,term)=>total+(haystack.includes(term)?1:0),0);if(!best||score>best.score)best={score,answer:item.summary}}const generic=locale==="en"?"I could not find a definitive answer in the site information. Please contact our advisers so we can review your situation.":locale==="ru"?"В информации сайта нет точного ответа. Свяжитесь с консультантом, чтобы мы могли оценить вашу ситуацию.":locale==="ar"?"لم أجد إجابة مؤكدة ضمن معلومات الموقع. تواصل مع مستشارينا لتقييم حالتك.":"Site bilgilerinde bu soruya kesin bir yanıt bulamadım. Durumunuzu değerlendirebilmemiz için danışmanımıza yazabilirsiniz.";return NextResponse.json({answer:best&&best.score>0?best.answer:generic,mode:"knowledge"});
}
