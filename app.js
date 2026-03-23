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


if(localStorage.getItem('th')==='l')document.documentElement.classList.add('light');

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
  if(!results.length){c.innerHTML="";return}
  var h='<div class="nom-hdr">\ud83c\udf0d Risultati da OpenStreetMap</div>';
  var seen2={};var unique2=[];
    results.forEach(function(r){var nm=r.display_name.split(",")[0].trim().toLowerCase();if(!seen2[nm]){seen2[nm]=true;unique2.push(r)}});
    unique2.forEach(function(r,i){
    var name=r.display_name.split(",")[0];
    var addr=r.display_name.split(",").slice(1,3).join(",").trim();
    var tp=detectType(r);
    var ti=TI[tp]||"\ud83c\udfdb";
    h+='<div class="sr nom-sr" onclick="showAddFlow('+i+',\''+q.replace(/'/g,"\\'")+'\')">';
    h+='<div class="sr-d">'+ti+" "+tp+'</div><div class="sr-n">'+name+'</div><div class="sr-x">'+addr+'</div></div>';
  });
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
  var h='<div class="bc-header"><div class="bc-total">'+total+'</div></div>';
  h+=renderBeerCounter();
  document.getElementById("beerw").innerHTML=h;
}

// === PINT COUNTER - BEER PASSPORT ===
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
  else if(total===5)ach=" - High Five!";
  else if(total===10)ach=" - Perfect Ten!";
  else if(total===20)ach=" - Legend!";
  else if(cnt===3)ach=" - Hat Trick a "+pubName+"!";
  else if(cnt===5)ach=" - Regular a "+pubName+"!";
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

function getBeerStats(){
  var beers=loadBeers();
  var total=0,topPub="",topCount=0,pubCount=0;
  for(var k in beers){
    total+=beers[k];
    pubCount++;
    if(beers[k]>topCount){topCount=beers[k];topPub=k}
  }
  // Pubs per day (count days with at least 1 beer)
  var daysWithBeer=0;
  LIVE_DAYS.forEach(function(d){
    var hasBeer=false;
    allItems(d).forEach(function(s){
      if(s.tp==="Pub/Birra"&&beers[s.n]&&beers[s.n]>0)hasBeer=true;
    });
    if(hasBeer)daysWithBeer++;
  });
  var avg=daysWithBeer>0?(total/daysWithBeer).toFixed(1):"0";
  return {total:total,topPub:topPub,topCount:topCount,pubCount:pubCount,avg:avg,daysWithBeer:daysWithBeer};
}

function getAchievements(){
  var beers=loadBeers();
  var total=0;for(var k in beers)total+=beers[k];
  var pubCount=Object.keys(beers).length;
  var achs=[];
  if(total>=1)achs.push({icon:"\ud83c\udf7a",name:"First Pint",desc:"La prima pinta del viaggio"});
  if(total>=5)achs.push({icon:"\u{1F3F5}",name:"High Five",desc:"5 pinte bevute"});
  if(total>=10)achs.push({icon:"\ud83c\udfc6",name:"Perfect Ten",desc:"10 pinte bevute"});
  if(total>=20)achs.push({icon:"\ud83d\udc51",name:"Pub Legend",desc:"20 pinte bevute"});
  if(pubCount>=3)achs.push({icon:"\ud83d\uddfa",name:"Explorer",desc:"3 pub diversi visitati"});
  if(pubCount>=5)achs.push({icon:"\ud83e\udded",name:"Pub Crawler",desc:"5 pub diversi visitati"});
  if(pubCount>=8)achs.push({icon:"\u2b50",name:"Master Crawler",desc:"8 pub diversi visitati"});
  // Check for hat trick at any pub
  for(var k in beers){
    if(beers[k]>=3){achs.push({icon:"\ud83c\udfa9",name:"Hat Trick",desc:"3+ pinte in un pub"});break}
  }
  return achs;
}

