"use client";

import { useMemo, useState } from "react";

type FaqItem={id:number;question:string;answer:string;category?:string};

export function FaqAccordion({items,className="",showCategory=false}:{items:FaqItem[];className?:string;showCategory?:boolean}) {
  const [open,setOpen]=useState<number|null>(null);
  const [category,setCategory]=useState("");
  const [query,setQuery]=useState("");
  const categories=useMemo(()=>[...new Set(items.map(item=>item.category).filter(Boolean) as string[])], [items]);
  const filtered=useMemo(()=>{
    const q=query.trim().toLocaleLowerCase("tr-TR");
    return items.filter(item=>(!category||item.category===category)&&(!q||`${item.question} ${item.answer}`.toLocaleLowerCase("tr-TR").includes(q)));
  },[items,category,query]);

  return <div className={`animated-faq ${className}`.trim()}>
    {showCategory&&<div className="faq-tools">
      <label className="faq-search"><span>⌕</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Sorularda ara"/></label>
      <div className="faq-categories"><button type="button" className={!category?"is-active":""} onClick={()=>setCategory("")}>Tümü</button>{categories.map(item=><button type="button" className={category===item?"is-active":""} onClick={()=>setCategory(item)} key={item}>{item}</button>)}</div>
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
      {!filtered.length&&<p className="faq-empty">Eşleşen soru bulunamadı.</p>}
    </div>
  </div>;
}
