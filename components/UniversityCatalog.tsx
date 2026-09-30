import Link from "@/components/NativeLink";
import type { University } from "@/lib/content";

const PAGE_SIZE=12;
const catalogText={
 tr:{search:"Üniversite ara",searchPlaceholder:"Ad veya şehir yazın",city:"Şehir",allCities:"Tüm şehirler",type:"Kurum türü",allTypes:"Tümü",state:"Devlet",foundation:"Vakıf",sort:"Sırala",nameAsc:"Ada göre A–Z",nameDesc:"Ada göre Z–A",citySort:"Şehre göre",newest:"Kuruluş yılına göre",apply:"Filtrele",clear:"Temizle",results:"üniversite gösteriliyor",page:"Sayfa",founded:"kuruluş yılı",view:"Bölümleri ve ücretleri incele",programs:"bölüm",empty:"Bu filtrelerle eşleşen üniversite bulunamadı.",previous:"Önceki",next:"Sonraki"},
 en:{search:"Search universities",searchPlaceholder:"Name or city",city:"City",allCities:"All cities",type:"Institution type",allTypes:"All",state:"Public",foundation:"Foundation",sort:"Sort by",nameAsc:"Name A–Z",nameDesc:"Name Z–A",citySort:"City",newest:"Year founded",apply:"Apply filters",clear:"Clear",results:"universities found",page:"Page",founded:"founded",view:"View programs and tuition",programs:"programs",empty:"No universities match these filters.",previous:"Previous",next:"Next"},
 ru:{search:"Поиск университетов",searchPlaceholder:"Название или город",city:"Город",allCities:"Все города",type:"Тип вуза",allTypes:"Все",state:"Государственный",foundation:"Частный",sort:"Сортировка",nameAsc:"Название А–Я",nameDesc:"Название Я–А",citySort:"По городу",newest:"По году основания",apply:"Применить",clear:"Сбросить",results:"университетов найдено",page:"Страница",founded:"год основания",view:"Программы и стоимость",programs:"программ",empty:"Ничего не найдено.",previous:"Назад",next:"Далее"},
 ar:{search:"ابحث عن جامعة",searchPlaceholder:"الاسم أو المدينة",city:"المدينة",allCities:"كل المدن",type:"نوع المؤسسة",allTypes:"الكل",state:"حكومية",foundation:"وقفية",sort:"ترتيب",nameAsc:"الاسم تصاعدياً",nameDesc:"الاسم تنازلياً",citySort:"حسب المدينة",newest:"سنة التأسيس",apply:"تطبيق الفلاتر",clear:"مسح",results:"جامعة",page:"صفحة",founded:"سنة التأسيس",view:"عرض البرامج والرسوم",programs:"برنامج",empty:"لا توجد جامعات مطابقة.",previous:"السابق",next:"التالي"}
} as const;

type Filters={query:string;city:string;type:string;sort:string};
function pageUrl(locale:string,page:number,filters:Filters){const params=new URLSearchParams();if(filters.query)params.set("q",filters.query);if(filters.city)params.set("city",filters.city);if(filters.type)params.set("type",filters.type);if(filters.sort&&filters.sort!=="name")params.set("sort",filters.sort);const suffix=params.toString();return `/${locale}/universiteler?page=${page}${suffix?`&${suffix}`:""}#universite-listesi`;}

export function UniversityCatalog({universities,locale,initialPage=1,filters,programCounts}:{universities:University[];locale:string;initialPage?:number;filters:Filters;programCounts:Record<string,number>}) {
  const t=catalogText[(locale in catalogText?locale:"tr") as keyof typeof catalogText];
  const term=filters.query.toLocaleLowerCase("tr-TR").trim();
  const cities=[...new Set(universities.map(u=>u.city))].sort((a,b)=>a.localeCompare(b,"tr"));
  const filtered=universities.filter(u=>(!term||`${u.name} ${u.city}`.toLocaleLowerCase("tr-TR").includes(term))&&(!filters.city||u.city===filters.city)&&(!filters.type||u.institutionType===filters.type)).sort((a,b)=>filters.sort==="name-desc"?b.name.localeCompare(a.name,"tr"):filters.sort==="city"?a.city.localeCompare(b.city,"tr")||a.name.localeCompare(b.name,"tr"):filters.sort==="newest"?Number(b.founded)-Number(a.founded)||a.name.localeCompare(b.name,"tr"):a.name.localeCompare(b.name,"tr"));
  const pageCount=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));
  const currentPage=Math.min(Math.max(1,initialPage),pageCount);
  const visible=filtered.slice((currentPage-1)*PAGE_SIZE,currentPage*PAGE_SIZE);
  return <div className="university-catalog">
    <form className="catalog-filters" method="get" action={`/${locale}/universiteler`}>
      <label>{t.search}<input name="q" type="search" defaultValue={filters.query} placeholder={t.searchPlaceholder}/></label>
      <label>{t.city}<select name="city" defaultValue={filters.city}><option value="">{t.allCities}</option>{cities.map(x=><option key={x}>{x}</option>)}</select></label>
      <label>{t.type}<select name="type" defaultValue={filters.type}><option value="">{t.allTypes}</option><option value="Devlet">{t.state}</option><option value="Vakıf">{t.foundation}</option></select></label>
      <label>{t.sort}<select name="sort" defaultValue={filters.sort}><option value="name">{t.nameAsc}</option><option value="name-desc">{t.nameDesc}</option><option value="city">{t.citySort}</option><option value="newest">{t.newest}</option></select></label>
      <button className="filter-submit" type="submit">{t.apply}</button><Link className="filter-clear" href={`/${locale}/universiteler`}>{t.clear}</Link>
    </form>
    <div className="catalog-page-frame" id="universite-listesi"><p className="catalog-count">{filtered.length} {t.results} · {t.page} {currentPage}/{pageCount}</p>
    <div className="catalog-cards">{visible.map(u=><Link href={`/${locale}/universiteler/${u.slug}`} className="catalog-university-card" key={u.id}><div><span>{u.city}</span><span>{u.institutionType==="Devlet"?t.state:u.institutionType==="Vakıf"?t.foundation:u.institutionType}</span></div><h2>{u.name}</h2><p>{programCounts[u.slug]||0} {t.programs} · {u.founded&&u.founded!=="—"?`${u.founded} ${t.founded}`:""}</p><b>{t.view}</b></Link>)}</div></div>
    {!visible.length&&<p className="empty-state">{t.empty}</p>}
    {pageCount>1&&<nav className="catalog-pagination" aria-label={t.page}>{currentPage===1?<span className="pagination-disabled">{t.previous}</span>:<Link href={pageUrl(locale,currentPage-1,filters)}>{t.previous}</Link>}<span>{t.page} {currentPage} / {pageCount}</span>{currentPage===pageCount?<span className="pagination-disabled">{t.next}</span>:<Link href={pageUrl(locale,currentPage+1,filters)}>{t.next}</Link>}</nav>}
  </div>;
}
