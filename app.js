/*==============================================
  LONDON APP - APPLICATION LOGIC
  All functions organized by feature
==============================================*/

/* --- PIN Lock --- */
var PIN_HASH="";
var pinCode="";
var PIN_LEN=6;
function hashPin(p){var h=0;for(var i=0;i<p.length;i++){h=((h<<5)-h)+p.charCodeAt(i);h=h&h}return h.toString(36)}
PIN_HASH=hashPin(CONFIG.pin);
function initLock(){
  if(sessionStorage.getItem("unlocked")==="1"){document.getElementById("lockScreen").classList.add("hide");return}
  document.querySelector(".shell").style.display="none";
  document.querySelector(".nav").style.display="none";
  renderDots();renderPad();
}
function renderDots(){
  var h="";for(var i=0;i<PIN_LEN;i++){h+='<div class="pin-dot '+(i<pinCode.length?"on":"")+'"></div>'}
  document.getElementById("pinDots").innerHTML=h;
}
function renderPad(){
  var nums=["1","2","3","4","5","6","7","8","9","","0","del"];
  var h="";nums.forEach(function(n){
    if(n==="")h+="<div></div>";
    else if(n==="del")h+='<div class="pin-btn del" onclick="pinDel()">\u232b</div>';
    else h+='<div class="pin-btn" onclick="pinAdd(\''+n+'\')">'+n+"</div>";
  });
  document.getElementById("pinPad").innerHTML=h;
}
function pinAdd(n){
  if(pinCode.length>=PIN_LEN)return;pinCode+=n;renderDots();
  if(pinCode.length===PIN_LEN)setTimeout(checkPin,200);
}
function pinDel(){pinCode=pinCode.slice(0,-1);renderDots();document.getElementById("pinMsg").textContent=""}
function checkPin(){
  if(hashPin(pinCode)===PIN_HASH){
    sessionStorage.setItem("unlocked","1");
    document.getElementById("lockScreen").classList.add("hide");
    document.querySelector(".shell").style.display="";
    document.querySelector(".nav").style.display="";
    setTimeout(function(){if(typeof gpsMap!=="undefined"&&gpsMap)gpsMap.invalidateSize()},300);
  }else{
    document.getElementById("pinMsg").textContent="PIN errato";
    document.querySelectorAll(".pin-dot").forEach(function(d){d.classList.add("err")});
    setTimeout(function(){pinCode="";renderDots();document.getElementById("pinMsg").textContent=""},800);
  }
}
initLock();


if(localStorage.getItem('th')!=='d')document.documentElement.classList.add('light');

var TC={'Pub/Birra':'pub','Cibo':'cibo','Attrazione':'attr','Mercato':'mkt','Trasporto':'trans','Passeggiata':'attr','Hotel':'hotel','Panorama':'attr','Foto':'foto','Shopping':'shop'};
var TI={'Pub/Birra':'\u{1F37A}','Cibo':'\u{1F37D}','Attrazione':'\u{1F3DB}','Mercato':'\u{1F6CD}','Trasporto':'\u{1F687}','Passeggiata':'\u{1F3DB}','Hotel':'\u{1F3E8}','Panorama':'\u{1F3DB}','Foto':'\u{1F4F8}','Shopping':'\u{1F6D2}'};
var TN={'Pub/Birra':'Pub','Cibo':'Cibo','Attrazione':'Attrazione','Mercato':'Mercato','Trasporto':'Trasporto','Passeggiata':'Attrazione','Hotel':'Hotel','Panorama':'Attrazione','Foto':'Foto','Shopping':'Shopping'};

var cD=0,tsX=0,sf=null,gpsMap=null,dayMarkers=[],gpsMarker=null;

// Contextual phrases by stop type + specific overrides

// Specific overrides for certain stops

function getPhrasesFor(stopName, stopType) {
  if (PHRASES_STOP[stopName]) return PHRASES_STOP[stopName];
  if (PHRASES_TYPE[stopType]) return PHRASES_TYPE[stopType];
  return PHRASES_TYPE["Attrazione"] || [];
}

function showPhrasesIdx(dayIdx, stopIdx) {
  var all = allItems(LIVE_DAYS[dayIdx]);
  if (stopIdx < all.length) {
    var s = all[stopIdx];
    showPhrases(s.n, s.tp);
  }
}

function showPhrases(stopName, stopType) {
  var phrases = getPhrasesFor(stopName, stopType);
  var overlay = document.getElementById("phrase-overlay");
  var content = document.getElementById("phrase-content");
  
  var h = '<div class="ph-hdr"><div><div class="ph-title">' + stopName + '</div><div class="ph-sub">Frasi utili</div></div><button class="ph-close" onclick="closePhrases()">\u2715</button></div>';
  h += '<div class="ph-list">';
  phrases.forEach(function(p, i) {
    h += '<div class="ph-item"><div class="ph-it">' + p.it + '</div><div class="ph-en">' + p.en + '</div>';
    h += '<div class="ph-btns"><button class="ph-btn" onclick="event.stopPropagation();speakEn(\'' + p.en.replace(/'/g, "\\'") + '\')"><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 5h2l4-3v12l-4-3H3a1 1 0 01-1-1V6a1 1 0 011-1z" fill="currentColor"/><path d="M11 5.5c.8.8 1.2 1.9 1.2 3s-.4 2.2-1.2 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Ascolta</button>';
    h += '<button class="ph-btn" onclick="event.stopPropagation();copyText(\'' + p.en.replace(/'/g, "\\'") + '\',this)"><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="8" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3" fill="none"/><rect x="6" y="5" width="8" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3" fill="none"/></svg> Copia</button></div></div>';
  });
  h += '</div>';
  
  h += '<div class="ph-free"><div class="ph-free-label">Scrivi una frase in italiano</div>';
  h += '<div class="ph-free-row"><input type="text" class="ph-input" id="phFreeIn" placeholder="Es: Dov\'e\' la fermata..." onkeydown="if(event.key===\'Enter\')translateFree()"><button class="ph-translate-btn" onclick="translateFree()"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4h5M4.5 2v2M3 6c1 2 3 3 5 3" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/><path d="M9 7l2 6 2-6M10 11h2" stroke="#fff" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>';
  h += '<div id="phFreeOut" class="ph-free-out"></div></div>';
  
  content.innerHTML = h;
  overlay.classList.add("open");
}

function closePhrases() {
  document.getElementById("phrase-overlay").classList.remove("open");
}

function speakEn(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(text);
  u.lang = "en-GB";
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

function copyText(text, btn) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    var ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
  var orig = btn.innerHTML;
  btn.innerHTML = "\u2713 Copiato!";
  setTimeout(function() { btn.innerHTML = orig; }, 1500);
}

function translateFree() {
  var inp = document.getElementById("phFreeIn").value.trim();
  if (!inp) return;
  var out = document.getElementById("phFreeOut");
  out.innerHTML = '<div class="ph-loading">\u23f3 Traduco...</div>';
  
  var url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(inp) + "&langpair=it|en";
  fetch(url)
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.responseData && d.responseData.translatedText) {
        var tr = d.responseData.translatedText;
        out.innerHTML = '<div class="ph-item"><div class="ph-it">' + inp + '</div><div class="ph-en">' + tr + '</div><div class="ph-btns"><button class="ph-btn" onclick="event.stopPropagation();speakEn(\'' + tr.replace(/'/g, "\\'") + '\')"><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 5h2l4-3v12l-4-3H3a1 1 0 01-1-1V6a1 1 0 011-1z" fill="currentColor"/><path d="M11 5.5c.8.8 1.2 1.9 1.2 3s-.4 2.2-1.2 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Ascolta</button><button class="ph-btn" onclick="event.stopPropagation();copyText(\'' + tr.replace(/'/g, "\\'") + '\',this)"><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="8" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3" fill="none"/><rect x="6" y="5" width="8" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3" fill="none"/></svg> Copia</button></div></div>';
      } else {
        out.innerHTML = '<div class="ph-err">\u274c Traduzione non disponibile</div>';
      }
    })
    .catch(function() {
      out.innerHTML = '<div class="ph-err">\u274c Errore di connessione</div>';
    });
}

// === EDIT ITINERARY FEATURE ===

// On first load, store DAYS in localStorage. After that, always read from storage.
function loadDays() {
  var stored = localStorage.getItem("ld-days");
  if (stored) {
    try { return JSON.parse(stored); } catch(e) {}
  }
  saveDays(DAYS);
  return JSON.parse(JSON.stringify(DAYS));
}
function saveDays(d) {
  localStorage.setItem("ld-days", JSON.stringify(d));
}
function confirmReset() {
  if (confirm("Ripristinare l'itinerario originale?")) resetDays();
}
function resetDays() {
  localStorage.removeItem("ld-days");
  LIVE_DAYS = JSON.parse(JSON.stringify(DAYS));
  saveDays(LIVE_DAYS);
  renderDay(cD);
}

var LIVE_DAYS = loadDays();

function checkVersion() {
  var stored = localStorage.getItem("ld-version");
  if (stored !== CONFIG.version) {
    localStorage.removeItem("ld-days");
    localStorage.setItem("ld-version", CONFIG.version);
    LIVE_DAYS = JSON.parse(JSON.stringify(DAYS));
    saveDays(LIVE_DAYS);
  }
}

// Types for dropdown

