import Link from "@/components/NativeLink";

const copy={
 tr:{kicker:"TERCİH ROBOTU",title:"Seçenekleri hedefinize göre daraltın.",lead:"Eğitim düzeyi, alan, şehir ve dili seçin. Robot sizi doğrudan eşleşen bölüm listesine götürsün.",degree:"1. Eğitim düzeyi",field:"2. İlgi alanı",city:"3. Şehir",language:"4. Eğitim dili",all:"Fark etmez",submit:"Uygun bölümleri göster",browse:"Tüm bölümlere bak",note:"Sonuçlar katalog verilerine göre hazırlanır. Kabul koşulu, ücret ve kontenjanı başvuru öncesinde üniversitenin resmî duyurusundan doğrulayın."},
 en:{kicker:"PROGRAM MATCHER",title:"Narrow the catalogue around your goals.",lead:"Choose a study level, field, city and teaching language to open a matching program list.",degree:"1. Study level",field:"2. Field",city:"3. City",language:"4. Teaching language",all:"Any",submit:"Show matching programs",browse:"Browse all programs",note:"Results use the catalogue data. Confirm admission requirements, fees and places in the university's current official notice."},
 ru:{kicker:"ПОДБОР ПРОГРАММ",title:"Сузьте выбор с учётом ваших целей.",lead:"Выберите уровень, направление, город и язык, чтобы открыть подходящие программы.",degree:"1. Уровень обучения",field:"2. Направление",city:"3. Город",language:"4. Язык обучения",all:"Любой",submit:"Показать программы",browse:"Все программы",note:"Результаты основаны на данных каталога. Уточняйте условия, стоимость и места в актуальном объявлении вуза."},
 ar:{kicker:"أداة اختيار التخصص",title:"ضيّق الخيارات حسب هدفك.",lead:"اختر المستوى والمجال والمدينة ولغة الدراسة لعرض البرامج المطابقة.",degree:"1. المستوى الدراسي",field:"2. المجال",city:"3. المدينة",language:"4. لغة الدراسة",all:"لا يهم",submit:"عرض البرامج المناسبة",browse:"عرض كل البرامج",note:"تعتمد النتائج على بيانات الكتالوج. تحقق من شروط القبول والرسوم والمقاعد في إعلان الجامعة الرسمي الحالي."}
} as const;

export function PreferenceRobot({locale,cities,degrees,languages,fields}:{locale:string;cities:string[];degrees:string[];languages:string[];fields:string[]}){
 const t=copy[(locale in copy?locale:"tr") as keyof typeof copy];
 return <main className="preference-page">
  <header><p className="elab-kicker">{t.kicker}</p><h1>{t.title}</h1><p>{t.lead}</p></header>
  <form className="preference-form" method="get" action={`/${locale}/bolumler`}>
   <input type="hidden" name="sort" value="degree"/>
   <label><span>{t.degree}</span><select name="degree" defaultValue=""><option value="">{t.all}</option>{degrees.map(value=><option key={value}>{value}</option>)}</select></label>
   <label><span>{t.field}</span><select name="field" defaultValue=""><option value="">{t.all}</option>{fields.map(value=><option key={value}>{value}</option>)}</select></label>
   <label><span>{t.city}</span><select name="city" defaultValue=""><option value="">{t.all}</option>{cities.map(value=><option key={value}>{value}</option>)}</select></label>
   <label><span>{t.language}</span><select name="language" defaultValue=""><option value="">{t.all}</option>{languages.map(value=><option key={value}>{value}</option>)}</select></label>
   <button type="submit">{t.submit}</button>
  </form>
  <footer><p>{t.note}</p><Link href={`/${locale}/bolumler`}>{t.browse}</Link></footer>
 </main>;
}
