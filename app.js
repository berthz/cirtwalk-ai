const map=L.map('map').setView([50.8466,4.3528],13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map);
const status=document.getElementById('status');
if(navigator.geolocation){
navigator.geolocation.watchPosition(p=>{
const lat=p.coords.latitude,lng=p.coords.longitude;
status.textContent=`Jouw locatie: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
if(window.me) map.removeLayer(window.me);
window.me=L.marker([lat,lng]).addTo(map).bindPopup('Jij bent hier');
map.setView([lat,lng],16);
},()=>status.textContent='Locatie niet beschikbaar');
}else status.textContent='GPS niet ondersteund';