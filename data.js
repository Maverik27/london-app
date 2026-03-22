/*==============================================
  LONDON APP - DATA
  Itinerary, phrases, icons, type mappings
==============================================*/

/* --- Type mappings --- */
var TC = {
  "Pub/Birra":"pub","Cibo":"cibo","Attrazione":"attr","Mercato":"mkt",
  "Trasporto":"trans","Passeggiata":"attr","Hotel":"hotel",
  "Panorama":"attr","Foto":"foto","Shopping":"shop"
};
var TI = {
  "Pub/Birra":"\ud83c\udf7a","Cibo":"\ud83c\udf7d","Attrazione":"\ud83c\udfdb","Mercato":"\ud83d\uded2",
  "Trasporto":"\ud83d\ude87","Passeggiata":"\ud83c\udfdb","Hotel":"\ud83c\udfe8",
  "Panorama":"\ud83c\udfdb","Foto":"\ud83d\udcf8","Shopping":"\ud83d\uded2"
};
var TN = {
  "Pub/Birra":"Pub","Cibo":"Cibo","Attrazione":"Attrazione","Mercato":"Mercato",
  "Trasporto":"Trasporto","Passeggiata":"Attrazione","Hotel":"Hotel",
  "Panorama":"Attrazione","Foto":"Foto","Shopping":"Shopping"
};

/* --- SVG Icons (22x22, uniform style) --- */
var ICN = {
  citymapper: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="5" fill="#3faa3c"/><circle cx="6" cy="11" r="2.2" fill="#fff"/><circle cx="16" cy="11" r="2.2" fill="#fff"/><path d="M8.5 11h1.5l2-3 2 3h1" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  gmaps: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2C7.4 2 4.5 4.9 4.5 8.5c0 5.2 6.5 11.5 6.5 11.5s6.5-6.3 6.5-11.5C17.5 4.9 14.6 2 11 2z" fill="#ea4335"/><path d="M11 2c1.8 0 3.4.7 4.6 1.9l-4.6 4.6V2z" fill="#4285f4"/><path d="M6.4 3.9C7.6 2.7 9.2 2 11 2v6.5L6.4 3.9z" fill="#fbbc04"/><path d="M4.5 8.5c0-1.5.4-2.8 1.2-3.9L11 8.5H4.5z" fill="#fbbc04"/><path d="M4.5 8.5H11v2.8L6.2 13c-1-1.3-1.7-2.8-1.7-4.5z" fill="#34a853"/><path d="M11 8.5l4.6-4.6c.8 1.1 1.2 2.4 1.2 3.9 0 1.7-.6 3.2-1.7 4.5L11 11.3V8.5z" fill="#4285f4"/><path d="M11 11.3l4.1 1.5c-1.5 2.4-3.2 4.5-4.1 5.5-.9-1-2.6-3.1-4.1-5.5L11 11.3z" fill="#34a853"/><circle cx="11" cy="8.5" r="2.5" fill="#1a0e04"/></svg>',
  wc: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="5" fill="#38bdf8"/><path d="M7 8h8v2a4 4 0 01-8 0V8z" fill="#fff"/><rect x="8.5" y="5" width="5" height="3.5" rx="1" fill="#fff"/><path d="M9.5 14v2h3v-2" stroke="#fff" stroke-width="1.2"/><rect x="8.5" y="15.5" width="5" height="1.5" rx=".5" fill="#fff"/></svg>',
  water: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="5" fill="#0ea5e9"/><path d="M11 4.5S6.5 9.5 6.5 12.5a4.5 4.5 0 009 0c0-3-4.5-8-4.5-8z" fill="#fff"/><path d="M9.5 13.5a1.5 2 0 003 0" stroke="#0ea5e9" stroke-width="1" stroke-linecap="round"/></svg>',
  skip_stop: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="5" fill="#6b7280"/><path d="M5 11h12M9 7l-4 4 4 4" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  delete_stop: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="5" fill="#ef4444"/><path d="M7 8h8l-.8 8.5a1 1 0 01-1 .9h-4.4a1 1 0 01-1-.9L7 8z" fill="#fff"/><rect x="6" y="6" width="10" height="2" rx=".5" fill="#fff"/><rect x="9" y="4.5" width="4" height="2" rx=".5" fill="#fff"/></svg>',
  add_here: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".4"/><path d="M10 6v8M6 10h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  diary: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="5" fill="#14b8a6"/><path d="M8 5h6l1.5 2H17a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h1.5L8 5z" fill="#fff"/><circle cx="11" cy="11.5" r="3.5" fill="#14b8a6"/><circle cx="11" cy="11.5" r="2" fill="#fff"/></svg>',
  edit: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="5" fill="#6b7280"/><path d="M13.5 5.5l3 3M6 13l-1 4 4-1 8.5-8.5-3-3L6 13z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  phrases: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="5" fill="#4f46e5"/><path d="M4 7h5M6.5 5v2M5 9c1 2 3 3 5 3" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><path d="M13 9l2 6 2-6M14 13h2" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  book: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="5" fill="#3b82f6"/><rect x="6" y="5" width="10" height="12" rx="1.5" fill="#fff"/><path d="M8.5 8h5M8.5 10.5h5M8.5 13h3" stroke="#3b82f6" stroke-width="1.2" stroke-linecap="round"/></svg>'
};