function showEditStop(dayIdx, stopIdx) {
  var all = allItemsLive(LIVE_DAYS[dayIdx]);
  var s = all.items[stopIdx];
  var isNew = !s;
  if (isNew) {
    s = {t:"12:00",n:"",tp:"Attrazione",ds:"",du:"",la:0,ln:0,ad:"",di:"",ws:[],bk:null,pla:null,pln:null};
  }

  var overlay = document.getElementById("edit-overlay");
  var content = document.getElementById("edit-content");

  var typeOpts = CONFIG.stopTypes.map(function(tp) {
    return '<option value="' + tp + '"' + (tp === s.tp ? ' selected' : '') + '>' + tp + '</option>';
  }).join("");

  var h = '<div class="ed-hdr"><div class="ed-title">' + (isNew ? "Nuova tappa" : "Modifica tappa") + '</div><button class="ph-close" onclick="closeEdit()">\u2715</button></div>';
  h += '<div class="ed-form">';
  h += '<label class="ed-label">Nome</label><input class="ed-input" id="ed-name" value="' + (s.n||"").replace(/"/g,"&quot;") + '" placeholder="Nome della tappa">';
  h += '<div class="ed-row"><div class="ed-half"><label class="ed-label">Orario</label><input class="ed-input" id="ed-time" type="time" value="' + (s.t||"12:00") + '"></div>';
  h += '<div class="ed-half"><label class="ed-label">Durata</label><input class="ed-input" id="ed-dur" value="' + (s.du||"") + '" placeholder="~30 min"></div></div>';
  h += '<label class="ed-label">Tipo</label><select class="ed-input" id="ed-type">' + typeOpts + '</select>';
  h += '<label class="ed-label">Descrizione</label><textarea class="ed-input ed-ta" id="ed-desc" placeholder="Descrizione...">' + (s.ds||"") + '</textarea>';
  h += '<label class="ed-label">Indirizzo</label><input class="ed-input" id="ed-addr" value="' + (s.ad||"").replace(/"/g,"&quot;") + '" placeholder="Indirizzo">';
  h += '<label class="ed-label">Come arrivarci</label><input class="ed-input" id="ed-dir" value="' + (s.di||"").replace(/"/g,"&quot;") + '" placeholder="Indicazioni">';
  h += '<div class="ed-row"><div class="ed-half"><label class="ed-label">Lat</label><input class="ed-input" id="ed-lat" type="number" step="any" value="' + (s.la||0) + '"></div>';
  h += '<div class="ed-half"><label class="ed-label">Lng</label><input class="ed-input" id="ed-lng" type="number" step="any" value="' + (s.ln||0) + '"></div></div>';
  h += '<label class="ed-label">Link prenotazione (opzionale)</label><input class="ed-input" id="ed-bk" value="' + (s.bk?s.bk.u:"") + '" placeholder="https://...">';
  
  h += '<div class="ed-actions">';
  h += '<button class="ed-save" onclick="saveEdit(' + dayIdx + ',' + stopIdx + ',' + (isNew?1:0) + ')">Salva</button>';
  if (!isNew) {
    h += '<button class="ed-del" onclick="deleteStop(' + dayIdx + ',' + stopIdx + ')">Elimina tappa</button>';
  }
  h += '</div>';
  
  if (!isNew) {
    h += '<div class="ed-move">';
    if (stopIdx > 0) h += '<button class="ed-move-btn" onclick="moveStop(' + dayIdx + ',' + stopIdx + ',-1)">\u2191 Sposta su</button>';
    if (stopIdx < all.items.length - 1) h += '<button class="ed-move-btn" onclick="moveStop(' + dayIdx + ',' + stopIdx + ',1)">\u2193 Sposta giu</button>';
    h += '</div>';
  }
  
  h += '</div>';
  
  content.innerHTML = h;
  overlay.classList.add("open");
}

function closeEdit() {
  document.getElementById("edit-overlay").classList.remove("open");
}

function saveEdit(dayIdx, stopIdx, isNew) {
  var s = {
    t: document.getElementById("ed-time").value || "12:00",
    n: document.getElementById("ed-name").value || "Nuova tappa",
    tp: document.getElementById("ed-type").value,
    ds: document.getElementById("ed-desc").value || "",
    du: document.getElementById("ed-dur").value || "",
    la: parseFloat(document.getElementById("ed-lat").value) || 0,
    ln: parseFloat(document.getElementById("ed-lng").value) || 0,
    ad: document.getElementById("ed-addr").value || "",
    di: document.getElementById("ed-dir").value || "",
    ws: [],
    bk: null,
    pla: null,
    pln: null
  };
  
  var bkUrl = document.getElementById("ed-bk").value;
  if (bkUrl) s.bk = {u: bkUrl, l: "Prenota"};
  
  // Find which zone and position this stop is in
  var info = findStopInZones(dayIdx, stopIdx);
  
  if (isNew) {
    // Add to last zone of the day
    var lastZone = LIVE_DAYS[dayIdx].zones[LIVE_DAYS[dayIdx].zones.length - 1];
    lastZone.items.push(s);
  } else {
    LIVE_DAYS[dayIdx].zones[info.zoneIdx].items[info.itemIdx] = s;
  }
  
  saveDays(LIVE_DAYS);
  closeEdit();
  renderDay(cD);
}

function deleteStop(dayIdx, stopIdx) {
  var info = findStopInZones(dayIdx, stopIdx);
  LIVE_DAYS[dayIdx].zones[info.zoneIdx].items.splice(info.itemIdx, 1);
  // Remove empty zones
  LIVE_DAYS[dayIdx].zones = LIVE_DAYS[dayIdx].zones.filter(function(z) { return z.items.length > 0; });
  saveDays(LIVE_DAYS);
  closeEdit();
  renderDay(cD);
}

function moveStop(dayIdx, stopIdx, direction) {
  var all = allItemsLive(LIVE_DAYS[dayIdx]).items;
  if (stopIdx + direction < 0 || stopIdx + direction >= all.length) return;
  
  var infoFrom = findStopInZones(dayIdx, stopIdx);
  var infoTo = findStopInZones(dayIdx, stopIdx + direction);
  
  // Swap in the flat list approach: remove from source, insert at target
  var item = LIVE_DAYS[dayIdx].zones[infoFrom.zoneIdx].items.splice(infoFrom.itemIdx, 1)[0];
  LIVE_DAYS[dayIdx].zones[infoTo.zoneIdx].items.splice(infoTo.itemIdx + (direction > 0 ? 1 : 0), 0, item);
  
  // Clean empty zones
  LIVE_DAYS[dayIdx].zones = LIVE_DAYS[dayIdx].zones.filter(function(z) { return z.items.length > 0; });
  
  saveDays(LIVE_DAYS);
  closeEdit();
  renderDay(cD);
}

// Helper: given a flat stopIdx, find zoneIdx and itemIdx within that zone
function findStopInZones(dayIdx, flatIdx) {
  var count = 0;
  for (var zi = 0; zi < LIVE_DAYS[dayIdx].zones.length; zi++) {
    var zone = LIVE_DAYS[dayIdx].zones[zi];
    for (var ii = 0; ii < zone.items.length; ii++) {
      if (count === flatIdx) return {zoneIdx: zi, itemIdx: ii};
      count++;
    }
  }
  return {zoneIdx: 0, itemIdx: 0};
}

// Helper: get all items from LIVE_DAYS
function allItemsLive(d) {
  var a = [];
  d.zones.forEach(function(z) { z.items.forEach(function(s) { a.push(s); }); });
  return {items: a};
}

// === NOMINATIM SEARCH + ADD TO ITINERARY ===
var NOM_CACHE = {};

function detectType(place){
  var t=(place.type||"").toLowerCase();
  var c=(place["class"]||"").toLowerCase();
  if(NOM_TYPE_MAP[t])return NOM_TYPE_MAP[t];
  if(NOM_TYPE_MAP[c])return NOM_TYPE_MAP[c];
  var dn=(place.display_name||"").toLowerCase();
  if(dn.indexOf("pub")>=0||dn.indexOf("brewery")>=0||dn.indexOf("tavern")>=0)return "Pub/Birra";
  if(dn.indexOf("restaurant")>=0||dn.indexOf("cafe")>=0||dn.indexOf("pizz")>=0)return "Cibo";
  if(dn.indexOf("museum")>=0||dn.indexOf("gallery")>=0||dn.indexOf("palace")>=0||dn.indexOf("tower")>=0||dn.indexOf("bridge")>=0||dn.indexOf("church")>=0)return "Attrazione";
  if(dn.indexOf("market")>=0)return "Mercato";
  if(dn.indexOf("station")>=0)return "Trasporto";
  if(dn.indexOf("hotel")>=0||dn.indexOf("hostel")>=0)return "Hotel";
  return "Attrazione";
}

function searchNominatim(q){
  if(!q||q.length<3)return;
  var key=q.toLowerCase();
  if(NOM_CACHE[key]){renderNomResults(NOM_CACHE[key],q);return}
  fetch("https://nominatim.openstreetmap.org/search?format=json&q="+encodeURIComponent(q+" London UK")+"&limit=5&addressdetails=1",{headers:{"Accept-Language":"it"}})
  .then(function(r){return r.json()})
  .then(function(d){NOM_CACHE[key]=d;renderNomResults(d,q)})
  .catch(function(){});
}

function renderNomResults(results,q){
  var c=document.getElementById("nom-results");
  if(!c)return;
  if(!results.length){c.innerHTML='<div class="sr-section"><div class="sr-section-hdr">AGGIUNGI ALL\'ITINERARIO</div><div class="sr-empty-small">Nessun risultato su OpenStreetMap</div></div>';return}
  
  var seen2={};var unique2=[];
  results.forEach(function(r){var nm=r.display_name.split(",")[0].trim().toLowerCase();if(!seen2[nm]){seen2[nm]=true;unique2.push(r)}});
  
  var h='<div class="sr-section"><div class="sr-section-hdr">AGGIUNGI ALL\'ITINERARIO</div>';
  unique2.forEach(function(r,i){
    var name=r.display_name.split(",")[0];
    var addr=r.display_name.split(",").slice(1,3).join(",").trim();
    var tp=detectType(r);
    var ti=TI[tp]||"\u{1F3DB}";
    var cl=TC[tp]||"attr";
    var safeName=name.replace(/'/g,"\u2019");
    var safeAddr=addr.replace(/'/g,"\u2019");
    var la=parseFloat(r.lat);
    var ln=parseFloat(r.lon);
    h+='<div class="sr-item" onclick="showAddFlow('+i+',\''+q.replace(/'/g,"\\'")+'\')">';
    h+='<div class="sr-item-ico" style="background:var(--'+cl+'s,var(--bg3))">'+ti+'</div>';
    h+='<div class="sr-item-info"><div class="sr-item-name">'+name+'</div><div class="sr-item-meta">'+tp+' \u2022 '+addr+'</div></div>';
    h+='<div class="sr-add-badge">+ Aggiungi</div>';
    h+='</div>';
  });
  h+='</div>';
  
  // Google Maps link
  h+='<div class="sr-gmaps" onclick="window.open(\'https://www.google.com/maps/search/'+encodeURIComponent(q+' London')+'\',\'_blank\')">';
  h+='<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2C6.4 2 3.5 4.9 3.5 8.5c0 5.2 6.5 11.5 6.5 11.5s6.5-6.3 6.5-11.5C16.5 4.9 13.6 2 10 2z" fill="#ea4335"/><circle cx="10" cy="8.5" r="2" fill="#fff"/></svg>';
  h+='<div class="sr-gmaps-text">Cerca "'+q+'" su Google Maps</div>';
  h+='<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="var(--tx3)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  h+='</div>';
  
  c.innerHTML=h;
}

function showAddFlow(resultIdx,q){
  var key=q.toLowerCase();
  var results=NOM_CACHE[key];
  if(!results||!results[resultIdx])return;
  var place=results[resultIdx];
  var name=place.display_name.split(",")[0];
  var addr=place.display_name.split(",").slice(0,3).join(",").trim();
  var la=parseFloat(place.lat);
  var ln=parseFloat(place.lon);
  var tp=detectType(place);
  
  var overlay=document.getElementById("edit-overlay");
  var content=document.getElementById("edit-content");
  var h='<div class="ed-hdr"><div class="ed-title">Aggiungi tappa</div><button class="ph-close" onclick="closeEdit()">\u2715</button></div>';
  h+='<div class="ed-form">';
  h+='<div style="padding:12px;background:var(--bg3);border-radius:10px;margin-bottom:14px"><div style="font-size:15px;font-weight:600">'+name+'</div><div style="font-size:12px;color:var(--tx2);margin-top:4px">'+addr+'</div><div style="font-size:11px;color:var(--tx3);margin-top:4px">Tipo rilevato: '+tp+'</div></div>';
  h+='<label class="ed-label">In quale giorno?</label><div class="day-pick">';
  LIVE_DAYS.forEach(function(d,i){
    h+='<button class="day-pick-btn" onclick="addPlaceToDay('+i+',\''+name.replace(/'/g,"\\'")+'\',\''+tp+'\',\''+addr.replace(/'/g,"\\'")+'\','+la+','+ln+')">';
    h+=d.pl+'<br><span style="font-size:10px;color:var(--tx3);font-weight:400">'+d.t.substring(0,28)+'</span></button>';
  });
  h+='</div></div>';
  content.innerHTML=h;
  overlay.classList.add("open");
}

function addPlaceToDay(dayIdx,name,tp,addr,la,ln){
  var all=allItems(LIVE_DAYS[dayIdx]);
  var lastTime="12:00";
  if(all.length>0){
    var lt=all[all.length-1].t;var parts=lt.split(":");
    var hh=parseInt(parts[0]);hh+=1;if(hh>23)hh=23;
    lastTime=(hh<10?"0":"")+hh+":"+parts[1];
  }
  var newStop={t:lastTime,n:name,tp:tp,ds:"",du:"~1h",la:la,ln:ln,ad:addr,di:"",ws:[],bk:null,pla:null,pln:null};
  var lastZone=LIVE_DAYS[dayIdx].zones[LIVE_DAYS[dayIdx].zones.length-1];
  lastZone.items.push(newStop);
  lastZone.items.sort(function(a,b){return a.t.localeCompare(b.t)});
  saveDays(LIVE_DAYS);
  closeEdit();
  selDay(dayIdx);
  var allNew=allItems(LIVE_DAYS[dayIdx]);
  var newIdx=-1;
  allNew.forEach(function(s,idx){if(s.n===name&&s.la===la)newIdx=idx});
  if(newIdx>=0)setTimeout(function(){showEditStop(dayIdx,newIdx)},300);
  showToast("\u2705 "+name+" aggiunto a "+LIVE_DAYS[dayIdx].pl);
}

function showSearchAdd(dayIdx, afterStopIdx) {
  var overlay = document.getElementById("edit-overlay");
  var content = document.getElementById("edit-content");
  var dayName = LIVE_DAYS[dayIdx].pl;
  var posLabel = typeof afterStopIdx === "number" ? " (dopo posizione " + (afterStopIdx+1) + ")" : "";
  
  var h = '<div class="ed-hdr"><div class="ed-title">Aggiungi tappa a ' + dayName + '</div><button class="ph-close" onclick="closeEdit()">\u2715</button></div>';
  h += '<div class="ed-form">';
  h += '<label class="ed-label">Cerca un luogo</label>';
  h += '<div class="ph-free-row"><input type="text" class="ed-input" id="addSearchIn" placeholder="Es: London Eye, Dishoom..."><button class="ph-translate-btn" onclick="doAddSearch(' + dayIdx + ',' + (typeof afterStopIdx==="number"?afterStopIdx:"999") + ')"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="#fff" stroke-width="2" fill="none"/><path d="M11 11l3 3" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg></button></div>';
  h += '<div id="addSearchResults" style="margin-top:10px"></div>';
  h += '</div>';
  
  content.innerHTML = h;
  overlay.classList.add("open");
  setTimeout(function() {
    var inp = document.getElementById("addSearchIn");
    if (inp) {
      inp.focus();
      inp.addEventListener("keydown", function(e) {
        if (e.key === "Enter") doAddSearch(dayIdx, typeof afterStopIdx==="number"?afterStopIdx:999);
      });
    }
  }, 300);
}

function doAddSearch(dayIdx, afterStopIdx) {
  var q = document.getElementById("addSearchIn").value.trim();
  if (!q || q.length < 2) return;
  var out = document.getElementById("addSearchResults");
  out.innerHTML = '<div class="emp">\u23f3 Cerco...</div>';
  
  fetch("https://nominatim.openstreetmap.org/search?format=json&q=" + encodeURIComponent(q + " London UK") + "&limit=8&addressdetails=1", {headers:{"Accept-Language":"it"}})
  .then(function(r) { return r.json(); })
  .then(function(results) {
    if (!results.length) { out.innerHTML = '<div class="emp">Nessun risultato</div>'; return; }
    // Deduplicate by name
    var seen = {};
    var unique = [];
    results.forEach(function(r) {
      var name = r.display_name.split(",")[0].trim().toLowerCase();
      if (!seen[name]) {
        seen[name] = true;
        unique.push(r);
      }
    });
    
    var h = "";
    unique.forEach(function(r, i) {
      var name = r.display_name.split(",")[0];
      var addr = r.display_name.split(",").slice(1, 3).join(",").trim();
      var la = parseFloat(r.lat);
      var ln = parseFloat(r.lon);
      var tp = detectType(r);
      var ti = TI[tp] || "\ud83c\udfdb";
      var safeName = name.replace(/'/g, "\u2019");
      var safeAddr = addr.replace(/'/g, "\u2019");
      h += '<div class="sr nom-sr" onclick="confirmAddPlaceAt(' + dayIdx + ',' + afterStopIdx + ',\'' + safeName + '\',\'' + tp + '\',\'' + safeAddr + '\',' + la + ',' + ln + ')">';
      h += '<div style="display:flex;justify-content:space-between;align-items:center"><div>';
      h += '<div class="sr-d">' + ti + ' ' + tp + '</div>';
      h += '<div class="sr-n">' + name + '</div>';
      h += '<div class="sr-x">' + addr + '</div>';
      h += '</div><div class="nom-add">+ Aggiungi</div></div></div>';
    });
    out.innerHTML = h;
  })
  .catch(function() { out.innerHTML = '<div class="emp">Errore di connessione</div>'; });
}

function confirmAddPlaceAt(dayIdx, afterStopIdx, name, tp, addr, la, ln) {
  // Calculate time: if inserting between stops, average their times
  var all = allItems(LIVE_DAYS[dayIdx]);
  var newTime = "12:00";
  
  if (afterStopIdx < 999 && afterStopIdx >= 0 && afterStopIdx < all.length) {
    var prevTime = all[afterStopIdx].t;
    var pp = prevTime.split(":");
    var ph = parseInt(pp[0]), pm = parseInt(pp[1]);
    // Check if there's a next stop
    if (afterStopIdx + 1 < all.length) {
      var nextTime = all[afterStopIdx + 1].t;
      var np = nextTime.split(":");
      var nh = parseInt(np[0]), nm = parseInt(np[1]);
      // Average
      var avgMin = Math.round(((ph*60+pm) + (nh*60+nm)) / 2);
      var ah = Math.floor(avgMin/60);
      var am = avgMin % 60;
      newTime = (ah<10?"0":"") + ah + ":" + (am<10?"0":"") + am;
    } else {
      // After last stop: +1h
      ph += 1;
      if (ph > 23) ph = 23;
      newTime = (ph<10?"0":"") + ph + ":" + (pm<10?"0":"") + pm;
    }
  } else {
    // At the end: +1h from last
    if (all.length > 0) {
      var lt = all[all.length-1].t.split(":");
      var lh = parseInt(lt[0]) + 1;
      if (lh > 23) lh = 23;
      newTime = (lh<10?"0":"") + lh + ":" + lt[1];
    }
  }
  
  var newStop = {t:newTime,n:name,tp:tp,ds:"",du:"~1h",la:la,ln:ln,ad:addr,di:"",ws:[],bk:null,pla:null,pln:null};
  
  // Find the right zone and position to insert
  if (afterStopIdx < 999 && afterStopIdx >= 0) {
    var info = findStopInZones(dayIdx, afterStopIdx);
    LIVE_DAYS[dayIdx].zones[info.zoneIdx].items.splice(info.itemIdx + 1, 0, newStop);
  } else {
    var lastZone = LIVE_DAYS[dayIdx].zones[LIVE_DAYS[dayIdx].zones.length - 1];
    lastZone.items.push(newStop);
  }
  
  saveDays(LIVE_DAYS);
  closeEdit();
  selDay(dayIdx);
  showToast("\u2705 " + name + " aggiunto!");
}

function deleteStopPermanent(dayIdx, stopIdx) {
  var all = allItems(LIVE_DAYS[dayIdx]);
  var name = all[stopIdx] ? all[stopIdx].n : "tappa";
  if (!confirm("Eliminare definitivamente " + name + "?")) return;
  var info = findStopInZones(dayIdx, stopIdx);
  LIVE_DAYS[dayIdx].zones[info.zoneIdx].items.splice(info.itemIdx, 1);
  LIVE_DAYS[dayIdx].zones = LIVE_DAYS[dayIdx].zones.filter(function(z) { return z.items.length > 0; });
  saveDays(LIVE_DAYS);
  renderDay(cD);
  showToast("\ud83d\uddd1 " + name + " eliminato");
}

function showToast(msg) {
  var t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(function() { t.classList.remove("show"); }, 2500);
}

// === CHECKLIST PRE-PARTENZA ===

// === BEER COUNTER ===

// === DIARIO DI VIAGGIO ===
function loadDiary(){
  var s=localStorage.getItem("ld-diary");
  if(s){try{return JSON.parse(s)}catch(e){}}
  return {};
}
function saveDiary(d){localStorage.setItem("ld-diary",JSON.stringify(d))}

function addDiaryEntry(dayIdx, stopIdx, text, photoData){
  var diary=loadDiary();
  var key=dayIdx+"-"+stopIdx;
  if(!diary[key])diary[key]=[];
  var entry={text:text||"",photo:photoData||null,time:new Date().toLocaleString("it-IT")};
  diary[key].push(entry);
  saveDiary(diary);
}

function renderDiaryBtn(dayIdx, stopIdx){
  var diary=loadDiary();
  var key=dayIdx+"-"+stopIdx;
  var entries=diary[key]||[];
  var hasPhoto=entries.some(function(e){return e.photo});
  var badge=entries.length>0?'<span class="diary-badge">'+entries.length+'</span>':"";
  var photoTag=hasPhoto?' \u{1F4F7}':'';
  return {html:'<a class="btn-ico" style="position:relative" href="javascript:void(0)" onclick="event.stopPropagation();event.preventDefault();showDiary('+dayIdx+','+stopIdx+')" title="Diario">'+ICN.diary+badge+'</a>', hasEntries:entries.length>0, hasPhoto:hasPhoto};
}

function showDiary(dayIdx, stopIdx){
  var diary=loadDiary();
  var key=dayIdx+"-"+stopIdx;
  var entries=diary[key]||[];
  var all=allItems(LIVE_DAYS[dayIdx]);
  var stopName=all[stopIdx]?all[stopIdx].n:"Tappa";
  
  var overlay=document.getElementById("edit-overlay");
  var content=document.getElementById("edit-content");
  
  var h='<div class="ed-hdr" style="background:#14b8a6"><div class="ed-title">\ud83d\udcd6 '+stopName+'</div><button class="ph-close" onclick="closeEdit()">\u2715</button></div>';
  h+='<div class="ed-form">';
  
  if(entries.length>0){
    entries.forEach(function(e,i){
      h+='<div class="diary-entry" style="position:relative">';
      h+='<button class="diary-del" onclick="event.stopPropagation();deleteDiaryEntry('+dayIdx+','+stopIdx+','+i+')">&times;</button>';
      if(e.photo)h+='<img src="'+e.photo+'" class="diary-photo">';
      if(e.text)h+='<div class="diary-text">'+e.text+'</div>';
      h+='<div class="diary-time">'+e.time+'</div>';
      h+='</div>';
    });
  }else{
    h+='<div class="emp">Nessuna nota ancora. Aggiungi il tuo primo ricordo!</div>';
  }
  
  h+='<div style="margin-top:14px;border-top:1px solid var(--brd);padding-top:14px">';
  h+='<textarea class="ed-input ed-ta" id="diary-text" placeholder="Cosa hai visto? Come ti sei sentito?"></textarea>';
  h+='<div style="display:flex;gap:8px;margin-top:8px">';
  h+='<label class="diary-photo-btn" style="flex:1;justify-content:center"><input type="file" accept="image/*" capture="environment" id="diary-photo" style="display:none" onchange="previewDiaryPhoto()"><span>\ud83d\udcf7 Scatta foto</span></label>';
  h+='<label class="diary-photo-btn" style="flex:1;justify-content:center"><input type="file" accept="image/*" id="diary-gallery" style="display:none" onchange="previewDiaryGallery()"><span>\ud83d\uddbc Galleria</span></label>';
  h+='</div>';
  h+='<div style="margin-top:8px"><button class="ed-save" style="width:100%" onclick="saveDiaryEntry('+dayIdx+','+stopIdx+')">\ud83d\udcbe Salva ricordo</button></div>';
  h+='<div id="diary-preview" style="margin-top:8px"></div>';
  h+='</div></div>';
  
  content.innerHTML=h;
  overlay.classList.add("open");
}

function compressPhoto(file, callback){
  var reader=new FileReader();
  reader.onload=function(e){
    var img=new Image();
    img.onload=function(){
      var canvas=document.createElement("canvas");
      var maxW=800,maxH=600;
      var w=img.width,h=img.height;
      if(w>maxW){h=h*(maxW/w);w=maxW}
      if(h>maxH){w=w*(maxH/h);h=maxH}
      canvas.width=w;canvas.height=h;
      var ctx=canvas.getContext("2d");
      ctx.drawImage(img,0,0,w,h);
      var compressed=canvas.toDataURL("image/jpeg",0.5);
      callback(compressed);
    };
    img.src=e.target.result;
  };
  reader.readAsDataURL(file);
}

function previewDiaryGallery(){
  var f=document.getElementById("diary-gallery").files[0];
  if(!f)return;
  compressPhoto(f,function(data){
    document.getElementById("diary-preview").innerHTML='<img src="'+data+'" style="width:100%;border-radius:8px;max-height:200px;object-fit:cover">';
    document.getElementById("diary-preview").dataset.photo=data;
  });
}

function previewDiaryPhoto(){
  var f=document.getElementById("diary-photo").files[0];
  if(!f)return;
  compressPhoto(f,function(data){
    document.getElementById("diary-preview").innerHTML='<img src="'+data+'" style="width:100%;border-radius:8px;max-height:200px;object-fit:cover">';
    document.getElementById("diary-preview").dataset.photo=data;
  });
}

function saveDiaryEntry(dayIdx, stopIdx){
  var text=document.getElementById("diary-text").value.trim();
  var preview=document.getElementById("diary-preview");
  var photo=preview.dataset?preview.dataset.photo:null;
  if(!text&&!photo){showToast("\u270f Scrivi qualcosa o scatta una foto");return}
  addDiaryEntry(dayIdx, stopIdx, text, photo);
  closeEdit();
  showToast("\ud83d\udcd6 Ricordo salvato!");
  renderDay(cD);
}


function deleteDiaryEntry(dayIdx, stopIdx, entryIdx){
  var diary=loadDiary();
  var key=dayIdx+"-"+stopIdx;
  if(diary[key]&&diary[key][entryIdx]!==undefined){
    diary[key].splice(entryIdx,1);
    if(diary[key].length===0)delete diary[key];
    saveDiary(diary);
    renderDay(cD);
    showDiary(dayIdx,stopIdx);
    showToast("\u{1F5D1} Ricordo eliminato");
  }
}

function exportDiary(){
  var diary=loadDiary();
  var h='<html><head><meta charset="utf-8"><title>Diario Londra 2026</title><style>body{font-family:system-ui;max-width:600px;margin:0 auto;padding:20px}h1{font-size:24px}h2{font-size:18px;margin-top:24px}.entry{margin:12px 0;padding:12px;border:1px solid #eee;border-radius:8px}img{max-width:100%;border-radius:8px}.time{font-size:11px;color:#999}</style></head><body>';
  h+='<h1>\ud83d\udcd6 Diario Londra 2026</h1>';
  LIVE_DAYS.forEach(function(d,di){
    var hasEntries=false;
    allItems(d).forEach(function(s,si){
      var key=di+"-"+si;
      if(diary[key]&&diary[key].length>0)hasEntries=true;
    });
    if(!hasEntries)return;
    h+='<h2>'+d.pl+' - '+d.t+'</h2>';
    allItems(d).forEach(function(s,si){
      var key=di+"-"+si;
      var entries=diary[key];
      if(!entries||!entries.length)return;
      h+='<h3>'+s.n+'</h3>';
      entries.forEach(function(e){
        h+='<div class="entry">';
        if(e.photo)h+='<img src="'+e.photo+'">';
        if(e.text)h+='<p>'+e.text+'</p>';
        h+='<div class="time">'+e.time+'</div></div>';
      });
    });
  });
  h+='</body></html>';
  var blob=new Blob([h],{type:'text/html'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');
  a.href=url;a.download='diario-londra-2026.html';a.click();
  showToast("\ud83d\udcbe Diario esportato!");
}

function renderBeerPage(){
  var beers=loadBeers();
  var total=0;for(var k in beers)total+=beers[k];
  var stats=getBeerStats();
  
  var h='<div class="bc-wrap">';
  // Hero
  h+='<div class="bc-hero" style="position:relative">';
  h+='<div class="wt-refresh" onclick="resetBeers()" style="position:absolute;top:12px;right:12px"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 2h12M5 2v-0M11 2v-0M4 5h8l-.7 8.5a1 1 0 01-1 .9H5.7a1 1 0 01-1-.9L4 5z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
  h+='<div class="bc-hero-num">'+total+'</div>';
  h+='<div class="bc-hero-label">Pint Counter</div>';
  h+='<div class="bc-hero-stats">';
  h+='<div class="bc-hs"><div class="bc-hs-n">'+stats.avg+'</div><div class="bc-hs-l">media/giorno</div></div>';
  h+='<div class="bc-hs"><div class="bc-hs-n">'+stats.pubCount+'</div><div class="bc-hs-l">pub visitati</div></div>';
  if(stats.topPub)h+='<div class="bc-hs"><div class="bc-hs-n">\u{1F947}</div><div class="bc-hs-l">'+stats.topPub+'</div></div>';
  h+='</div></div>';
  
  h+=renderBeerCounter();
  h+='</div>';
  document.getElementById("beerw").innerHTML=h;
}

// === PINT COUNTER - BEER PASSPORT ===

function resetBeers(){
  if(!confirm("Azzerare tutte le pinte e ricominciare da zero?"))return;
  localStorage.removeItem("ld-beers");
  renderBeerPage();
  showToast("\u{1F504} Pint Counter azzerato!");
}

function loadBeers(){
  var s=localStorage.getItem("ld-beers");
  if(s){try{return JSON.parse(s)}catch(e){}}
  return {};
}
function saveBeers(b){localStorage.setItem("ld-beers",JSON.stringify(b))}

function addBeer(pubName){
  var beers=loadBeers();
  beers[pubName]=(beers[pubName]||0)+1;
  saveBeers(beers);
  var cnt=beers[pubName];
  var total=0;for(var k in beers)total+=beers[k];
  // Achievements
  var ach="";
  if(total===1)ach=" - First Pint!";
  else if(total===10)ach=" - Warming Up!";
  else if(total===20)ach=" - Session Pro!";
  else if(total===30)ach=" - Marathon Drinker!";
  else if(total===50)ach=" - Pub Royalty!";
  else if(cnt===5)ach=" - Hat Trick x5 a "+pubName+"!";
  else if(cnt===10)ach=" - Local a "+pubName+"!";
  showToast("\ud83c\udf7a Pinta #"+total+(ach||""));
  renderBeerPage();
}

function removeBeer(pubName){
  var beers=loadBeers();
  if(beers[pubName]&&beers[pubName]>0){
    beers[pubName]--;
    if(beers[pubName]===0)delete beers[pubName];
    saveBeers(beers);
    renderBeerPage();
  }
}

function getAllPubs(){
  var beers=loadBeers();
  var pubs=[];
  var seen={};
  // First: all pubs from itinerary
  LIVE_DAYS.forEach(function(d){
    allItems(d).forEach(function(s){
      if(s.tp==="Pub/Birra"&&!seen[s.n]){
        seen[s.n]=true;
        pubs.push({name:s.n,addr:s.ad||""});
      }
    });
  });
  // Then: any tracked pub not in itinerary (was removed or added externally)
  for(var k in beers){
    if(!seen[k]){
      seen[k]=true;
      pubs.push({name:k,addr:""});
    }
  }
  return pubs;
}

function getBeerStats(){
  var beers=loadBeers();
  var total=0,topPub="",topCount=0,pubCount=0;
  for(var k in beers){
    total+=beers[k];
    pubCount++;
    if(beers[k]>topCount){topCount=beers[k];topPub=k}
  }
  var totalPubs=getAllPubs().length;
  var daysWithBeer=0;
  LIVE_DAYS.forEach(function(d){
    var hasBeer=false;
    allItems(d).forEach(function(s){
      if(s.tp==="Pub/Birra"&&beers[s.n]&&beers[s.n]>0)hasBeer=true;
    });
    if(hasBeer)daysWithBeer++;
  });
  var avg=daysWithBeer>0?(total/daysWithBeer).toFixed(1):"0";
  var achs=getAchievements();
  var unlockedAchs=achs.filter(function(a){return a.unlocked}).length;
  return {total:total,topPub:topPub,topCount:topCount,pubCount:pubCount,totalPubs:totalPubs,avg:avg,daysWithBeer:daysWithBeer,unlockedAchs:unlockedAchs};
}

function getAchievements(){
  var beers=loadBeers();
  var total=0;for(var k in beers)total+=beers[k];
  var pubCount=Object.keys(beers).length;
  var maxPerPub=0;
  for(var k in beers){if(beers[k]>maxPerPub)maxPerPub=beers[k]}
  var gpubs=0;
  for(var k in beers){
    var kl=k.toLowerCase();
    if(kl.indexOf("guinness")>=0||kl.indexOf("toucan")>=0||kl.indexOf("devonshire")>=0||kl.indexOf("grocer")>=0||kl.indexOf("dublin")>=0)gpubs++;
  }
  return [
    {icon:"\u{1F37A}",name:"First Pint",desc:"1 pinta bevuta",unlocked:total>=1},
    {icon:"\u{1F37B}",name:"Warming Up",desc:"10 pinte bevute",unlocked:total>=10},
    {icon:"\u{1F3C5}",name:"Session Pro",desc:"20 pinte bevute",unlocked:total>=20},
    {icon:"\u{1F3C6}",name:"Marathon Drinker",desc:"30 pinte bevute",unlocked:total>=30},
    {icon:"\u{1F451}",name:"Pub Royalty",desc:"50 pinte bevute",unlocked:total>=50},
    {icon:"\u{1F48E}",name:"Centurion",desc:"100 pinte bevute",unlocked:total>=100},
    {icon:"\u{1F463}",name:"Pub Hopper",desc:"3 pub diversi",unlocked:pubCount>=3},
    {icon:"\u{1F5FA}",name:"Explorer",desc:"6 pub diversi",unlocked:pubCount>=6},
    {icon:"\u{1F9ED}",name:"Pub Crawler",desc:"10 pub diversi",unlocked:pubCount>=10},
    {icon:"\u{1F3A9}",name:"Hat Trick",desc:"5+ pinte in un pub",unlocked:maxPerPub>=5},
    {icon:"\u{1F1EE}\u{1F1EA}",name:"Irish Soul",desc:"3 Guinness pubs",unlocked:gpubs>=3},
    {icon:"\u2618\ufe0f",name:"Guinness Master",desc:"5 Guinness pubs",unlocked:gpubs>=5}
  ];
}

function renderBeerCounter(){
  var beers=loadBeers();
  var achs=getAchievements();
  var h='';
  
  // Achievements - all visible
  h+='<div class="bc-card"><div class="bc-card-hdr">ACHIEVEMENTS</div><div class="bc-achs">';
  achs.forEach(function(a){
    h+='<div class="bc-ach'+(a.unlocked?'':' bc-ach-locked')+'"><span class="bc-ach-ico">'+(a.unlocked?a.icon:'\u{1F512}')+'</span><div><div class="bc-ach-name">'+a.name+'</div><div class="bc-ach-desc">'+a.desc+'</div></div></div>';
  });
  h+='</div></div>';
  
  // Beer Passport - merge itinerary pubs + any extra tracked pubs
  h+='<div class="bc-card"><div class="bc-card-hdr">BEER PASSPORT</div>';
  var pubList=getAllPubs();
  pubList.forEach(function(p){
    var cnt=beers[p.name]||0;
    var visited=cnt>0;
    h+='<div class="bp-row'+(visited?' bp-visited':'')+'">';
    h+='<div class="bp-check">'+(visited?'\u2705':'\u2b1c')+'</div>';
    h+='<div class="bp-info"><div class="bp-name">'+p.name+'</div>';
    if(p.addr)h+='<div class="bp-addr">'+p.addr+'</div>';
    h+='</div>';
    h+='<div class="bp-ctr"><button class="bp-btn" onclick="event.stopPropagation();removeBeer(\u0027'+p.name.replace(/'/g,"\u2019")+'\u0027)">-</button><span class="bp-cnt">'+cnt+'</span><button class="bp-btn" onclick="event.stopPropagation();addBeer(\u0027'+p.name.replace(/'/g,"\u2019")+'\u0027)">+</button></div>';
    h+='</div>';
  });
  h+='</div>';
  
  // Fun stats
  var stats=getBeerStats();
  if(stats.total>0){
    h+='<div class="bc-card"><div class="bc-card-hdr">STATISTICHE</div><div class="bc-fun-stats">';
    h+='<div class="bc-fs-row"><span class="bc-fs-label">Pinte totali</span><span class="bc-fs-val">'+stats.total+'</span></div>';
    h+='<div class="bc-fs-row"><span class="bc-fs-label">Pub visitati</span><span class="bc-fs-val">'+stats.pubCount+'/'+stats.totalPubs+'</span></div>';
    h+='<div class="bc-fs-row"><span class="bc-fs-label">Media per pub</span><span class="bc-fs-val">'+(stats.pubCount>0?(stats.total/stats.pubCount).toFixed(1):"0")+'</span></div>';
    h+='<div class="bc-fs-row"><span class="bc-fs-label">Media al giorno</span><span class="bc-fs-val">'+stats.avg+'</span></div>';
    if(stats.topPub)h+='<div class="bc-fs-row"><span class="bc-fs-label">Pub preferito</span><span class="bc-fs-val">'+stats.topPub+' ('+stats.topCount+')</span></div>';
    h+='<div class="bc-fs-row"><span class="bc-fs-label">Achievement sbloccati</span><span class="bc-fs-val">'+stats.unlockedAchs+'/12</span></div>';
    h+='</div></div>';
  }
  
  return h;
}

var TAB_HEADERS = {
  p1: {name:"London App", icon:CONFIG.iconFavicon},
  p2: {name:"Cerca", icon:"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2230%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%3E%3Crect%20width%3D%2230%22%20height%3D%2230%22%20rx%3D%227%22%20fill%3D%22%233b82f6%22/%3E%3Ccircle%20cx%3D%2213%22%20cy%3D%2213%22%20r%3D%226%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%222.5%22/%3E%3Cpath%20d%3D%22M18%2018l5%205%22%20stroke%3D%22%23fff%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22/%3E%3C/svg%3E"},
  p3: {name:"Trasporti", icon:"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2230%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%3E%3Crect%20width%3D%2230%22%20height%3D%2230%22%20rx%3D%227%22%20fill%3D%22%23ef4444%22/%3E%3Ccircle%20cx%3D%2215%22%20cy%3D%2215%22%20r%3D%229%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%222%22/%3E%3Crect%20x%3D%226%22%20y%3D%2212%22%20width%3D%2218%22%20height%3D%226%22%20rx%3D%221%22%20fill%3D%22%23012169%22/%3E%3Ctext%20x%3D%2215%22%20y%3D%2217%22%20text-anchor%3D%22middle%22%20fill%3D%22%23fff%22%20font-family%3D%22system-ui%22%20font-size%3D%225%22%20font-weight%3D%22700%22%3ETfL%3C/text%3E%3C/svg%3E"},
  p4: {name:"Meteo", icon:"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2230%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%3E%3Crect%20width%3D%2230%22%20height%3D%2230%22%20rx%3D%227%22%20fill%3D%22%230ea5e9%22/%3E%3Ccircle%20cx%3D%2214%22%20cy%3D%2212%22%20r%3D%225%22%20fill%3D%22%23fbbf24%22/%3E%3Cpath%20d%3D%22M14%205v2M14%2019v2M7%2012H5M23%2012h-2M8.5%207.5l1.5%201.5M18%2017l1.5%201.5M8.5%2016.5l1.5-1.5M18%207l1.5-1.5%22%20stroke%3D%22%23fbbf24%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22/%3E%3Cpath%20d%3D%22M10%2020c0-2.5%202-4%204.5-4s4.5%201.5%204.5%204%22%20fill%3D%22%23fff%22%20opacity%3D%22.8%22/%3E%3C/svg%3E"},
  p6: {name:"Pint Counter", icon:CONFIG.iconPint},
  p5: {name:"Info", icon:"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2230%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%3E%3Crect%20width%3D%2230%22%20height%3D%2230%22%20rx%3D%227%22%20fill%3D%22%236b7280%22/%3E%3Ccircle%20cx%3D%2215%22%20cy%3D%229%22%20r%3D%222%22%20fill%3D%22%23fff%22/%3E%3Crect%20x%3D%2213%22%20y%3D%2213%22%20width%3D%224%22%20height%3D%229%22%20rx%3D%221%22%20fill%3D%22%23fff%22/%3E%3C/svg%3E"}
};
function updateHeader(tabId){
  var cfg=TAB_HEADERS[tabId]||TAB_HEADERS.p1;
  document.getElementById("hdr-name").textContent=cfg.name;
  document.getElementById("hdr-ico").src=cfg.icon;
}


/* --- Live weather cache --- */
var WEATHER_CACHE = null;
var TFL_STATUS = {};

/* --- Weather state --- */
var wtDays=null;
var wtSelected=0;
var wtOpen=-1;

function wtToggle(i){
  if(wtOpen===i){wtOpen=-1}else{wtOpen=i}
  wtSelected=i;
  renderMt();
}

function windIcon(kmh){
  if(kmh<10)return '<svg width="20" height="16" viewBox="0 0 20 16"><path d="M2 8c2-2 4 2 6 0" stroke="var(--tx3)" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>';
  if(kmh<20)return '<svg width="20" height="16" viewBox="0 0 20 16"><path d="M2 5c2-2 4 2 6 0" stroke="var(--tx2)" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M2 10c2-2 4 2 6 0" stroke="var(--tx2)" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>';
  return '<svg width="20" height="16" viewBox="0 0 20 16"><path d="M2 3c2-2 4 2 6 0" stroke="var(--tx)" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M2 8c2-2 4 2 6 0" stroke="var(--tx)" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M2 13c2-2 4 2 6 0" stroke="var(--tx)" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>';
}


function fetchWeatherAuto(){fetchW()}


function renderQuickView(){
  if(!LIVE_DAYS||!LIVE_DAYS.length)return "";
  var now=new Date();
  var dayIdx=-1;
  // Find which day we're on (26-31 Mar 2026)
  var dates=["2026-03-26","2026-03-27","2026-03-28","2026-03-29","2026-03-30","2026-03-31"];
  var today=now.toISOString().split("T")[0];
  for(var i=0;i<dates.length;i++){if(dates[i]===today){dayIdx=i;break}}
  
  if(dayIdx<0||dayIdx>=LIVE_DAYS.length)return "";
  
  var h=now.getHours(),m=now.getMinutes();
  var nowMin=h*60+m;
  var all=allItems(LIVE_DAYS[dayIdx]);
  var current=null,next=null;
  
  for(var j=0;j<all.length;j++){
    var parts=all[j].t.split(":");
    var stopMin=parseInt(parts[0])*60+parseInt(parts[1]);
    if(stopMin<=nowMin)current=all[j];
    if(stopMin>nowMin&&!next)next=all[j];
  }
  
  if(!current&&!next)return "";
  
  var qh='<div class="qv">';
  if(current){
    var cl=TC[current.tp]||"hotel";
    qh+='<div class="qv-now"><span class="qv-label">Adesso</span><span class="qv-name">'+current.n+'</span></div>';
  }
  if(next){
    var parts=next.t.split(":");
    var nextMin=parseInt(parts[0])*60+parseInt(parts[1]);
    var diff=nextMin-nowMin;
    if(diff>0&&diff<=120){
      qh+='<div class="qv-next"><span class="qv-label">Tra '+diff+' min</span><span class="qv-name">'+next.n+'</span></div>';
    }
  }
  qh+='</div>';
  return qh;
}


var EUR_GBP_RATE = 0.86;

function fetchExchangeRate(){
  fetch("https://api.exchangerate-api.com/v4/latest/EUR")
  .then(function(r){return r.json()})
  .then(function(d){
    if(d.rates&&d.rates.GBP){
      EUR_GBP_RATE=d.rates.GBP;
      var el=document.getElementById("fx-rate");
      if(el)el.textContent="1 EUR = "+(typeof EUR_GBP_RATE!=='undefined'?EUR_GBP_RATE:0.86).toFixed(4)+" GBP";
    }
  })
  .catch(function(){});
}

function convertCurrency(){
  var inp=document.getElementById("fx-input");
  var out=document.getElementById("fx-output");
  var dir=document.getElementById("fx-dir");
  if(!inp||!out)return;
  var val=parseFloat(inp.value)||0;
  if(dir&&dir.value==="gbp2eur"){
    out.textContent=(val/EUR_GBP_RATE).toFixed(2)+" EUR";
  }else{
    out.textContent=(val*EUR_GBP_RATE).toFixed(2)+" GBP";
  }
}


/* --- Menu & Guide --- */

function toggleTheme(){
  document.documentElement.classList.toggle("light");
  var isLight=document.documentElement.classList.contains("light");
  localStorage.setItem("th",isLight?"l":"d");
  var ico=document.getElementById("theme-ico");
  var lbl=document.getElementById("theme-label");
  if(ico)ico.innerHTML=isLight?"\u2600\ufe0f":"\u{1F319}";
  if(lbl)lbl.textContent=isLight?"Tema scuro":"Tema chiaro";
}
function updateThemeMenu(){
  var isLight=document.documentElement.classList.contains("light");
  var ico=document.getElementById("theme-ico");
  var lbl=document.getElementById("theme-label");
  if(ico)ico.innerHTML=isLight?"\u2600\ufe0f":"\u{1F319}";
  if(lbl)lbl.textContent=isLight?"Tema scuro":"Tema chiaro";
}

function toggleMenu(){
  var m=document.getElementById("app-menu");
  if(m)m.classList.toggle("open");
  updateThemeMenu();
}
function closeMenu(){
  var m=document.getElementById("app-menu");
  if(m)m.classList.remove("open");
}
function showGuide(){
  closeMenu();
  var overlay=document.getElementById("edit-overlay");
  var content=document.getElementById("edit-content");
  var h='<div class="ed-hdr" style="background:#6b7280"><div class="ed-title">Guida funzionalit\u00e0</div><button class="ph-close" onclick="closeEdit()">\u2715</button></div>';
  h+='<div class="ed-form">';
  
  var sections=[
    {t:"\u{1F4C5} Timeline",d:"Scorri i giorni con le pillole in alto. Ogni giorno ha zone colorate con le tappe. Swipe laterale per cambiare giorno."},
    {t:"\u{1F4CD} Mappa",d:"La mappa mostra le tappe del giorno. Premi 'Tu sei qui' per la tua posizione GPS (funziona solo da sito HTTPS)."},
    {t:"\u270f\ufe0f Modifica tappa",d:"L'icona matita accanto al nome di ogni tappa apre il form di modifica. Puoi cambiare orario, descrizione, tipo e posizione."},
    {t:"\u2795 Aggiungi tappa",d:"Il + tra due tappe o in fondo al giorno apre la ricerca. Cerca un luogo, selezionalo e viene aggiunto con coordinate e tipo automatici."},
    {t:"\u23ed\ufe0f Salta tappa",d:"L'icona grigia a destra di ogni tappa la nasconde temporaneamente (diventa trasparente). Puoi ripristinarla in qualsiasi momento."},
    {t:"\u{1F5D1} Elimina tappa",d:"L'icona rossa cestino a destra elimina la tappa definitivamente dall'itinerario. Chiede conferma prima di eliminare."},
    {t:"\u{1F4F7} Diario",d:"L'icona turchese fotocamera su ogni tappa apre il diario. Puoi scattare foto, caricare dalla galleria e aggiungere note. Le foto vengono compresse automaticamente. \u{1F4F7} appare accanto al nome se ci sono foto."},
    {t:"\u{1F4AC} Frasi utili",d:"L'icona viola su ogni tappa mostra frasi in inglese utili per quel contesto. Puoi ascoltare la pronuncia, copiare il testo o tradurre liberamente dall'italiano."},
    {t:"\u{1F9ED} Navigazione",d:"L'icona Citymapper apre le indicazioni partendo dalla tua posizione GPS attuale. L'icona Google Maps mostra la destinazione su Maps."},
    {t:"\u{1F50D} Cerca",d:"La tab Cerca trova tappe nell'itinerario. Se non trovi nulla, cerca su OpenStreetMap e aggiungi nuovi luoghi."},
    {t:"\u{1F687} Trasporti",d:"Stato in tempo reale di tutte le linee TfL. Si aggiorna automaticamente all'apertura. Premi 'Aggiorna' per i dati pi\u00f9 recenti."},
    {t:"\u2600\ufe0f Meteo",d:"Previsioni con temperatura, pioggia e vento. Si aggiorna automaticamente. Alba e tramonto visibili nella card giornata."},
    {t:"\u{1F37A} Pint Counter",d:"Beer passport con tutti i pub dell'itinerario. Conta le pinte con +/-, sblocca achievement e vedi le statistiche. I pub nuovi aggiunti all'itinerario appaiono automaticamente."},
    {t:"\u{1F4B1} Convertitore",d:"Nella tab Info, converti EUR/GBP con il tasso aggiornato in tempo reale."},
    {t:"\u{1F512} PIN",d:"L'app \u00e8 protetta da PIN a 6 cifre. Modificabile in config.js."},
    {t:"\u{1F504} Ripristina",d:"Nel menu (\u2699), 'Ripristina itinerario' riporta tutto alla versione originale."}
  ];
  
  sections.forEach(function(s){
    h+='<div style="margin-bottom:14px"><div style="font-size:14px;font-weight:600;margin-bottom:3px">'+s.t+'</div><div style="font-size:13px;color:var(--tx2);line-height:1.6">'+s.d+'</div></div>';
  });
  
  h+='</div>';
  content.innerHTML=h;
  overlay.classList.add("open");
}



/* --- Swipe: days on Piano, tabs everywhere --- */
var TAB_ORDER=["p1","p2","p3","p4","p6","p5"];
var swStartX=0,swStartY=0;

function getActiveTab(){
  var el=document.querySelector(".pg.on");
  return el?el.id:"p1";
}

function switchToTab(tabId){
  document.querySelectorAll(".pg").forEach(function(p){p.classList.remove("on")});
  document.querySelectorAll(".nav button").forEach(function(b){b.classList.remove("on")});
  var pg=document.getElementById(tabId);
  if(pg)pg.classList.add("on");
  document.querySelectorAll(".nav button").forEach(function(b){
    if(b.dataset.p===tabId)b.classList.add("on");
  });
  updateHeader(tabId);
}

function initSwipe(){
  document.addEventListener("touchstart",function(e){
    swStartX=e.touches[0].clientX;
    swStartY=e.touches[0].clientY;
  },{passive:true});
  
  document.addEventListener("touchend",function(e){
    var dx=e.changedTouches[0].clientX-swStartX;
    var dy=e.changedTouches[0].clientY-swStartY;
    if(Math.abs(dx)<60||Math.abs(dy)>Math.abs(dx)*0.6)return;
    
    var tab=getActiveTab();
    var tabIdx=TAB_ORDER.indexOf(tab);
    
    if(tab==="p1"){
      // On Piano: swipe changes day first, then overflows to tabs
      if(dx<0){
        // Swipe left: next day or next tab
        if(cD<LIVE_DAYS.length-1){
          selDay(cD+1);
        }else{
          // Last day: go to next tab
          if(tabIdx<TAB_ORDER.length-1)switchToTab(TAB_ORDER[tabIdx+1]);
        }
      }else{
        // Swipe right: prev day
        if(cD>0)selDay(cD-1);
      }
    }else{
      // Other tabs: swipe switches tabs
      if(dx<0&&tabIdx<TAB_ORDER.length-1){
        switchToTab(TAB_ORDER[tabIdx+1]);
      }else if(dx>0&&tabIdx>0){
        switchToTab(TAB_ORDER[tabIdx-1]);
      }
    }
  },{passive:true});
}


/* --- Metro status check for timeline --- */
function getMetroWarning(stop){
  if(stop.tp!=="Trasporto"||!stop.ds)return null;
  if(!TFL_STATUS||Object.keys(TFL_STATUS).length===0)return null;
  
  var ds=stop.ds.toLowerCase();
  var lineMap={
    "circle":"circle","district":"district","central":"central",
    "northern":"northern","jubilee":"jubilee","h&c":"hammersmith-city",
    "hammersmith":"hammersmith-city","piccadilly":"piccadilly",
    "victoria":"victoria","bakerloo":"bakerloo","metropolitan":"metropolitan",
    "dlr":"dlr","elizabeth":"elizabeth","overground":"london-overground"
  };
  
  var warnings=[];
  for(var name in lineMap){
    if(ds.indexOf(name)>=0){
      var id=lineMap[name];
      var st=TFL_STATUS[id];
      if(st&&st.sev!==10&&st.sev!==1){
        warnings.push({line:name.charAt(0).toUpperCase()+name.slice(1),status:st.desc,sev:st.sev});
      }
    }
  }
  return warnings.length>0?warnings:null;
}


function filterCat(cat){
  // Clear search input and filter by category
  var q=document.getElementById("si").value.trim().toLowerCase();
  var r=document.getElementById("srs");
  var nc=document.getElementById("nom-results");
  if(nc)nc.innerHTML="";
  
  var found=[];
  LIVE_DAYS.forEach(function(d,di){
    allItems(d).forEach(function(s,si){
      if(s.tp===cat){
        found.push({stop:s,dayIdx:di,stopIdx:si,day:d.pl});
      }
    });
  });
  
  var h='';
  if(found.length>0){
    var tn=TN[cat]||cat;
    h+='<div class="sr-section"><div class="sr-section-hdr">'+tn.toUpperCase()+' NELL\'ITINERARIO</div>';
    found.forEach(function(f){
      var cl=TC[f.stop.tp]||"attr";
      var ti=TI[f.stop.tp]||"\u{1F3DB}";
      h+='<div class="sr-item" onclick="goTo('+f.dayIdx+',\''+f.stop.t+'\')">';
      h+='<div class="sr-item-ico" style="background:var(--'+cl+'s,var(--bg3))">'+ti+'</div>';
      h+='<div class="sr-item-info"><div class="sr-item-name">'+f.stop.n+'</div><div class="sr-item-meta">'+f.day+(f.stop.ad?' \u2022 '+f.stop.ad:'')+'</div></div>';
      h+='<svg class="sr-item-arr" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="var(--tx3)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      h+='</div>';
    });
    h+='</div>';
  }else{
    h+='<div class="sr-section"><div class="sr-section-hdr">'+cat+'</div><div class="sr-empty-small">Nessun risultato</div></div>';
  }
  r.innerHTML=h;
}

function doLocate(){
  var btn=document.querySelector(".gps-btn");
  if(!gpsMap){if(btn)btn.textContent="\u274c Mappa non pronta";return;}
  if(btn)btn.textContent="\u23f3 Cerco...";
  
  // Try 1: native geolocation (no isSecureContext check!)
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      function(p){
        var la=p.coords.latitude,ln=p.coords.longitude;
        if(gpsMarker)gpsMap.removeLayer(gpsMarker);
        gpsMarker=L.circleMarker([la,ln],{radius:10,fillColor:"#3b82f6",fillOpacity:1,color:"#fff",weight:3}).addTo(gpsMap);
        gpsMarker.bindPopup("\u{1F4CD} Tu sei qui!").openPopup();
        gpsMap.setView([la,ln],15);
        if(btn)btn.textContent="\u{1F4CD} Tu sei qui";
      },
      function(err){
        if(btn)btn.textContent="\u274c "+err.message;
        setTimeout(function(){if(btn)btn.textContent="\u{1F4CD} Tu sei qui"},4000);
      },
      {enableHighAccuracy:true,timeout:15000,maximumAge:0}
    );
  }else{
    if(btn){btn.textContent="\u274c GPS non disponibile";setTimeout(function(){btn.textContent="\u{1F4CD} Tu sei qui"},3000);}
  }
}

function init(){
  renderNav();renderPills();LIVE_DAYS=loadDays();
checkVersion();
renderDay(0);renderSearch();renderTr();renderMt();renderIf();renderBeerPage();
  document.getElementById("si").addEventListener("input",doSearch);
  var el=document.getElementById("dc");
  // day swipe handled by initSwipe()
  setTimeout(initMap,300);
  initSwipe();

  setTimeout(fetchWeatherAuto,500);
  setTimeout(fetchTfl,1000);
  setTimeout(fetchExchangeRate,1500);
  setInterval(updateTimers,60000);
}

function initMap(){
  try{
    gpsMap=L.map("gmap",{zoomControl:false,attributionControl:false}).setView([51.521,-0.0776],13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18}).addTo(gpsMap);
    renderDayMarkers();
    doLocate();
  }catch(e){console.error("Map init error:",e)}
}

function renderDayMarkers(){
  if(!gpsMap)return;
  dayMarkers.forEach(function(m){gpsMap.removeLayer(m)});
  dayMarkers=[];
  var all=allItems(LIVE_DAYS[cD]).filter(function(s){return s.la&&s.la<52});
  if(!all.length)return;
  var bounds=[];
  all.forEach(function(s,i){
    var m=L.circleMarker([s.la,s.ln],{radius:6,fillColor:"#ef4444",fillOpacity:.9,color:"#fff",weight:2}).addTo(gpsMap);
    m.bindPopup("<b>"+(i+1)+". "+s.n+"</b>");
    dayMarkers.push(m);
    bounds.push([s.la,s.ln]);
  });
  if(bounds.length>1)gpsMap.fitBounds(bounds,{padding:[20,20]});
  else gpsMap.setView(bounds[0],14);
}

function renderNav(){document.querySelectorAll(".nav button").forEach(function(b){b.onclick=function(){document.querySelectorAll(".nav button").forEach(function(x){x.classList.remove("on")});document.querySelectorAll(".pg").forEach(function(x){x.classList.remove("on")});b.classList.add("on");document.getElementById(b.dataset.p).classList.add("on");updateHeader(b.dataset.p);if(b.dataset.p==="p1"&&gpsMap)setTimeout(function(){gpsMap.invalidateSize();renderDayMarkers()},100)}})}
function renderPills(){var c=document.getElementById("pls");c.innerHTML=DAYS.map(function(d,i){return '<div class="pl'+(i===0?" on":"")+'" data-i="'+i+'">'+d.pl+'</div>'}).join("");c.querySelectorAll(".pl").forEach(function(p){p.onclick=function(){selDay(+p.dataset.i)}})}
function selDay(i){cD=i;document.querySelectorAll(".pl").forEach(function(x){x.classList.remove("on")});document.querySelector('.pl[data-i="'+i+'"]').classList.add("on");renderDay(i);renderDayMarkers();document.querySelector('.pl[data-i="'+i+'"]').scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}
function allItems(d){var a=[];d.zones.forEach(function(z){z.items.forEach(function(s,si){a.push(s)})});return a}

function getZoneColor(z){
  var types={};z.items.forEach(function(s,si){var c=TC[s.tp]||"hotel";types[c]=(types[c]||0)+1});
  var max="hotel",maxC=0;for(var k in types)if(types[k]>maxC){max=k;maxC=types[k]}
  return max;
}

function updateTimers(){
  var now=new Date();
  var nowH=now.getHours(),nowM=now.getMinutes();
  var dates=["2026-03-26","2026-03-27","2026-03-28","2026-03-29","2026-03-30","2026-03-31"];
  var today=now.toISOString().split("T")[0];
  var dayDate=dates[cD]||"";
  
  allItems(LIVE_DAYS[cD]).forEach(function(s,i){
    var el=document.getElementById("tmr-"+cD+"-"+i);
    if(!el)return;
    var parts=s.t.split(":");
    var sh=parseInt(parts[0]),sm=parseInt(parts[1]);
    
    // Build target datetime
    var target=new Date(dayDate+"T"+(sh<10?"0":"")+sh+":"+(sm<10?"0":"")+sm+":00");
    var diffMs=target.getTime()-now.getTime();
    
    if(isNaN(diffMs)){el.textContent="";return}
    
    if(diffMs<0){
      // Past
      if(diffMs>-3600000)el.textContent="\u{1F4CD} In corso";
      else el.textContent="";
    }else{
      var diffMin=Math.floor(diffMs/60000);
      var diffH=Math.floor(diffMin/60);
      var diffD=Math.floor(diffH/24);
      var remH=diffH%24;
      var remM=diffMin%60;
      
      var txt="\u23f1 ";
      if(diffD>0){
        txt+=diffD+"g "+remH+"h";
      }else if(diffH>0){
        txt+=diffH+"h "+remM+"min";
      }else if(diffMin>0){
        txt+=diffMin+" min";
      }else{
        txt="\u{1F4CD} Ora!";
      }
      el.textContent=txt;
    }
  });
}

function renderDay(i){
  var d=LIVE_DAYS[i],all=allItems(d);
  var pb=0,fb=0;all.forEach(function(s){if(s.tp==="Pub/Birra")pb++;if(s.tp==="Cibo")fb++});
  var skipped=all.filter(function(_,si){return localStorage.getItem("sk-"+i+"-"+si)==="1"}).length;
  document.getElementById("pbar").style.width=(all.length?Math.round(skipped/all.length*100):0)+"%";

  var h=renderQuickView()+'<div class="dhc"><div class="dhc-t">'+d.t+'</div><div class="dhc-chips"><span class="chip chip-w">'+d.wt+'</span><span class="chip '+(d.rn?"chip-r":"chip-s")+'">'+(d.rn?"\u{1F327} Pioggia":"\u2600\ufe0f Sole")+'</span>'+(d.sunrise&&d.sunrise.indexOf("T")>0?'<span class="chip chip-w">\u{1F305} '+d.sunrise.split("T")[1].substring(0,5)+'</span>':'')+(d.sunset&&d.sunset.indexOf("T")>0?'<span class="chip chip-w">\u{1F307} '+d.sunset.split("T")[1].substring(0,5)+'</span>':'')+'<span class="chip chip-s">~'+d.km+' km</span><span class="chip chip-s">'+all.length+' tappe</span></div>'+(d.dr?'<div class="dhc-dress">'+d.dr+'</div>':'')+(d.wn?'<div class="dhc-wrn">'+d.wn+'</div>':'')+'</div>';

  h+='<div class="tl">';
  var gi=0;
  d.zones.forEach(function(z,zi){
    var mainTp=getZoneColor(z);
    var nextZ=d.zones[zi+1];
    var nextTp=nextZ?getZoneColor(nextZ):mainTp;
    var firstTime=z.items[0]?z.items[0].t:"";

    h+='<div class="tl-zone tl-lc-'+nextTp+'"><div class="tl-zone-time">'+firstTime+'</div><div class="tl-zone-dotcol"><div class="tl-zone-dot '+mainTp+'"></div></div><div><div class="zb">';
    if(z.zone)h+='<div class="zb-hdr c-'+mainTp+'">'+z.zone+'</div>';

    z.items.forEach(function(s,si){
      var cl=TC[s.tp]||"hotel";
      var ti=TI[s.tp]||"";
      var tn=TN[s.tp]||s.tp;
      var tgs=s.ws.map(function(w){return '<span class="tg tg-'+(w.y==="a"?"a":w.y==="b"?"b":"i")+'">'+w.x+'</span>'}).join("");
      var nt=localStorage.getItem("nt-"+i+"-"+gi)||"";
      var isSkip=localStorage.getItem("sk-"+i+"-"+gi)==="1";
      var cmLink="";
      if(s.la)cmLink="https://citymapper.com/directions?endcoord="+s.la+","+s.ln+"&endname="+encodeURIComponent(s.n);

      h+='<div class="zk'+(isSkip?" skip":"")+'" id="zk-'+i+'-'+gi+'" onclick="tgl('+i+','+gi+')">';
      h+='<div class="zk-wrap"><div class="zk-content"><div class="zk-top"><span class="zk-dot '+cl+'"></span><span class="zk-time">'+s.t+'</span><span class="zk-lb '+cl+'">'+ti+" "+tn+'</span></div>';
      var diaryInfo=renderDiaryBtn(i,gi);
      var metroWarn=getMetroWarning(s);
      h+='<div class="zk-nm">'+s.n+(diaryInfo.hasPhoto?' <span style="font-size:12px">\u{1F4F7}</span>':'')+(diaryInfo.hasEntries&&!diaryInfo.hasPhoto?' <span style="font-size:12px">\u{1F4DD}</span>':'')+' <a class="ed-pen" href="javascript:void(0)" onclick="event.stopPropagation();event.preventDefault();showEditStop('+i+','+gi+')" title="Modifica">'+ICN.edit+'</a></div>';
      h+='<div class="zk-ds">'+s.ds+'</div>';
      if(metroWarn){metroWarn.forEach(function(w){h+='<div class="zk-metro-warn"><span class="zk-mw-dot'+(w.sev<5?' zk-mw-bad':' zk-mw-warn')+'"></span>'+w.line+': '+w.status+'</div>'})}
      if(tgs)h+='<div class="zk-tags">'+tgs+'</div>';
      if(s.du)h+='<div class="zk-du">'+s.du+'</div>';
      h+='<div class="zk-timer" id="tmr-'+i+'-'+gi+'"></div>';
      h+='</div>';
      h+='<div class="zk-actions">';
      h+='<a class="zk-act-btn zk-skip-btn'+(isSkip?" on":"")+'" href="javascript:void(0)" onclick="event.stopPropagation();event.preventDefault();toggleSkip('+i+','+gi+')" title="'+(isSkip?'Ripristina':'Salta')+'">'+ICN.skip_stop+'</a>';
      h+='<a class="zk-act-btn zk-del-btn" href="javascript:void(0)" onclick="event.stopPropagation();event.preventDefault();deleteStopPermanent('+i+','+gi+')" title="Elimina">'+ICN.delete_stop+'</a>';
      h+='</div></div></div>';

      h+='<div class="sd" id="sd-'+i+'-'+gi+'">';
      if(s.di)h+='<div class="sdb"><div class="sdl">\u{1F5FA} Come arrivarci</div><div class="sdtx">'+s.di+'</div></div>';
      if(s.ad)h+='<div class="sdb"><div class="sdl">\u{1F4CD} '+s.ad+'</div></div>';
      h+='<div class="sdlk">';
      if(cmLink)h+='<a class="btn-ico" href="'+cmLink+'" target="_blank" title="Citymapper">'+ICN.citymapper+'</a>';
      if(s.la)h+='<a class="btn-ico" href="https://www.google.com/maps/dir/?api=1&destination='+s.la+','+s.ln+'&travelmode=walking" target="_blank" title="Google Maps">'+ICN.gmaps+'</a>';
      h+='<a class="btn-ico" href="javascript:void(0)" onclick="event.stopPropagation();event.preventDefault();showPhrasesIdx('+i+','+gi+')" title="Frasi utili">'+ICN.phrases+'</a>';
      h+=diaryInfo.html;
      if(s.bk)h+='<a class="btn-book" href="'+s.bk.u+'" target="_blank">'+ICN.book+' '+s.bk.l+'</a>';
      if(s.la){h+='<a class="btn-ico" href="https://www.google.com/maps/search/toilet+near+'+s.la+','+s.ln+'" target="_blank" title="Bagno">'+ICN.wc+'</a>';
      h+='<a class="btn-ico" href="https://www.google.com/maps/search/drinking+fountain+near+'+s.la+','+s.ln+'" target="_blank" title="Fontanella">'+ICN.water+'</a>'}
      
      h+='</div>';

      h+='<div class="sdb" style="margin-top:8px"><div class="sdl">\u{1F4DD} Note</div><textarea class="sdnt" placeholder="Aggiungi nota..." id="nt-'+i+'-'+gi+'" onclick="event.stopPropagation()" onblur="saveNt('+i+','+gi+')">'+nt+'</textarea></div>';
      h+='</div>';
      if(si < z.items.length - 1) {
        h+='<div class="add-between"><a class="add-circle" href="javascript:void(0)" onclick="event.stopPropagation();event.preventDefault();showSearchAdd('+i+','+gi+')">'+ICN.add_here+'</a></div>';
      }
      gi++;
    });
    h+='</div></div></div>';
    if(zi < d.zones.length - 1) {
      h+='<div class="tl-zone" style="grid-template-columns:42px 22px 1fr"><div class="tl-zone-time"></div><div class="tl-zone-dotcol" style="padding:4px 0"><div style="width:2px;background:var(--brd);flex:1"></div></div><div class="add-between" style="padding:4px 0"><a class="add-circle" href="javascript:void(0)" onclick="event.stopPropagation();event.preventDefault();showSearchAdd('+i+','+(gi-1)+')">'+ICN.add_here+'</a></div></div>';
    }
  });
  h+='</div>';
  h+='<div style="display:grid;grid-template-columns:42px 14px 1fr;padding:4px 0"><div></div><div></div><div class="add-between"><a class="add-circle" href="javascript:void(0)" onclick="event.stopPropagation();event.preventDefault();showSearchAdd('+i+',allItems(LIVE_DAYS['+i+']).length-1)">'+ICN.add_here+'</a></div></div>';
  document.getElementById("dc").innerHTML=h;
  updateTimers();
}

function tgl(d,s){document.getElementById("sd-"+d+"-"+s).classList.toggle("open")}
function saveNt(d,s){localStorage.setItem("nt-"+d+"-"+s,document.getElementById("nt-"+d+"-"+s).value)}
function toggleSkip(d,s){var k="sk-"+d+"-"+s;localStorage.setItem(k,localStorage.getItem(k)==="1"?"0":"1");renderDay(d)}

function renderSearch(){
  var h='<div class="sr-cats" id="scp">';
  var cats=["Pub/Birra","Cibo","Attrazione","Mercato","Trasporto"];
  cats.forEach(function(c){
    h+='<span class="sr-chip" onclick="filterCat(\''+c+'\')">'+TI[c]+' '+(TN[c]||c)+'</span>';
  });
  h+='</div>';
  document.getElementById("scp").innerHTML=h;
}
function doSearch(){
  var q=document.getElementById("si").value.trim().toLowerCase();
  var r=document.getElementById("srs");
  var nc=document.getElementById("nom-results");
  
  if(!q){
    r.innerHTML='<div class="sr-empty">Cerca un luogo nell\'itinerario o aggiungi nuovi posti</div>';
    if(nc)nc.innerHTML="";
    return;
  }
  
  // Local results
  var found=[];
  LIVE_DAYS.forEach(function(d,di){
    allItems(d).forEach(function(s,si){
      if(s.n.toLowerCase().indexOf(q)>=0||s.ds.toLowerCase().indexOf(q)>=0||(s.ad&&s.ad.toLowerCase().indexOf(q)>=0)){
        found.push({stop:s,dayIdx:di,stopIdx:si,day:d.pl});
      }
    });
  });
  
  var h='';
  if(found.length>0){
    h+='<div class="sr-section"><div class="sr-section-hdr">NELL\'ITINERARIO</div>';
    found.forEach(function(f){
      var cl=TC[f.stop.tp]||"attr";
      var ti=TI[f.stop.tp]||"\u{1F3DB}";
      var tn=TN[f.stop.tp]||f.stop.tp;
      h+='<div class="sr-item" onclick="goTo('+f.dayIdx+',\''+f.stop.t+'\')">';
      h+='<div class="sr-item-ico" style="background:var(--'+cl+'s,var(--bg3))">'+ti+'</div>';
      h+='<div class="sr-item-info"><div class="sr-item-name">'+f.stop.n+'</div><div class="sr-item-meta">'+f.day+' \u2022 '+tn+(f.stop.ad?' \u2022 '+f.stop.ad:'')+'</div></div>';
      h+='<svg class="sr-item-arr" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="var(--tx3)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      h+='</div>';
    });
    h+='</div>';
  }else{
    h+='<div class="sr-section"><div class="sr-section-hdr">NELL\'ITINERARIO</div><div class="sr-empty-small">Nessun risultato</div></div>';
  }
  r.innerHTML=h;
  
  // Nominatim search
  if(q&&q.length>=3){
    if(nc)nc.innerHTML='<div class="sr-section"><div class="sr-section-hdr">AGGIUNGI ALL\'ITINERARIO</div><div class="sr-empty-small">\u23f3 Cerco...</div></div>';
    searchNominatim(q);
  }else{
    if(nc)nc.innerHTML="";
  }
}
function goTo(di,t){
  document.querySelectorAll(".nav button").forEach(function(x){x.classList.remove("on")});
  document.querySelectorAll(".pg").forEach(function(x){x.classList.remove("on")});
  document.querySelector('.nav button[data-p="p1"]').classList.add("on");
  document.getElementById("p1").classList.add("on");
  selDay(di);
  setTimeout(function(){
    var all=allItems(LIVE_DAYS[di]);var si=all.findIndex(function(s){return s.t===t});
    if(si>=0){var el=document.getElementById("zk-"+di+"-"+si);if(el){el.scrollIntoView({behavior:"smooth",block:"center"});document.getElementById("sd-"+di+"-"+si).classList.add("open")}}
  },150);
}

function fetchTfl(){
  var lines=["bakerloo","central","circle","district","hammersmith-city","jubilee","metropolitan","northern","piccadilly","victoria","waterloo-city","dlr","elizabeth","london-overground","tram"];
  var colors={"bakerloo":"#B36305","central":"#DC241F","circle":"#FFD329","district":"#00782A","hammersmith-city":"#F3A9BB","jubilee":"#A0A5A9","metropolitan":"#9B0056","northern":"#000000","piccadilly":"#003688","victoria":"#0098D4","waterloo-city":"#95CDBA","dlr":"#00A4A7","elizabeth":"#6950A1","london-overground":"#E86A10","tram":"#84B817"};
  var names={"hammersmith-city":"H&C","london-overground":"Overground","waterloo-city":"W&City"};
  
  fetch(CONFIG.tflUrl+"/"+lines.join(",")+"/Status")
  .then(function(r){return r.json()})
  .then(function(data){
    var ok=0,warn=0,bad=0;
    var h='';
    data.forEach(function(l,i){
      var st=l.lineStatuses&&l.lineStatuses[0]?l.lineStatuses[0]:{};
      var sev=st.statusSeverity||0;
      var desc=st.statusSeverityDescription||"Unknown";
      var reason=st.reason||"";
      var cls,badge,badgeBg;
      if(sev===10||sev===1){cls="ok";badge="Regolare";badgeBg="var(--oks)";ok++}
      else if(sev>=5){cls="warn";badge=desc;badgeBg="var(--wrns)";warn++}
      else{cls="bad";badge=desc;badgeBg="var(--errs)";bad++}
      var lName=names[l.id]||l.name;
      var lColor=colors[l.id]||"#888";
      var hasDetail=reason&&cls!=="ok";
      
      h+='<div class="tr-row'+(hasDetail?' tr-expandable':'')+'" onclick="'+(hasDetail?'this.classList.toggle(\'open\')':'')+'">';
      h+='<div class="tr-row-main">';
      h+='<div class="tr-line-ico" style="background:'+lColor+'"><svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="none" stroke="#fff" stroke-width="1.5"/><rect x="2" y="8" width="16" height="4" rx="1" fill="#fff"/></svg></div>';
      h+='<div class="tr-line-name">'+lName+'</div>';
      h+='<div class="tr-badge tr-'+cls+'" style="background:'+badgeBg+'">'+badge+'</div>';
      h+='</div>';
      if(hasDetail)h+='<div class="tr-detail">'+reason.replace(/'/g,"&#39;")+'</div>';
      h+='</div>';
    });
    
    document.getElementById("tr-list").innerHTML=h;
    document.getElementById("tr-stats").innerHTML='<div class="tr-stat"><div class="tr-stat-n" style="color:var(--ok)">'+ok+'</div><div class="tr-stat-l">attive</div></div><div class="tr-stat"><div class="tr-stat-n" style="color:var(--wrn)">'+warn+'</div><div class="tr-stat-l">rallentate</div></div><div class="tr-stat"><div class="tr-stat-n" style="color:var(--err)">'+bad+'</div><div class="tr-stat-l">sospese</div></div>';
    // Store status for timeline cross-reference
    TFL_STATUS={};
    data.forEach(function(l){
      var st=l.lineStatuses&&l.lineStatuses[0]?l.lineStatuses[0]:{};
      TFL_STATUS[l.id]={sev:st.statusSeverity||0,desc:st.statusSeverityDescription||"",reason:st.reason||""};
    });
    
    // Closures section - render above the line list
    var closures='';
    data.forEach(function(l){
      var st=l.lineStatuses&&l.lineStatuses[0]?l.lineStatuses[0]:{};
      if(st.reason&&st.statusSeverity!==10&&st.statusSeverity!==1){
        var lName=names[l.id]||l.name;
        var lColor=colors[l.id]||"#888";
        closures+='<div class="tr-closure"><div class="tr-closure-line" style="border-left:3px solid '+lColor+';padding-left:10px"><div class="tr-closure-name">'+lName+'</div><div class="tr-closure-reason">'+st.reason.replace(/'/g,"&#39;")+'</div></div></div>';
      }
    });
    var clEl=document.getElementById("tr-closures");
    if(closures&&clEl){
      clEl.innerHTML='<div class="tr-closures-card"><div class="tr-closures-hdr">AVVISI E CHIUSURE</div>'+closures+'</div>';
    }else if(clEl){
      clEl.innerHTML='';
    }
    
    // Refresh timeline to show metro warnings
    renderDay(cD);
    
    document.getElementById("tr-footer").textContent="TfL API \u2022 "+new Date().toLocaleString("it-IT");
  })
  .catch(function(e){
    document.getElementById("tr-list").innerHTML='<div style="padding:20px;text-align:center;color:var(--err)">\u274c '+e.message+'</div>';
  });
}

function renderTr(){
  var h='<div class="tr-wrap">';
  h+='<div class="tr-hero" id="tr-hero">';
  h+='<div class="wt-refresh" onclick="fetchTfl()"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13.5 2.5v4h-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 8a6 6 0 0111.5-2.5L13.5 6.5M2.5 13.5v-4h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 8a6 6 0 01-11.5 2.5L2.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
  h+='<div class="tr-hero-title">TfL Londra</div>';
  h+='<div class="tr-hero-stats" id="tr-stats"><div class="tr-stat"><div class="tr-stat-n" style="color:var(--ok)">--</div><div class="tr-stat-l">attive</div></div><div class="tr-stat"><div class="tr-stat-n" style="color:var(--wrn)">--</div><div class="tr-stat-l">rallentate</div></div><div class="tr-stat"><div class="tr-stat-n" style="color:var(--err)">--</div><div class="tr-stat-l">sospese</div></div></div>';
  h+='</div>';
  h+='<div class="tr-closures" id="tr-closures"></div>';
  h+='<div class="tr-list" id="tr-list"><div style="padding:20px;text-align:center;color:var(--tx3)">Caricamento...</div></div>';
  h+='<div class="tr-footer" id="tr-footer"></div>';
  h+='</div>';
  document.getElementById("trw").innerHTML=h;
}

function renderMt(){
  var h='<div class="wt-wrap">';
  
  // Hero card - show selected day or today
  var heroIdx=typeof wtSelected==="number"?wtSelected:0;
  var wd=wtDays&&wtDays.length?wtDays[heroIdx]:null;
  
  h+='<div class="wt-hero" id="wt-hero">';
  h+='<div class="wt-refresh" onclick="fetchW()"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13.5 2.5v4h-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 8a6 6 0 0111.5-2.5L13.5 6.5M2.5 13.5v-4h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 8a6 6 0 01-11.5 2.5L2.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
  if(wd){
    var wIco=wd.rain>30?"\u{1F327}\ufe0f":"\u2600\ufe0f";
    h+='<div class="wt-hero-city">Londra</div>';
    h+='<div class="wt-hero-ico">'+wIco+'</div>';
    h+='<div class="wt-hero-temp"><span class="wt-hero-max">'+wd.max+'\u00b0</span><span class="wt-hero-min"> / '+wd.min+'\u00b0</span></div>';
    h+='<div class="wt-hero-date">'+wd.label+'</div>';
    h+='<div class="wt-hero-details">';
    h+='<div class="wt-hd"><div>\u{1F4A7}</div><div>'+wd.rain+'%</div></div>';
    h+='<div class="wt-hd"><div>\u{1F4A8}</div><div>'+wd.wind+' km/h</div></div>';
    h+='<div class="wt-hd"><div>\u{1F305}</div><div>'+wd.sunrise+'</div></div>';
    h+='<div class="wt-hd"><div>\u{1F307}</div><div>'+wd.sunset+'</div></div>';
    h+='</div>';
    if(wd.dress)h+='<div class="wt-hero-dress">\u{1F9E5} '+wd.dress+'</div>';
  }else{
    h+='<div class="wt-hero-city">Londra</div>';
    h+='<div class="wt-hero-ico">--</div>';
    h+='<div class="wt-hero-temp"><span class="wt-hero-max">--\u00b0</span></div>';
    h+='<div class="wt-hero-date">Premi aggiorna</div>';
  }
  h+='</div>';
  
  // Day list
  h+='<div class="wt-list">';
  h+='<div class="wt-list-hdr"><span></span><span></span><span></span><span>Min</span><span>Max</span><span>\u{1F4A7}</span><span>\u{1F4A8}</span></div>';
  
  if(wtDays&&wtDays.length){
    wtDays.forEach(function(wd,i){
      var isTrip=wd.isTrip;
      var isOpen=wtOpen===i;
      var rainHigh=wd.rain>30;
      var windSvg=windIcon(wd.wind);
      
      h+='<div class="wt-row'+(isTrip?' wt-trip':'')+(isOpen?' wt-open':'')+'" onclick="wtToggle('+i+')">';
      h+='<div class="wt-row-main">';
      h+='<span class="wt-row-arr">'+(isOpen?'\u25BE':'\u25B8')+'</span>';
      h+='<span class="wt-row-day">'+wd.short+'</span>';
      h+='<span class="wt-row-ico">'+(rainHigh?"\u{1F327}\ufe0f":"\u2600\ufe0f")+'</span>';
      h+='<span class="wt-row-min">'+wd.min+'\u00b0</span>';
      h+='<span class="wt-row-max">'+wd.max+'\u00b0</span>';
      h+='<span class="wt-row-rain'+(rainHigh?' hi':'')+'">'+wd.rain+'%</span>';
      h+='<span class="wt-row-wind">'+windSvg+'</span>';
      h+='</div>';
      
      if(isOpen){
        h+='<div class="wt-row-detail">';
        h+='<span>\u{1F305} '+wd.sunrise+'</span>';
        h+='<span>\u{1F307} '+wd.sunset+'</span>';
        if(wd.dress)h+='<span class="wt-row-dress">\u{1F9E5} '+wd.dress+'</span>';
        h+='</div>';
      }
      h+='</div>';
    });
  }else{
    h+='<div style="padding:20px;text-align:center;color:var(--tx3)">Premi aggiorna per caricare le previsioni</div>';
  }
  h+='</div>';
  
  h+='<div class="wt-footer" id="wt-footer"></div>';
  h+='</div>';
  document.getElementById("mtw").innerHTML=h;
}
function fetchW(){
  var el=document.getElementById("wt-footer");
  if(el)el.textContent="\u23f3 Aggiornamento...";
  fetch(CONFIG.weatherUrl+"?latitude="+CONFIG.weatherLat+"&longitude="+CONFIG.weatherLng+"&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max,sunrise,sunset&timezone="+CONFIG.weatherTz+"&forecast_days=14")
  .then(function(r){return r.json()})
  .then(function(d){
    if(!d.daily)return;
    WEATHER_CACHE=d.daily;
    wtDays=[];
    var tripDates={};
    var tripStart=new Date(CONFIG.startDate);
    for(var dd=0;dd<6;dd++){
      var dt=new Date(tripStart);dt.setDate(dt.getDate()+dd);
      tripDates[dt.toISOString().split("T")[0]]=dd;
    }
    var dayNames=["Dom","Lun","Mar","Mer","Gio","Ven","Sab"];
    var monthNames=["gen","feb","mar","apr","mag","giu","lug","ago","set","ott","nov","dic"];
    
    d.daily.time.forEach(function(t,i){
      var dt=new Date(t+"T00:00:00");
      var dayN=dayNames[dt.getDay()];
      var dayNum=dt.getDate();
      var mon=monthNames[dt.getMonth()];
      var mn=Math.round(d.daily.temperature_2m_min[i]);
      var mx=Math.round(d.daily.temperature_2m_max[i]);
      var pp=d.daily.precipitation_probability_max[i]||0;
      var ws=d.daily.windspeed_10m_max?Math.round(d.daily.windspeed_10m_max[i]):0;
      var sr=d.daily.sunrise&&d.daily.sunrise[i]?d.daily.sunrise[i].split("T")[1].substring(0,5):"--";
      var ss=d.daily.sunset&&d.daily.sunset[i]?d.daily.sunset[i].split("T")[1].substring(0,5):"--";
      var isTrip=tripDates[t]!==undefined;
      var tripIdx=tripDates[t];
      
      var dress="";
      if(isTrip&&tripIdx!==undefined&&LIVE_DAYS[tripIdx])dress=LIVE_DAYS[tripIdx].dr||"";
      else if(pp>30)dress="Impermeabile consigliato";
      else if(mx<8)dress="Vestiti pesanti";
      else if(mx<15)dress="Giubbotto, strati";
      
      wtDays.push({date:t,short:dayN+" "+dayNum,label:dayN+" "+dayNum+" "+mon,min:mn,max:mx,rain:pp,wind:ws,sunrise:sr,sunset:ss,isTrip:isTrip,tripIdx:tripIdx,dress:dress});
      
      // Sync to LIVE_DAYS
      if(isTrip&&tripIdx!==undefined&&LIVE_DAYS[tripIdx]){
        LIVE_DAYS[tripIdx].wt=mn+"\u00b0/"+mx+"\u00b0C";
        LIVE_DAYS[tripIdx].rn=pp>30?1:0;
        LIVE_DAYS[tripIdx].wind=ws;
        LIVE_DAYS[tripIdx].sunrise=d.daily.sunrise?d.daily.sunrise[i]:null;
        LIVE_DAYS[tripIdx].sunset=d.daily.sunset?d.daily.sunset[i]:null;
      }
    });
    
    wtSelected=0;
    renderMt();
    renderDay(cD);
    var ft=document.getElementById("wt-footer");
    if(ft)ft.textContent="Open-Meteo \u2022 "+new Date().toLocaleString("it-IT");
  })
  .catch(function(e){
    var ft=document.getElementById("wt-footer");
    if(ft)ft.textContent="\u274c "+e.message;
  });
}

function refreshInfo(){renderIf()}
function renderIf(){
  var h='<div class="if-wrap">';
  
  // Converter
  h+='<div class="if-card"><div class="if-card-hdr">CONVERTITORE</div>';
  h+='<div class="fx-row"><input type="number" class="fx-input" id="fx-input" placeholder="EUR" oninput="convertCurrency()"><div class="fx-swap" onclick="var d=document.getElementById(\'fx-dir\');d.value=d.value===\'eur2gbp\'?\'gbp2eur\':\'eur2gbp\';convertCurrency()"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4-4 4 4M4 10l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><select class="fx-sel" id="fx-dir" onchange="convertCurrency()" style="display:none"><option value="eur2gbp">e2g</option><option value="gbp2eur">g2e</option></select><div class="fx-out" id="fx-output">0.00 GBP</div></div>';
  h+='<div class="fx-rate" id="fx-rate">1 EUR = '+(typeof EUR_GBP_RATE!=="undefined"?EUR_GBP_RATE:0.86).toFixed(4)+' GBP</div>';
  h+='</div>';
  
  // Numeri utili
  h+='<div class="if-card"><div class="if-card-hdr">NUMERI UTILI</div>';
  var nums=[
    {ico:"\u{1F198}",bg:"var(--errs)",n:"999 / 112",d:"Emergenze"},
    {ico:"\u{1F3E5}",bg:"var(--accs)",n:"111",d:"NHS, consulenza medica"},
    {ico:"\u{1F1EE}\u{1F1F9}",bg:"var(--oks)",n:"+44 20 7312 2200",d:"Ambasciata italiana"},
    {ico:"\u{1F687}",bg:"var(--accs)",n:"0343 222 1234",d:"TfL trasporti"},
    {ico:"\u{1F3E8}",bg:"var(--wrns)",n:"+44 20 7456 0400",d:"Hotel Point A"}
  ];
  nums.forEach(function(n,i){
    h+='<div class="if-row'+(i<nums.length-1?' if-brd':'')+'">';
    h+='<div class="if-ico" style="background:'+n.bg+'">'+n.ico+'</div>';
    h+='<div class="if-info"><div class="if-info-n">'+n.n+'</div><div class="if-info-d">'+n.d+'</div></div>';
    h+='</div>';
  });
  h+='</div>';
  
  // Consigli
  h+='<div class="if-card"><div class="if-card-hdr">CONSIGLI</div>';
  var tips=[
    {ico:"\u{1F697}",n:"Si guida a sinistra!",d:"Guardate prima a destra"},
    {ico:"\u{1F4B0}",n:"Mancia 10%",d:"Apprezzata, non obbligatoria"},
    {ico:"\u{1F50C}",n:"Prese UK tipo G",d:"Serve adattatore 3 pin"},
    {ico:"\u{1F4A7}",n:"Acqua rubinetto OK",d:"Potabile, riempite le borracce"},
    {ico:"\u{1F37A}",n:"Orari pub",d:"~23 settimana, ~00 weekend"},
    {ico:"\u{1F4B3}",n:"Contactless ovunque",d:"Anche importi piccoli"},
    {ico:"\u{1F45C}",n:"Sicurezza metro",d:"Occhio a borse nelle ore di punta"}
  ];
  tips.forEach(function(t,i){
    h+='<div class="if-tip'+(i<tips.length-1?' if-brd':'')+'">';
    h+='<span class="if-tip-ico">'+t.ico+'</span>';
    h+='<div><div class="if-tip-n">'+t.n+'</div><div class="if-tip-d">'+t.d+'</div></div>';
    h+='</div>';
  });
  h+='</div>';
  
  // Legenda
  h+='<div class="if-card"><div class="if-card-hdr">LEGENDA TIMELINE</div>';
  h+='<div class="if-leg">';
  var legs=[["var(--pub)","Pub"],["var(--food)","Cibo"],["var(--attr)","Attrazione"],["var(--mkt)","Mercato"],["var(--trn)","Trasporto"],["var(--fot)","Foto"]];
  legs.forEach(function(l){h+='<div class="if-leg-i"><div class="if-leg-d" style="background:'+l[0]+'"></div>'+l[1]+'</div>'});
  h+='</div></div>';
  
  h+='<div class="if-footer">London App v'+CONFIG.version+' \u{1F408}\u200d\u2b1b</div>';
  h+='</div>';
  document.getElementById("ifw").innerHTML=h;
}

init();
