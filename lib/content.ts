import { env } from "cloudflare:workers";

export type SiteSettings = {
  siteName: string; heroTitle: string; heroDescription: string; ctaText: string;
  phone: string; whatsapp: string; address: string; hours: string; email: string; headingFont: string; bodyFont: string;
  primaryColor: string; accentColor: string; updatedAt: string;
};
export type Review = { id:number; author:string; context:string; quote:string; isExample:number; active:number; sortOrder:number; updatedAt:string };
export type Faq = { id:number; question:string; answer:string; category:string; active:number; sortOrder:number };
export type HomeCopy = { heroEyebrow:string; servicesTitle:string; servicesIntro:string; aboutTitle:string; aboutBody:string; finderTitle:string; finderIntro:string; processTitle:string; processIntro:string; reviewsTitle:string; contactTitle:string; contactBody:string };
export const defaultHomeCopy: HomeCopy = {
  heroEyebrow:"Eğitim ve yaşam danışmanlığı · İstanbul",
  servicesTitle:"İHTİYACINIZ OLAN DESTEK, TEK YERDE.",
  servicesIntro:"Üniversite tercihinden resmî işlemlere kadar her aşamayı açık bir planla birlikte yürütüyoruz.",
  aboutTitle:"KARMAŞIK SÜREÇLERİ SADELEŞTİRİYORUZ.",
  aboutBody:"Önce sizi dinliyoruz. Ardından seçenekleri, belgeleri ve tarihleri tek tek açıklayarak uygulanabilir bir yol haritası hazırlıyoruz.",
  finderTitle:"SİZE UYGUN PROGRAMI KEŞFEDİN.",
  finderIntro:"Örnek katalogda şehir, derece ve eğitim diline göre arama yapın. Program ve başvuru koşullarını görüşmede güncel olarak teyit ediyoruz.",
  processTitle:"DÖRT ADIMDA NET BİR YOL.",
  processIntro:"Hangi aşamada olduğunuzu ve sırada ne yapılacağını her zaman bilirsiniz.",
  reviewsTitle:"DANIŞAN DENEYİMLERİ.",
  contactTitle:"BİRLİKTE BAŞLAYALIM.",
  contactBody:"Sorunuzu bize iletin; ihtiyacınıza uygun ilk adımı birlikte belirleyelim.",
};
export type Service = { id:number; slug:string; title:string; summary:string; detail:string; icon:string; active:number; sortOrder:number; updatedAt:string };
export type University = { id:number; slug:string; name:string; city:string; country:string; description:string; featured:number; active:number; updatedAt:string };
export type Program = { id:number; universityId:number; universityName:string; universitySlug:string; slug:string; name:string; degreeType:string; language:string; duration:string; tuitionFee:string; description:string; active:number; updatedAt:string };
export type Consultation = { id:number; name:string; phone:string; whatsapp:string; email:string; service:string; university:string|null; program:string|null; message:string; preferredContact:string; kvkkAcceptedAt:string; status:string; adminNote:string; createdAt:string };

const defaultSettings: SiteSettings = {
  siteName:"TD Danışmanlık", heroTitle:"Doğru adım. Net bir gelecek.",
  heroDescription:"Üniversite seçiminden ikamet ve vatandaşlık işlemlerine kadar tüm süreci, sizin için sadeleştiriyor ve özenle takip ediyoruz.",
  ctaText:"Görüşme talebi oluşturun", phone:"+90 507 077 87 15", whatsapp:"905070778715", address:"Yeşilköy, İstanbul Dünya Ticaret Mrk. A2 Blok Kat:5 Daire:206, 34500 Bakırköy/İstanbul", hours:"Mesai bitişi: 17.00", email:"info@tddanismanlik.com",
  headingFont:"Manrope", bodyFont:"Manrope", primaryColor:"#17181c", accentColor:"#1047e8", updatedAt:new Date().toISOString(),
};

