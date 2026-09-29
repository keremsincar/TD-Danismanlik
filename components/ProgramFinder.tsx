import Link from "@/components/NativeLink";
import type { Program, University } from "@/lib/content";

const texts={
 tr:{search:"Bölüm veya üniversite ara",searchPlaceholder:"Örn. bilgisayar mühendisliği",city:"Şehir",allCities:"Tüm şehirler",university:"Üniversite",allUniversities:"Tüm üniversiteler",degree:"Derece",allDegrees:"Tüm dereceler",language:"Eğitim dili",allLanguages:"Tüm diller",field:"Alan",allFields:"Tüm alanlar",sort:"Sırala",universitySort:"Üniversite adına göre",programAsc:"Bölüm adına göre A–Z",programDesc:"Bölüm adına göre Z–A",fieldSort:"Alana göre",apply:"Filtrele",clear:"Temizle",found:"program bulundu",duration:"Süre",fee:"Ücret",detail:"Bölümü incele",empty:"Bu filtrelerle eşleşen bölüm bulunamadı.",source:"Kaynak",previous:"Önceki",next:"Sonraki",page:"Sayfa",note:"Ücret ve kontenjanlar dönemsel olarak değişir; kesin tutarı başvuru öncesinde üniversitenin güncel duyurusundan teyit edin."},
 en:{search:"Search programs or universities",searchPlaceholder:"E.g. computer engineering",city:"City",allCities:"All cities",university:"University",allUniversities:"All universities",degree:"Degree",allDegrees:"All degrees",language:"Teaching language",allLanguages:"All languages",field:"Field",allFields:"All fields",sort:"Sort by",universitySort:"University name",programAsc:"Program name A–Z",programDesc:"Program name Z–A",fieldSort:"Field",apply:"Apply filters",clear:"Clear",found:"programs found",duration:"Duration",fee:"Tuition",detail:"View program",empty:"No programs match these filters.",source:"Source",previous:"Previous",next:"Next",page:"Page",note:"Fees and places change by term; confirm the exact amount in the university's current notice before applying."},
 ru:{search:"Поиск программ или вузов",searchPlaceholder:"Например, компьютерная инженерия",city:"Город",allCities:"Все города",university:"Университет",allUniversities:"Все университеты",degree:"Уровень",allDegrees:"Все уровни",language:"Язык обучения",allLanguages:"Все языки",field:"Направление",allFields:"Все направления",sort:"Сортировка",universitySort:"По университету",programAsc:"Программа А–Я",programDesc:"Программа Я–А",fieldSort:"По направлению",apply:"Применить",clear:"Сбросить",found:"программ найдено",duration:"Срок",fee:"Стоимость",detail:"О программе",empty:"Программы не найдены.",source:"Источник",previous:"Назад",next:"Далее",page:"Страница",note:"Стоимость и места меняются; перед подачей уточняйте точную сумму в актуальном объявлении вуза."},
 ar:{search:"ابحث عن برنامج أو جامعة",searchPlaceholder:"مثال: هندسة الحاسوب",city:"المدينة",allCities:"كل المدن",university:"الجامعة",allUniversities:"كل الجامعات",degree:"الدرجة",allDegrees:"كل الدرجات",language:"لغة الدراسة",allLanguages:"كل اللغات",field:"المجال",allFields:"كل المجالات",sort:"ترتيب",universitySort:"حسب الجامعة",programAsc:"اسم البرنامج تصاعدياً",programDesc:"اسم البرنامج تنازلياً",fieldSort:"حسب المجال",apply:"تطبيق الفلاتر",clear:"مسح",found:"برنامج",duration:"المدة",fee:"الرسوم",detail:"عرض البرنامج",empty:"لا توجد برامج مطابقة.",source:"المصدر",previous:"السابق",next:"التالي",page:"صفحة",note:"تتغير الرسوم والمقاعد حسب الفصل؛ تحقق من المبلغ الدقيق في الإعلان الحالي للجامعة قبل التقديم."}
} as const;

