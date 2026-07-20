
const map=L.map('map').setView([50.8466,4.3528],14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map);
const status=document.getElementById('status');
let route=[],idx=0,user;

fetch('routes/brussel.json').then(r=>r.json()).then(data=>{
 route=data.stops;
 L.polyline(route.map(s=>[s.lat,s.lng])).addTo(map);
 route.forEach(s=>L.marker([s.lat,s.lng]).addTo(map).bindPopup(s.name));
});

function speak(t){
 if(!('speechSynthesis' in window)) return;
 speechSynthesis.cancel();
 speechSynthesis.speak(new SpeechSynthesisUtterance(t));
}
function dist(a,b,c,d){
 const R=6371000;
 const x=(d-b)*Math.PI/180*Math.cos((a+c)*Math.PI/360);
 const y=(c-a)*Math.PI/180;
 return Math.sqrt(x*x+y*y)*R;
}
navigator.geolocation.watchPosition(p=>{
 const lat=p.coords.latitude,lng=p.coords.longitude;
 if(user) map.removeLayer(user);
 user=L.circleMarker([lat,lng]).addTo(map);
 map.setView([lat,lng],16);
 if(route.length){
   const s=route[idx];
   const m=Math.round(dist(lat,lng,s.lat,s.lng));
   status.innerHTML=`<h3>${s.name}</h3><p>${s.story}</p><p><b>${m} m</b> | Stop ${idx+1}/${route.length}</p>`;
   if(m<35){
      navigator.vibrate?.([150,100,150]);
      speak(s.story);
      if(idx<route.length-1) idx++;
   }
 }
});
