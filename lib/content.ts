import { env } from "cloudflare:workers";
import { universityCatalog } from "./university-catalog";
import referenceProgramsRaw from "./reference-programs.json";

export type SiteSettings = {
  siteName: string; heroTitle: string; heroDescription: string; ctaText: string;
  phone: string; whatsapp: string; address: string; hours: string; email: string; headingFont: string; bodyFont: string;
  primaryColor: string; accentColor: string; updatedAt: string;
};
export type Review = { id:number; author:string; context:string; quote:string; isExample:number; active:number; sortOrder:number; updatedAt:string; avatar?:string };
export type Faq = { id:number; question:string; answer:string; category:string; active:number; sortOrder:number };
export type HomeCopy = { heroEyebrow:string; servicesTitle:string; servicesIntro:string; aboutTitle:string; aboutBody:string; finderTitle:string; finderIntro:string; processTitle:string; processIntro:string; reviewsTitle:string; contactTitle:string; contactBody:string };
export type SiteImages = { hero:string; about:string };
export const defaultHomeCopy: HomeCopy = {
  heroEyebrow:"TD Danışmanlık",
  servicesTitle:"Eğitim ve resmî işlemlerde kapsamlı danışmanlık.",
  servicesIntro:"Üniversite tercihi, kayıt, ikamet ve ilgili resmî süreçler için kapsamı, belge planını ve kritik tarihleri sistematik biçimde yönetiyoruz.",
  aboutTitle:"Her dosyaya aynı yerden başlamıyoruz.",
  aboutBody:"Önce durumunuzu dinler, belgelerinizi ve takvimi önümüze koyarız. Sonra gerçekten gerekli adımları sırasıyla planlarız.",
  finderTitle:"Üniversite ve program kataloğu.",
  finderIntro:"Üniversiteleri ve programları şehir, derece, dil ve alana göre inceleyin; güncel koşulları resmî kaynak üzerinden doğrulayın.",
  processTitle:"Tanımlı aşamalar, düzenli takip.",
  processIntro:"İş kapsamını başlangıçta belirler, her aşamanın sorumluluklarını ve durumunu düzenli olarak raporlarız.",
  reviewsTitle:"Danışan notları",
  contactTitle:"Danışmanlık ve iletişim.",
  contactBody:"Üniversite, kayıt veya resmî işlemlere ilişkin talebinizi iletin. Ekibimiz kapsamı değerlendirerek uygun iletişim kanalından dönüş sağlayacaktır.",
};
export type Service = { id:number; slug:string; title:string; summary:string; detail:string; icon:string; image:string; active:number; sortOrder:number; updatedAt:string };
export type University = { id:number; slug:string; name:string; city:string; country:string; description:string; featured:number; active:number; updatedAt:string; institutionType:string; founded:string; image:string; logoUrl:string };
export type Program = { id:number; universityId:number; universityName:string; universitySlug:string; slug:string; name:string; degreeType:string; language:string; duration:string; tuitionFee:string; description:string; active:number; updatedAt:string; field?:string; englishName?:string; source?:string };
type ReferenceProgram = { id:number; universitySlug:string; universityName:string; slug:string; name:string; englishName:string; degreeType:string; field:string; language:string; duration:string; tuitionFee:string; source:string };
const referencePrograms=referenceProgramsRaw as ReferenceProgram[];
const referenceProgramCounts=referencePrograms.reduce<Record<string,number>>((counts,item)=>{counts[item.universitySlug]=(counts[item.universitySlug]||0)+1;return counts;},{});
export type Consultation = { id:number; name:string; phone:string; whatsapp:string; email:string; service:string; university:string|null; program:string|null; message:string; preferredContact:string; kvkkAcceptedAt:string; status:string; adminNote:string; createdAt:string };

const defaultSettings: SiteSettings = {
  siteName:"TD Danışmanlık", heroTitle:"Doğru adım. Net bir gelecek.",
  heroDescription:"Türkiye’de üniversite başvurusu, kayıt ve resmî işlemler için dosyanıza uygun bir plan çıkarıyoruz. Belgeyi, tarihi ve sonraki adımı birlikte takip ediyoruz.",
  ctaText:"Danışmanlık talebi oluşturun", phone:"+90 507 077 87 15", whatsapp:"905070778715", address:"İstanbul Dünya Ticaret Merkezi, A2 Blok, Kat 5, Daire 206, Yeşilköy, Bakırköy/İstanbul", hours:"", email:"info@tddanismanlik.com",
  headingFont:"Newsreader", bodyFont:"IBM Plex Sans", primaryColor:"#20252b", accentColor:"#6686a3", updatedAt:new Date().toISOString(),
};