type Filters={query:string;city:string;university:string;degree:string;language:string;field:string;sort:string};
type Props={programs:Program[];universities:University[];cities:string[];degrees:string[];languages:string[];fields:string[];total:number;page:number;pageCount:number;filters:Filters;locale?:string};

function pageUrl(locale:string,page:number,filters:Filters){const params=new URLSearchParams();if(filters.query)params.set("q",filters.query);if(filters.city)params.set("city",filters.city);if(filters.university)params.set("university",filters.university);if(filters.degree)params.set("degree",filters.degree);if(filters.language)params.set("language",filters.language);if(filters.field)params.set("field",filters.field);if(filters.sort&&filters.sort!=="university")params.set("sort",filters.sort);params.set("programPage",String(page));return `/${locale}/bolumler?${params.toString()}#program-listesi`;}

export function ProgramFinder({programs,universities,cities,degrees,languages,fields,total,page,pageCount,filters,locale="tr"}:Props){
 const t=texts[(locale in texts?locale:"tr") as keyof typeof texts];
 return <div className="finder-shell">
   <form className="finder-filters program-filter-form" method="get" action={`/${locale}/bolumler`}>
     <label className="program-filter-search"><span>{t.search}</span><input name="q" type="search" defaultValue={filters.query} placeholder={t.searchPlaceholder}/></label>
     <label><span>{t.city}</span><select name="city" defaultValue={filters.city}><option value="">{t.allCities}</option>{cities.map(x=><option key={x}>{x}</option>)}</select></label>
     <label><span>{t.university}</span><select name="university" defaultValue={filters.university}><option value="">{t.allUniversities}</option>{universities.map(x=><option key={x.id} value={x.slug}>{x.name}</option>)}</select></label>
     <label><span>{t.degree}</span><select name="degree" defaultValue={filters.degree}><option value="">{t.allDegrees}</option>{degrees.map(x=><option key={x}>{x}</option>)}</select></label>
     <label><span>{t.language}</span><select name="language" defaultValue={filters.language}><option value="">{t.allLanguages}</option>{languages.map(x=><option key={x}>{x}</option>)}</select></label>
     <label><span>{t.field}</span><select name="field" defaultValue={filters.field}><option value="">{t.allFields}</option>{fields.map(x=><option key={x}>{x}</option>)}</select></label>
     <label><span>{t.sort}</span><select name="sort" defaultValue={filters.sort}><option value="university">{t.universitySort}</option><option value="program-asc">{t.programAsc}</option><option value="program-desc">{t.programDesc}</option><option value="field">{t.fieldSort}</option></select></label>
     <button className="filter-submit" type="submit">{t.apply}</button><Link className="filter-clear" href={`/${locale}/bolumler`}>{t.clear}</Link>
   </form>
   <div className="finder-meta" id="program-listesi"><span><b>{total}</b> {t.found}</span><small>{t.note}</small></div>
   <div className="program-results">{programs.map(p=><Link className="program-card program-card-simple" href={`/${locale}/bolumler/${p.slug}`} key={p.slug} aria-label={`${p.name} — ${t.detail}`}>
     <div className="program-top"><span className="degree-badge">{p.degreeType}</span>{p.language&&<span>{p.language}</span>}</div>
     <h3>{p.name}</h3><p className="program-university">{p.universityName}</p>
     <span className="program-card-cta">{t.detail}<b aria-hidden="true">↗</b></span>
   </Link>)}</div>
   {!programs.length&&<p className="empty-state">{t.empty}</p>}
   {pageCount>1&&<nav className="catalog-pagination" aria-label={t.page}>{page>1?<Link href={pageUrl(locale,page-1,filters)}>← {t.previous}</Link>:<span className="pagination-disabled">← {t.previous}</span>}<span>{t.page} {page} / {pageCount}</span>{page<pageCount?<Link href={pageUrl(locale,page+1,filters)}>{t.next} →</Link>:<span className="pagination-disabled">{t.next} →</span>}</nav>}
 </div>;
}
