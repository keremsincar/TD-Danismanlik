/* eslint-disable @next/next/no-img-element -- Logos are administrator-managed R2 assets. */

function initials(name:string){
  return name.replace(/Üniversitesi|University/gi,"").trim().split(/\s+/).filter(Boolean).slice(0,3).map(word=>word[0]).join("").toLocaleUpperCase("tr-TR");
}

export function UniversityMark({name,logoUrl,className=""}:{name:string;logoUrl?:string;className?:string}){
  return <span className={`university-mark ${className}`.trim()} aria-hidden="true">{logoUrl?<img src={logoUrl} alt=""/>:<b>{initials(name)}</b>}</span>;
}
