import Link from "@/components/NativeLink";
import type { University } from "@/lib/content";
import { UniversityMark } from "./UniversityMark";

const PAGE_SIZE=12;
const catalogText={
 tr:{search:"Üniversite ara",searchPlaceholder:"Üniversite veya şehir",city:"Şehir",allCities:"Tüm şehirler",type:"Kurum türü",allTypes:"Tümü",state:"Devlet",foundation:"Vakıf",sort:"Sıralama",nameAsc:"Ada göre A–Z",nameDesc:"Ada göre Z–A",citySort:"Şehre göre",newest:"En yeni kuruluş",apply:"Sonuçları göster",clear:"Filtreleri temizle",results:"üniversite",page:"Sayfa",founded:"kuruluş",view:"Üniversiteyi incele",programs:"program",pending:"Program verisi güncelleniyor",empty:"Bu filtrelerle eşleşen üniversite bulunamadı.",previous:"Önceki",next:"Sonraki"},
 en:{search:"Search universities",searchPlaceholder:"University or city",city:"City",allCities:"All cities",type:"Institution type",allTypes:"All",state:"Public",foundation:"Foundation",sort:"Sort",nameAsc:"Name A–Z",nameDesc:"Name Z–A",citySort:"City",newest:"Newest founded",apply:"Show results",clear:"Clear filters",results:"universities",page:"Page",founded:"founded",view:"View university",programs:"programs",pending:"Program data is being updated",empty:"No universities match these filters.",previous:"Previous",next:"Next"},
 ru:{search:"Поиск университетов",searchPlaceholder:"Университет или город",city:"Город",allCities:"Все города",type:"Тип вуза",allTypes:"Все",state:"Государственный",foundation:"Частный",sort:"Сортировка",nameAsc:"Название А–Я",nameDesc:"Название Я–А",citySort:"По городу",newest:"Новые вузы",apply:"Показать",clear:"Сбросить фильтры",results:"университетов",page:"Страница",founded:"основан",view:"Открыть университет",programs:"программ",pending:"Данные программ обновляются",empty:"Ничего не найдено.",previous:"Назад",next:"Далее"},
 ar:{search:"ابحث عن جامعة",searchPlaceholder:"الجامعة أو المدينة",city:"المدينة",allCities:"كل المدن",type:"نوع المؤسسة",allTypes:"الكل",state:"حكومية",foundation:"وقفية",sort:"الترتيب",nameAsc:"الاسم تصاعدياً",nameDesc:"الاسم تنازلياً",citySort:"حسب المدينة",newest:"الأحدث تأسيساً",apply:"عرض النتائج",clear:"مسح الفلاتر",results:"جامعة",page:"صفحة",founded:"تأسست",view:"عرض الجامعة",programs:"برنامجاً",pending:"بيانات البرامج قيد التحديث",empty:"لا توجد جامعات مطابقة.",previous:"السابق",next:"التالي"}
} as const;

type Filters={query:string;city:string;type:string;sort:string};
function pageUrl(locale:string,page:number,filters:Filters){const params=new URLSearchParams();if(filters.query)params.set("q",filters.query);if(filters.city)params.set("city",filters.city);if(filters.type)params.set("type",filters.type);if(filters.sort&&filters.sort!=="name")params.set("sort",filters.sort);const suffix=params.toString();return `/${locale}/universiteler?page=${page}${suffix?`&${suffix}`:""}#universite-listesi`;}

