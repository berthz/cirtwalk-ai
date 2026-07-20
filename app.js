
const routeUrl='routes/brussel.json';
const map=L.map('map').setView([50.8466,4.3528],14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map);
const status=document.getElementById('status');
let stops=[],next=0,userMarker;

fetch(routeUrl).then(r=>r.json()).then(data=>{
  stops=data.stops;
  stops.forEach(s=>L.marker([s.lat,s.lng]).addTo(map).bindPopup(s.name));
});

function dist(a,b,c,d){
 const R=6371000;
 const x=(d-b)*Math.PI/180*Math.cos((a+c)*Math.PI/360);
 const y=(c-a)*Math.PI/180;
 return Math.sqrt(x*x+y*y)*R;
}

navigator.geolocation.watchPosition(p=>{
 const lat=p.coords.latitude,lng=p.coords.longitude;
 if(userMarker) map.removeLayer(userMarker);
 userMarker=L.marker([lat,lng]).addTo(map);
 map.setView([lat,lng],16);
 if(stops.length){
   const s=stops[next];
   const m=Math.round(dist(lat,lng,s.lat,s.lng));
   status.innerHTML=`<strong>Volgende stop:</strong> ${s.name}<br>Afstand: ${m} meter`;
   if(m<40 && next<stops.length-1){
      navigator.vibrate?.(300);
      alert("Aangekomen bij: "+s.name);
      next++;
   }
 } else {
   status.textContent="Route wordt geladen...";
 }
},()=>status.textContent="Geen GPS");