const defaultServices = [
  ["universite-bolum-secimi","Üniversite ve Bölüm Seçimi","Hedeflerinize, akademik geçmişinize ve bütçenize uygun seçenekleri birlikte belirliyoruz.","Profil analizi, program karşılaştırması ve tercih stratejisini kapsayan kişisel bir yol haritası oluşturuyoruz.","01"],
  ["kayit-sureci","Kayıt Süreci ve Takibi","Başvurudan kabul ve kesin kayda kadar her adımı planlı ve şeffaf biçimde takip ediyoruz.","Evrak kontrolünden üniversite iletişimine kadar başvuru dosyanızın tüm aşamalarını yönetiyoruz.","02"],
  ["ikamet-izni","İkamet İzni İşlemleri","Başvuru, randevu ve dosya takibini güncel mevzuata uygun şekilde yürütüyoruz.","İkamet izni türünün belirlenmesi, evrak kontrolü, başvuru ve sonuç takibi tek ekip tarafından yürütülür.","03"],
  ["adres-kayit","Adres Kayıt İşlemleri","Adres beyanı ve ilgili resmî kayıt adımlarında size eşlik ediyoruz.","Adres kayıt süreciniz için gerekli belgeleri ve randevu adımlarını netleştiriyoruz.","04"],
  ["calisma-izni","Çalışma İzni İşlemleri","İşveren ve çalışan tarafındaki izin sürecini koordineli biçimde yönetiyoruz.","Başvuru uygunluğu, evrak seti ve kurum yazışmaları uzman ekibimizce takip edilir.","05"],
  ["vatandaslik","Vatandaşlık İşlemleri","Uygunluk değerlendirmesinden dosya takibine kadar kontrollü destek sunuyoruz.","Başvuru türünüzü değerlendiriyor, gerekli evrak ve resmî süreçleri anlaşılır bir plana dönüştürüyoruz.","06"],
  ["tercume","Tercüme Hizmetleri","Resmî ve akademik belgeleriniz için doğru, tutarlı ve takip edilebilir tercüme süreci.","Belge türüne uygun tercüme, noter ve ilgili onay adımlarını koordine ediyoruz.","07"],
  ["denklik","Denklik Belgesi İşlemleri","Diploma ve eğitim belgelerinizin denklik sürecini adım adım takip ediyoruz.","Başvuru dosyanızın hazırlanması, kontrolü ve ilgili kurum süreçleri için destek veriyoruz.","08"],
];

const defaultUniversities = [
  ["istanbul-gelisim-universitesi","İstanbul Gelişim Üniversitesi","İstanbul","Türkiye","Geniş program seçenekleri ve uluslararası öğrenci topluluğuyla dinamik bir eğitim ortamı.",1],
  ["istanbul-aydin-universitesi","İstanbul Aydın Üniversitesi","İstanbul","Türkiye","Uygulamalı eğitim yaklaşımı ve çok dilli program seçenekleriyle güçlü bir şehir üniversitesi.",1],
  ["bahcesehir-universitesi","Bahçeşehir Üniversitesi","İstanbul","Türkiye","Küresel bağlantıları ve şehir merkezindeki kampüs deneyimiyle öne çıkan bir üniversite.",1],
  ["ankara-medipol-universitesi","Ankara Medipol Üniversitesi","Ankara","Türkiye","Sağlık ve mühendislik alanlarında güncel programlar sunan modern bir üniversite.",0],
];

const defaultPrograms = [
  [1,"bilgisayar-muhendisligi","Bilgisayar Mühendisliği","Lisans","İngilizce","4 yıl","Bilgi alın","Yazılım, algoritmalar ve bilgisayar sistemlerinde güçlü bir temel sunar."],
  [1,"isletme-yonetimi","İşletme Yönetimi","Lisans","Türkçe","4 yıl","Bilgi alın","Yönetim, finans ve girişimcilik odaklı disiplinler arası eğitim."],
  [2,"mimarlik","Mimarlık","Lisans","İngilizce","4 yıl","Bilgi alın","Tasarım stüdyoları ile teknik bilgiyi bir araya getiren program."],
  [2,"uluslararasi-ticaret","Uluslararası Ticaret","Yüksek Lisans","Türkçe","2 yıl","Bilgi alın","Küresel ticaret ve stratejik yönetim alanlarına odaklanan program."],
  [3,"psikoloji","Psikoloji","Lisans","İngilizce","4 yıl","Bilgi alın","İnsan davranışına bilimsel ve uygulamalı yaklaşım kazandırır."],
  [4,"dis-hekimligi","Diş Hekimliği","Lisans","Türkçe","5 yıl","Bilgi alın","Klinik deneyimle desteklenen kapsamlı sağlık eğitimi."],
];

