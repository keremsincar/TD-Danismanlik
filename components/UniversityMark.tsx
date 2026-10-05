/* eslint-disable @next/next/no-img-element -- Logos are administrator-managed R2 assets. */

export function UniversityMark({name,logoUrl,className=""}:{name:string;logoUrl?:string;className?:string}){
  if(!logoUrl) return null;
  return <span className={`university-mark ${className}`.trim()}><img src={logoUrl} alt={`${name} logosu`}/></span>;
}
