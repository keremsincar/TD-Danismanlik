import Link from "@/components/NativeLink";

const copy={
 tr:{kicker:"TERCİH ROBOTU",title:"Doğru seçeneği daha hızlı bulun.",lead:"Bölümünüzü seçin; eğitim düzeyi, şehir, alan ve eğitim diliyle sonuçları daraltın.",program:"Bölüm",degree:"Eğitim düzeyi",field:"İlgi alanı",city:"Şehir",language:"Eğitim dili",all:"Tümü",submit:"Sonuçları göster",browse:"Tüm bölümleri incele",note:"Sonuçlar katalog verilerine göre hazırlanır. Kabul koşulu, ücret ve kontenjanı başvuru öncesinde üniversitenin resmî duyurusundan doğrulayın."},
 en:{kicker:"PROGRAM MATCHER",title:"Find the right option faster.",lead:"Choose a program and refine the results by study level, city, field and teaching language.",program:"Program",degree:"Study level",field:"Field",city:"City",language:"Teaching language",all:"Any",submit:"Show results",browse:"Browse all programs",note:"Results use catalogue data. Confirm admission requirements, fees and places in the university's current official notice."},
 ru:{kicker:"ПОДБОР ПРОГРАММ",title:"Быстрее найдите подходящий вариант.",lead:"Выберите программу и уточните результаты по уровню, городу, направлению и языку обучения.",program:"Программа",degree:"Уровень обучения",field:"Направление",city:"Город",language:"Язык обучения",all:"Любой",submit:"Показать результаты",browse:"Все программы",note:"Результаты основаны на данных каталога. Уточняйте условия, стоимость и места в актуальном объявлении вуза."},
 ar:{kicker:"أداة اختيار التخصص",title:"اعثر على الخيار المناسب بسرعة.",lead:"اختر البرنامج ثم ضيّق النتائج حسب المستوى والمدينة والمجال ولغة الدراسة.",program:"البرنامج",degree:"المستوى الدراسي",field:"المجال",city:"المدينة",language:"لغة الدراسة",all:"الكل",submit:"عرض النتائج",browse:"عرض كل البرامج",note:"تعتمد النتائج على بيانات الكتالوج. تحقق من شروط القبول والرسوم والمقاعد في إعلان الجامعة الرسمي الحالي."}
} as const;

export function PreferenceRobot({locale,cities,degrees,languages,fields,programs}:{locale:string;cities:string[];degrees:string[];languages:string[];fields:string[];programs:string[]}){
 const t=copy[(locale in copy?locale:"tr") as keyof typeof copy];
 return <main className="preference-page preference-premium">
  <header className="preference-hero">
    <div><p className="elab-kicker">{t.kicker}</p><h1>{t.title}</h1></div>
    <p>{t.lead}</p>
  </header>
  <form className="preference-form preference-form-premium" method="get" action={`/${locale}/bolumler`}>
   <input type="hidden" name="sort" value="degree"/>
   <div className="preference-primary">
    <label className="preference-program"><span>{t.program}</span><select name="q" defaultValue=""><option value="">{t.all}</option>{programs.map(value=><option key={value} value={value}>{value}</option>)}</select></label>
    <button type="submit">{t.submit}<span aria-hidden="true">↗</span></button>
   </div>
   <div className="preference-refiners">
    <label><span>01 · {t.degree}</span><select name="degree" defaultValue=""><option value="">{t.all}</option>{degrees.map(value=><option key={value}>{value}</option>)}</select></label>
    <label><span>02 · {t.field}</span><select name="field" defaultValue=""><option value="">{t.all}</option>{fields.map(value=><option key={value}>{value}</option>)}</select></label>
    <label><span>03 · {t.city}</span><select name="city" defaultValue=""><option value="">{t.all}</option>{cities.map(value=><option key={value}>{value}</option>)}</select></label>
    <label><span>04 · {t.language}</span><select name="language" defaultValue=""><option value="">{t.all}</option>{languages.map(value=><option key={value}>{value}</option>)}</select></label>
   </div>
  </form>
  <footer className="preference-footer"><p>{t.note}</p><Link href={`/${locale}/bolumler`}>{t.browse}<span aria-hidden="true">→</span></Link></footer>
 </main>;
}
