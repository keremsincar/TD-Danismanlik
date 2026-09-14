"use client";
import { useState } from "react";

export function MapEmbed({address}:{address:string}) {
  const [visible,setVisible]=useState(false);
  const query=encodeURIComponent(address);
  const directions=`https://www.google.com/maps/search/?api=1&query=${query}`;
  const embed=`https://maps.google.com/maps?q=${query}&z=15&output=embed`;
  return <div className="map-shell">
    {visible?<iframe title="TD Danışmanlık ofis konumu — Google Maps" src={embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/>:<div className="map-placeholder"><span>TD<br/>İSTANBUL</span><div><p>Ofisimizi haritada görün</p><small>Harita yalnızca isteğinizle yüklenir.</small><button type="button" onClick={()=>setVisible(true)}>Haritayı göster ↗</button></div></div>}
    <a href={directions} target="_blank" rel="noopener noreferrer">Yol tarifi alın ↗</a>
  </div>;
}
