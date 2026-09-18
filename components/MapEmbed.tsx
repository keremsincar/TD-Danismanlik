export function MapEmbed({address,locale="tr"}:{address:string;locale?:string}) {
  // The office is in the A2 block of the World Trade Center; a full floor/suite
  // address is not reliably geocoded by Maps. Pin the complex and show the suite below.
  const location="40.986305,28.831944";
  const directions=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("İstanbul Dünya Ticaret Merkezi A2 Blok, Yeşilköy, Bakırköy, İstanbul")}`;
  const embed=`https://maps.google.com/maps?q=${location}&z=17&output=embed`;
  const directionsLabel=locale==="en"?"Get directions in Google Maps":locale==="ru"?"Маршрут в Google Maps":locale==="ar"?"الاتجاهات في خرائط Google":"Google Maps’te yol tarifi";
  return <div className="map-shell">
    <iframe title="TD Danışmanlık — İstanbul Dünya Ticaret Merkezi A2 Blok konumu" src={embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/>
    <div className="map-caption"><span>{address}</span><a href={directions} target="_blank" rel="noopener noreferrer">{directionsLabel} ↗</a></div>
  </div>;
}