/* --- Nominatim type detection --- */
var NOM_TYPE_MAP = {
  pub:"Pub/Birra",bar:"Pub/Birra",biergarten:"Pub/Birra",brewery:"Pub/Birra",
  restaurant:"Cibo",fast_food:"Cibo",cafe:"Cibo",food_court:"Cibo",ice_cream:"Cibo",bakery:"Cibo",
  museum:"Attrazione",tourism:"Attrazione",attraction:"Attrazione",castle:"Attrazione",monument:"Attrazione",memorial:"Attrazione",artwork:"Attrazione",gallery:"Attrazione",theatre:"Attrazione",cinema:"Attrazione",church:"Attrazione",cathedral:"Attrazione",
  marketplace:"Mercato",market:"Mercato",
  station:"Trasporto",bus_station:"Trasporto",subway:"Trasporto",
  hotel:"Hotel",hostel:"Hotel",guest_house:"Hotel",
  viewpoint:"Attrazione",
  shop:"Shopping",supermarket:"Shopping",clothes:"Shopping",books:"Shopping"
};

/* --- Itinerary --- */
var DAYS = [
{id:0,pl:"Gio 26",t:"Arrivo, Brick Lane e pub crawl Spitalfields",wt:"4-14\u00b0C",rn:0,dr:"\ud83e\udde5 Giubbotto leggero, strati. Sera fresca (~4\u00b0C).",wn:"",km:4.5,zones:[
{zone:"Arrivo",items:[
{t:"16:50",n:"Stansted Airport",tp:"Trasporto",ds:"Atterraggio FR2686 da Cagliari.",la:51.885,ln:0.235,ad:"Stansted Airport",di:"Sbarco e treno.",ws:[],bk:null,pla:null,pln:null},
{t:"17:30",n:"Stansted Express",tp:"Trasporto",ds:"Treno diretto, \u00a319.40 p.p., ogni 15 min.",du:"~47 min",la:51.517,ln:-0.083,ad:"Liverpool St Station",di:"Seguire Stansted Express. Diretto.",ws:[],bk:null,pla:51.885,pln:0.235}]},
{zone:"Check-in",items:[
{t:"18:15",n:"Hotel Point A",tp:"Hotel",ds:"Check-in, bagagli. Scorte colazione da Tesco!",du:"~30 min",la:51.521,ln:-0.0776,ad:"13-15 Folgate St, E1 6BX",di:"Uscita Liverpool St, Bishopsgate, sx Folgate St. 5 min.",ws:[{x:"\u26a0 No colazione",y:"a"},{x:"\ud83d\uded2 Tesco",y:"i"}],bk:null,pla:51.517,pln:-0.083}]},
{zone:"Brick Lane",items:[
{t:"19:00",n:"Passeggiata e street food",tp:"Cibo",ds:"East End: street art, curry, vintage. Cena camminando.",du:"~30 min",la:51.521,ln:-0.072,ad:"Brick Lane, E1",di:"Hotel, Folgate, Commercial, sx Brick Lane. 7 min.",ws:[],bk:null,pla:51.521,pln:-0.0776},
{t:"19:30",n:"Prima pinta del viaggio!",tp:"Pub/Birra",ds:"Scelta libera tra i pub sulla via.",du:"~15 min",la:51.521,ln:-0.072,ad:"Brick Lane",di:"Lungo Brick Lane.",ws:[],bk:null,pla:null,pln:null}]},
{zone:"Shoreditch",items:[
{t:"19:45",n:"Mikkeller Bar",tp:"Pub/Birra",ds:"Craft beer danese + Rick Astley. 20 tap. Pizza Yard Sale.",du:"~1h",la:51.5273,ln:-0.0769,ad:"2-4 Hackney Rd, E2 7NS",di:"Brick Lane nord, Bethnal Green Rd, dx Hackney Rd. 10 min.",ws:[{x:"\u26a0 Chiude 22:45",y:"a"},{x:"\ud83c\udf55 Pizza",y:"i"}],bk:null,pla:51.521,pln:-0.072}]},
{zone:"Pub crawl verso hotel",items:[
{t:"20:45",n:"The Pride of Spitalfields",tp:"Pub/Birra",ds:"Il pub col gatto! Real ale \u00a35.50, salt beef \u00a35.",du:"~45 min",la:51.5189,ln:-0.0712,ad:"3 Heneage St, E1 5LJ",di:"Da Mikkeller scendendo. 12 min.",ws:[{x:"\ud83e\udd6a Salt beef pranzo+dom",y:"i"}],bk:null,pla:51.5273,pln:-0.0769},
{t:"21:30",n:"The Ten Bells",tp:"Pub/Birra",ds:"1752, Jack the Ripper. Piastrelle originali. Burger.",du:"~45 min",la:51.5194,ln:-0.0743,ad:"84 Commercial St, E1",di:"Heneage St, dx Commercial. 4 min.",ws:[],bk:null,pla:51.5189,pln:-0.0712},
{t:"22:15",n:"The Golden Heart",tp:"Pub/Birra",ds:"Timothy Taylor Landlord. Ultima pinta.",du:"~30 min",la:51.5202,ln:-0.0743,ad:"110 Commercial St",di:"1 min.",ws:[{x:"\ud83d\udeab No cibo",y:"a"}],bk:null,pla:51.5194,pln:-0.0743},
{t:"22:45",n:"Rientro hotel",tp:"Trasporto",ds:"4 min a piedi.",la:51.521,ln:-0.0776,ad:"Hotel",di:"Commercial St, Folgate St.",ws:[],bk:null,pla:51.5202,pln:-0.0743}]}]},

{id:1,pl:"Ven 27 \ud83c\udf82",t:"Tower Bridge, Borough, Bermondsey e Sky Garden",wt:"8-13\u00b0C",rn:0,dr:"\ud83e\udde5 Giubbotto, strati. Sole.",wn:"",km:12,zones:[
{zone:"",items:[{t:"09:30",n:"Colazione",tp:"Cibo",ds:"Scorte Tesco.",la:51.521,ln:-0.0776,ad:"Hotel",di:"",ws:[],bk:null,pla:null,pln:null}]},
{zone:"Tower Bridge",items:[
{t:"10:00",n:"Metro \u2192 Tower Hill",tp:"Trasporto",ds:"Circle/District, 3 fermate.",du:"~15 min",la:51.5101,ln:-0.0765,ad:"Tower Hill",di:"Circle/District ovest.",ws:[],bk:null,pla:51.517,pln:-0.083},
{t:"10:15",n:"Tower Bridge Exhibition",tp:"Attrazione",ds:"Passerella vetro 42m. ~\u00a312.30.",du:"~1h 15min",la:51.5045,ln:-0.0762,ad:"Tower Bridge Rd, SE1",di:"Da Tower Hill: 5 min.",ws:[{x:"\ud83d\udccb Prenotare",y:"b"},{x:"\u26a0 Borse 40x20x25",y:"a"}],bk:{u:"https://www.towerbridge.org.uk",l:"Prenota"},pla:51.5101,pln:-0.0765}]},
{zone:"Borough e Bermondsey",items:[
{t:"11:30",n:"Passeggiata Tamigi",tp:"Passeggiata",ds:"Panoramica.",du:"~10 min",la:51.505,ln:-0.088,ad:"South Bank",di:"Uscita sud Tower Bridge.",ws:[],bk:null,pla:51.5045,pln:-0.0762},
{t:"11:45",n:"Borough Market",tp:"Cibo",ds:"Mercato 1756. Ostriche, scotch egg, raclette.",du:"~1h 30min",la:51.5056,ln:-0.0905,ad:"London SE1 9AH",di:"Lungo il fiume.",ws:[{x:"Ven 10-17",y:"i"}],bk:null,pla:51.505,pln:-0.088},
{t:"13:15",n:"Metro \u2192 Bermondsey",tp:"Trasporto",ds:"Jubilee, 1 fermata.",du:"~20 min",la:51.498,ln:-0.064,ad:"Bermondsey",di:"London Bridge, Jubilee est.",ws:[],bk:null,pla:51.5056,pln:-0.0905},
{t:"14:00",n:"Anspach & Hobday",tp:"Pub/Birra",ds:"Beer Mile. London Black leggendaria.",du:"~1h",la:51.4987,ln:-0.0735,ad:"118 Druid St, SE1",di:"Jamaica Rd, sx Druid St.",ws:[{x:"\u26a0 Apre 14:00",y:"a"}],bk:null,pla:51.498,pln:-0.064}]},
{zone:"City di Londra",items:[
{t:"15:15",n:"Metro \u2192 Monument",tp:"Trasporto",ds:"Jubilee + a piedi.",du:"~10 min",la:51.5108,ln:-0.0862,ad:"Monument",di:"",ws:[],bk:null,pla:51.4987,pln:-0.0735},
{t:"15:30",n:"Leadenhall Market",tp:"Attrazione",ds:"Vittoriano, Harry Potter.",du:"~30 min",la:51.5128,ln:-0.0835,ad:"Gracechurch St",di:"5 min.",ws:[],bk:null,pla:51.5108,pln:-0.0862},
{t:"16:00",n:"Passeggiata City",tp:"Passeggiata",ds:"Gherkin, Lloyd's.",du:"~30 min",la:51.5115,ln:-0.084,ad:"City",di:"",ws:[],bk:null,pla:null,pln:null},
{t:"16:30",n:"Pub pre-tramonto",tp:"Pub/Birra",ds:"Pinta prima di Sky Garden.",du:"~45 min",la:51.512,ln:-0.084,ad:"City",di:"",ws:[],bk:null,pla:null,pln:null},
{t:"17:30",n:"Sky Garden",tp:"Panorama",ds:"35\u00b0 piano, gratuito. 360\u00b0 al tramonto. Cocktail!",du:"~1h",la:51.5112,ln:-0.0835,ad:"20 Fenchurch St",di:"5 min.",ws:[{x:"\ud83d\udccb Prenotato",y:"b"}],bk:{u:"https://skygarden.london",l:"Sky Garden"},pla:null,pln:null}]},
{zone:"Cena compleanno",items:[
{t:"18:30",n:"Ritorno a piedi",tp:"Passeggiata",ds:"18-20 min.",du:"~20 min",la:51.521,ln:-0.0776,ad:"Spitalfields",di:"Fenchurch, Aldgate, Commercial.",ws:[],bk:null,pla:51.5112,pln:-0.0835},
{t:"19:00",n:"Cena compleanno",tp:"Cibo",ds:"Ten Bells: burger. Queen's Head: bangers & mash.",du:"~1h 15min",la:51.5194,ln:-0.0743,ad:"Spitalfields",di:"",ws:[],bk:null,pla:null,pln:null},
{t:"20:15",n:"Grocer o Pride",tp:"Pub/Birra",ds:"Grocer: Guinness. Pride: il gatto.",du:"~1h 30min",la:51.520,ln:-0.076,ad:"Spitalfields",di:"",ws:[],bk:null,pla:null,pln:null},
{t:"22:00",n:"Rientro",tp:"Trasporto",ds:"3-8 min.",la:51.521,ln:-0.0776,ad:"Hotel",di:"",ws:[],bk:null,pla:null,pln:null}]}]},

{id:2,pl:"Sab 28",t:"Portobello, Guinness, Chinatown e Soho",wt:"8-16\u00b0C",rn:1,dr:"\ud83e\udde5 Impermeabile, ombrello.",wn:"\u26a0 Cambio ora stanotte: 02:00 \u2192 03:00!",km:10,zones:[
{zone:"Notting Hill",items:[
{t:"09:30",n:"Metro \u2192 Notting Hill",tp:"Trasporto",ds:"Central diretta, ~20 min.",la:51.5091,ln:-0.1964,ad:"Notting Hill Gate",di:"Central ovest.",ws:[],bk:null,pla:51.517,pln:-0.083},
{t:"10:00",n:"Portobello Road Market",tp:"Mercato",ds:"Sab = top. Antiquariato, vintage, street food.",du:"~45 min",la:51.5153,ln:-0.2053,ad:"Portobello Rd",di:"5 min.",ws:[],bk:null,pla:51.5091,pln:-0.1964},
{t:"10:30",n:"Notting Hill Bookshop",tp:"Shopping",ds:"La libreria del film.",du:"~10 min",la:51.5152,ln:-0.2058,ad:"13 Blenheim Crescent",di:"2 min.",ws:[],bk:null,pla:null,pln:null},
{t:"10:45",n:"Duke of Wellington",tp:"Pub/Birra",ds:"Pub tradizionale. Rifugio pioggia.",du:"~45 min",la:51.517,ln:-0.2027,ad:"179 Portobello Rd",di:"3 min.",ws:[],bk:null,pla:null,pln:null},
{t:"11:30",n:"The Queens",tp:"Pub/Birra",ds:"Pub classico.",du:"~30 min",la:51.5137,ln:-0.2027,ad:"Notting Hill",di:"",ws:[],bk:null,pla:null,pln:null}]},
{zone:"Covent Garden",items:[
{t:"12:00",n:"Bus double decker",tp:"Trasporto",ds:"Primo giro! Piano sopra davanti!",du:"~40 min",la:51.5129,ln:-0.1243,ad:"Covent Garden",di:"Bus 94/390.",ws:[],bk:null,pla:51.5137,pln:-0.2027},
{t:"12:45",n:"Covent Garden",tp:"Passeggiata",ds:"Piazza coperta, artisti.",du:"~30 min",la:51.5129,ln:-0.1243,ad:"Covent Garden",di:"",ws:[],bk:null,pla:null,pln:null},
{t:"13:15",n:"Rock & Sole Plaice",tp:"Cibo",ds:"Fish & chips dal 1871.",du:"~45 min",la:51.515,ln:-0.1257,ad:"47 Endell St",di:"5 min.",ws:[],bk:null,pla:51.5129,pln:-0.1243},
{t:"14:00",n:"Guinness Open Gate",tp:"Pub/Birra",ds:"Complesso \u00a373M. Microbirrificio, Porter's Table.",du:"~2h",la:51.5137,ln:-0.1253,ad:"28-32 Shelton St",di:"2 min.",ws:[{x:"\ud83d\udccb Prenotare",y:"b"}],bk:{u:"https://opengatelondon.guinness.com",l:"Prenota"},pla:51.515,pln:-0.1257}]},
{zone:"Chinatown e Soho",items:[
{t:"16:00",n:"Chinatown",tp:"Cibo",ds:"Bao bun, dumpling, bubble tea.",du:"~20 min",la:51.5113,ln:-0.1311,ad:"Gerrard St",di:"5-8 min.",ws:[],bk:null,pla:51.5137,pln:-0.1253},
{t:"16:30",n:"The Devonshire",tp:"Pub/Birra",ds:"#1 Guinness UK.",du:"~45 min",la:51.5138,ln:-0.1358,ad:"7 Devonshire St",di:"5 min.",ws:[],bk:null,pla:51.5113,pln:-0.1311},
{t:"17:15",n:"The Toucan",tp:"Pub/Birra",ds:"Micro pub irlandese.",du:"~45 min",la:51.5145,ln:-0.1347,ad:"19 Carlisle St",di:"3 min.",ws:[{x:"\u26a0 Solo in piedi",y:"a"}],bk:null,pla:51.5138,pln:-0.1358}]},
{zone:"Rientro",items:[
{t:"18:00",n:"Annabel's",tp:"Foto",ds:"Facciata iconica.",du:"~10 min",la:51.5095,ln:-0.1465,ad:"46 Berkeley Sq",di:"10 min.",ws:[],bk:null,pla:51.5145,pln:-0.1347},
{t:"18:15",n:"Metro \u2192 Liverpool St",tp:"Trasporto",ds:"Central est.",la:51.517,ln:-0.083,ad:"Liverpool St",di:"",ws:[],bk:null,pla:51.5095,pln:-0.1465},
{t:"18:30",n:"Sud Italia",tp:"Cibo",ds:"Pizza portafoglio, \u00a33-7.",du:"~30 min",la:51.5199,ln:-0.0755,ad:"16 Horner Sq",di:"3 min.",ws:[],bk:null,pla:51.517,pln:-0.083},
{t:"19:00",n:"Serata tranquilla",tp:"Hotel",ds:"A letto presto. Cambio ora!",la:51.521,ln:-0.0776,ad:"Hotel",di:"",ws:[{x:"\u26a0 02\u219203",y:"a"}],bk:null,pla:null,pln:null}]}]},

{id:3,pl:"Dom 29",t:"Columbia Road, Camden e SMOKESTAK",wt:"3-8\u00b0C",rn:1,dr:"\ud83e\udde5 Pesante! Strati caldi.",wn:"\u26a0 Persa 1h sonno. Northern chiusa via Bank dopo 22.",km:11,zones:[
{zone:"Shoreditch mattina",items:[
{t:"09:00",n:"Columbia Road Flower Market",tp:"Mercato",ds:"Solo domenica. Fiori, caffe'.",du:"~45 min",la:51.5293,ln:-0.0699,ad:"Columbia Rd",di:"12 min.",ws:[{x:"\u26a0 Solo dom",y:"a"}],bk:null,pla:51.521,pln:-0.0776},
{t:"09:45",n:"After School Cookie Club",tp:"Cibo",ds:"Cookie caldo artigianale.",du:"~15 min",la:51.524,ln:-0.073,ad:"155 Bethnal Green Rd",di:"8 min.",ws:[],bk:null,pla:51.5293,pln:-0.0699}]},
{zone:"Camden Town",items:[
{t:"10:15",n:"Metro \u2192 Camden",tp:"Trasporto",ds:"Northern via Charing Cross.",du:"~15 min",la:51.5392,ln:-0.1426,ad:"Camden Town",di:"Old St (10 min), Northern (5 fermate).",ws:[],bk:null,pla:51.524,pln:-0.073},
{t:"10:30",n:"Camden Market e Stables",tp:"Mercato",ds:"Coperti. Burger, bao, jerk chicken.",du:"~1h 30min",la:51.5413,ln:-0.1466,ad:"Camden Lock Place",di:"5 min.",ws:[],bk:null,pla:51.5392,pln:-0.1426},
{t:"12:00",n:"Amy Winehouse Statue",tp:"Foto",ds:"Bronzo in Stables.",du:"~5 min",la:51.5419,ln:-0.1467,ad:"Stables Market",di:"",ws:[],bk:null,pla:null,pln:null},
{t:"12:15",n:"The Lyttelton Arms",tp:"Pub/Birra",ds:"Pub classico.",du:"~45 min",la:51.5391,ln:-0.1421,ad:"Camden High St",di:"5 min.",ws:[],bk:null,pla:null,pln:null},
{t:"13:00",n:"Camden Town Brewery",tp:"Pub/Birra",ds:"Birra locale.",du:"~45 min",la:51.5465,ln:-0.1403,ad:"Wilkin St Mews",di:"10 min.",ws:[],bk:null,pla:51.5391,pln:-0.1421},
{t:"13:45",n:"The Dublin Castle",tp:"Pub/Birra",ds:"Punk/live 1974.",du:"~45 min",la:51.5387,ln:-0.1438,ad:"94 Parkway",di:"8 min.",ws:[],bk:null,pla:51.5465,pln:-0.1403}]},
{zone:"Islington",items:[
{t:"14:30",n:"Bus \u2192 Islington",tp:"Trasporto",ds:"38/73, primo piano!",du:"~20 min",la:51.5362,ln:-0.1058,ad:"Angel",di:"",ws:[],bk:null,pla:51.5387,pln:-0.1438},
{t:"15:00",n:"Upper Street",tp:"Passeggiata",ds:"Quartiere vivace.",du:"~30 min",la:51.536,ln:-0.103,ad:"Upper St",di:"",ws:[],bk:null,pla:null,pln:null},
{t:"15:30",n:"The Holy Tavern",tp:"Pub/Birra",ds:"Ex Jerusalem Tavern. St Peter's, 1720.",du:"~1h",la:51.522,ln:-0.105,ad:"55 Britton St",di:"15 min.",ws:[],bk:null,pla:51.536,pln:-0.103}]},
{zone:"Cena",items:[
{t:"16:30",n:"Rientro a piedi",tp:"Trasporto",ds:"25 min.",la:51.521,ln:-0.0776,ad:"Hotel",di:"",ws:[],bk:null,pla:51.522,pln:-0.105},
{t:"17:00",n:"Pausa hotel",tp:"Hotel",ds:"Rinfrescata.",du:"~1h",la:51.521,ln:-0.0776,ad:"Hotel",di:"",ws:[],bk:null,pla:null,pln:null},
{t:"18:00",n:"SMOKESTAK",tp:"Cibo",ds:"Bib Gourmand. Brisket 12-15h. ~\u00a326-40.",du:"~2h",la:51.5233,ln:-0.0725,ad:"35 Sclater St",di:"12 min.",ws:[{x:"\ud83d\udccb Prenotare",y:"b"}],bk:{u:"https://www.smokestak.co.uk",l:"Prenota"},pla:51.521,pln:-0.0776},
{t:"20:00",n:"Rientro",tp:"Trasporto",ds:"12 min.",la:51.521,ln:-0.0776,ad:"Hotel",di:"",ws:[],bk:null,pla:51.5233,pln:-0.0725}]}]},

{id:4,pl:"Lun 30",t:"Westminster, Cambio Guardia, Mayfair e pub crawl",wt:"2-8\u00b0C",rn:1,dr:"\ud83e\udde5 Pesante! 2\u00b0C. Guanti, cappello.",wn:"",km:9,zones:[
{zone:"Westminster",items:[
{t:"09:30",n:"Metro \u2192 Westminster",tp:"Trasporto",ds:"Circle/H&C, ~20 min.",la:51.501,ln:-0.125,ad:"Westminster",di:"",ws:[],bk:null,pla:51.517,pln:-0.083},
{t:"10:00",n:"Big Ben e Westminster",tp:"Attrazione",ds:"Westminster Bridge.",du:"~30 min",la:51.501,ln:-0.1246,ad:"Westminster",di:"",ws:[],bk:null,pla:null,pln:null},
{t:"10:30",n:"The Mall \u2192 Buckingham",tp:"Passeggiata",ds:"Viale cerimoniale.",du:"~15 min",la:51.501,ln:-0.141,ad:"The Mall",di:"",ws:[],bk:null,pla:null,pln:null},
{t:"10:45",n:"Cambio della Guardia",tp:"Attrazione",ds:"11:00, ~45 min.",du:"~1h",la:51.5014,ln:-0.1419,ad:"Buckingham Palace",di:"",ws:[{x:"\u26a0 Entro 10:45",y:"a"}],bk:null,pla:null,pln:null}]},
{zone:"St James e Mayfair",items:[
{t:"11:45",n:"Trafalgar Square",tp:"Passeggiata",ds:"Nelson, leoni.",du:"~15 min",la:51.508,ln:-0.1281,ad:"Trafalgar Square",di:"15 min.",ws:[],bk:null,pla:51.5014,pln:-0.1419},
{t:"12:00",n:"St James's Market",tp:"Mercato",ds:"Piazzetta curata.",du:"~30 min",la:51.5089,ln:-0.1341,ad:"St James's Market",di:"10 min.",ws:[],bk:null,pla:51.508,pln:-0.1281},
{t:"12:30",n:"Mercato Mayfair",tp:"Cibo",ds:"Ex chiesa. Pizza, pasta, birra.",du:"~1h 30min",la:51.5128,ln:-0.1527,ad:"41 N Audley St",di:"10 min.",ws:[],bk:null,pla:51.5089,pln:-0.1341},
{t:"14:00",n:"Annabel's",tp:"Foto",ds:"Se non fatto sabato.",du:"~10 min",la:51.5095,ln:-0.1465,ad:"46 Berkeley Sq",di:"5 min.",ws:[],bk:null,pla:null,pln:null},
{t:"14:15",n:"Passeggiata Mayfair",tp:"Passeggiata",ds:"Regent St, Piccadilly.",du:"~45 min",la:51.5101,ln:-0.1359,ad:"Regent St",di:"",ws:[],bk:null,pla:null,pln:null}]},
{zone:"Pub crawl Spitalfields",items:[
{t:"15:00",n:"Metro \u2192 Liverpool St",tp:"Trasporto",ds:"Central, 15 min.",la:51.517,ln:-0.083,ad:"Liverpool St",di:"",ws:[],bk:null,pla:51.5101,pln:-0.1359},
{t:"15:15",n:"Pausa hotel",tp:"Hotel",ds:"Rinfrescata.",du:"~1h 15min",la:51.521,ln:-0.0776,ad:"Hotel",di:"",ws:[],bk:null,pla:null,pln:null},
{t:"16:30",n:"Queen's Head",tp:"Pub/Birra",ds:"Bangers & mash.",du:"~45 min",la:51.5227,ln:-0.078,ad:"Shoreditch High St",di:"3 min.",ws:[],bk:null,pla:51.521,pln:-0.0776},
{t:"17:15",n:"The Grocer",tp:"Pub/Birra",ds:"Beer garden, Guinness.",du:"~45 min",la:51.5201,ln:-0.0761,ad:"4 Crispin Pl",di:"3 min.",ws:[],bk:null,pla:51.5227,pln:-0.078},
{t:"18:00",n:"Pride of Spitalfields",tp:"Pub/Birra",ds:"Ultimo saluto al gatto.",du:"~45 min",la:51.5189,ln:-0.0712,ad:"3 Heneage St",di:"5 min.",ws:[],bk:null,pla:51.5201,pln:-0.0761},
{t:"18:45",n:"Rudy's o Sud Italia",tp:"Cibo",ds:"Rudy's ~\u00a315. Sud Italia \u00a33-7.",du:"~1h",la:51.5205,ln:-0.0773,ad:"Spital Sq",di:"2 min.",ws:[],bk:null,pla:null,pln:null},
{t:"19:45",n:"Ten Bells, ultima sera",tp:"Pub/Birra",ds:"L'ultima pinta.",du:"~1h 30min",la:51.5194,ln:-0.0743,ad:"84 Commercial St",di:"5 min.",ws:[],bk:null,pla:51.5205,pln:-0.0773},
{t:"21:15",n:"Rientro",tp:"Hotel",ds:"Domani checkout.",la:51.521,ln:-0.0776,ad:"Hotel",di:"",ws:[],bk:null,pla:null,pln:null}]}]},

{id:5,pl:"Mar 31",t:"Partenza: Leadenhall, funivia e Stansted",wt:"7-14\u00b0C",rn:1,dr:"\ud83e\udde5 Comodo. Impermeabile.",wn:"Checkout 11. Trolley tutto il giorno.",km:6,zones:[
{zone:"",items:[
{t:"09:30",n:"Colazione e bagagli",tp:"Hotel",ds:"Preparare tutto.",du:"~1h",la:51.521,ln:-0.0776,ad:"Hotel",di:"",ws:[],bk:null,pla:null,pln:null},
{t:"10:30",n:"Checkout",tp:"Hotel",ds:"Reception (~\u00a35) o portarli.",la:51.521,ln:-0.0776,ad:"Hotel",di:"",ws:[{x:"\u26a0 Entro 11",y:"a"}],bk:null,pla:null,pln:null}]},
{zone:"Ultimi giri",items:[
{t:"10:45",n:"Old Spitalfields Market",tp:"Mercato",ds:"Coperto. Souvenir.",du:"~30 min",la:51.5197,ln:-0.0755,ad:"Horner Sq",di:"3 min.",ws:[],bk:null,pla:51.521,pln:-0.0776},
{t:"11:15",n:"Leadenhall Market",tp:"Attrazione",ds:"Vittoriano, Harry Potter.",du:"~45 min",la:51.5128,ln:-0.0835,ad:"Gracechurch St",di:"16 min.",ws:[],bk:null,pla:51.5197,pln:-0.0755},
{t:"12:00",n:"Emirates Air Line",tp:"Attrazione",ds:"Funivia, \u00a35 Oyster. A/R ~1.5h.",du:"~1h 30min",la:51.5087,ln:0.0175,ad:"Royal Docks",di:"Bank, DLR.",ws:[{x:"Opzionale",y:"i"}],bk:null,pla:51.5128,pln:-0.0835}]},
{zone:"Partenza",items:[
{t:"13:30",n:"Pranzo Liverpool St",tp:"Cibo",ds:"M&S, Pret, Rudy's.",du:"~30 min",la:51.517,ln:-0.083,ad:"Liverpool St",di:"",ws:[],bk:null,pla:null,pln:null},
{t:"14:30",n:"Stansted Express",tp:"Trasporto",ds:"Diretto, ~50 min.",du:"~47 min",la:51.885,ln:0.235,ad:"Stansted",di:"",ws:[],bk:null,pla:51.517,pln:-0.083},
{t:"15:20",n:"Stansted Airport",tp:"Trasporto",ds:"Security, duty free.",la:51.885,ln:0.235,ad:"Stansted",di:"",ws:[],bk:null,pla:null,pln:null},
{t:"19:00",n:"FR2687 \u2192 Cagliari",tp:"Trasporto",ds:"Arrivo 22:45!",la:51.885,ln:0.235,ad:"Stansted",di:"",ws:[],bk:null,pla:null,pln:null}]}]}
];

