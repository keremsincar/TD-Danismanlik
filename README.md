# TD Danışmanlık web sitesi

Premium kurumsal site, program arama deneyimi ve güvenli içerik yönetim paneli. Proje Next.js uyumlu Vinext, TypeScript, React, Tailwind CSS ve Cloudflare D1 üzerinde çalışır; Sites dağıtımına hazırdır.

## Özellikler

- Türkçe, İngilizce, Rusça ve Arapça rotaları; Arapça için RTL yerleşim
- Yönetilebilir site adı, hero metni, ana sayfa yazıları, CTA, telefon, WhatsApp, adres, çalışma saati, e-mail, font ve tema renkleri
- Hizmet, üniversite, program, yorum ve SSS kayıtları için ekleme/düzenleme/yayından kaldırma ekranları
- Program arama ve üniversite/şehir/derece/dil filtreleri
- Google Maps haritası ve WhatsApp için hazır mesaj bağlantıları
- Veritabanına kaydedilen danışmanlık talepleri, durum/not yönetimi ve CSV dışa aktarma
- Honeypot, sunucu tarafı doğrulama, aynı-origin kontrolü ve D1 tabanlı rate limiting
- Opsiyonel Resend bildirim e-maili
- Dinamik metadata, Open Graph kartı, sitemap, robots, breadcrumb ve schema.org verileri
- KVKK, gizlilik, çerez ve kullanım şartları sayfaları
- Mobil CTA, WhatsApp mesajları, FAQ asistanı ve çerez tercihleri
- Güvenlik başlıkları ve admin noindex kuralları

## Yerel geliştirme

```bash
npm install
npm run dev
```

Yerel D1 için önce migration dosyalarını uygulayın; ardından ilk istekte örnek içerikler eklenir. Şema değişikliklerinden sonra migration üretin:

```bash
npm run db:generate
```

Mevcut yerel D1 veritabanını güncellerken önce `npm run build` çalıştırın, ardından yeni migration dosyasını Wrangler ile uygulayın. Sıfırdan başlayan veritabanında `drizzle/` dosyalarını sırayla uygulayın. Son migration örneği:

```bash
npx wrangler d1 execute site-creator-d1 --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0002_demonic_the_initiative.sql
```

Kalite kontrolleri:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Ortam değişkenleri

`.env.example` dosyasını temel alın. `ADMIN_EMAIL`, yönetim alanına girebilecek ChatGPT hesaplarını virgülle ayrılmış bir liste olarak belirler. Varsayılan başlangıç hesabı `info@tddanismanlik.com` olarak tanımlıdır.

Yönetici girişi `/admin/login` adresindedir. Kimlik doğrulama, dağıtım platformunun güvenli oturum akışını kullanır; kullanıcı şifresi kaynak kodda veya veritabanında tutulmaz. Bu nedenle briefte paylaşılan başlangıç parolası projeye yazılmamıştır.

`RESEND_API_KEY` girildiğinde yeni danışmanlık talepleri Site Settings içindeki e-mail adresine gönderilir. Anahtar yoksa talep yine D1 veritabanına güvenle kaydedilir ve admin panelinde görünür.

## Dağıtım ve D1

`.openai/hosting.json` içindeki `DB` bağlaması Sites tarafından gerçek D1 kaynağına bağlanır. `drizzle/` klasöründeki migration dosyaları kalıcı şemayı temsil eder. Dağıtımdan önce production değişkenlerini hosting ayarlarından tanımlayın.

## Domain geçişi

1. Siteyi dağıtıp kalıcı hedef adresi alın.
2. Domain sağlayıcınızda yalnızca platformun verdiği A/CNAME kayıtlarını uygulayın.
3. `www` için ana domaine 301 yönlendirmesi ve HTTPS zorlamasını açın.
4. `NEXT_PUBLIC_SITE_URL` değerini canonical domain ile güncelleyin.
5. Mevcut WordPress URL listesini çıkarıp yeni karşılıklarına 301 yönlendirin; nameserver kayıtlarını topluca değiştirmeden önce e-mail ve diğer DNS kayıtlarını yedekleyin.

## Search Console ve Analytics

Deploy sonrası Search Console domain doğrulamasını tamamlayın, `GOOGLE_SITE_VERIFICATION` değerini ekleyin ve `/sitemap.xml` adresini gönderin. GA4 kimliği için `NEXT_PUBLIC_GA_ID` ayrılmıştır. Analitik scripti eklenirken yalnızca kullanıcının analitik çerez onayından sonra çalıştırılmalıdır.

## E-mail ve veri yedekleme

Resend alan adını doğrulayın ve gönderici adresini production hesabınızla eşleştirin. D1 için düzenli export/backup planı kurun; özellikle danışmanlık taleplerini ve site ayarlarını deployment öncesinde yedekleyin.

## İçerik notu

Başlangıç üniversite ve program kayıtları katalog deneyimini göstermek için örnek içeriktir. Yorumlar da yönetim panelinden gerçek ve onaylı yorumlarla değiştirilene kadar açıkça “Temsili yorum” olarak işaretlenir. Ücret, kontenjan ve başvuru şartlarını yayına almadan önce güncel resmî kaynaklarla doğrulayın. KVKK ve yasal sayfaların şirket bilgileri tamamlandıktan sonra hukuk danışmanı tarafından gözden geçirilmesi önerilir.
