"use client";

const languages=[
  {code:"tr",label:"Türkçe",flag:"🇹🇷"},
  {code:"en",label:"English",flag:"🇬🇧"},
  {code:"ru",label:"Русский",flag:"🇷🇺"},
  {code:"ar",label:"العربية",flag:"🇸🇦"},
];

export function LanguageMenu({locale}:{locale:string}) {
  const current=languages.find(item=>item.code===locale)??languages[0];
  function switchLanguage(event:React.MouseEvent<HTMLAnchorElement>,code:string) {
    const path=window.location.pathname;
    const parts=path.split("/");
    if(languages.some(item=>item.code===parts[1])) {
      event.preventDefault();
      parts[1]=code;
      window.location.assign(parts.join("/")+window.location.search);
    }
  }
  return <details className="language-menu elab-language td-language">
    <summary aria-label={`${current.label} — dil seçin`}><span className="td-language-flag" aria-hidden="true">{current.flag}</span><span className="td-language-name">{current.label}</span><i aria-hidden="true">⌄</i></summary>
    <div>{languages.map(item=><a href={`/${item.code}`} onClick={event=>switchLanguage(event,item.code)} key={item.code} lang={item.code} aria-current={item.code===current.code?"page":undefined}><span aria-hidden="true">{item.flag}</span><b>{item.label}</b>{item.code===current.code&&<i aria-hidden="true">✓</i>}</a>)}</div>
  </details>;
}