const defaultServiceImages:Record<string,string>={
  "universite-bolum-secimi":"/td-campus.jpg",
  "kayit-sureci":"https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=82",
  "ikamet-izni":"https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=82",
  "adres-kayit":"https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=82",
  "calisma-izni":"https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=82",
  "vatandaslik":"https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=82",
  "tercume":"https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=82",
  "denklik":"https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=82",
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
  ["Başvuru için son tarihleri nasıl öğrenebilirim?","Başvuru tarihleri üniversiteye ve programa göre değişir. İlgilendiğiniz kurumun resmî takvimini birlikte kontrol ederiz.","Üniversite",5],
  ["Yurt dışından başvuru yapabilir miyim?","Birçok kurum çevrim içi başvuru kabul eder. Gerekli evrak ve adımları seçtiğiniz üniversitenin resmî duyurusuna göre teyit ederiz.","Üniversite",6],
  ["Diploma denkliği her başvuruda gerekli mi?","Gereklilik başvuru türüne ve kuruma göre değişir. Belgelerinizi inceledikten sonra ilgili resmî kaynağa göre yönlendiririz.","Resmî İşlemler",7],
  ["Belgelerin tercümesi ve noter onayı gerekiyor mu?","Bu koşul belge türüne ve başvuru yapılan kuruma bağlıdır. Gereksiz işlem yapmamanız için önce kurumun güncel belge listesini inceleriz.","Belgeler",8],
  ["Danışmanlık görüşmesinde neler konuşuluyor?","Hedefinizi, mevcut belgelerinizi, zaman planınızı ve önceliklerinizi ele alır; sonraki adımları özetleriz.","Genel",9],
  ["Üniversite ücretleri sitedeki bilgilerle kesinleşir mi?","Hayır. Ücret, burs ve kontenjan bilgileri dönemsel olarak değişir; kesin bilgiyi üniversitenin güncel duyurusundan doğrulamak gerekir.","Üniversite",10],
  ["İkamet başvurumu sizin yerinize yapıyor musunuz?","Hizmet kapsamını dosyanızın türüne ve yürürlükteki uygulamaya göre ilk görüşmede netleştiririz. Resmî kararı ilgili kurum verir.","Resmî İşlemler",11],
  ["Görüşme için ofise gelmem şart mı?","İlk değerlendirme telefon veya çevrim içi yapılabilir. Evrak teslimi ya da yüz yüze işlem gerekiyorsa bunu önceden bildiririz.","Genel",12],
  ["Türkiye’de üniversite başvurusu için YÖS zorunlu mu?","YÖS şartı üniversiteye ve programa göre değişir. Bazı kurumlar diploma notu, SAT veya kendi sınavını kabul edebilir; güncel kabul ölçütünü ilgili üniversitenin duyurusundan kontrol ederiz.","Üniversite",13],
  ["Aynı anda birden fazla üniversiteye başvurabilir miyim?","Evet, uygun olduğunuz birden fazla programa başvuru yapılabilir. Takvimleri, belge setlerini ve olası kayıt çakışmalarını tek planda takip etmek önemlidir.","Üniversite",14],
  ["Burs imkânları nasıl değerlendiriliyor?","Burs türleri akademik başarıya, programa ve başvuru dönemine göre değişebilir. Uygun seçenekleri inceler, kesin oranı üniversitenin güncel teklifinden doğrularız.","Üniversite",15],
  ["Başvuru sonucu ne zaman açıklanır?","Değerlendirme süresi kuruma ve döneme göre değişir. Başvurudan sonra üniversitenin duyurduğu takvimi ve öğrenci portalını düzenli olarak takip ederiz.","Üniversite",16],
  ["Kabul mektubu aldıktan sonra ne yapmalıyım?","Ön kayıt, ücret ödeme, vize veya ülkeye giriş hazırlığı ve kesin kayıt belgeleri sıraya konur. Kabul mektubundaki son tarihler öncelikle kontrol edilir.","Kayıt",17],
  ["Kesin kayıt için hangi belgeler istenir?","Genellikle diploma, transkript, pasaport, fotoğraf ve gerekli tercüme/onay belgeleri istenir. Nihai liste üniversiteye ve programa göre farklılaşır.","Kayıt",18],
  ["Öğrenci ikamet iznine ne zaman başvurmalıyım?","Kayıt ve giriş durumunuza göre yasal süre içinde başvuru yapılmalıdır. Güncel randevu ve belge koşullarını dosyanıza göre kontrol ederiz.","Resmî İşlemler",19],
  ["Mevcut ikamet iznimi öğrenci ikametine çevirebilir miyim?","Geçiş imkânı mevcut izin türüne ve güncel mevzuata bağlıdır. İşlem yapmadan önce izin kartı, kayıt durumu ve süreler birlikte değerlendirilmelidir.","Resmî İşlemler",20],
  ["Yabancı kimlik numarası ne zaman alınır?","Yabancı kimlik numarasının oluşma zamanı başvuru ve kayıt sürecine göre değişebilir. Resmî sistemdeki güncel durum üzerinden takip yapılır.","Resmî İşlemler",21],
  ["Adres kaydı için randevu gerekiyor mu?","İlçe, belge türü ve güncel uygulamaya göre randevu veya farklı bir başvuru kanalı gerekebilir. İşlem öncesinde yetkili kurumun güncel duyurusunu kontrol ederiz.","Resmî İşlemler",22],
  ["Belgelerimi size çevrim içi gönderebilir miyim?","Ön inceleme için okunaklı tarama veya fotoğrafları güvenli iletişim kanallarımızdan iletebilirsiniz. Asıl belge gerekip gerekmediğini işlem türüne göre ayrıca bildiririz.","Belgeler",23],
  ["Eksik belgeyle başvuru yapılabilir mi?","Bazı kurumlar koşullu başvuru kabul edebilir; bazıları ise tüm belgeleri zorunlu tutar. Eksik belgenin riskini ve tamamlanma tarihini başvuru öncesinde netleştiririz.","Belgeler",24],
  ["Pasaportumun süresi ne kadar olmalı?","Gerekli geçerlilik süresi başvuru türüne göre değişebilir. Üniversite, vize ve ikamet işlemleri için pasaport süresini ayrı ayrı kontrol etmek gerekir.","Belgeler",25],
  ["Online danışmanlık alabilir miyim?","Evet. İlk değerlendirme ve birçok takip görüşmesi çevrim içi yapılabilir. Fiziksel belge veya yüz yüze işlem gerekirse bunu önceden planlarız.","Genel",26],
  ["Danışmanlık ücretini nasıl öğrenebilirim?","Ücret, ihtiyaç duyduğunuz hizmetlerin kapsamına göre belirlenir. Dosyanızı kısaca değerlendirdikten sonra kapsamı ve ücretlendirmeyi açık şekilde paylaşırız.","Genel",27],
  ["Süreç boyunca kiminle iletişim kuracağım?","Dosyanız için belirlenen iletişim kanalı üzerinden ekibimizle görüşürsünüz. Önemli tarihleri ve sonraki adımları aynı akışta paylaşırız.","Genel",28],
  ["Başvurumun kabul edileceğini garanti ediyor musunuz?","Hayır. Kabul ve resmî işlem kararları ilgili üniversite veya kamu kurumuna aittir. Biz dosyanın doğru hazırlanması ve sürecin düzenli takip edilmesi için destek sunarız.","Genel",29],
  ["Üniversite veya bölüm seçerken bütçe dikkate alınıyor mu?","Evet. Eğitim ücretiyle birlikte şehirdeki yaşam giderlerini, burs seçeneklerini ve ödeme takvimini değerlendirmeye dahil ederiz.","Üniversite",30],
  ["Türkçe hazırlık okumam gerekir mi?","Hazırlık veya dil yeterlik şartı programın eğitim diline ve üniversitenin kurallarına bağlıdır. Kabul koşullarındaki seviye ve muafiyet seçeneklerini kontrol ederiz.","Üniversite",31],
  ["İngilizce programlar için dil belgesi gerekiyor mu?","Bazı programlar uluslararası sınav sonucu isterken bazıları kendi yeterlik sınavını uygular. Kabul edilen belge ve minimum puan üniversiteye göre değişir.","Üniversite",32],
];

