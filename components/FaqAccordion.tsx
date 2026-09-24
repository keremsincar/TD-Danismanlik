"use client";

import { useState } from "react";

type FaqItem={id:number;question:string;answer:string;category?:string};

export function FaqAccordion({items,className="",showCategory=false}:{items:FaqItem[];className?:string;showCategory?:boolean}) {
  const [open,setOpen]=useState<number|null>(null);
  return <div className={`animated-faq ${className}`.trim()}>{items.map((item,index)=>{
    const expanded=open===item.id;
    return <article className={expanded?"is-open":""} key={item.id}>
      <button type="button" aria-expanded={expanded} aria-controls={`faq-answer-${item.id}`} onClick={()=>setOpen(expanded?null:item.id)}>
        <span className="faq-number">{String(index+1).padStart(2,"0")}</span>
        <span className="faq-question">{item.question}{showCategory&&item.category?<small>{item.category}</small>:null}</span>
        <span className="faq-plus" aria-hidden="true">＋</span>
      </button>
      <div className="faq-answer-wrap" id={`faq-answer-${item.id}`} aria-hidden={!expanded}><div><p>{item.answer}</p></div></div>
    </article>;
  })}</div>;
}
