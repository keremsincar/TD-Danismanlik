/* eslint-disable @next/next/no-img-element -- Service and process visuals use administrator-managed URLs. */
import { notFound } from "next/navigation";
import Link from "@/components/NativeLink";
import { InnerPage } from "@/components/InnerPage";
import { ConsultationForm } from "@/components/ConsultationForm";
import { ContactPage } from "@/components/ContactPage";
import { ProgramFinder } from "@/components/ProgramFinder";
import { PreferenceRobot } from "@/components/PreferenceRobot";
import { UniversityCatalog } from "@/components/UniversityCatalog";
import { FaqAccordion } from "@/components/FaqAccordion";
import { getAllCatalogProgramsForForm,getCatalogProgramCounts,getCatalogUniversities,getFaqs,getReviews,getServices,getSettings,getSiteImages,getUniversities,searchCatalogPrograms } from "@/lib/content";
import { languageLabels,localizeFaqs,localizeService,pageIntro,requestText } from "@/lib/i18n";
export const dynamic="force-dynamic";
const pages:Record<string,{title:string;lead:string;body:string[]}>= {
  "hakkimizda":{title:"Hakkımızda",lead:"TD Danışmanlık; eğitim, üniversite başvuruları ve resmî işlemlerde karmaşık adımları anlaşılır ve takip edilebilir bir sürece dönüştürür.",body:["Her danışanın hedefi, akademik geçmişi ve koşulları farklıdır. Bu nedenle standart bir yanıt yerine ihtiyaç analiziyle başlar, uygun seçenekleri birlikte değerlendiririz.","Çalışma sürecimiz; ihtiyaçların belirlenmesi, üniversite veya hizmet seçeneklerinin karşılaştırılması, gerekli belge ve başvuru adımlarının planlanması ve sürecin düzenli takibinden oluşur.","Üniversite ve bölüm seçimi, kayıt süreçleri, ikamet izni, adres kaydı, çalışma izni, vatandaşlık, tercüme ve denklik işlemleri gibi farklı alanlarda danışmanlık sunuyoruz.","Bilgileri mümkün olduğunca güncel ve resmî kaynaklarla kontrol eder, kesin kararın üniversite veya ilgili kamu kurumu tarafından verildiği durumlarda bunu açık biçimde belirtiriz.","Türkçe, İngilizce, Rusça ve Arapça iletişim altyapımız sayesinde farklı ülkelerden danışanlarla süreci daha anlaşılır biçimde yürütebiliyoruz."]},
  "gizlilik-politikasi":{title:"Gizlilik Politikası",lead:"Kişisel verilerinizin güvenliği ve şeffaf biçimde işlenmesi bizim için önceliklidir.",body:["İletişim ve danışmanlık formları aracılığıyla paylaştığınız bilgiler yalnızca talebinizi değerlendirmek, sizinle iletişime geçmek ve hizmet sunmak amacıyla kullanılır.","Verileriniz yetkisiz erişime karşı uygun teknik ve idari tedbirlerle korunur; yasal zorunluluklar dışında üçüncü kişilerle paylaşılmaz.","Verilerinize ilişkin talepleriniz için info@tddanismanlik.com adresinden bizimle iletişime geçebilirsiniz."]},
  "kvkk-aydinlatma-metni":{title:"KVKK Aydınlatma Metni",lead:"6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamındaki bilgilendirme metni.",body:["Kimlik ve iletişim bilgileriniz; danışmanlık talebinizi almak, sizinle iletişim kurmak, hizmet süreçlerini yürütmek ve yasal yükümlülükleri yerine getirmek amacıyla işlenebilir.","Kişisel verileriniz, açık rızanız veya kanunda belirtilen hukuki sebepler doğrultusunda ve amaçla sınırlı olarak saklanır.","KVKK’nın 11. maddesi kapsamındaki haklarınızı kullanmak için info@tddanismanlik.com adresine başvurabilirsiniz. Nihai hukuki metin, şirket bilgilerinin tamamlanmasının ardından hukuk danışmanınız tarafından gözden geçirilmelidir."]},
  "cerez-politikasi":{title:"Çerez Politikası",lead:"Sitemizde hangi çerezlerin neden kullanıldığını açıkça anlatıyoruz.",body:["Zorunlu çerezler sitenin güvenli ve doğru çalışması için gereklidir. Analitik ve pazarlama çerezleri yalnızca onayınızla etkinleştirilir.","Tercihlerinizi çerez bildirimindeki seçeneklerden yönetebilir veya tarayıcınız üzerinden silebilirsiniz."]},
  "kullanim-sartlari":{title:"Kullanım Şartları",lead:"Web sitemizi kullanırken geçerli olan temel koşullar.",body:["Sitede sunulan bilgiler genel bilgilendirme amaçlıdır ve kişiye özel hukuki görüş yerine geçmez. Güncel ve kişisel değerlendirme için danışmanlık talebi oluşturabilirsiniz.","İçeriklerin izinsiz çoğaltılması ve ticari amaçla kullanılması yasaktır."]},
};
const translatedPages:Record<string,Record<string,{title:string;lead:string;body:string[]}>>={
 en:{
  "hakkimizda":{title:"Consulting built on trust, clarity and care.",lead:"TD Consulting turns complex education and official procedures into a clear, trackable journey.",body:["Every applicant has different goals and circumstances. We begin with a careful needs assessment rather than a standard answer.","We review information against current sources and keep communication transparent at every stage."]},
  "gizlilik-politikasi":{title:"Privacy Policy",lead:"Protecting your personal data and explaining how it is used are priorities for us.",body:["Information submitted through contact and consultation forms is used only to review your request, contact you and provide the requested service.","We take appropriate technical and organisational measures against unauthorised access and do not share data except where legally required.","Contact info@tddanismanlik.com with requests concerning your personal data."]},
  "kvkk-aydinlatma-metni":{title:"Personal Data Notice",lead:"Information provided under Türkiye’s Personal Data Protection Law No. 6698.",body:["Identity and contact details may be processed to receive your consultation request, communicate with you, deliver services and meet legal obligations.","Personal data is retained only for the stated purpose and on the basis of consent or another lawful ground.","You can exercise your rights by contacting info@tddanismanlik.com."]},
  "cerez-politikasi":{title:"Cookie Policy",lead:"This page explains which cookies we use and why.",body:["Essential cookies are required for the site to work securely. Analytics and marketing cookies are activated only with your consent.","You can manage your choices in the cookie notice or remove cookies through your browser settings."]},
  "kullanim-sartlari":{title:"Terms of Use",lead:"The basic terms that apply when using this website.",body:["Site content is general information and is not a substitute for advice tailored to your case. Request a consultation for a current individual assessment.","Unauthorised reproduction or commercial use of the content is prohibited."]}
 },
 ru:{
  "hakkimizda":{title:"Консультации на основе доверия и ясности.",lead:"TD Consulting превращает сложные образовательные и официальные процедуры в понятный план.",body:["Цели и обстоятельства каждого клиента различаются, поэтому мы начинаем с анализа потребностей.","Проверяем информацию по актуальным источникам и поддерживаем прозрачную связь на каждом этапе."]},
  "gizlilik-politikasi":{title:"Политика конфиденциальности",lead:"Мы уделяем приоритетное внимание защите персональных данных.",body:["Данные из форм используются только для рассмотрения запроса, связи с вами и оказания услуги.","Мы принимаем меры против несанкционированного доступа и не передаём данные без законного основания.","По вопросам данных пишите на info@tddanismanlik.com."]},
  "kvkk-aydinlatma-metni":{title:"Уведомление о персональных данных",lead:"Информация в соответствии с Законом Турции № 6698.",body:["Контактные данные могут обрабатываться для связи, оказания услуг и выполнения требований закона.","Данные хранятся только в пределах заявленной цели и правового основания.","Для реализации своих прав обратитесь по адресу info@tddanismanlik.com."]},
  "cerez-politikasi":{title:"Политика cookie",lead:"Какие файлы cookie используются на сайте и зачем.",body:["Обязательные cookie нужны для безопасной работы сайта. Аналитические и маркетинговые cookie включаются только с вашего согласия.","Настройками можно управлять в уведомлении или в браузере."]},
  "kullanim-sartlari":{title:"Условия использования",lead:"Основные правила использования сайта.",body:["Информация на сайте носит общий характер и не заменяет индивидуальную консультацию.","Копирование и коммерческое использование материалов без разрешения запрещено."]}
 },
 ar:{
  "hakkimizda":{title:"استشارات تقوم على الثقة والوضوح.",lead:"تحول TD للاستشارات خطوات التعليم والمعاملات الرسمية إلى مسار واضح يمكن متابعته.",body:["تختلف أهداف كل عميل وظروفه، لذلك نبدأ بتقييم الاحتياجات بعناية.","نراجع المعلومات وفق المصادر الحالية ونحافظ على تواصل شفاف في كل مرحلة."]},
  "gizlilik-politikasi":{title:"سياسة الخصوصية",lead:"حماية بياناتك الشخصية وشرح طريقة استخدامها من أولوياتنا.",body:["تستخدم معلومات النماذج لمراجعة طلبك والتواصل معك وتقديم الخدمة فقط.","نتخذ تدابير مناسبة ضد الوصول غير المصرح به ولا نشارك البيانات إلا عند وجود التزام قانوني.","للاستفسارات تواصل عبر info@tddanismanlik.com."]},
  "kvkk-aydinlatma-metni":{title:"إشعار حماية البيانات",lead:"معلومات وفق قانون حماية البيانات الشخصية التركي رقم 6698.",body:["قد تعالج بيانات الاتصال لتلقي طلبك والتواصل وتقديم الخدمات والوفاء بالالتزامات القانونية.","تُحفظ البيانات ضمن الغرض والأساس القانوني المحدد فقط.","يمكنك ممارسة حقوقك عبر info@tddanismanlik.com."]},
  "cerez-politikasi":{title:"سياسة ملفات الارتباط",lead:"نوضح ملفات الارتباط التي نستخدمها وسبب استخدامها.",body:["ملفات الارتباط الضرورية لازمة لتشغيل الموقع بأمان. لا تُفعّل ملفات التحليل والتسويق إلا بموافقتك.","يمكنك إدارة تفضيلاتك من إشعار ملفات الارتباط أو إعدادات المتصفح."]},
  "kullanim-sartlari":{title:"شروط الاستخدام",lead:"الشروط الأساسية لاستخدام هذا الموقع.",body:["المعلومات عامة ولا تغني عن استشارة مخصصة لحالتك.","يُمنع نسخ المحتوى أو استخدامه تجارياً دون إذن."]}
 }
};
const catalogSourceCopy={
 tr:<>Katalog bilgileri, belirtilen <a href="https://index-v3-eight.vercel.app" target="_blank" rel="noopener noreferrer">veri kaynağı</a> temel alınarak hazırlanır. Ücret ve kabul koşullarında üniversitelerin güncel resmî duyuruları esas alınmalıdır.</>,
 en:<>Catalog information is prepared from the stated <a href="https://index-v3-eight.vercel.app" target="_blank" rel="noopener noreferrer">data source</a>. Current official university announcements govern tuition and admission conditions.</>,
 ru:<>Каталог составлен на основе указанного <a href="https://index-v3-eight.vercel.app" target="_blank" rel="noopener noreferrer">источника данных</a>. Условия оплаты и приёма следует уточнять по официальным объявлениям университетов.</>,
 ar:<>تُعد بيانات الدليل استناداً إلى <a href="https://index-v3-eight.vercel.app" target="_blank" rel="noopener noreferrer">مصدر البيانات</a> المذكور. وتُعتمد الإعلانات الرسمية الحديثة للجامعات في الرسوم وشروط القبول.</>,
} as const;
export async function generateMetadata({params}:{params:Promise<{locale:string;slug:string}>}){
  const {locale,slug}=await params;

  if(slug==="tesekkurler"){
    return{
      title:"Talebiniz Alındı | TD Danışmanlık",
      robots:{index:false,follow:false}
    };
  }

  const trMeta:Record<string,{title:string;description:string}>={
    hakkimizda:{
      title:"Hakkımızda | TD Danışmanlık",
      description:"TD Danışmanlık'ın çalışma yaklaşımı, danışmanlık süreci ve eğitim ile resmî işlemlerde sunduğu destek alanları."
    },
    hizmetler:{
      title:"Hizmetlerimiz | TD Danışmanlık",
      description:"Üniversite başvuruları, ikamet, vatandaşlık ve diğer resmî işlemler için sunduğumuz danışmanlık hizmetlerini inceleyin."
    },
    universiteler:{
      title:"Üniversiteler | TD Danışmanlık",
      description:"Türkiye'deki üniversiteleri şehir, kurum türü ve program seçeneklerine göre inceleyin."
    },
    bolumler:{
      title:"Bölümler ve Programlar | TD Danışmanlık",
      description:"Üniversite bölümlerini ve programlarını eğitim dili, derece türü, şehir ve üniversiteye göre inceleyin."
    },
    "tercih-robotu":{
      title:"Tercih Robotu | TD Danışmanlık",
      description:"Eğitim düzeyi, şehir ve alan tercihlerinize göre uygun üniversite programlarını keşfedin."
    },
    surec:{
      title:"Çalışma Sürecimiz | TD Danışmanlık",
      description:"Danışmanlık sürecimizin ihtiyaç analizinden başvuru ve takibe kadar nasıl ilerlediğini inceleyin."
    },
    yorumlar:{
      title:"Danışan Görüşleri | TD Danışmanlık",
      description:"TD Danışmanlık hizmetlerinden yararlanan danışanların görüşlerini inceleyin."
    },
    sss:{
      title:"Sık Sorulan Sorular | TD Danışmanlık",
      description:"Üniversite başvuruları ve resmî işlemler hakkında sık sorulan soruların yanıtlarını inceleyin."
    },
    iletisim:{
      title:"İletişim | TD Danışmanlık",
      description:"TD Danışmanlık ile iletişime geçin ve danışmanlık süreciniz hakkında bilgi alın."
    },
    "danismanlik-talebi":{
      title:"Danışmanlık Talebi | TD Danışmanlık",
      description:"Eğitim veya resmî işlemler için danışmanlık talebinizi oluşturun."
    },
    "gizlilik-politikasi":{
      title:"Gizlilik Politikası | TD Danışmanlık",
      description:"TD Danışmanlık gizlilik politikasını inceleyin."
    },
    "kvkk-aydinlatma-metni":{
      title:"KVKK Aydınlatma Metni | TD Danışmanlık",
      description:"Kişisel verilerin işlenmesine ilişkin KVKK aydınlatma metni."
    },
    "cerez-politikasi":{
      title:"Çerez Politikası | TD Danışmanlık",
      description:"TD Danışmanlık web sitesinin çerez kullanım politikasını inceleyin."
    },
    "kullanim-sartlari":{
      title:"Kullanım Şartları | TD Danışmanlık",
      description:"TD Danışmanlık web sitesi kullanım şartlarını inceleyin."
    }
  };

  if(locale==="tr"&&trMeta[slug]){
    return trMeta[slug];
  }

  const page=translatedPages[locale]?.[slug]??pages[slug];

  if(page){
    return{
      title:`${page.title} | TD Danışmanlık`,
      description:page.lead
    };
  }

  return{
    title:"TD Danışmanlık",
    description:"Eğitim, üniversite başvuruları ve resmî işlemler için danışmanlık hizmetleri."
  };
}

