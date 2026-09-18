"use client";
import { useMemo, useState } from "react";
import Link from "@/components/NativeLink";
import type { University } from "@/lib/content";

const PAGE_SIZE=12;
const catalogText={
 tr:{search:"Üniversite ara",searchPlaceholder:"Ad veya şehir yazın",city:"Şehir",allCities:"Tüm şehirler",type:"Kurum türü",allTypes:"Devlet ve vakıf",state:"Devlet",foundation:"Vakıf",sort:"Sırala",nameAsc:"Ada göre A–Z",nameDesc:"Ada göre Z–A",citySort:"Şehre göre",newest:"Kuruluş yılına göre",results:"üniversite gösteriliyor",page:"Sayfa",founded:"kuruluş yılı",profile:"Üniversite profili",view:"Profili incele",empty:"Bu filtrelerle eşleşen üniversite bulunamadı. Aramayı değiştirebilirsiniz.",previous:"Önceki",next:"Sonraki"},
 en:{search:"Search universities",searchPlaceholder:"Name or city",city:"City",allCities:"All cities",type:"Institution type",allTypes:"Public and foundation",state:"Public",foundation:"Foundation",sort:"Sort by",nameAsc:"Name A–Z",nameDesc:"Name Z–A",citySort:"City",newest:"Year founded",results:"universities found",page:"Page",founded:"founded",profile:"University profile",view:"View profile",empty:"No universities match these filters. Try a different search.",previous:"Previous",next:"Next"},
 ru:{search:"Поиск университетов",searchPlaceholder:"Название или город",city:"Город",allCities:"Все города",type:"Тип вуза",allTypes:"Государственные и частные",state:"Государственный",foundation:"Частный",sort:"Сортировка",nameAsc:"Название А–Я",nameDesc:"Название Я–А",citySort:"По городу",newest:"По году основания",results:"университетов найдено",page:"Страница",founded:"год основания",profile:"Профиль университета",view:"Подробнее",empty:"Ничего не найдено. Измените параметры поиска.",previous:"Назад",next:"Далее"},
 ar:{search:"ابحث عن جامعة",searchPlaceholder:"الاسم أو المدينة",city:"المدينة",allCities:"كل المدن",type:"نوع المؤسسة",allTypes:"حكومية ووقفية",state:"حكومية",foundation:"وقفية",sort:"ترتيب",nameAsc:"الاسم تصاعدياً",nameDesc:"الاسم تنازلياً",citySort:"حسب المدينة",newest:"سنة التأسيس",results:"جامعة معروضة",page:"صفحة",founded:"سنة التأسيس",profile:"ملف الجامعة",view:"عرض الملف",empty:"لا توجد جامعات مطابقة. غيّر البحث.",previous:"السابق",next:"التالي"}
} as const;

export function UniversityCatalog({universities,locale}:{universities:University[];locale:string}) {
  const t=catalogText[(locale in catalogText?locale:"tr") as keyof typeof catalogText];
  const [query,setQuery]=useState("");
  const [city,setCity]=useState("");
  const [type,setType]=useState("");
  const [sort,setSort]=useState("name");
  const [page,setPage]=useState(1);
  const cities=useMemo(()=>[...new Set(universities.map(u=>u.city))].sort((a,b)=>a.localeCompare(b,"tr")),[universities]);
  const filtered=useMemo(()=>{
    const term=query.toLocaleLowerCase("tr-TR").trim();
    const result=universities.filter(u=>(!term||`${u.name} ${u.city}`.toLocaleLowerCase("tr-TR").includes(term))&&(!city||u.city===city)&&(!type||u.institutionType===type));
    return result.sort((a,b)=>sort==="name-desc"?b.name.localeCompare(a.name,"tr"):sort==="city"?a.city.localeCompare(b.city,"tr")||a.name.localeCompare(b.name,"tr"):sort==="newest"?Number(b.founded)-Number(a.founded)||a.name.localeCompare(b.name,"tr"):a.name.localeCompare(b.name,"tr"));
  },[universities,query,city,type,sort]);
  const pageCount=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));
  const currentPage=Math.min(page,pageCount);
  const visible=filtered.slice((currentPage-1)*PAGE_SIZE,currentPage*PAGE_SIZE);
  const change=(fn:(value:string)=>void)=>(event:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{fn(event.target.value);setPage(1)};
  return <div className="university-catalog">
    <div className="catalog-filters">
      <label>{t.search}<input type="search" value={query} onChange={change(setQuery)} placeholder={t.searchPlaceholder}/></label>
      <label>{t.city}<select value={city} onChange={change(setCity)}><option value="">{t.allCities}</option>{cities.map(x=><option key={x}>{x}</option>)}</select></label>
      <label>{t.type}<select value={type} onChange={change(setType)}><option value="">{t.allTypes}</option><option value="Devlet">{t.state}</option><option value="Vakıf">{t.foundation}</option></select></label>
      <label>{t.sort}<select value={sort} onChange={change(setSort)}><option value="name">{t.nameAsc}</option><option value="name-desc">{t.nameDesc}</option><option value="city">{t.citySort}</option><option value="newest">{t.newest}</option></select></label>
    </div>
    <p className="catalog-count">{filtered.length} {t.results} · {t.page} {currentPage}/{pageCount}</p>
    <div className="catalog-cards">{visible.map(u=><Link href={`/${locale}/universiteler/${u.slug}`} className="catalog-university-card" key={u.id}><div><span>{u.city}</span><span>{u.institutionType==="Devlet"?t.state:u.institutionType==="Vakıf"?t.foundation:u.institutionType}</span></div><h2>{u.name}</h2><p>{u.founded&&u.founded!=="—"?`${u.founded} ${t.founded}`:t.profile}</p><b>{t.view} ↗</b></Link>)}</div>
    {!visible.length&&<p className="empty-state">{t.empty}</p>}
    <nav className="catalog-pagination" aria-label={t.page}><button type="button" disabled={currentPage===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>← {t.previous}</button>{Array.from({length:pageCount},(_,i)=>i+1).filter(i=>i===1||i===pageCount||Math.abs(i-currentPage)<=2).map((i,index,array)=><span key={i}>{index>0&&i-array[index-1]>1&&<span className="pagination-ellipsis">…</span>}<button type="button" aria-current={i===currentPage?"page":undefined} onClick={()=>setPage(i)}>{i}</button></span>)}<button type="button" disabled={currentPage===pageCount} onClick={()=>setPage(p=>Math.min(pageCount,p+1))}>{t.next} →</button></nav>
  </div>;
}
