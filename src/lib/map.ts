import maplibregl from 'maplibre-gl';
import type { FeatureCollection, Feature } from 'geojson';
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
// Arbitrary diagram coordinates, deliberately not situated in Lusaka. No surveyed geometry.
const baseline: Feature = { type:'Feature', properties:{}, geometry:{type:'LineString',coordinates:[[-.075,-.05],[-.035,-.012],[.025,-.012],[.025,.045],[.075,.06]]} };
const proposal: Feature = { type:'Feature', properties:{}, geometry:{type:'LineString',coordinates:[[-.075,-.05],[-.055,0],[-.015,.04],[.03,.055],[.075,.06]]} };
const points: FeatureCollection = {type:'FeatureCollection',features:[[-.075,-.05],[.025,-.012],[.075,.06]].map((coordinates,i)=>({type:'Feature',properties:{label:['A','Transfer','B'][i]},geometry:{type:'Point',coordinates}}))};
const collection = (feature: Feature): FeatureCollection => ({type:'FeatureCollection',features:[feature]});
const bounds: [[number,number],[number,number]] = [[-.1,-.07],[.1,.08]];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let map: maplibregl.Map | undefined;
let ready = false;
let currentScene = 'distance';
const ids = ['distance','connections','cost','network','alternative'];
const notes: Record<string,string> = {
  distance:'Fictional origin A and destination B. No geographic basemap.',
  connections:'Solid line: two illustrative bus legs via a transfer. Walking is accounted for in the comparison below.',
  cost:'Read the full walking, waiting and onboard breakdown in the comparison below.',
  network:'Actual network withheld pending reuse terms. The diagram does not show survey coverage.',
  alternative:'Dashed line: an unverified direct concept. No road alignment is implied.'
};
function setScene(id: string) {
  currentScene = id;
  document.querySelectorAll<HTMLElement>('.scene').forEach(el => el.classList.toggle('is-active',el.id===id));
  $('scene-counter').textContent = `${String(ids.indexOf(id)+1).padStart(2,'0')} / 05`;
  $('map-note').textContent = notes[id];
  document.querySelectorAll<HTMLElement>('[data-transfer]').forEach(el => { el.style.display = id === 'distance' ? 'none' : ''; });
  if (!map || !ready) return;
  map.setPaintProperty('baseline','line-opacity',id==='distance' ? 0.12 : id==='network' ? .25 : 1);
  map.setPaintProperty('proposal','line-opacity',id==='alternative' ? 1 : 0);
  map.setFilter('stops',['!=',['get','label'],id==='distance' ? 'Transfer' : '']);
  map.setFilter('labels',['!=',['get','label'],id==='distance' ? 'Transfer' : '']);
  map.fitBounds(bounds,{padding:window.innerWidth<641?35:55,duration:reducedMotion.matches?0:650});
}
const observer = new IntersectionObserver(entries => {
  const active = entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if (active) setScene(active.target.id);
},{rootMargin:'-30% 0px -25% 0px',threshold:[0,.15,.4,.7]});
document.querySelectorAll('.scene').forEach(el=>observer.observe(el));
function fallback() {
  $('map-fallback').hidden = false;
  $('map-fallback').style.display = 'flex';
  $('reset-map').hidden = true;
}
try {
  map = new maplibregl.Map({container:'story-map',style:{version:8,sources:{},layers:[{id:'background',type:'background',paint:{'background-color':'#e2e6db'}}]},center:[0,0],zoom:10,attributionControl:false,scrollZoom:false,dragRotate:false,pitchWithRotate:false,touchPitch:false});
  map.addControl(new maplibregl.NavigationControl({showCompass:false}),'top-right');
  map.addControl(new maplibregl.AttributionControl({compact:false,customAttribution:'Schematic © Lumba Digital · synthetic fixture'}));
  map.on('load',()=>{
    if(!map) return;
    const grid: FeatureCollection = {type:'FeatureCollection',features:[]};
    for (let i=-.2;i<=.2;i+=.025) {
      grid.features.push({type:'Feature',properties:{},geometry:{type:'LineString',coordinates:[[i,-.2],[i,.2]]}},{type:'Feature',properties:{},geometry:{type:'LineString',coordinates:[[-.2,i],[.2,i]]}});
    }
    map.addSource('grid',{type:'geojson',data:grid});map.addLayer({id:'grid',type:'line',source:'grid',paint:{'line-color':'#cdd6c6','line-width':1}});
    map.addSource('baseline',{type:'geojson',data:collection(baseline)});
    map.addLayer({id:'baseline',type:'line',source:'baseline',layout:{'line-join':'round','line-cap':'round'},paint:{'line-color':'#193e35','line-width':6}});
    map.addSource('proposal',{type:'geojson',data:collection(proposal)});
    map.addLayer({id:'proposal',type:'line',source:'proposal',paint:{'line-color':'#b64c2b','line-width':4,'line-dasharray':[2,2],'line-opacity':0}});
    map.addSource('stops',{type:'geojson',data:points});
    map.addLayer({id:'stops',type:'circle',source:'stops',paint:{'circle-radius':8,'circle-color':'#f5f1e8','circle-stroke-color':'#193e35','circle-stroke-width':3}});
    // HTML labels avoid external glyph/font requests and keep the diagram offline.
    map.addLayer({id:'labels',type:'circle',source:'stops',paint:{'circle-radius':1,'circle-opacity':0}});
    for(const f of points.features){
      if(f.geometry.type!=='Point')continue;
      const label=document.createElement('span');label.textContent=String(f.properties?.label);label.className='diagram-label';
      label.style.cssText='font:600 11px Arial;color:#193e35;background:#f5f1e8;padding:3px 6px;';
      if(f.properties?.label==='Transfer')label.dataset.transfer='true';
      new maplibregl.Marker({element:label,anchor:'top',offset:[0,15]}).setLngLat(f.geometry.coordinates as [number,number]).addTo(map);
    }
    ready=true;
    $('map-fallback').style.display='none';
    $('reset-map').hidden=false;
    setScene(currentScene);
  });
  map.on('error',fallback);
  map.getCanvas().addEventListener('webglcontextlost',fallback);
  $('reset-map').addEventListener('click',()=>setScene(currentScene));
} catch { fallback(); }
