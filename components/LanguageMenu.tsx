"use client";

const languages=[{code:"tr",label:"Türkçe"},{code:"en",label:"English"},{code:"ru",label:"Русский"},{code:"ar",label:"العربية"}];
export function LanguageMenu({locale}:{locale:string}) {
  function switchLanguage(event:React.MouseEvent<HTMLAnchorElement>,code:string) {
    const path=window.location.pathname;
    const parts=path.split("/");
    if(languages.some(item=>item.code===parts[1])) {
      event.preventDefault();
      parts[1]=code;
      window.location.assign(parts.join("/")+window.location.search);
    }
  }
  return <details className="language-menu elab-language"><summary aria-label="Dil seçin">{locale.toUpperCase()} <span aria-hidden="true">⌄</span></summary><div>{languages.map(item=><a href={`/${item.code}`} onClick={event=>switchLanguage(event,item.code)} key={item.code} lang={item.code}>{item.label}</a>)}</div></details>;
}
