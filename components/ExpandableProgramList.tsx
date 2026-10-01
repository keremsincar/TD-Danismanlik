"use client";

import { useState } from "react";
import Link from "@/components/NativeLink";
import type { Program } from "@/lib/content";

const labels={
  tr:{show:"Tüm programları göster",hide:"Listeyi daralt",language:"Eğitim dili"},
  en:{show:"Show all programs",hide:"Collapse list",language:"Teaching language"},
  ru:{show:"Показать все программы",hide:"Свернуть список",language:"Язык обучения"},
  ar:{show:"عرض كل البرامج",hide:"تقليص القائمة",language:"لغة الدراسة"},
} as const;

export function ExpandableProgramList({programs,locale="tr",initialCount=8}:{programs:Program[];locale?:string;initialCount?:number}){
  const [expanded,setExpanded]=useState(false);
  const t=labels[(locale in labels?locale:"tr") as keyof typeof labels];
  const visible=expanded?programs:programs.slice(0,initialCount);
  return <div className="expandable-programs">
    <div className="university-program-rows">{visible.map(program=><Link href={`/${locale}/bolumler/${program.slug}`} key={program.slug}>
      <span>{program.degreeType}</span><h3>{program.name}</h3><p>{program.language&&`${t.language}: ${program.language} · `}{program.duration}</p><b aria-hidden="true">+</b>
    </Link>)}</div>
    {programs.length>initialCount&&<button type="button" className="program-list-toggle" aria-expanded={expanded} onClick={()=>setExpanded(value=>!value)}>{expanded?t.hide:`${t.show} (${programs.length})`}</button>}
  </div>;
}
