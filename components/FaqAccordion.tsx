"use client";

import { useMemo, useState } from "react";

type FaqItem={id:number;question:string;answer:string;category?:string};

export function FaqAccordion({items,className="",showCategory=false,locale="tr"}:{items:FaqItem[];className?:string;showCategory?:boolean;locale?:string}) {
  const [open,setOpen]=useState<number|null>(null);
  const ui={tr:{search:"Sorularda ara",all:"Tümü",empty:"Eşleşen soru bulunamadı."},en:{search:"Search questions",all:"All",empty:"No matching questions found."},ru:{search:"Поиск по вопросам",all:"Все",empty:"Подходящих вопросов не найдено."},ar:{search:"ابحث في الأسئلة",all:"الكل",empty:"لم يتم العثور على أسئلة مطابقة."}}[(locale==="en"||locale==="ru"||locale==="ar"?locale:"tr") as "tr"|"en"|"ru"|"ar"];
  const [category,setCategory]=useState("");
  const [query,setQuery]=useState("");
  const categories=useMemo(()=>[...new Set(items.map(item=>item.category).filter(Boolean) as string[])], [items]);
  const filtered=useMemo(()=>{
    const q=query.trim().toLocaleLowerCase("tr-TR");
    return items.filter(item=>(!category||item.category===category)&&(!q||`${item.question} ${item.answer}`.toLocaleLowerCase("tr-TR").includes(q)));
  },[items,category,query]);

  return <div className={`animated-faq ${className}`.trim()}>
    {showCategory&&<div className="faq-tools">
      <label className="faq-search"><span>⌕</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={ui.search}/></label>
      <div className="faq-categories"><button type="button" className={!category?"is-active":""} onClick={()=>setCategory("")}>{ui.all}</button>{categories.map(item=><button type="button" className={category===item?"is-active":""} onClick={()=>setCategory(item)} key={item}>{item}</button>)}</div>
    </div>}
    <div className="faq-accordion-list">
      {filtered.map((item,index)=>{
        const expanded=open===item.id;
        return <article className={expanded?"is-open":""} key={item.id}>
          <button type="button" aria-expanded={expanded} aria-controls={`faq-answer-${item.id}`} onClick={()=>setOpen(expanded?null:item.id)}>
            <span className="faq-number">{String(index+1).padStart(2,"0")}</span>
            <span className="faq-question">{item.question}{showCategory&&item.category?<small>{item.category}</small>:null}</span>
            <span className="faq-plus" aria-hidden="true">{expanded?"−":"＋"}</span>
          </button>
          <div className="faq-answer-wrap" id={`faq-answer-${item.id}`} aria-hidden={!expanded}><div><p>{item.answer}</p></div></div>
        </article>;
      })}
      {!filtered.length&&<p className="faq-empty">{ui.empty}</p>}
    </div>
  </div>;
}