const defaultReviews = [
  ["Mohamed A.","İstanbul · Lisans başvurusu","Başvuru belgelerini farklı yerlerden toplamaya çalışırken neyin güncel olduğundan emin olamıyordum. Dosyayı birlikte sıraya koyunca hangi belgeyi ne zaman hazırlamam gerektiği netleşti.",1],
  ["Mariam K.","Ankara · Üniversite tercihi","Sadece okul listesi vermek yerine bütçemi ve istediğim bölümü birlikte değerlendirdiler. Görüşmeden sonra seçeneklerim daha gerçekçi ve anlaşılır hale geldi.",2],
  ["Azizbek R.","İstanbul · Kayıt süreci","Kabul sonrasında kayıt için birkaç eksik belgem vardı. Üniversiteyle yazışmaları ve tarihleri düzenli takip ettikleri için süreci karıştırmadan tamamladım.",3],
  ["Amina S.","Bursa · İkamet dosyası","İnternetteki uzun listeler kafamı karıştırmıştı. Kendi durumuma göre gerekenleri ayrı bir kontrol listesinde göstermeleri en çok işime yarayan kısım oldu.",4],
  ["Ivan P.","İzmir · Program araştırması","Ücret ve dil seçeneklerini tek tek karşılaştırdık. Karar vermem için baskı yapılmaması ve her bilginin kaynağının gösterilmesi güven verdi.",5],
  ["Sara N.","İstanbul · Belge ve tercüme","Tercüme, noter ve teslim sırasını baştan planladık. Süreç boyunca kısa ve açık bilgi aldım; hangi aşamada olduğumu hep biliyordum.",6],
] as const;

function db(): D1Database { return (env as unknown as { DB:D1Database }).DB; }
let ready: Promise<void> | null = null;

export function ensureDatabase(): Promise<void> {
  if (ready) return ready;
  ready = seedDefaults();
  return ready;
}

