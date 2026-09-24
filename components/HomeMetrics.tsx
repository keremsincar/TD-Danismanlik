"use client";

import { useEffect, useRef, useState } from "react";

const labels={
  tr:["Türkiye genelinde üniversite","Karşılaştırılabilir bölüm","İletişim dili"],
  en:["Universities across Türkiye","Programs to compare","Communication languages"],
  ru:["Университетов по Турции","Программ для сравнения","Языка общения"],
  ar:["جامعة في أنحاء تركيا","برنامج للمقارنة","لغات للتواصل"]
} as const;

export function HomeMetrics({universities,programs,locale}:{universities:number;programs:number;locale:string}) {
  const copy=labels[(locale in labels?locale:"tr") as keyof typeof labels];
  const [values,setValues]=useState([0,0,0]);
  const root=useRef<HTMLElement>(null);
  useEffect(()=>{const node=root.current;if(!node)return;const targets=[universities,programs,4];let frame=0;const startAnimation=()=>{const started=performance.now(),duration=1100;const tick=(now:number)=>{const progress=Math.min(1,(now-started)/duration),eased=1-Math.pow(1-progress,3);setValues(targets.map(value=>Math.round(value*eased)));if(progress<1)frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)};const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){startAnimation();observer.disconnect()}},{threshold:.25});observer.observe(node);return()=>{observer.disconnect();cancelAnimationFrame(frame)}},[universities,programs]);
  return <section className="home-metrics" ref={root}><div className="home-marquee" aria-hidden="true"><div><span>ÜNİVERSİTE BAŞVURUSU</span><i>•</i><span>BÖLÜM SEÇİMİ</span><i>•</i><span>KAYIT VE İKAMET</span><i>•</i><span>ÜNİVERSİTE BAŞVURUSU</span><i>•</i><span>BÖLÜM SEÇİMİ</span><i>•</i><span>KAYIT VE İKAMET</span></div></div><div className="home-metric-grid">{values.map((value,index)=><div key={copy[index]}><strong>{value.toLocaleString(locale==="tr"?"tr-TR":"en-US")}{index<2?"+":""}</strong><span>{copy[index]}</span></div>)}</div></section>;
}