/* --- Contextual Phrases --- */
var PHRASES_TYPE = {
  "Trasporto":[{it:"Scusi, come arrivo a...?",en:"Excuse me, how do I get to...?"},{it:"Devo cambiare linea?",en:"Do I need to change lines?"},{it:"Qual e' la prossima fermata?",en:"What's the next stop?"},{it:"A che ora parte il prossimo treno?",en:"What time is the next train?"},{it:"Posso pagare con carta contactless?",en:"Can I pay by contactless?"}],
  "Hotel":[{it:"Ho una prenotazione a nome...",en:"I have a booking under the name..."},{it:"A che ora e' il checkout?",en:"What time is checkout?"},{it:"Posso lasciare i bagagli dopo il checkout?",en:"Can I leave my luggage after checkout?"},{it:"La colazione e' inclusa?",en:"Is breakfast included?"},{it:"Potrebbe chiamarmi un taxi?",en:"Could you call me a taxi?"}],
  "Pub/Birra":[{it:"Una pinta della vostra migliore, per favore",en:"A pint of your best, please"},{it:"Due pinte per favore",en:"Two pints, please"},{it:"Servite anche da mangiare?",en:"Do you serve food?"},{it:"Dov'e' il bagno?",en:"Where are the toilets?"},{it:"Il conto, per favore",en:"The bill, please"},{it:"Avete birre alla spina locali?",en:"Do you have local draught beers?"}],
  "Cibo":[{it:"Un tavolo per due, per favore",en:"A table for two, please"},{it:"Posso vedere il menu?",en:"Can I see the menu, please?"},{it:"Cosa mi consiglia?",en:"What do you recommend?"},{it:"Il conto, per favore",en:"The bill, please"},{it:"Posso pagare con carta?",en:"Can I pay by card?"},{it:"Senza glutine, per favore",en:"Gluten-free, please"}],
  "Mercato":[{it:"Quanto costa questo?",en:"How much is this?"},{it:"Posso assaggiare?",en:"Can I try some?"},{it:"Accettate solo contanti?",en:"Do you only accept cash?"},{it:"Me ne da' due, per favore",en:"Can I have two, please?"},{it:"Avete qualcosa di vegano?",en:"Do you have anything vegan?"}],
  "Attrazione":[{it:"Due biglietti, per favore",en:"Two tickets, please"},{it:"C'e' uno sconto per prenotazioni online?",en:"Is there a discount for online bookings?"},{it:"Si possono fare foto?",en:"Are photos allowed?"},{it:"Dove posso lasciare le borse?",en:"Where can I leave my bags?"},{it:"A che ora chiude?",en:"What time do you close?"}],
  "Passeggiata":[{it:"Scusi, sa dove si trova...?",en:"Excuse me, do you know where... is?"},{it:"E' lontano a piedi?",en:"Is it far to walk?"},{it:"Puo' indicarmi la direzione per...?",en:"Can you point me towards...?"}],
  "Panorama":[{it:"Si possono fare foto?",en:"Are photos allowed?"},{it:"C'e' un guardaroba?",en:"Is there a cloakroom?"},{it:"Dov'e' l'ascensore?",en:"Where is the lift?"}],
  "Foto":[{it:"Puo' farci una foto, per favore?",en:"Could you take our photo, please?"},{it:"Scusi, sa cos'e' questo monumento?",en:"Excuse me, do you know what this monument is?"}],
  "Shopping":[{it:"Quanto costa?",en:"How much is this?"},{it:"Posso pagare con carta?",en:"Can I pay by card?"},{it:"Avete una taglia piu' grande/piccola?",en:"Do you have a bigger/smaller size?"}]
};