export default async function GenericPage({params,searchParams}:{params:Promise<{locale:string;slug:string}>;searchParams:Promise<{page?:string;q?:string;city?:string;type?:string;sort?:string;university?:string;degree?:string;language?:string;field?:string;programPage?:string;program?:string}>}){const [{locale,slug},query]=await Promise.all([params,searchParams]);const initialPage=Math.max(1,Number.parseInt(query.page||"1",10)||1);const [settings,services,universities,images]=await Promise.all([getSettings(),getServices(),getUniversities(),getSiteImages()]);
const programs=slug==="danismanlik-talebi"?await getAllCatalogProgramsForForm():[];const t=languageLabels(locale),request=requestText(locale);if(slug==="danismanlik-talebi")return <InnerPage settings={settings} locale={locale} crumbs={[{label:t.home,href:`/${locale}`},{label:t.request}]}><main className="request-page"><section><p className="section-index">{t.request}</p><h1>{request.title1}<br/><em>{request.title2}</em></h1><p>{request.lead}</p><div className="request-points"><span>{request.point1}</span><span>{request.point2}</span><span>{request.point3}</span></div></section><ConsultationForm {...{services,universities,programs,locale}}/></main></InnerPage>;
  if(slug==="iletisim")return <InnerPage settings={settings} locale={locale} crumbs={[{label:t.home,href:`/${locale}`},{label:t.contact}]}><ContactPage settings={settings} locale={locale}/></InnerPage>;
  if(slug==="tesekkurler")return <InnerPage settings={settings} locale={locale} crumbs={[{label:t.home,href:`/${locale}`},{label:request.thanksTitle}]}><main className="thanks-page"><span>✓</span><p className="section-index">{request.thanksKicker}</p><h1>{request.thanksTitle}</h1><p>{request.thanksBody}</p><div><Link className="button button-dark" href={`/${locale}`}>{request.home}</Link>{settings.whatsapp&&<a className="button button-primary" href={`https://wa.me/${settings.whatsapp.replace(/\D/g,"")}`}>{request.whatsapp}</a>}</div></main></InnerPage>;
  if(slug==="hizmetler")return <InnerPage settings={settings} locale={locale} crumbs={[{label:t.home,href:`/${locale}`},{label:t.services}]}><main className="listing-page"><header><p className="elab-kicker">{settings.siteName} / {t.services}</p><h1>{pageIntro(locale,"hizmetler")[0]}</h1><p>{pageIntro(locale,"hizmetler")[1]}</p></header><div className="listing-grid service-listing-grid">{services.map(item=>{const s=localizeService(locale,item);return <Link key={s.id} href={`/${locale}/hizmetler/${s.slug}`}><span className="listing-service-photo"><img src={s.image} alt="" loading="lazy"/></span><h2>{s.title}</h2><p>{s.summary}</p><b>{t.viewService}</b></Link>})}</div></main></InnerPage>;
  if(slug==="universiteler"){const catalog=await getCatalogUniversities();const filters={query:query.q||"",city:query.city||"",type:query.type||"",sort:query.sort||"name"};const source=catalogSourceCopy[(locale in catalogSourceCopy?locale:"tr") as keyof typeof catalogSourceCopy];return <InnerPage settings={settings} locale={locale} crumbs={[{label:t.home,href:`/${locale}`},{label:t.universities}]}><main className="listing-page"><header><p className="elab-kicker">{t.universities}</p><h1>{pageIntro(locale,"universiteler")[0]}</h1><p>{pageIntro(locale,"universiteler")[1]}</p></header><UniversityCatalog universities={catalog} locale={locale} initialPage={initialPage} filters={filters} programCounts={getCatalogProgramCounts()}/><p className="catalog-source">{source}</p></main></InnerPage>}
  if(slug==="tercih-robotu"){const options=await searchCatalogPrograms({pageSize:12,sort:"degree"});return <InnerPage settings={settings} locale={locale} crumbs={[{label:t.home,href:`/${locale}`},{label:locale==="tr"?"Tercih Robotu":"Program Matcher"}]}><PreferenceRobot locale={locale} cities={options.cities} degrees={options.degrees} languages={options.languages} fields={options.fields}/></InnerPage>}
  if(slug==="bolumler"){
  const selectedProgram=query.program||"";
  const searchTerm=(query.q||"").trim();
  const sortMode=query.sort==="desc"?"desc":"asc";
  const currentProgramPage=Math.max(1,Number.parseInt(query.programPage||"1",10)||1);
  const perPage=24;

  const catalog=await searchCatalogPrograms({
    query:selectedProgram,
    page:1,
    pageSize:120,
    sort:"program-asc"
  });

  const compareTr=(a:string,b:string)=>
    a.trim().localeCompare(b.trim(),"tr-TR",{sensitivity:"base"});

  const normalize=(value:string)=>
    value.toLocaleLowerCase("tr-TR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"")
      .replace(/ı/g,"i");

  const localizedProgramOptions=catalog.programOptions.map(item=>{
    const display=
      locale==="tr"
        ? item.name
        : locale==="en"
          ? (item.englishName||item.name)
          : locale==="ru"
            ? (item.russianName||item.englishName||item.name)
            : locale==="ar"
              ? (item.arabicName||item.englishName||item.name)
              : (item.englishName||item.name);

    return {
      canonical:item.name,
      display
    };
  });

  const filteredProgramNames=localizedProgramOptions
    .filter(item=>
      !searchTerm||
      normalize(item.display).includes(normalize(searchTerm))||
      normalize(item.canonical).includes(normalize(searchTerm))
    )
    .sort((a,b)=>
      sortMode==="desc"
        ? compareTr(b.display,a.display)
        : compareTr(a.display,b.display)
    );

  const programPageCount=Math.max(1,Math.ceil(filteredProgramNames.length/perPage));
  const safeProgramPage=Math.min(currentProgramPage,programPageCount);

  const visibleProgramNames=filteredProgramNames.slice(
    (safeProgramPage-1)*perPage,
    safeProgramPage*perPage
  );

  const matchingPrograms=selectedProgram
    ? catalog.programs.filter(
        program=>program.name.trim().localeCompare(
          selectedProgram.trim(),
          "tr-TR",
          {sensitivity:"base"}
        )===0
      )
    : [];

  const universityMap=new Map<
    string,
    {name:string;slug:string;count:number}
  >();

  for(const program of matchingPrograms){
    const current=universityMap.get(program.universitySlug);

    if(current){
      current.count+=1;
    }else{
      universityMap.set(program.universitySlug,{
        name:program.universityName,
        slug:program.universitySlug,
        count:1
      });
    }
  }

  const fieldUniversities=[...universityMap.values()]
    .sort((a,b)=>compareTr(a.name,b.name));

  const programCopy={
    tr:{
      title:"Üniversite Bölümleri",
      description:"İlgilendiğiniz bölümü arayın, sıralayın ve bu bölümü sunan üniversiteleri görüntüleyin.",
      search:"Bölüm ara",
      placeholder:"Örn. Bilgisayar Mühendisliği",
      sort:"Sırala",
      apply:"Uygula",
      clear:"Temizle",
      found:"bölüm bulundu",
      viewUniversities:"Üniversiteleri Gör",
      cardDescription:"Bu bölümü sunan üniversiteleri görüntüleyin.",
      noResults:"Aramanıza uygun bölüm bulunamadı.",
      allPrograms:"Tüm Bölümler",
      viewUniversity:"Üniversiteyi İncele",
      noUniversities:"Bu bölüm için üniversite bulunamadı.",
      selectedSuffix:"programının bulunduğu üniversiteleri inceleyin."
    },
    en:{
      title:"University Programs",
      description:"Search and sort programs, then view the universities offering them.",
      search:"Search program",
      placeholder:"e.g. Computer Engineering",
      sort:"Sort",
      apply:"Apply",
      clear:"Clear",
      found:"programs found",
      viewUniversities:"View Universities",
      cardDescription:"View universities offering this program.",
      noResults:"No programs matched your search.",
      allPrograms:"All Programs",
      viewUniversity:"View University",
      noUniversities:"No universities found for this program.",
      selectedSuffix:"is offered by the following universities."
    },
    ru:{
      title:"Университетские программы",
      description:"Найдите нужную программу, отсортируйте список и посмотрите университеты, где она доступна.",
      search:"Поиск программы",
      placeholder:"Напр. Компьютерная инженерия",
      sort:"Сортировка",
      apply:"Применить",
      clear:"Очистить",
      found:"программ найдено",
      viewUniversities:"Смотреть университеты",
      cardDescription:"Посмотреть университеты, предлагающие эту программу.",
      noResults:"По вашему запросу программы не найдены.",
      allPrograms:"Все программы",
      viewUniversity:"Смотреть университет",
      noUniversities:"Для этой программы университеты не найдены.",
      selectedSuffix:"доступна в следующих университетах."
    },
    ar:{
      title:"التخصصات والبرامج الجامعية",
      description:"ابحث عن البرنامج ورتّب النتائج ثم اعرض الجامعات التي تقدمه.",
      search:"ابحث عن برنامج",
      placeholder:"مثال: هندسة الحاسوب",
      sort:"الترتيب",
      apply:"تطبيق",
      clear:"مسح",
      found:"برنامج",
      viewUniversities:"عرض الجامعات",
      cardDescription:"اعرض الجامعات التي تقدم هذا البرنامج.",
      noResults:"لم يتم العثور على برامج مطابقة.",
      allPrograms:"جميع البرامج",
      viewUniversity:"عرض الجامعة",
      noUniversities:"لم يتم العثور على جامعات لهذا البرنامج.",
      selectedSuffix:"متاح في الجامعات التالية."
    }
  } as const;

  const pc=programCopy[(locale in programCopy?locale:"tr") as keyof typeof programCopy];

  const selectedProgramOption=catalog.programOptions.find(
    item=>item.name.trim().localeCompare(
      selectedProgram.trim(),
      "tr-TR",
      {sensitivity:"base"}
    )===0
  );

  const selectedProgramDisplay=!selectedProgram
    ? ""
    : locale==="tr"
      ? selectedProgram
      : locale==="en"
        ? (selectedProgramOption?.englishName||selectedProgram)
        : locale==="ru"
          ? (selectedProgramOption?.russianName||selectedProgramOption?.englishName||selectedProgram)
          : locale==="ar"
            ? (selectedProgramOption?.arabicName||selectedProgramOption?.englishName||selectedProgram)
            : (selectedProgramOption?.englishName||selectedProgram);

  const title=selectedProgram
    ? selectedProgramDisplay
    : pc.title;

  const description=selectedProgram
    ? `${selectedProgramDisplay} ${pc.selectedSuffix}`
    : pc.description;

  const makePageHref=(page:number)=>{
    const params=new URLSearchParams();
    if(searchTerm)params.set("q",searchTerm);
    if(sortMode==="desc")params.set("sort","desc");
    if(page>1)params.set("programPage",String(page));
    const qs=params.toString();
    return `/${locale}/bolumler${qs?`?${qs}`:""}`;
  };

  return <InnerPage
    settings={settings}
    locale={locale}
    crumbs={[
      {label:t.home,href:`/${locale}`},
      {label:t.programs,href:`/${locale}/bolumler`},
      ...(selectedProgram?[{label:selectedProgram}]:[])
    ]}
  >
    <main className="listing-page program-index-page">
      <header>
        <p className="elab-kicker">{t.programs}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      {!selectedProgram ? (
        <>
          <form className="program-filter-bar" method="get">
            <label>
              <span>{pc.search}</span>
              <input
                type="search"
                name="q"
                defaultValue={searchTerm}
                placeholder={pc.placeholder}
              />
            </label>

            <label>
              <span>{pc.sort}</span>
              <select name="sort" defaultValue={sortMode}>
                <option value="asc">A → Z</option>
                <option value="desc">Z → A</option>
              </select>
            </label>

            <button className="button button-primary" type="submit">
              {pc.apply}
            </button>

            {(searchTerm||sortMode==="desc")&&(
              <Link className="program-filter-clear" href={`/${locale}/bolumler`}>
                {pc.clear}
              </Link>
            )}
          </form>

          <div className="program-results-meta">
            <strong>{filteredProgramNames.length}</strong> {pc.found}
          </div>

          <div className="listing-grid program-listing-grid">
            {visibleProgramNames.map(program=>(
              <Link
                className="program-card"
                key={program.canonical}
                href={`/${locale}/bolumler?program=${encodeURIComponent(program.canonical)}`}
              >
                <h2>{program.display}</h2>
                <p>{pc.cardDescription}</p>
                <b>{pc.viewUniversities}</b>
              </Link>
            ))}
          </div>

          {!visibleProgramNames.length&&(
            <div className="empty-state">
              {pc.noResults}
            </div>
          )}

          {programPageCount>1&&(
            <nav className="program-pagination" aria-label="Bölüm sayfaları">
              {safeProgramPage>1&&(
                <Link href={makePageHref(safeProgramPage-1)}>←</Link>
              )}

              {Array.from({length:programPageCount},(_,i)=>i+1)
                .filter(page=>
                  page===1||
                  page===programPageCount||
                  Math.abs(page-safeProgramPage)<=2
                )
                .map((page,index,array)=>{
                  const previous=array[index-1];
                  return <span key={page} className="program-page-group">
                    {previous&&page-previous>1&&<span className="program-page-dots">…</span>}
                    <Link
                      className={page===safeProgramPage?"is-active":""}
                      href={makePageHref(page)}
                    >
                      {page}
                    </Link>
                  </span>
                })}

              {safeProgramPage<programPageCount&&(
                <Link href={makePageHref(safeProgramPage+1)}>→</Link>
              )}
            </nav>
          )}
        </>
      ) : (
        <>
          <Link className="elab-pill program-back-link" href={`/${locale}/bolumler`}>
            ← {pc.allPrograms}
          </Link>

          <div className="listing-grid program-university-grid">
            {fieldUniversities.map(university=>(
              <Link
                key={university.slug}
                href={`/${locale}/universiteler/${university.slug}`}
              >
                <h2>{university.name}</h2>
                <p>{selectedProgramDisplay}</p>
                <b>{pc.viewUniversity}</b>
              </Link>
            ))}
          </div>

          {!fieldUniversities.length&&(
            <div className="empty-state">
              {pc.noUniversities}
            </div>
          )}
        </>
      )}
    </main>
  </InnerPage>
}

if(slug==="surec")return <InnerPage settings={settings} locale={locale} crumbs={[{label:t.home,href:`/${locale}`},{label:t.process}]}><main className="listing-page process-listing-page"><header><p className="elab-kicker">{t.processKicker}</p><h1>{pageIntro(locale,"surec")[0]}</h1><p>{pageIntro(locale,"surec")[1]}</p></header><div className="process-showcase"><div className="process-page-grid">{[[t.meet,t.meetBody],[t.roadmap,t.roadmapBody],[t.application,t.applicationBody],[t.followup,t.followupBody]].map(([title,body],index)=><article key={title}><span>{locale==="tr"?`Aşama ${index+1}`:`0${index+1}`}</span><h2>{title}</h2><p>{body}</p></article>)}</div><aside className="process-media"><img src={images.about} alt=""/><div><strong>TD</strong><span>{settings.siteName.replace(/^TD\s+/i,"")}</span></div></aside></div><Link className="elab-pill elab-pill-blue process-page-cta" href={`/${locale}/danismanlik-talebi`}>{t.request}</Link></main></InnerPage>;
  if(slug==="sss"){const faqs=localizeFaqs(locale,await getFaqs());return <InnerPage settings={settings} locale={locale} crumbs={[{label:t.home,href:`/${locale}`},{label:t.faq}]}><main className="listing-page faq-listing-page"><header><p className="elab-kicker">{t.faqKicker}</p><h1>{pageIntro(locale,"sss")[0]}</h1><p>{pageIntro(locale,"sss")[1]}</p></header><FaqAccordion className="faq-page-list" items={faqs} showCategory/></main></InnerPage>}
  if(slug==="yorumlar"){const reviews=await getReviews();return <InnerPage settings={settings} locale={locale} crumbs={[{label:t.home,href:`/${locale}`},{label:t.reviews}]}><main className="listing-page"><header><p className="elab-kicker">{t.reviewKicker}</p><h1>{pageIntro(locale,"yorumlar")[0]}</h1><p>{pageIntro(locale,"yorumlar")[1]}</p></header>{reviews.length?<div className="review-page-grid">{reviews.map(r=><article key={r.id}><blockquote>“{r.quote}”</blockquote><div className="review-page-person"><span aria-hidden="true">{r.author.slice(0,1)}</span><p><strong>{r.author}</strong><small>{r.context}</small></p></div></article>)}</div>:<div className="empty-state">{locale==="tr"?"Henüz yayımlanmış danışan görüşü bulunmuyor.":locale==="en"?"No client feedback has been published yet.":locale==="ru"?"Отзывы клиентов пока не опубликованы.":"لم تُنشر آراء العملاء بعد."}</div>}</main></InnerPage>}
  const page=translatedPages[locale]?.[slug]??pages[slug];if(!page)notFound();const updated=locale==="en"?"Last updated: 24 September 2026":locale==="ru"?"Обновлено: 24 сентября 2026":locale==="ar"?"آخر تحديث: 24 سبتمبر 2026":"";return <InnerPage settings={settings} locale={locale} crumbs={[{label:t.home,href:`/${locale}`},{label:page.title}]}><main className="legal-page"><header><p className="section-index">TD DANIŞMANLIK</p><h1>{page.title}</h1><p>{page.lead}</p></header><article>{page.body.map(p=><p key={p}>{p}</p>)}{slug!=="hakkimizda"&&<small>{updated}</small>}</article></main></InnerPage>}