function renderBeerCounter(){
  var beers=loadBeers();
  var stats=getBeerStats();
  var achs=getAchievements();
  var h="";

  // Stats row
  if(stats.total>0){
    h+='<div class="bc-stats">';
    h+='<div class="bc-stat"><div class="bc-stat-n">'+stats.avg+'</div><div class="bc-stat-l">media/giorno</div></div>';
    h+='<div class="bc-stat"><div class="bc-stat-n">'+stats.pubCount+'</div><div class="bc-stat-l">pub visitati</div></div>';
    if(stats.topPub)h+='<div class="bc-stat"><div class="bc-stat-n">\ud83e\udd47</div><div class="bc-stat-l">'+stats.topPub+'</div></div>';
    h+='</div>';
  }

  // Achievements
  if(achs.length>0){
    h+='<div class="bc-section">Achievements</div>';
    h+='<div class="bc-achs">';
    achs.forEach(function(a){
      h+='<div class="bc-ach"><span class="bc-ach-ico">'+a.icon+'</span><div><div class="bc-ach-name">'+a.name+'</div><div class="bc-ach-desc">'+a.desc+'</div></div></div>';
    });
    h+='</div>';
  }

  // Locked achievements
  var possibleTotal=[1,5,10,20];var possiblePubs=[3,5,8];var locked=[];
  possibleTotal.forEach(function(n){if(stats.total<n)locked.push({need:n+" pinte",icon:"\ud83d\udd12"})});
  possiblePubs.forEach(function(n){if(stats.pubCount<n)locked.push({need:n+" pub",icon:"\ud83d\udd12"})});
  if(locked.length>0&&locked.length<=4){
    h+='<div class="bc-locked">';
    locked.forEach(function(l){h+='<span class="bc-lock">'+l.icon+" "+l.need+'</span>'});
    h+='</div>';
  }

  // Beer Passport - flat unique list
  h+='<div class="bc-section">Beer Passport</div>';
  var seen={};
  LIVE_DAYS.forEach(function(d){
    allItems(d).forEach(function(s){
      if(s.tp==="Pub/Birra"&&!seen[s.n]){
        seen[s.n]=true;
        var cnt=beers[s.n]||0;
        var visited=cnt>0;
        h+='<div class="bp-card'+(visited?" visited":"")+'">';
        h+='<div class="bp-stamp">'+(visited?"\u2705":"\u2b1c")+'</div>';
        h+='<div class="bp-info"><div class="bp-name">'+s.n+'</div>';
        if(s.ad)h+='<div class="bp-addr">'+s.ad+'</div>';
        if(s.ds)h+='<div class="bp-desc">'+s.ds+'</div>';
        h+='</div>';
        h+='<div class="bp-counter"><button class="beer-minus" onclick="event.stopPropagation();removeBeer(\u0027'+s.n.replace(/'/g,"\u2019")+'\u0027)">-</button><span class="beer-count">'+cnt+'</span><button class="beer-plus" onclick="event.stopPropagation();addBeer(\u0027'+s.n.replace(/'/g,"\u2019")+'\u0027)">+</button></div>';
        h+='</div>';
      }
    });
  });
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

function fetchWeatherAuto() {
  fetch(CONFIG.weatherUrl+"?latitude="+CONFIG.weatherLat+"&longitude="+CONFIG.weatherLng+"&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max,sunrise,sunset&timezone="+CONFIG.weatherTz+"&start_date="+CONFIG.startDate+"&end_date="+CONFIG.endDate)
  .then(function(r){return r.json()})
  .then(function(d){
    if(!d.daily)return;
    WEATHER_CACHE=d.daily;
    // Update LIVE_DAYS weather data
    var lb=["Gio 26","Ven 27","Sab 28","Dom 29","Lun 30","Mar 31"];
    d.daily.time.forEach(function(t,i){
      if(i<LIVE_DAYS.length){
        var mn=Math.round(d.daily.temperature_2m_min[i]);
        var mx=Math.round(d.daily.temperature_2m_max[i]);
        var pp=d.daily.precipitation_probability_max[i];
        LIVE_DAYS[i].wt=mn+"\u00b0/"+mx+"\u00b0C";
        LIVE_DAYS[i].rn=pp>30?1:0;
        LIVE_DAYS[i].wind=d.daily.windspeed_10m_max?Math.round(d.daily.windspeed_10m_max[i]):null;
        LIVE_DAYS[i].sunrise=d.daily.sunrise?d.daily.sunrise[i]:null;
        LIVE_DAYS[i].sunset=d.daily.sunset?d.daily.sunset[i]:null;
      }
    });
    renderDay(cD);
    renderMt();
  })
  .catch(function(){});
}


function renderQuickView(){
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
      if(el)el.textContent="1 EUR = "+EUR_GBP_RATE.toFixed(4)+" GBP";
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
  el.addEventListener("touchstart",function(e){tsX=e.touches[0].clientX},{passive:true});
  el.addEventListener("touchend",function(e){var d=tsX-e.changedTouches[0].clientX;if(Math.abs(d)>60){if(d>0&&cD<DAYS.length-1)selDay(cD+1);if(d<0&&cD>0)selDay(cD-1)}},{passive:true});
  setTimeout(initMap,300);
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
  var now=new Date(),h=now.getHours(),m=now.getMinutes();
  allItems(LIVE_DAYS[cD]).forEach(function(s,i){
    var el=document.getElementById("tmr-"+cD+"-"+i);
    if(!el)return;
    var parts=s.t.split(":"),sh=parseInt(parts[0]),sm=parseInt(parts[1]);
    var diff=(sh*60+sm)-(h*60+m);
    if(diff>0&&diff<=60)el.textContent="\u23f1 Parti tra "+diff+" min";
    else if(diff===0)el.textContent="\u{1F4CD} Ora!";
    else el.textContent="";
  });
}

function renderDay(i){
  var d=LIVE_DAYS[i],all=allItems(d);
  var pb=0,fb=0;all.forEach(function(s){if(s.tp==="Pub/Birra")pb++;if(s.tp==="Cibo")fb++});
  var skipped=all.filter(function(_,si){return localStorage.getItem("sk-"+i+"-"+si)==="1"}).length;
  document.getElementById("pbar").style.width=(all.length?Math.round(skipped/all.length*100):0)+"%";

  var h=renderQuickView()+'<div class="dhc"><div class="dhc-t">'+d.t+'</div><div class="dhc-chips"><span class="chip chip-w">'+d.wt+'</span><span class="chip '+(d.rn?"chip-r":"chip-s")+'">'+(d.rn?"\u{1F327} Pioggia":"\u2600\ufe0f Sole")+'</span>'+(d.sunrise?'<span class="chip chip-w">\u{1F305} '+d.sunrise.split("T")[1].substring(0,5)+'</span>':'')+(d.sunset?'<span class="chip chip-w">\u{1F307} '+d.sunset.split("T")[1].substring(0,5)+'</span>':'')+'</span></div><div class="dhc-dress">'+d.dr+'</div>'+(d.wn?'<div class="dhc-wrn">'+d.wn+'</div>':'')+'<div class="dhc-stats"><span><b>'+all.length+'</b> tappe</span><span><b>'+pb+'</b> \u{1F37A}</span><span><b>'+fb+'</b> \u{1F37D}</span><span>~<b>'+d.km+'</b> km</span></div></div>';

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
      h+='<div class="zk-nm">'+s.n+' <a class="ed-pen" href="javascript:void(0)" onclick="event.stopPropagation();event.preventDefault();showEditStop('+i+','+gi+')" title="Modifica">'+ICN.edit+'</a></div>';
      h+='<div class="zk-ds">'+s.ds+'</div>';
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
  h+='<div style="padding:0 20px"><button class="add-stop-btn" onclick="showSearchAdd('+i+',allItems(LIVE_DAYS['+i+']).length-1)">+ Cerca e aggiungi tappa</button></div>';
  document.getElementById("dc").innerHTML=h;
  updateTimers();
}

function tgl(d,s){document.getElementById("sd-"+d+"-"+s).classList.toggle("open")}
function saveNt(d,s){localStorage.setItem("nt-"+d+"-"+s,document.getElementById("nt-"+d+"-"+s).value)}
function toggleSkip(d,s){var k="sk-"+d+"-"+s;localStorage.setItem(k,localStorage.getItem(k)==="1"?"0":"1");renderDay(d)}

function renderSearch(){
  var c=document.getElementById("scp");
  var showCats=["Pub/Birra","Cibo","Attrazione","Mercato","Trasporto","Hotel","Foto","Shopping"];c.innerHTML=showCats.map(function(k){return '<div class="scp" data-c="'+k+'">'+(TI[k]||"")+" "+(TN[k]||k)+'</div>'}).join("");
  c.querySelectorAll(".scp").forEach(function(ch){ch.onclick=function(){
    if(sf===ch.dataset.c){sf=null;ch.classList.remove("on")}
    else{c.querySelectorAll(".scp").forEach(function(x){x.classList.remove("on")});sf=ch.dataset.c;ch.classList.add("on")}
    doSearch();
  }});
}
function doSearch(){
  var q=(document.getElementById("si").value||"").toLowerCase().trim();
  var r=document.getElementById("srs");
  if(!q&&!sf){r.innerHTML='<div class="emp">Cerca un luogo per trovarlo nell\u0027itinerario o per aggiungerne uno nuovo</div>';return}
  var res=[];
  LIVE_DAYS.forEach(function(d){allItems(d).forEach(function(s){
    var txt=(s.n+" "+s.ds+" "+s.tp+" "+(s.ad||"")).toLowerCase();
    if((!q||txt.indexOf(q)>=0)&&(!sf||s.tp===sf))res.push({d:d,s:s});
  })});
  var h=res.length?res.map(function(x){return '<div class="sr" onclick="goTo('+x.d.id+',\''+x.s.t+'\')"><div class="sr-d">'+x.d.pl+'</div><div class="sr-n">'+x.s.n+'</div><div class="sr-x">'+x.s.ds.substring(0,90)+'</div></div>'}).join(""):'<div class="emp">Nessun risultato</div>';
  if(q&&q.length>2)h+='<div class="sr-gm"><a href="https://www.google.com/maps/search/'+encodeURIComponent(q+" London")+'" target="_blank">'+ICN.gmaps+' Cerca "'+q+'" su Google Maps</a></div>';
  r.innerHTML=h;
  if(q&&q.length>=3){var nc=document.getElementById("nom-results");if(nc)nc.innerHTML='<div class="nom-hdr">Cerco nuovi luoghi...</div>';searchNominatim(q);}else{var nc=document.getElementById("nom-results");if(nc)nc.innerHTML="";}
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
  var el=document.getElementById("tfl-status");el.innerHTML='<div class="emp">Caricamento...</div>';
  var lines=["bakerloo","central","circle","district","hammersmith-city","jubilee","metropolitan","northern","piccadilly","victoria","waterloo-city","dlr","elizabeth","london-overground","tram"];
  fetch("https://api.tfl.gov.uk/Line/"+lines.join(",")+"/Status")
  .then(function(r){return r.json()})
  .then(function(d){
    var h="";d.forEach(function(l){
      var st=l.lineStatuses[0];var sev=st.statusSeverity;
      var cls=sev===10?"tfl-ok":sev>=5?"tfl-warn":"tfl-bad";
      h+='<div class="tfl-row"><span class="tfl-ln">'+l.name+'</span><span class="tfl-st '+cls+'">'+st.statusSeverityDescription+'</span></div>';
    });
    h+='<div style="font-size:11px;color:var(--tx3);margin-top:6px">\u{1F4E1} TfL API \u2022 '+new Date().toLocaleString("it-IT")+'</div>';
    el.innerHTML=h;
  })
  .catch(function(){el.innerHTML='<div class="emp">Errore connessione TfL</div>'});
}

function renderTr(){
  document.getElementById("trw").innerHTML='<div class="ic"><h3>\u{1F687} Stato linee live</h3><div id="tfl-status"><div class="emp">Premi aggiorna</div></div><button class="wlb" onclick="fetchTfl()">\u{1F504} Aggiorna da TfL</button></div><div class="ic"><h3>\u26a0 Chiusure note</h3><ul><li>\u{1F7E2} <b>Sciopero</b><div class="li-desc">Annullato</div></li><li>\u26a0\ufe0f <b>Metropolitan (sab-dom)</b><div class="li-desc">Chiusa Aldgate \u2192 Wembley Park</div></li><li>\u26a0\ufe0f <b>DLR (sab-dom)</b><div class="li-desc">Chiusa Bank \u2192 Canning Town</div></li><li>\u26a0\ufe0f <b>Northern (tutta sett.)</b><div class="li-desc">No treni Camden\u2192Kennington via Bank dopo 22</div></li><li>\u{1F7E2} <b>Lun-Mar</b><div class="li-desc">Nessuna chiusura</div></li></ul></div><div class="ic"><h3>\u{1F4A1} Tips trasporti</h3><ul><li>\u{1F4B3} <b>Contactless/Oyster</b><div class="li-desc">Appoggiare la carta ai tornelli</div></li><li>\u{1F4F1} <b>Citymapper</b><div class="li-desc">App consigliata per navigare</div></li><li>\u{1F4B0} <b>Cap ~\u00a38.10</b><div class="li-desc">Massimo giornaliero zone 1-2</div></li><li>\u{1F682} <b>Stansted Express \u00a319.40</b><div class="li-desc">Ogni 15 min, ~50 min</div></li><li>\u{1F550} <b>Cambio ora sab notte</b><div class="li-desc">02:00 \u2192 03:00</div></li></ul></div>';
}

function renderMt(){
  document.getElementById("mtw").innerHTML='<div class="ic"><h3>\u2600\ufe0f Meteo</h3><div id="mt-data"><div class="mt-grid"><div class="mt-hdr">Giorno</div><div class="mt-hdr">Temp</div><div class="mt-hdr">Pioggia</div><div class="mt-hdr">Vento</div>'+LIVE_DAYS.map(function(d){return '<div class="mt-cell mt-day">'+(d.rn?"\u{1F327}":"\u2600\ufe0f")+" "+d.pl+'</div><div class="mt-cell">'+d.wt+'</div><div class="mt-cell">'+(d.rn?"probabile":"basso")+'</div><div class="mt-cell">'+(d.wind?"\u{1F4A8} "+d.wind+" km/h":"--")+'</div>'}).join("")+'</div></div><button class="wlb" onclick="fetchW()">\u{1F504} Aggiorna live</button><div id="wl" style="margin-top:8px;font-size:12px;color:var(--tx2)"></div></div>';
}
function fetchW(){
  var el=document.getElementById("wl");el.textContent="Caricamento...";
  fetch("https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max&timezone=Europe/London&start_date=2026-03-26&end_date=2026-03-31")
  .then(function(r){return r.json()})
  .then(function(d){
    if(!d.daily){el.textContent="N/A";return}
    var lb=["Gio 26","Ven 27","Sab 28","Dom 29","Lun 30","Mar 31"];
    var h='<div class="mt-grid"><div class="mt-hdr">Giorno</div><div class="mt-hdr">Temp</div><div class="mt-hdr">Pioggia</div><div class="mt-hdr">Vento</div>';
    d.daily.time.forEach(function(t,i){
      var mn=Math.round(d.daily.temperature_2m_min[i]);
      var mx=Math.round(d.daily.temperature_2m_max[i]);
      var pp=d.daily.precipitation_probability_max[i];
      var ws=d.daily.windspeed_10m_max?Math.round(d.daily.windspeed_10m_max[i]):"?";
      h+='<div class="mt-cell mt-day">'+(pp>30?"\u{1F327}":"\u2600\ufe0f")+" "+(lb[i]||t)+'</div><div class="mt-cell">'+mn+'\u00b0 / '+mx+'\u00b0</div><div class="mt-cell">'+(pp>30?'<span style="color:var(--wrn)">'+pp+'%</span>':'<span style="color:var(--ok)">'+pp+'%</span>')+'</div><div class="mt-cell">\u{1F4A8} '+ws+' km/h</div>';
    });
    h+='</div><div style="font-size:11px;color:var(--tx3);margin-top:6px">\u{1F4E1} Open-Meteo \u2022 '+new Date().toLocaleString("it-IT")+'</div>';
    document.getElementById("mt-data").innerHTML=h;
    el.textContent="";
  })
  .catch(function(){el.textContent="Errore."});
}

function refreshInfo(){renderIf()}
function renderIf(){
  var h='<div class="ic"><h3>\u{1F4B1} Convertitore EUR/GBP</h3><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><input type="number" class="ed-input" id="fx-input" placeholder="Importo" style="width:100px;flex:none" oninput="convertCurrency()"><select class="ed-input" id="fx-dir" style="width:auto;flex:none" onchange="convertCurrency()"><option value="eur2gbp">EUR \u2192 GBP</option><option value="gbp2eur">GBP \u2192 EUR</option></select><div id="fx-output" style="font-size:20px;font-weight:700;color:var(--pub)">0.00 GBP</div></div><div id="fx-rate" style="font-size:11px;color:var(--tx3);margin-top:6px">1 EUR = '+EUR_GBP_RATE.toFixed(4)+' GBP</div></div>';
  h+='<div class="ic"><h3>Legenda timeline</h3><div class="leg"><div class="leg-i"><div class="leg-d" style="background:var(--pub)"></div>Pub</div><div class="leg-i"><div class="leg-d" style="background:var(--food)"></div>Cibo</div><div class="leg-i"><div class="leg-d" style="background:var(--attr)"></div>Attrazione</div><div class="leg-i"><div class="leg-d" style="background:var(--mkt)"></div>Mercato</div><div class="leg-i"><div class="leg-d" style="background:var(--trn)"></div>Trasporto</div><div class="leg-i"><div class="leg-d" style="background:var(--fot)"></div>Foto</div></div></div>';
  h+='<div class="ic"><h3>\u{1F4D6} Diario di viaggio</h3><button class="wlb" onclick="exportDiary()" style="width:100%">\u{1F4BE} Esporta diario come HTML</button></div>';
  h+='<div class="ic"><h3>\u{1F4DE} Numeri utili</h3><ul><li>\u{1F198} <b>999 / 112</b><div class="li-desc">Emergenze (polizia, ambulanza, vigili)</div></li><li>\u{1F3E5} <b>111</b><div class="li-desc">NHS, consulenza medica non urgente</div></li><li>\u{1F1EE}\u{1F1F9} <b>+44 20 7312 2200</b><div class="li-desc">Ambasciata italiana a Londra</div></li><li>\u{1F687} <b>0343 222 1234</b><div class="li-desc">TfL, info trasporti</div></li><li>\u{1F3E8} <b>+44 20 7456 0400</b><div class="li-desc">Hotel Point A Liverpool Street</div></li></ul></div>';
  h+='<div class="ic"><h3>\u{1F4A1} Consigli</h3><ul><li>\u{1F697} <b>Si guida a sinistra!</b><div class="li-desc">Guardate prima a destra quando attraversate</div></li><li>\u{1F4B0} <b>Mancia 10%</b><div class="li-desc">Apprezzata, non obbligatoria</div></li><li>\u{1F50C} <b>Prese UK tipo G</b><div class="li-desc">3 pin rettangolari, serve adattatore</div></li><li>\u{1F4A7} <b>Acqua rubinetto OK</b><div class="li-desc">Potabile, riempite le borracce</div></li><li>\u{1F37A} <b>Orari pub</b><div class="li-desc">~23 settimana, ~00 weekend</div></li><li>\u{1F4B3} <b>Contactless ovunque</b><div class="li-desc">Anche per importi piccoli</div></li><li>\u{1F45C} <b>Sicurezza metro</b><div class="li-desc">Occhio a borse nelle ore di punta</div></li></ul></div>';
  h+='<div class="foot">London App - Mar 2026 \u{1F408}\u200d\u2b1b</div>';
  h+='<div style="text-align:center;padding:0 20px 10px"><button class="wlb" onclick="confirmReset()">Ripristina itinerario originale</button></div>';
  document.getElementById("ifw").innerHTML=h;
}

init();
