"use client";
import { useMemo, useState } from "react";
import type { Program, University } from "@/lib/content";
const texts={
 tr:{search:"Bölüm veya üniversite arayın",city:"Şehir",allCities:"Tüm şehirler",university:"Üniversite",allUniversities:"Tüm üniversiteler",degree:"Derece",allDegrees:"Tüm dereceler",language:"Eğitim dili",allLanguages:"Tüm diller",found:"program bulundu",note:"Örnek katalog · Ücret, kontenjan ve başvuru koşullarını güncel kaynaklardan teyit edin.",duration:"Süre",fee:"Ücret",detail:"Detayları inceleyin",empty:"Aramanızla eşleşen program bulunamadı.",retry:"Filtreleri sadeleştirerek yeniden deneyin."},
 en:{search:"Search programs or universities",city:"City",allCities:"All cities",university:"University",allUniversities:"All universities",degree:"Degree",allDegrees:"All degrees",language:"Teaching language",allLanguages:"All languages",found:"programs found",note:"Sample catalog · Confirm fees, places and requirements with official sources.",duration:"Duration",fee:"Fees",detail:"View details",empty:"No programs match your search.",retry:"Try fewer filters."},
 ru:{search:"Поиск программ или вузов",city:"Город",allCities:"Все города",university:"Университет",allUniversities:"Все университеты",degree:"Уровень",allDegrees:"Все уровни",language:"Язык обучения",allLanguages:"Все языки",found:"программ найдено",note:"Пример каталога · Уточняйте стоимость и условия в официальных источниках.",duration:"Срок",fee:"Стоимость",detail:"Подробнее",empty:"Программы не найдены.",retry:"Попробуйте изменить фильтры."},
 ar:{search:"ابحث عن برنامج أو جامعة",city:"المدينة",allCities:"كل المدن",university:"الجامعة",allUniversities:"كل الجامعات",degree:"الدرجة",allDegrees:"كل الدرجات",language:"لغة الدراسة",allLanguages:"كل اللغات",found:"برنامج معروض",note:"كتالوج تجريبي · تحقق من الرسوم والمقاعد والشروط من المصادر الرسمية.",duration:"المدة",fee:"الرسوم",detail:"التفاصيل",empty:"لا توجد برامج مطابقة.",retry:"جرّب تقليل عوامل التصفية."}
} as const;


export function ProgramFinder({programs,universities,whatsapp,locale="tr"}:{programs:Program[];universities:University[];whatsapp:string;locale?:string}){
  const t=texts[(locale in texts?locale:"tr") as keyof typeof texts];
  const linkedUniversities=universities.filter(u=>programs.some(p=>p.universityId===u.id));
  const [search,setSearch]=useState(""); const [city,setCity]=useState(""); const [university,setUniversity]=useState(""); const [degree,setDegree]=useState(""); const [language,setLanguage]=useState("");
  const visible=useMemo(()=>programs.filter(p=>{ const uni=universities.find(u=>u.id===p.universityId); const haystack=`${p.name} ${p.universityName}`.toLocaleLowerCase("tr-TR"); return haystack.includes(search.toLocaleLowerCase("tr-TR"))&&(!city||uni?.city===city)&&(!university||String(p.universityId)===university)&&(!degree||p.degreeType===degree)&&(!language||p.language===language);}),[programs,universities,search,city,university,degree,language]);
  const wa=(p:Program)=>whatsapp?`https://wa.me/${whatsapp.replace(/\D/g,"")}?text=${encodeURIComponent(`Merhaba TD Danışmanlık,\n\n${p.universityName} bünyesindeki ${p.name} programı hakkında bilgi almak istiyorum.`)}`:`/${locale}/danismanlik-talebi?program=${encodeURIComponent(p.name)}`;
  return <div className="finder-shell">
    <div className="finder-filters">
      <label className="search-field"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.search} aria-label={t.search} /></label>
      <select value={city} onChange={e=>setCity(e.target.value)} aria-label={t.city}><option value="">{t.allCities}</option>{[...new Set(linkedUniversities.map(u=>u.city))].map(x=><option key={x}>{x}</option>)}</select>
      <select value={university} onChange={e=>setUniversity(e.target.value)} aria-label={t.university}><option value="">{t.allUniversities}</option>{linkedUniversities.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select>
      <select value={degree} onChange={e=>setDegree(e.target.value)} aria-label={t.degree}><option value="">{t.allDegrees}</option>{[...new Set(programs.map(p=>p.degreeType))].map(x=><option key={x}>{x}</option>)}</select>
      <select value={language} onChange={e=>setLanguage(e.target.value)} aria-label={t.language}><option value="">{t.allLanguages}</option>{[...new Set(programs.map(p=>p.language))].map(x=><option key={x}>{x}</option>)}</select>
    </div>
    <div className="finder-meta"><span><b>{visible.length}</b> {t.found}</span><small>{t.note}</small></div>
    <div className="program-results">{visible.map(p=><article className="program-card" key={p.id}>
      <div className="program-top"><span className="degree-badge">{p.degreeType}</span><span>{p.language}</span></div>
      <h3>{p.name}</h3><p><a href={`/${locale}/universiteler/${p.universitySlug}`}>{p.universityName} ↗</a></p>
      <div className="program-info"><span><small>{t.duration}</small>{p.duration}</span><span><small>{t.fee}</small>{p.tuitionFee}</span></div>
      <div className="program-links"><a href={`/${locale}/bolumler/${p.slug}`}>{t.detail}</a><a className="round-link" href={wa(p)} target={whatsapp?"_blank":undefined} rel="noreferrer" aria-label={`${p.name} için WhatsApp’tan bilgi alın`}>↗</a></div>
    </article>)}</div>
    {!visible.length&&<div className="empty-state"><b>{t.empty}</b><span>{t.retry}</span></div>}
  </div>
}
