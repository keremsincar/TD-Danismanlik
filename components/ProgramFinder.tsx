"use client";
import { useMemo, useState } from "react";
import type { Program, University } from "@/lib/content";

export function ProgramFinder({programs,universities,whatsapp,locale="tr"}:{programs:Program[];universities:University[];whatsapp:string;locale?:string}){
  const [search,setSearch]=useState(""); const [city,setCity]=useState(""); const [university,setUniversity]=useState(""); const [degree,setDegree]=useState(""); const [language,setLanguage]=useState("");
  const visible=useMemo(()=>programs.filter(p=>{ const uni=universities.find(u=>u.id===p.universityId); const haystack=`${p.name} ${p.universityName}`.toLocaleLowerCase("tr-TR"); return haystack.includes(search.toLocaleLowerCase("tr-TR"))&&(!city||uni?.city===city)&&(!university||String(p.universityId)===university)&&(!degree||p.degreeType===degree)&&(!language||p.language===language);}),[programs,universities,search,city,university,degree,language]);
  const wa=(p:Program)=>whatsapp?`https://wa.me/${whatsapp.replace(/\D/g,"")}?text=${encodeURIComponent(`Merhaba TD Danışmanlık,\n\n${p.universityName} bünyesindeki ${p.name} programı hakkında bilgi almak istiyorum.`)}`:`/${locale}/danismanlik-talebi?program=${encodeURIComponent(p.name)}`;
  return <div className="finder-shell">
    <div className="finder-filters">
      <label className="search-field"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Bölüm veya üniversite arayın" aria-label="Bölüm veya üniversite ara" /></label>
      <select value={city} onChange={e=>setCity(e.target.value)} aria-label="Şehir"><option value="">Tüm şehirler</option>{[...new Set(universities.map(u=>u.city))].map(x=><option key={x}>{x}</option>)}</select>
      <select value={university} onChange={e=>setUniversity(e.target.value)} aria-label="Üniversite"><option value="">Tüm üniversiteler</option>{universities.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select>
      <select value={degree} onChange={e=>setDegree(e.target.value)} aria-label="Derece"><option value="">Tüm dereceler</option>{[...new Set(programs.map(p=>p.degreeType))].map(x=><option key={x}>{x}</option>)}</select>
      <select value={language} onChange={e=>setLanguage(e.target.value)} aria-label="Eğitim dili"><option value="">Tüm diller</option>{[...new Set(programs.map(p=>p.language))].map(x=><option key={x}>{x}</option>)}</select>
    </div>
    <div className="finder-meta"><span><b>{visible.length}</b> program bulundu</span><small>Örnek katalog · Ücret, kontenjan ve başvuru koşullarını güncel kaynaklardan teyit edin.</small></div>
    <div className="program-results">{visible.map(p=><article className="program-card" key={p.id}>
      <div className="program-top"><span className="degree-badge">{p.degreeType}</span><span>{p.language}</span></div>
      <h3>{p.name}</h3><p><a href={`/${locale}/universiteler/${p.universitySlug}`}>{p.universityName} ↗</a></p>
      <div className="program-info"><span><small>Süre</small>{p.duration}</span><span><small>Ücret</small>{p.tuitionFee}</span></div>
      <div className="program-links"><a href={`/${locale}/bolumler/${p.slug}`}>Detayları inceleyin</a><a className="round-link" href={wa(p)} target={whatsapp?"_blank":undefined} rel="noreferrer" aria-label={`${p.name} için WhatsApp’tan bilgi alın`}>↗</a></div>
    </article>)}</div>
    {!visible.length&&<div className="empty-state"><b>Aramanızla eşleşen program bulunamadı.</b><span>Filtreleri sadeleştirerek yeniden deneyin.</span></div>}
  </div>
}