export function UniversityCatalog({universities,locale,initialPage=1,filters,programCounts}:{universities:University[];locale:string;initialPage?:number;filters:Filters;programCounts:Record<string,number>}) {
  const t=catalogText[(locale in catalogText?locale:"tr") as keyof typeof catalogText];
  const term=filters.query.toLocaleLowerCase("tr-TR").trim();
  const compareTr=(a:string,b:string)=>a.trim().localeCompare(b.trim(),"tr-TR",{sensitivity:"base"});
  const cities=[...new Set(universities.map(u=>u.city))].sort(compareTr);
  const filtered=universities.filter(u=>(!term||`${u.name} ${u.city}`.toLocaleLowerCase("tr-TR").includes(term))&&(!filters.city||u.city===filters.city)&&(!filters.type||u.institutionType===filters.type)).sort((a,b)=>filters.sort==="name-desc"?compareTr(b.name,a.name):filters.sort==="city"?compareTr(a.city,b.city)||compareTr(a.name,b.name):filters.sort==="newest"?Number(b.founded)-Number(a.founded)||compareTr(a.name,b.name):compareTr(a.name,b.name));
  const pageCount=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));
  const currentPage=Math.min(Math.max(1,initialPage),pageCount);
  const visible=filtered.slice((currentPage-1)*PAGE_SIZE,currentPage*PAGE_SIZE);
  return <div className="university-catalog">
    <form className="catalog-filters catalog-filters-premium" method="get" action={`/${locale}/universiteler`}>
      <div className="catalog-filter-primary">
       <label className="catalog-search">{t.search}<input name="q" type="search" defaultValue={filters.query} placeholder={t.searchPlaceholder}/></label>
       <button className="filter-submit" type="submit">{t.apply}<span aria-hidden="true">↗</span></button>
      </div>
      <div className="catalog-filter-secondary">
       <label>{t.city}<select name="city" defaultValue={filters.city}><option value="">{t.allCities}</option>{cities.map(x=><option key={x}>{x}</option>)}</select></label>
       <label>{t.type}<select name="type" defaultValue={filters.type}><option value="">{t.allTypes}</option><option value="Devlet">{t.state}</option><option value="Vakıf">{t.foundation}</option></select></label>
       <label>{t.sort}<select name="sort" defaultValue={filters.sort}><option value="name">{t.nameAsc}</option><option value="name-desc">{t.nameDesc}</option><option value="city">{t.citySort}</option><option value="newest">{t.newest}</option></select></label>
       <Link className="filter-clear" href={`/${locale}/universiteler`}>{t.clear}</Link>
      </div>
    </form>
    <div className="catalog-page-frame" id="universite-listesi">
      <div className="catalog-results-head"><p><strong>{filtered.length}</strong> {t.results}</p><span>{t.page} {currentPage}/{pageCount}</span></div>
      <div className="catalog-cards">{visible.map((u,index)=><Link href={`/${locale}/universiteler/${u.slug}`} className={`catalog-university-card ${u.institutionType==="Vakıf"?"is-foundation":"is-public"}`} key={u.id}>
        <div className="catalog-card-index">{String((currentPage-1)*PAGE_SIZE+index+1).padStart(2,"0")}</div>
        <div className="catalog-university-meta"><UniversityMark name={u.name} logoUrl={u.logoUrl}/><p><span>{u.city}</span><span>{u.institutionType==="Devlet"?t.state:u.institutionType==="Vakıf"?t.foundation:u.institutionType}</span></p></div>
        <h2>{u.name}</h2>
        <div className="catalog-card-facts">{programCounts[u.slug]?<span><b>{programCounts[u.slug]}</b> {t.programs}</span>:null}{u.founded&&u.founded!=="—"&&<span><b>{u.founded}</b> {t.founded}</span>}</div>
        <div className="catalog-card-cta"><span>{t.view}</span><b aria-hidden="true">↗</b></div>
      </Link>)}</div>
    </div>
    {!visible.length&&<p className="empty-state">{t.empty}</p>}
    {pageCount>1&&<nav className="catalog-pagination" aria-label={t.page}>{currentPage===1?<span className="pagination-disabled">{t.previous}</span>:<Link href={pageUrl(locale,currentPage-1,filters)}>{t.previous}</Link>}<strong>{currentPage} / {pageCount}</strong>{currentPage===pageCount?<span className="pagination-disabled">{t.next}</span>:<Link href={pageUrl(locale,currentPage+1,filters)}>{t.next}</Link>}</nav>}
  </div>;
}
