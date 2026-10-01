"use client";
import { useEffect, useState } from "react";

const copy={
 tr:{label:"Çerez tercihleri",title:"Gizliliğiniz bizim için önemlidir.",body:"Zorunlu olmayan çerezleri yalnızca onayınızla kullanırız.",required:"Zorunlu",analytics:"Analitik",marketing:"Pazarlama",manage:"Tercihleri yönetin",reject:"Reddet",accept:"Kabul et"},
 en:{label:"Cookie preferences",title:"Your privacy is important to us.",body:"We use non-essential cookies only with your consent.",required:"Required",analytics:"Analytics",marketing:"Marketing",manage:"Manage preferences",reject:"Reject",accept:"Accept"},
 ru:{label:"Настройки cookie",title:"Ваша конфиденциальность важна для нас.",body:"Необязательные cookie используются только с вашего согласия.",required:"Обязательные",analytics:"Аналитика",marketing:"Маркетинг",manage:"Настроить",reject:"Отклонить",accept:"Принять"},
 ar:{label:"تفضيلات ملفات الارتباط",title:"خصوصيتكم مهمة لنا.",body:"نستخدم ملفات الارتباط غير الضرورية فقط بموافقتكم.",required:"ضرورية",analytics:"تحليلات",marketing:"تسويق",manage:"إدارة التفضيلات",reject:"رفض",accept:"قبول"},
} as const;

export function CookieBanner({locale="tr"}:{locale?:string}){ const t=copy[(locale in copy?locale:"tr") as keyof typeof copy]; const [open,setOpen]=useState(false); const [manage,setManage]=useState(false); useEffect(()=>{const id=setTimeout(()=>setOpen(!localStorage.getItem("td-consent")),0);return()=>clearTimeout(id)},[]); const save=(value:string)=>{localStorage.setItem("td-consent",value);window.dispatchEvent(new Event("td-consent-changed"));setOpen(false)}; if(!open)return null; return <aside className="cookie-banner" aria-label={t.label}><div><b>{t.title}</b><p>{t.body}</p>{manage&&<div className="cookie-options"><label><input type="checkbox" checked disabled/> {t.required}</label><label><input type="checkbox"/> {t.analytics}</label><label><input type="checkbox"/> {t.marketing}</label></div>}</div><div className="cookie-actions">{!manage&&<button onClick={()=>setManage(true)}>{t.manage}</button>}<button onClick={()=>save("rejected")}>{t.reject}</button><button className="accept" onClick={()=>save("accepted")}>{t.accept}</button></div></aside> }