const defaultFaqs = [
  ["Üniversite başvurusu nasıl yapılır?","Akademik profilinizi ve hedeflerinizi değerlendirerek uygun programları belirler, evrak ve başvuru takvimini birlikte planlarız.","Üniversite",1],
  ["İkamet izni için hangi belgeler gerekir?","Belge listesi başvuru türüne ve kişisel durumunuza göre değişir. Ön değerlendirme sonrasında size özel güncel bir kontrol listesi sunarız.","Resmî İşlemler",2],
  ["Çalışma izni süreci ne kadar sürer?","Süre; başvuru türüne, işverene ve kurum değerlendirmesine bağlıdır. Dosya kontrolünden sonra tahmini aşamaları şeffaf biçimde paylaşırız.","Resmî İşlemler",3],
  ["Hizmetleriniz hangi dillerde sunuluyor?","Türkçe, İngilizce, Rusça ve Arapça iletişim altyapımız bulunmaktadır.","Genel",4],
];

function db(): D1Database { return (env as unknown as { DB:D1Database }).DB; }
let ready: Promise<void> | null = null;

export function ensureDatabase(): Promise<void> {
  if (ready) return ready;
  ready = (async () => {
    const d1 = db();
    await d1.batch([
      d1.prepare("CREATE TABLE IF NOT EXISTS site_settings (id INTEGER PRIMARY KEY, site_name TEXT NOT NULL, hero_title TEXT NOT NULL, hero_description TEXT NOT NULL, cta_text TEXT NOT NULL, phone TEXT NOT NULL, whatsapp TEXT NOT NULL, address TEXT NOT NULL DEFAULT '', hours TEXT NOT NULL DEFAULT '', email TEXT NOT NULL, heading_font TEXT NOT NULL, body_font TEXT NOT NULL, primary_color TEXT NOT NULL, accent_color TEXT NOT NULL, updated_at TEXT NOT NULL)"),
      d1.prepare("CREATE TABLE IF NOT EXISTS services (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL, summary TEXT NOT NULL, detail TEXT NOT NULL, icon TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, sort_order INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL)"),
      d1.prepare("CREATE TABLE IF NOT EXISTS universities (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, city TEXT NOT NULL, country TEXT NOT NULL, description TEXT NOT NULL, featured INTEGER NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL)"),
      d1.prepare("CREATE TABLE IF NOT EXISTS programs (id INTEGER PRIMARY KEY AUTOINCREMENT, university_id INTEGER NOT NULL, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, degree_type TEXT NOT NULL, language TEXT NOT NULL, duration TEXT NOT NULL, tuition_fee TEXT NOT NULL, description TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL, FOREIGN KEY (university_id) REFERENCES universities(id))"),
      d1.prepare("CREATE TABLE IF NOT EXISTS consultation_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL, whatsapp TEXT NOT NULL, email TEXT NOT NULL, service TEXT NOT NULL, university TEXT, program TEXT, message TEXT NOT NULL, preferred_contact TEXT NOT NULL, kvkk_accepted_at TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'NEW', admin_note TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL)"),
      d1.prepare("CREATE TABLE IF NOT EXISTS faqs (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT NOT NULL, answer TEXT NOT NULL, category TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, sort_order INTEGER NOT NULL DEFAULT 0)"),
      d1.prepare("CREATE TABLE IF NOT EXISTS audit_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, actor TEXT NOT NULL, action TEXT NOT NULL, detail TEXT NOT NULL, created_at TEXT NOT NULL)"),
      d1.prepare("CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at INTEGER NOT NULL)"),
      d1.prepare("CREATE INDEX IF NOT EXISTS idx_programs_university_id ON programs(university_id)"),
      d1.prepare("CREATE INDEX IF NOT EXISTS idx_consultations_status_created ON consultation_requests(status, created_at)"),
      d1.prepare("CREATE INDEX IF NOT EXISTS idx_services_active_order ON services(active, sort_order)"),
    ]);
    await seedDefaults();
  })();
  return ready;
}