async function seedDefaults() {
  const d1 = db(); const now = new Date().toISOString();
  const settingsCount = await d1.prepare("SELECT COUNT(*) AS count FROM site_settings").first<{count:number}>();
  if (!settingsCount?.count) await d1.prepare("INSERT INTO site_settings (id,site_name,hero_title,hero_description,cta_text,phone,whatsapp,address,hours,email,heading_font,body_font,primary_color,accent_color,updated_at) VALUES (1,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
    .bind(defaultSettings.siteName,defaultSettings.heroTitle,defaultSettings.heroDescription,defaultSettings.ctaText,defaultSettings.phone,defaultSettings.whatsapp,defaultSettings.address,defaultSettings.hours,defaultSettings.email,defaultSettings.headingFont,defaultSettings.bodyFont,defaultSettings.primaryColor,defaultSettings.accentColor,now).run();
  const legacyMarker="NORMALIZE_LEGACY_SETTINGS_V1";
  const legacyHandled=await d1.prepare("SELECT id FROM audit_logs WHERE action=? LIMIT 1").bind(legacyMarker).first<{id:number}>();
  if(!legacyHandled){
    const legacy=await d1.prepare("SELECT primary_color AS primaryColor,accent_color AS accentColor,phone,whatsapp,address FROM site_settings WHERE id=1").first<{primaryColor:string;accentColor:string;phone:string;whatsapp:string;address:string}>();
    if(legacy?.primaryColor==="#14362e"&&legacy.accentColor==="#dfff70"&&!legacy.phone&&!legacy.whatsapp){
      await d1.prepare("UPDATE site_settings SET hero_title=?,hero_description=?,cta_text=?,phone=?,whatsapp=?,address=?,hours=?,heading_font=?,body_font=?,primary_color=?,accent_color=?,updated_at=? WHERE id=1").bind(defaultSettings.heroTitle,defaultSettings.heroDescription,defaultSettings.ctaText,defaultSettings.phone,defaultSettings.whatsapp,defaultSettings.address,defaultSettings.hours,defaultSettings.headingFont,defaultSettings.bodyFont,defaultSettings.primaryColor,defaultSettings.accentColor,now).run();
    }
    await d1.prepare("INSERT INTO audit_logs (actor,action,detail,created_at) VALUES (?,?,?,?)").bind("system",legacyMarker,"Eski başlangıç ayarları bir kez normalleştirildi",now).run();
  }
  const copyRepairMarker="REPAIR_TRUNCATED_COPY_V1";
  const copyRepairHandled=await d1.prepare("SELECT id FROM audit_logs WHERE action=? LIMIT 1").bind(copyRepairMarker).first<{id:number}>();
  if(!copyRepairHandled){
    await d1.prepare("UPDATE home_content SET value=?,updated_at=? WHERE key='servicesIntro' AND value=?").bind(defaultHomeCopy.servicesIntro,now,"Bölüm tercihi, kayıt evrakı ve ikamet başvurusu için hangi adımın ne zaman yapılacağını").run();
    await d1.prepare("INSERT INTO audit_logs (actor,action,detail,created_at) VALUES (?,?,?,?)").bind("system",copyRepairMarker,"Yarım kalan hizmet açıklaması tamamlandı",now).run();
  }
  const styleRefreshMarker="STYLE_REFRESH_V2";
  const styleRefreshHandled=await d1.prepare("SELECT id FROM audit_logs WHERE action=? LIMIT 1").bind(styleRefreshMarker).first<{id:number}>();
  if(!styleRefreshHandled){
    await d1.prepare("UPDATE site_settings SET cta_text=CASE WHEN cta_text='Görüşme planlayalım' THEN ? ELSE cta_text END,primary_color=CASE WHEN primary_color IN ('#17181c','#14362e') THEN ? ELSE primary_color END,accent_color=CASE WHEN accent_color IN ('#1047e8','#dfff70','#6f8d7c') THEN ? ELSE accent_color END,updated_at=? WHERE id=1").bind(defaultSettings.ctaText,defaultSettings.primaryColor,defaultSettings.accentColor,now).run();
    await d1.prepare("INSERT INTO audit_logs (actor,action,detail,created_at) VALUES (?,?,?,?)").bind("system",styleRefreshMarker,"Kurumsal renk ve CTA varsayılanları güncellendi",now).run();
  }
  const professionalCopyMarker="PROFESSIONAL_COPY_V2";
  const professionalCopyHandled=await d1.prepare("SELECT id FROM audit_logs WHERE action=? LIMIT 1").bind(professionalCopyMarker).first<{id:number}>();
  if(!professionalCopyHandled){
    const replacements:[keyof HomeCopy,string,string][]=[
      ["servicesTitle",defaultHomeCopy.servicesTitle,"Eğitimden resmî işlemlere."],
      ["servicesIntro",defaultHomeCopy.servicesIntro,"Bölüm tercihi, kayıt evrakı ve ikamet başvurusu için hangi adımın ne zaman yapılacağını birlikte belirleyelim."],
      ["finderTitle",defaultHomeCopy.finderTitle,"Hangi bölüm, hangi şehir?"],
      ["finderIntro",defaultHomeCopy.finderIntro,"Şehir, derece ve eğitim diline göre örnek programları karşılaştırın. Güncel koşulları başvuru öncesinde birlikte teyit ederiz."],
      ["processTitle",defaultHomeCopy.processTitle,"Süreç gözünüzün önünde ilerlesin."],
      ["processIntro",defaultHomeCopy.processIntro,"Başlangıçta bir yol haritası çıkarır, her aşamada nerede olduğunuzu paylaşırız."],
      ["contactTitle",defaultHomeCopy.contactTitle,"Sorunuzu konuşalım."],
      ["contactBody",defaultHomeCopy.contactBody,"Üniversite, kayıt veya resmî işlemle ilgili sorunuz varsa bize yazın. İlk görüşmede neye ihtiyacınız olduğunu netleştirelim."],
    ];
    await d1.batch(replacements.map(([key,value,oldValue])=>d1.prepare("UPDATE home_content SET value=?,updated_at=? WHERE key=? AND value=?").bind(value,now,key,oldValue)));
    await d1.prepare("INSERT INTO audit_logs (actor,action,detail,created_at) VALUES (?,?,?,?)").bind("system",professionalCopyMarker,"Ana sayfa dili kurumsal anlatıma güncellendi",now).run();
  }
  const serviceCount = await d1.prepare("SELECT COUNT(*) AS count FROM services").first<{count:number}>();
  if (!serviceCount?.count) await d1.batch(defaultServices.map((s,i)=>d1.prepare("INSERT INTO services (slug,title,summary,detail,icon,active,sort_order,updated_at) VALUES (?,?,?,?,?,1,?,?)").bind(...s,i+1,now)));
  const universityCount = await d1.prepare("SELECT COUNT(*) AS count FROM universities").first<{count:number}>();
  if (!universityCount?.count) await d1.batch(defaultUniversities.map(u=>d1.prepare("INSERT INTO universities (slug,name,city,country,description,featured,active,updated_at) VALUES (?,?,?,?,?,?,1,?)").bind(...u,now)));
  if ((universityCount?.count??0)<190) {
    for(let i=0;i<universityCatalog.length;i+=40) await d1.batch(universityCatalog.slice(i,i+40).map(u=>d1.prepare("INSERT OR IGNORE INTO universities (slug,name,city,country,description,featured,active,updated_at) VALUES (?,?,?,?,?,0,1,?)").bind(u.slug,u.name,u.city,"Türkiye",`${u.city} ilinde bulunan ${u.type.toLocaleLowerCase("tr-TR")} üniversitesi. Program, ücret ve başvuru koşullarını üniversitenin güncel resmî duyurularından teyit edin.`,now)));
  }
  const programCount = await d1.prepare("SELECT COUNT(*) AS count FROM programs").first<{count:number}>();
  if (!programCount?.count) await d1.batch(defaultPrograms.map(p=>d1.prepare("INSERT INTO programs (university_id,slug,name,degree_type,language,duration,tuition_fee,description,active,updated_at) VALUES (?,?,?,?,?,?,?,?,1,?)").bind(...p,now)));
  const faqCount = await d1.prepare("SELECT COUNT(*) AS count FROM faqs").first<{count:number}>();
  if (!faqCount?.count) await d1.batch(defaultFaqs.map(f=>d1.prepare("INSERT INTO faqs (question,answer,category,active,sort_order) VALUES (?,?,?,1,?)").bind(...f)));
  if (faqCount?.count && faqCount.count<defaultFaqs.length) await d1.batch(defaultFaqs.slice(faqCount.count).map(f=>d1.prepare("INSERT INTO faqs (question,answer,category,active,sort_order) VALUES (?,?,?,1,?)").bind(...f)));
  const seededReviewRepairMarker="HIDE_SEEDED_PLACEHOLDER_REVIEWS_V1";
  const seededReviewRepairHandled=await d1.prepare("SELECT id FROM audit_logs WHERE action=? LIMIT 1").bind(seededReviewRepairMarker).first<{id:number}>();
  if(!seededReviewRepairHandled){
    const seededAuthors=defaultReviews.map(item=>item[0]);
    for(const author of seededAuthors){
      await d1.prepare("UPDATE reviews SET is_example=1,active=0 WHERE author=?").bind(author).run();
    }
    await d1.prepare("INSERT INTO audit_logs (actor,action,detail,created_at) VALUES (?,?,?,?)").bind("system",seededReviewRepairMarker,"Varsayılan örnek yorumlar kamusal yayından kaldırıldı",now).run();
  }
}

export async function getSettings(): Promise<SiteSettings> { await ensureDatabase(); const row=await db().prepare("SELECT site_name AS siteName,hero_title AS heroTitle,hero_description AS heroDescription,cta_text AS ctaText,phone,whatsapp,address,hours,email,heading_font AS headingFont,body_font AS bodyFont,primary_color AS primaryColor,accent_color AS accentColor,updated_at AS updatedAt FROM site_settings WHERE id=1").first<SiteSettings>(); return row??defaultSettings; }
export async function getHomeCopy(): Promise<HomeCopy> { await ensureDatabase(); const rows=(await db().prepare("SELECT key,value FROM home_content").all<{key:string;value:string}>()).results; return rows.reduce((copy,row)=>{const key=row.key as keyof HomeCopy;if(key in copy)copy[key]=row.value;return copy;},{...defaultHomeCopy}); }
export async function getSiteImages():Promise<SiteImages> { await ensureDatabase(); const rows=(await db().prepare("SELECT key,value FROM home_content WHERE key IN ('imageHero','imageAbout')").all<{key:string;value:string}>()).results;const values=Object.fromEntries(rows.map(row=>[row.key,row.value]));return {hero:values.imageHero||"/td-students.jpg",about:values.imageAbout||"/td-campus.jpg"}; }
export async function getReviews(activeOnly=true): Promise<Review[]> { await ensureDatabase(); const q=activeOnly?"SELECT id,author,context,quote,is_example AS isExample,active,sort_order AS sortOrder,updated_at AS updatedAt FROM reviews WHERE active=1 AND is_example=0 ORDER BY sort_order,id":"SELECT id,author,context,quote,is_example AS isExample,active,sort_order AS sortOrder,updated_at AS updatedAt FROM reviews ORDER BY sort_order,id";return (await db().prepare(q).all<Review>()).results; }
async function getManagedMedia(prefix:string){const rows=(await db().prepare("SELECT key,value FROM home_content WHERE key LIKE ?").bind(`${prefix}%`).all<{key:string;value:string}>()).results;return new Map(rows.map(row=>[row.key.slice(prefix.length),row.value]));}
export async function getServices(activeOnly=true): Promise<Service[]> { await ensureDatabase(); const q=activeOnly?"SELECT id,slug,title,summary,detail,icon,active,sort_order AS sortOrder,updated_at AS updatedAt FROM services WHERE active=1 ORDER BY sort_order":"SELECT id,slug,title,summary,detail,icon,active,sort_order AS sortOrder,updated_at AS updatedAt FROM services ORDER BY sort_order"; const [rows,images]=await Promise.all([db().prepare(q).all<Omit<Service,"image">>(),getManagedMedia("serviceImage:")]);return rows.results.map(service=>({...service,image:images.get(service.slug)||defaultServiceImages[service.slug]||"/td-campus.jpg"})); }
export async function getService(slug:string): Promise<Service|null> { await ensureDatabase(); const [service,image]=await Promise.all([db().prepare("SELECT id,slug,title,summary,detail,icon,active,sort_order AS sortOrder,updated_at AS updatedAt FROM services WHERE slug=? AND active=1").bind(slug).first<Omit<Service,"image">>(),db().prepare("SELECT value FROM home_content WHERE key=?").bind(`serviceImage:${slug}`).first<{value:string}>()]);return service?{...service,image:image?.value||defaultServiceImages[slug]||"/td-campus.jpg"}:null; }
const catalogBySlug=new Map<string,(typeof universityCatalog)[number]>(universityCatalog.map(u=>[u.slug,u]));
type UniversityRow=Omit<University,"institutionType"|"founded"|"image"|"logoUrl">;
function withUniversityMetadata(row:UniversityRow,images:Map<string,string>,logos:Map<string,string>):University { const item=catalogBySlug.get(row.slug);return {...row,institutionType:item?.type??"Diğer",founded:item?.year??"",image:images.get(row.slug)||"/td-campus.jpg",logoUrl:logos.get(row.slug)||""}; }
export async function getUniversities(activeOnly=true): Promise<University[]> { await ensureDatabase(); const q=activeOnly?"SELECT id,slug,name,city,country,description,featured,active,updated_at AS updatedAt FROM universities WHERE active=1 ORDER BY featured DESC,name":"SELECT id,slug,name,city,country,description,featured,active,updated_at AS updatedAt FROM universities ORDER BY featured DESC,name"; const [rows,images,logos]=await Promise.all([db().prepare(q).all<UniversityRow>(),getManagedMedia("universityImage:"),getManagedMedia("universityLogo:")]);return rows.results.map(row=>withUniversityMetadata(row,images,logos)); }
export async function getUniversity(slug:string): Promise<University|null> { await ensureDatabase(); const [row,image,logo]=await Promise.all([db().prepare("SELECT id,slug,name,city,country,description,featured,active,updated_at AS updatedAt FROM universities WHERE slug=? AND active=1").bind(slug).first<UniversityRow>(),db().prepare("SELECT value FROM home_content WHERE key=?").bind(`universityImage:${slug}`).first<{value:string}>(),db().prepare("SELECT value FROM home_content WHERE key=?").bind(`universityLogo:${slug}`).first<{value:string}>()]);return row?withUniversityMetadata(row,new Map([[slug,image?.value||"/td-campus.jpg"]]),new Map([[slug,logo?.value||""]])):null; }
function cleanProgramLanguage(value:string){const language=value.trim();return !language||language.length>32||/doğrulanmadı|whatsapp|iletişime geç/i.test(language)?"":language;}
function cleanProgram(program:Program):Program{return {...program,language:cleanProgramLanguage(program.language)};}
export async function getPrograms(universityId?:number,activeOnly=true): Promise<Program[]> { await ensureDatabase(); const where=activeOnly?" WHERE p.active=1 AND u.active=1":""; const conjunction=where?" AND":" WHERE"; const q="SELECT p.id,p.university_id AS universityId,u.name AS universityName,u.slug AS universitySlug,p.slug,p.name,p.degree_type AS degreeType,p.language,p.duration,p.tuition_fee AS tuitionFee,p.description,p.active,p.updated_at AS updatedAt FROM programs p JOIN universities u ON u.id=p.university_id"+where+(universityId?`${conjunction} p.university_id=?`:"")+" ORDER BY p.name"; const stmt=db().prepare(q); return (await (universityId?stmt.bind(universityId):stmt).all<Program>()).results.map(cleanProgram); }
function referenceToProgram(item:ReferenceProgram,university:University):Program{return cleanProgram({id:item.id,universityId:university.id,universityName:university.name,universitySlug:university.slug,slug:item.slug,name:item.name,englishName:item.englishName,degreeType:item.degreeType,field:item.field,language:item.language,duration:item.duration,tuitionFee:item.tuitionFee,source:item.source,description:`${university.name} bünyesindeki ${item.name} programı. Eğitim dili, süre, ücret, kontenjan ve kabul koşulları dönemsel olarak değişebilir; başvuru öncesinde güncel resmî kaynağı kontrol edin.`,active:1,updatedAt:"2026-09-10T00:00:00.000Z"});}
export async function getCatalogUniversities():Promise<University[]>{const universities=await getUniversities();return universities.sort((a,b)=>a.name.localeCompare(b.name,"tr"));}
export function getCatalogProgramCounts(){return {...referenceProgramCounts};}
export function getCatalogProgramTotal(){return referencePrograms.length;}
export type ProgramSearch={query?:string;city?:string;university?:string;degree?:string;language?:string;field?:string;sort?:string;page?:number;pageSize?:number};
export async function searchCatalogPrograms(options:ProgramSearch={}){
  const universities=await getCatalogUniversities();
  const universityBySlug=new Map(universities.map(item=>[item.slug,item]));
  const databasePrograms=await getPrograms();
  const overrides=new Map(databasePrograms.map(item=>[item.slug,item]));
  const referenceSlugs=new Set(referencePrograms.map(item=>item.slug));
  const all=referencePrograms.map(item=>overrides.get(item.slug)??(universityBySlug.has(item.universitySlug)?referenceToProgram(item,universityBySlug.get(item.universitySlug)!):null)).filter((item):item is Program=>Boolean(item));
  for(const item of databasePrograms){if(!referenceSlugs.has(item.slug))all.push(item)}
  const normalize=(value:string)=>value.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ı/g,"i");
  const query=normalize(options.query?.trim()||"");
  const degreeRank=(value:string)=>({"Ön Lisans":0,"Lisans":1,"Yüksek Lisans":2,"Doktora":3}[value]??9);
  const byDegree=(a:Program,b:Program)=>degreeRank(a.degreeType)-degreeRank(b.degreeType)||a.universityName.localeCompare(b.universityName,"tr")||a.name.localeCompare(b.name,"tr");
  const compare=(a:Program,b:Program)=>options.sort==="program-asc"?a.name.localeCompare(b.name,"tr")||a.universityName.localeCompare(b.universityName,"tr"):options.sort==="program-desc"?b.name.localeCompare(a.name,"tr")||a.universityName.localeCompare(b.universityName,"tr"):options.sort==="field"?(a.field||"").localeCompare(b.field||"","tr")||degreeRank(a.degreeType)-degreeRank(b.degreeType)||a.name.localeCompare(b.name,"tr"):options.sort==="university"?a.universityName.localeCompare(b.universityName,"tr")||degreeRank(a.degreeType)-degreeRank(b.degreeType)||a.name.localeCompare(b.name,"tr"):byDegree(a,b);
  const filtered=all.filter(item=>{const university=universityBySlug.get(item.universitySlug);return (!query||normalize(`${item.name} ${item.englishName||""} ${item.universityName} ${item.field||""}`).includes(query))&&(!options.city||university?.city===options.city)&&(!options.university||item.universitySlug===options.university)&&(!options.degree||item.degreeType===options.degree)&&(!options.language||item.language===options.language)&&(!options.field||item.field===options.field)}).sort(compare);
  const pageSize=Math.min(120,Math.max(12,options.pageSize||18));
  const pageCount=Math.max(1,Math.ceil(filtered.length/pageSize));
  const page=Math.min(pageCount,Math.max(1,options.page||1));
  const values=(key:"degreeType"|"language"|"field")=>[...new Set(all.map(item=>item[key]).filter(Boolean) as string[])].sort((a,b)=>key==="degreeType"?degreeRank(a)-degreeRank(b):a.localeCompare(b,"tr"));
  return {programs:filtered.slice((page-1)*pageSize,page*pageSize),total:filtered.length,page,pageCount,universities,cities:[...new Set(universities.map(item=>item.city))].sort((a,b)=>a.localeCompare(b,"tr")),degrees:values("degreeType"),languages:values("language"),fields:values("field"),programOptions:[...new Map(
  filtered
    .filter(item=>item.name?.trim())
    .map(item=>[
      item.name.trim().toLocaleLowerCase("tr-TR"),
      {
        name:item.name.trim(),
        englishName:item.englishName?.trim()||item.name.trim(),
        russianName:(item as Program & {russianName?:string}).russianName?.trim()||"",
        arabicName:(item as Program & {arabicName?:string}).arabicName?.trim()||""
      }
    ])
).values()].sort((a,b)=>a.name.localeCompare(b.name,"tr-TR",{sensitivity:"base"}))};
}
export async function getAllCatalogProgramsForForm():Promise<Program[]>{
  const universities=await getCatalogUniversities();
  const universityBySlug=new Map(universities.map(item=>[item.slug,item]));
  const databasePrograms=await getPrograms();
  const overrides=new Map(databasePrograms.map(item=>[item.slug,item]));
  const referenceSlugs=new Set(referencePrograms.map(item=>item.slug));
  const all=referencePrograms
    .map(item=>overrides.get(item.slug)??(universityBySlug.has(item.universitySlug)?referenceToProgram(item,universityBySlug.get(item.universitySlug)!):null))
    .filter((item):item is Program=>Boolean(item));
  for(const item of databasePrograms){
    if(!referenceSlugs.has(item.slug))all.push(item);
  }
  return all.sort((a,b)=>a.name.localeCompare(b.name,"tr-TR",{sensitivity:"base"})||a.universityName.localeCompare(b.universityName,"tr-TR",{sensitivity:"base"}));
}
export async function getCatalogProgramsForUniversity(university:University,limit=96):Promise<{programs:Program[];total:number}>{const result=await searchCatalogPrograms({university:university.slug,pageSize:Math.min(120,limit),page:1});return {programs:result.programs,total:result.total};}
export async function getProgram(slug:string): Promise<Program|null> { await ensureDatabase(); const saved=await db().prepare("SELECT p.id,p.university_id AS universityId,u.name AS universityName,u.slug AS universitySlug,p.slug,p.name,p.degree_type AS degreeType,p.language,p.duration,p.tuition_fee AS tuitionFee,p.description,p.active,p.updated_at AS updatedAt FROM programs p JOIN universities u ON u.id=p.university_id WHERE p.slug=? AND p.active=1").bind(slug).first<Program>();if(saved)return cleanProgram(saved);const reference=referencePrograms.find(item=>item.slug===slug);if(!reference)return null;const university=await getUniversity(reference.universitySlug);return university?referenceToProgram(reference,university):null; }
export async function getFaqs(activeOnly=true): Promise<Faq[]> { await ensureDatabase(); const q=activeOnly?"SELECT id,question,answer,category,active,sort_order AS sortOrder FROM faqs WHERE active=1 ORDER BY sort_order":"SELECT id,question,answer,category,active,sort_order AS sortOrder FROM faqs ORDER BY sort_order";return (await db().prepare(q).all<Faq>()).results; }
export async function getDashboardData() { await ensureDatabase(); const d1=db(); const [leads,universities,programs,faqs,recent,audit]=await Promise.all([d1.prepare("SELECT COUNT(*) AS count FROM consultation_requests").first<{count:number}>(),d1.prepare("SELECT COUNT(*) AS count FROM universities WHERE active=1").first<{count:number}>(),d1.prepare("SELECT COUNT(*) AS count FROM programs WHERE active=1").first<{count:number}>(),d1.prepare("SELECT COUNT(*) AS count FROM faqs WHERE active=1").first<{count:number}>(),d1.prepare("SELECT * FROM consultation_requests ORDER BY created_at DESC LIMIT 12").all<Consultation>(),d1.prepare("SELECT actor,action,detail,created_at AS createdAt FROM audit_logs ORDER BY created_at DESC LIMIT 8").all<{actor:string;action:string;detail:string;createdAt:string}>()]); return { counts:{leads:leads?.count??0,universities:universities?.count??0,programs:referencePrograms.length+(programs?.count??0),faqs:faqs?.count??0}, recent:recent.results, audit:audit.results } }
export function rawDatabase() { return db(); }
