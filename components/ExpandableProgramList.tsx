"use client";

import { useState } from "react";
import Link from "@/components/NativeLink";
import type { Program } from "@/lib/content";

const labels={
  tr:{
    show:"Tüm programları göster",
    hide:"Listeyi daralt",
    language:"Eğitim dili",
    view:"Programı incele",
    duration:"Süre"
  },
  en:{
    show:"Show all programs",
    hide:"Collapse list",
    language:"Teaching language",
    view:"View program",
    duration:"Duration"
  },
  ru:{
    show:"Показать все программы",
    hide:"Свернуть список",
    language:"Язык обучения",
    view:"Открыть программу",
    duration:"Продолжительность"
  },
  ar:{
    show:"عرض كل البرامج",
    hide:"تقليص القائمة",
    language:"لغة الدراسة",
    view:"عرض البرنامج",
    duration:"المدة"
  },
} as const;

export function ExpandableProgramList({
  programs,
  locale="tr",
  initialCount=8
}:{
  programs:Program[];
  locale?:string;
  initialCount?:number
}){
  const [expanded,setExpanded]=useState(false);
  const t=labels[(locale in labels?locale:"tr") as keyof typeof labels];
  const visible=expanded?programs:programs.slice(0,initialCount);
  const programName=(program:Program)=>locale==="tr"?(program.turkishName||program.name):(program.englishName||program.name);

  return (
    <div className="expandable-programs">
      <div className="university-program-grid">
        {visible.map(program=>(
          <Link
            href={`/${locale}/bolumler/${program.slug}`}
            key={program.slug}
            className="university-program-card"
          >
            <div className="university-program-card-top">
              <div className="university-program-card-copy">
                <span className="university-program-degree">
                  {program.degreeType}
                </span>

                <h3>{programName(program)}</h3>
              </div>

              <span className="university-program-arrow" aria-hidden="true">
                →
              </span>
            </div>

            <div className="university-program-meta">
              {program.language&&(
                <span>
                  <b>{t.language}</b>
                  {program.language}
                </span>
              )}

              {program.duration&&(
                <span>
                  <b>{t.duration}</b>
                  {program.duration}
                </span>
              )}
            </div>

            <div className="university-program-card-footer">
              <span>{t.view}</span>
              <span aria-hidden="true">↗</span>
            </div>
          </Link>
        ))}
      </div>

      {programs.length>initialCount&&(
        <button
          type="button"
          className="program-list-toggle"
          aria-expanded={expanded}
          onClick={()=>setExpanded(value=>!value)}
        >
          <span>
            {expanded?t.hide:`${t.show} (${programs.length})`}
          </span>
          <span aria-hidden="true">
            {expanded?"↑":"↓"}
          </span>
        </button>
      )}
    </div>
  );
}