async function seedDefaults() {
  const d1 = db(); const now = new Date().toISOString();
  const settingsCount = await d1.prepare("SELECT COUNT(*) AS count FROM site_settings").first<{count:number}>();
  if (!settingsCount?.count) await d1.prepare("INSERT INTO site_settings (id,site_name,hero_title,hero_description,cta_text,phone,whatsapp,address,hours,email,heading_font,body_font,primary_color,accent_color,updated_at) VALUES (1,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
    .bind(defaultSettings.siteName,defaultSettings.heroTitle,defaultSettings.heroDescription,defaultSettings.ctaText,defaultSettings.phone,defaultSettings.whatsapp,defaultSettings.address,defaultSettings.hours,defaultSettings.email,defaultSettings.headingFont,defaultSettings.bodyFont,defaultSettings.primaryColor,defaultSettings.accentColor,now).run();
  const serviceCount = await d1.prepare("SELECT COUNT(*) AS count FROM services").first<{count:number}>();
  if (!serviceCount?.count) await d1.batch(defaultServices.map((s,i)=>d1.prepare("INSERT INTO services (slug,title,summary,detail,icon,active,sort_order,updated_at) VALUES (?,?,?,?,?,1,?,?)").bind(...s,i+1,now)));
  const universityCount = await d1.prepare("SELECT COUNT(*) AS count FROM universities").first<{count:number}>();
  if (!universityCount?.count) await d1.batch(defaultUniversities.map(u=>d1.prepare("INSERT INTO universities (slug,name,city,country,description,featured,active,updated_at) VALUES (?,?,?,?,?,?,1,?)").bind(...u,now)));
  const programCount = await d1.prepare("SELECT COUNT(*) AS count FROM programs").first<{count:number}>();
  if (!programCount?.count) await d1.batch(defaultPrograms.map(p=>d1.prepare("INSERT INTO programs (university_id,slug,name,degree_type,language,duration,tuition_fee,description,active,updated_at) VALUES (?,?,?,?,?,?,?,?,1,?)").bind(...p,now)));
  const faqCount = await d1.prepare("SELECT COUNT(*) AS count FROM faqs").first<{count:number}>();
  if (!faqCount?.count) await d1.batch(defaultFaqs.map(f=>d1.prepare("INSERT INTO faqs (question,answer,category,active,sort_order) VALUES (?,?,?,1,?)").bind(...f)));
  const reviewCount = await d1.prepare("SELECT COUNT(*) AS count FROM reviews").first<{count:number}>();
  if (!reviewCount?.count) await d1.batch([
    ["Örnek danışan", "Üniversite başvurusu", "Başvuru takvimini ve gerekli belgeleri ilk görüşmede netleştirmeleri, süreç boyunca ne yapacağımı bilmemi sağladı."],
    ["Örnek danışan", "İkamet işlemleri", "İkamet dosyamdaki eksikleri önceden görüp tek tek tamamladık. Sorularımın yanıtını her aşamada açıkça aldım."],
    ["Örnek danışan", "Program seçimi", "Seçenekleri yalnızca sıralamadılar; bütçem ve hedeflerim üzerinden birlikte değerlendirdik."],
  ].map((r,i)=>d1.prepare("INSERT INTO reviews (author,context,quote,is_example,active,sort_order,updated_at) VALUES (?,?,?,1,1,?,?)").bind(...r,i+1,now)));
}

export async function getSettings(): Promise<SiteSettings> { await ensureDatabase(); const row=await db().prepare("SELECT site_name AS siteName,hero_title AS heroTitle,hero_description AS heroDescription,cta_text AS ctaText,phone,whatsapp,address,hours,email,heading_font AS headingFont,body_font AS bodyFont,primary_color AS primaryColor,accent_color AS accentColor,updated_at AS updatedAt FROM site_settings WHERE id=1").first<SiteSettings>(); if(!row)return defaultSettings; const legacyPalette=row.primaryColor==="#14362e"&&row.accentColor==="#dfff70"; return {...row,phone:row.phone||defaultSettings.phone,whatsapp:row.whatsapp||defaultSettings.whatsapp,address:row.address||defaultSettings.address,hours:row.hours||defaultSettings.hours,headingFont:legacyPalette&&row.headingFont==="Newsreader"?"Manrope":row.headingFont,primaryColor:row.primaryColor==="#14362e"?defaultSettings.primaryColor:row.primaryColor,accentColor:row.accentColor==="#dfff70"?defaultSettings.accentColor:row.accentColor}; }
export async function getHomeCopy(): Promise<HomeCopy> { await ensureDatabase(); const rows=(await db().prepare("SELECT key,value FROM home_content").all<{key:string;value:string}>()).results; return rows.reduce((copy,row)=>{if(row.key in copy)(copy as unknown as Record<string,string>)[row.key]=row.value;return copy;},{...defaultHomeCopy}); }
export async function getReviews(activeOnly=true): Promise<Review[]> { await ensureDatabase(); const q=activeOnly?"SELECT id,author,context,quote,is_example AS isExample,active,sort_order AS sortOrder,updated_at AS updatedAt FROM reviews WHERE active=1 ORDER BY sort_order,id":"SELECT id,author,context,quote,is_example AS isExample,active,sort_order AS sortOrder,updated_at AS updatedAt FROM reviews ORDER BY sort_order,id";return (await db().prepare(q).all<Review>()).results; }
export async function getServices(activeOnly=true): Promise<Service[]> { await ensureDatabase(); const q=activeOnly?"SELECT id,slug,title,summary,detail,icon,active,sort_order AS sortOrder,updated_at AS updatedAt FROM services WHERE active=1 ORDER BY sort_order":"SELECT id,slug,title,summary,detail,icon,active,sort_order AS sortOrder,updated_at AS updatedAt FROM services ORDER BY sort_order"; return (await db().prepare(q).all<Service>()).results; }
export async function getService(slug:string): Promise<Service|null> { await ensureDatabase(); return await db().prepare("SELECT id,slug,title,summary,detail,icon,active,sort_order AS sortOrder,updated_at AS updatedAt FROM services WHERE slug=? AND active=1").bind(slug).first<Service>(); }
export async function getUniversities(activeOnly=true): Promise<University[]> { await ensureDatabase(); const q=activeOnly?"SELECT id,slug,name,city,country,description,featured,active,updated_at AS updatedAt FROM universities WHERE active=1 ORDER BY featured DESC,name":"SELECT id,slug,name,city,country,description,featured,active,updated_at AS updatedAt FROM universities ORDER BY featured DESC,name"; return (await db().prepare(q).all<University>()).results; }
export async function getUniversity(slug:string): Promise<University|null> { await ensureDatabase(); return await db().prepare("SELECT id,slug,name,city,country,description,featured,active,updated_at AS updatedAt FROM universities WHERE slug=? AND active=1").bind(slug).first<University>(); }
export async function getPrograms(universityId?:number,activeOnly=true): Promise<Program[]> { await ensureDatabase(); const where=activeOnly?" WHERE p.active=1 AND u.active=1":""; const conjunction=where?" AND":" WHERE"; const q="SELECT p.id,p.university_id AS universityId,u.name AS universityName,u.slug AS universitySlug,p.slug,p.name,p.degree_type AS degreeType,p.language,p.duration,p.tuition_fee AS tuitionFee,p.description,p.active,p.updated_at AS updatedAt FROM programs p JOIN universities u ON u.id=p.university_id"+where+(universityId?`${conjunction} p.university_id=?`:"")+" ORDER BY p.name"; const stmt=db().prepare(q); return (await (universityId?stmt.bind(universityId):stmt).all<Program>()).results; }
export async function getProgram(slug:string): Promise<Program|null> { await ensureDatabase(); return await db().prepare("SELECT p.id,p.university_id AS universityId,u.name AS universityName,u.slug AS universitySlug,p.slug,p.name,p.degree_type AS degreeType,p.language,p.duration,p.tuition_fee AS tuitionFee,p.description,p.active,p.updated_at AS updatedAt FROM programs p JOIN universities u ON u.id=p.university_id WHERE p.slug=? AND p.active=1").bind(slug).first<Program>(); }
export async function getFaqs(activeOnly=true): Promise<Faq[]> { await ensureDatabase(); const q=activeOnly?"SELECT id,question,answer,category,active,sort_order AS sortOrder FROM faqs WHERE active=1 ORDER BY sort_order":"SELECT id,question,answer,category,active,sort_order AS sortOrder FROM faqs ORDER BY sort_order";return (await db().prepare(q).all<Faq>()).results; }
export async function getDashboardData() { await ensureDatabase(); const d1=db(); const [leads,universities,programs,faqs,recent,audit]=await Promise.all([d1.prepare("SELECT COUNT(*) AS count FROM consultation_requests").first<{count:number}>(),d1.prepare("SELECT COUNT(*) AS count FROM universities WHERE active=1").first<{count:number}>(),d1.prepare("SELECT COUNT(*) AS count FROM programs WHERE active=1").first<{count:number}>(),d1.prepare("SELECT COUNT(*) AS count FROM faqs WHERE active=1").first<{count:number}>(),d1.prepare("SELECT * FROM consultation_requests ORDER BY created_at DESC LIMIT 12").all<Consultation>(),d1.prepare("SELECT actor,action,detail,created_at AS createdAt FROM audit_logs ORDER BY created_at DESC LIMIT 8").all<{actor:string;action:string;detail:string;createdAt:string}>()]); return { counts:{leads:leads?.count??0,universities:universities?.count??0,programs:programs?.count??0,faqs:faqs?.count??0}, recent:recent.results, audit:audit.results } }
export function rawDatabase() { return db(); }
