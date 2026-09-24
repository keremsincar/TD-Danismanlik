"use client";

import { useEffect, useRef, useState } from "react";

const labels={
  tr:{stats:["Türkiye genelinde üniversite","İncelenebilir bölüm ve program","Üniversite bulunan şehir"],marquee:["ÜNİVERSİTE BAŞVURUSU","BÖLÜM SEÇİMİ","KAYIT VE İKAMET"]},
  en:{stats:["Universities across Türkiye","Programs available to explore","Cities with universities"],marquee:["UNIVERSITY APPLICATIONS","PROGRAM SELECTION","ENROLMENT AND RESIDENCE"]},
  ru:{stats:["Университетов по Турции","Программ для изучения","Город с университетами"],marquee:["ПОСТУПЛЕНИЕ В ВУЗ","ВЫБОР ПРОГРАММЫ","РЕГИСТРАЦИЯ И ВНЖ"]},
  ar:{stats:["جامعة في أنحاء تركيا","برنامجاً متاحاً للاستكشاف","مدينة تضم جامعات"],marquee:["التقديم للجامعة","اختيار التخصص","التسجيل والإقامة"]}
} as const;

export function HomeMetrics({universities,programs,cities,locale}:{universities:number;programs:number;cities:number;locale:string}) {
  const copy=labels[(locale in labels?locale:"tr") as keyof typeof labels];
  const [values,setValues]=useState([0,0,0]);
  const root=useRef<HTMLElement>(null);
  useEffect(()=>{const node=root.current;if(!node)return;const targets=[universities,programs,cities];let frame=0;const startAnimation=()=>{const started=performance.now(),duration=1100;const tick=(now:number)=>{const progress=Math.min(1,(now-started)/duration),eased=1-Math.pow(1-progress,3);setValues(targets.map(value=>Math.round(value*eased)));if(progress<1)frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)};const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){startAnimation();observer.disconnect()}},{threshold:.25});observer.observe(node);return()=>{observer.disconnect();cancelAnimationFrame(frame)}},[universities,programs,cities]);
  const ticker=[...copy.marquee,...copy.marquee];
  return <section className="home-metrics" ref={root}><div className="home-marquee" aria-hidden="true"><div>{ticker.map((item,index)=><span key={`${item}-${index}`}>{item}<i>•</i></span>)}</div></div><div className="home-metric-grid">{values.map((value,index)=><div key={copy.stats[index]}><strong>{value.toLocaleString(locale==="tr"?"tr-TR":"en-US")}</strong><span>{copy.stats[index]}</span></div>)}</div></section>;
}
