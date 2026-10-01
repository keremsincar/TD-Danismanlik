/* eslint-disable @next/next/no-img-element -- University visuals are administrator-managed R2 assets. */
import { notFound } from "next/navigation";
import Link from "@/components/NativeLink";
import { InnerPage } from "@/components/InnerPage";
import { getCatalogProgramsForUniversity, getSettings, getUniversity } from "@/lib/content";
import { languageLabels, universityDetailText } from "@/lib/i18n";
import { UniversityMark } from "@/components/UniversityMark";
import { ExpandableProgramList } from "@/components/ExpandableProgramList";

export const dynamic="force-dynamic";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const u=await getUniversity(slug);
  return u?{title:`${u.name} | TD Danışmanlık`,description:`${u.name}: ${u.city}, ${u.institutionType.toLocaleLowerCase("tr-TR")} üniversitesi. Program ve başvuru bilgilerini inceleyin.`}:{};
}

export default async function UniversityPage({params}:{params:Promise<{locale:string;slug:string}>}) {
  const {locale,slug}=await params;
  const [settings,u]=await Promise.all([getSettings(),getUniversity(slug)]);
  if(!u)notFound();
  const {programs,total}=await getCatalogProgramsForUniversity(u,120);
  const t=universityDetailText(locale),nav=languageLabels(locale);
  const type=u.institutionType==="Devlet"?t.public:u.institutionType==="Vakıf"?t.foundation:u.institutionType;
  return <InnerPage settings={settings} locale={locale} crumbs={[{label:nav.home,href:`/${locale}`},{label:t.university,href:`/${locale}/universiteler`},{label:u.name}]}>
    <main className="catalog-detail university-detail">
      <section><p className="section-index">{u.city} · {type}</p><h1>{u.name}</h1><p>{locale==="tr"?u.description:t.generic}</p><div className="university-facts"><div><small>{t.city}</small><strong>{u.city}</strong></div><div><small>{t.type}</small><strong>{type}</strong></div><div><small>{t.founded}</small><strong>{u.founded&&u.founded!=="—"?u.founded:t.unknown}</strong></div></div><Link className="button button-primary" href={`/${locale}/danismanlik-talebi`}>{t.consult}</Link></section>
      <aside className="catalog-brand-panel"><img src={u.image} alt=""/><div className="catalog-brand-identity">{u.logoUrl&&<UniversityMark name={u.name} logoUrl={u.logoUrl}/>}<p><strong>{u.name}</strong><small>{u.city} · {type}</small></p></div></aside>
    </main>
    <section className="university-guidance"><article><h2>{t.admission}</h2><p>{t.admissionBody}</p></article><article><h2>{t.documents}</h2><p>{t.documentsBody}</p></article><article><h2>{t.support}</h2><p>{t.supportBody}</p></article></section>
    <section className="program-list-section"><div><p className="section-index">{nav.programs}</p><h2>{t.programs}</h2><p><strong>{total}</strong> {locale==="tr"?"program listelenmektedir.":locale==="en"?"programs are listed.":locale==="ru"?"программ в каталоге.":"برنامجاً في الدليل."} {t.programNote}</p><Link className="program-filter-link" href={`/${locale}/bolumler?university=${u.slug}`}>{locale==="tr"?"Programları filtreleyin":locale==="en"?"Filter programs":locale==="ru"?"Фильтровать программы":"تصفية البرامج"}</Link></div><div>{programs.length?<ExpandableProgramList programs={programs} locale={locale}/>:<p className="empty-state">{t.empty}</p>}</div></section>
    <section className="university-bottom-cta"><h2>{t.bottomTitle}</h2><p>{t.bottomBody}</p><Link className="elab-pill elab-pill-blue" href={`/${locale}/danismanlik-talebi`}>{t.request}</Link></section>
  </InnerPage>;
}