var PHRASES_STOP = {
  "Stansted Airport":[{it:"Dov'e' lo Stansted Express?",en:"Where is the Stansted Express?"},{it:"Quanto costa il biglietto per Liverpool Street?",en:"How much is a ticket to Liverpool Street?"},{it:"Posso pagare con carta contactless?",en:"Can I pay by contactless?"},{it:"A che ora parte il prossimo treno?",en:"What time is the next train?"},{it:"Dov'e' l'uscita per i treni?",en:"Where is the exit for the trains?"},{it:"Quanto dura il viaggio?",en:"How long is the journey?"}],
  "Hotel Point A":[{it:"Ho una prenotazione a nome...",en:"I have a reservation under the name..."},{it:"La camera ha una finestra?",en:"Does the room have a window?"},{it:"Posso lasciare i bagagli dopo il checkout?",en:"Can I store my luggage after checkout?"},{it:"C'e' un supermercato qui vicino?",en:"Is there a supermarket nearby?"},{it:"A che ora e' il checkout?",en:"What time is checkout?"},{it:"Il wifi e' gratuito?",en:"Is the wifi free?"}],
  "Mikkeller Bar":[{it:"Quali birre avete alla spina oggi?",en:"What do you have on tap today?"},{it:"Mi consiglia qualcosa di leggero?",en:"Can you recommend something light?"},{it:"Fate anche la pizza?",en:"Do you also serve pizza?"},{it:"A che ora chiudete?",en:"What time do you close?"}],
  "Borough Market":[{it:"Posso assaggiare prima di comprare?",en:"Can I taste before I buy?"},{it:"Quanto costa una porzione?",en:"How much is a portion?"},{it:"Cosa mi consiglia come street food?",en:"What would you recommend for street food?"},{it:"Accettate carte?",en:"Do you take cards?"},{it:"C'e' un bagno pubblico qui vicino?",en:"Is there a public toilet nearby?"}],
  "Tower Bridge Exhibition":[{it:"Ho gia' prenotato online",en:"I already booked online"},{it:"Dove posso lasciare lo zaino?",en:"Where can I leave my backpack?"},{it:"Quanto dura la visita?",en:"How long does the visit take?"},{it:"Si puo' salire sulla passerella di vetro?",en:"Can you walk on the glass walkway?"}],
  "Sky Garden":[{it:"Ho una prenotazione per le...",en:"I have a reservation for..."},{it:"Possiamo sederci vicino alla vetrata?",en:"Can we sit near the window?"},{it:"Un cocktail per il compleanno della mia ragazza!",en:"A cocktail for my girlfriend's birthday!"},{it:"A che ora e' il tramonto oggi?",en:"What time is sunset today?"}],
  "SMOKESTAK":[{it:"Ho una prenotazione a nome...",en:"I have a reservation under the name..."},{it:"Qual e' il vostro piatto forte?",en:"What's your signature dish?"},{it:"Vorremmo il brisket per favore",en:"We'd like the brisket, please"},{it:"E' possibile avere un tavolo fuori?",en:"Is it possible to have a table outside?"},{it:"Il conto, per favore",en:"The bill, please"}],
  "Guinness Open Gate":[{it:"Ho una prenotazione",en:"I have a reservation"},{it:"Come funziona il tour?",en:"How does the tour work?"},{it:"Quali birre producete qui?",en:"What beers do you brew here?"},{it:"Dov'e' il cortile esterno?",en:"Where is the outdoor courtyard?"}],
  "Cambio della Guardia":[{it:"A che ora inizia la cerimonia?",en:"What time does the ceremony start?"},{it:"Da dove si vede meglio?",en:"Where's the best spot to watch?"},{it:"Quanto dura?",en:"How long does it last?"}],
  "Rock & Sole Plaice":[{it:"Fish and chips per due, per favore",en:"Fish and chips for two, please"},{it:"Che tipo di pesce avete oggi?",en:"What fish do you have today?"},{it:"Con pure' di piselli, per favore",en:"With mushy peas, please"}],
  "Portobello Road Market":[{it:"Posso avere un prezzo migliore?",en:"Can I get a better price?"},{it:"E' un pezzo originale o una riproduzione?",en:"Is this an original or a reproduction?"},{it:"Avete qualcosa di vintage anni '60?",en:"Do you have anything vintage from the '60s?"}],
  "Camden Market e Stables":[{it:"Qual e' il vostro piatto piu' venduto?",en:"What's your best seller?"},{it:"E' piccante?",en:"Is it spicy?"},{it:"Posso avere meno salsa?",en:"Can I have less sauce?"}]
};
