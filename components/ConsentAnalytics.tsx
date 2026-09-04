"use client";
import { useEffect } from "react";

export function ConsentAnalytics({measurementId}:{measurementId?:string}){
  useEffect(()=>{
    if(!measurementId)return;
    let loaded=false;
    const load=()=>{
      if(loaded||localStorage.getItem("td-consent")!=="accepted")return;
      loaded=true;
      const script=document.createElement("script");
      script.async=true;
      script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(script);
      window.dataLayer=window.dataLayer||[];
      window.gtag=(...args:unknown[])=>{window.dataLayer?.push(args)};
      window.gtag("js",new Date());
      window.gtag("config",measurementId,{anonymize_ip:true});
    };
    load();
    window.addEventListener("td-consent-changed",load);
    return()=>window.removeEventListener("td-consent-changed",load);
  },[measurementId]);
  return null;
}

declare global{interface Window{dataLayer?:unknown[][];gtag?:(...args:unknown[])=>void}}
