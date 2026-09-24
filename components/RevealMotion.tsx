"use client";
import { useEffect } from "react";

export function RevealMotion() {
  useEffect(()=>{
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    const elements=[...document.querySelectorAll<HTMLElement>(".elab-section,.listing-grid>a,.catalog-university-card,.process-page-grid>article,.university-guidance>article,.home-metric-grid>div,.contact-page-details,.contact-email,.program-card")];
    if(!elements.length)return;
    document.documentElement.classList.add("motion-ready");
    const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}},{threshold:0.08,rootMargin:"0px 0px -25px 0px"});
    elements.forEach(element=>{element.classList.add("motion-target");observer.observe(element)});
    return ()=>{observer.disconnect();document.documentElement.classList.remove("motion-ready")};
  },[]);
  return null;
}
