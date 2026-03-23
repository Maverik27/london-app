// === GEO OVERRIDE START ===

// Salvo posizione utente
window.USER_POS = null;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function(p) {
      window.USER_POS = {
        lat: p.coords.latitude,
        lng: p.coords.longitude
      };
    },
    function() {
      window.USER_POS = null;
    }
  );
}

// Intercetto click sui link Citymapper
document.addEventListener("click", function(e){
  const link = e.target.closest('a[href*="citymapper.com/directions"]');
  if (!link) return;
  //if (!window.USER_POS) return; // fallback hotel
  e.preventDefault();
  const url = new URL(link.href);
  //url.searchParams.set("startcoord", window.USER_POS.lat + "," + window.USER_POS.lng);

  // === TEST MODE: Trafalgar Square ===
  const TEST_START = "51.5080,-0.1281";
  url.searchParams.set("startcoord", TEST_START);
  url.searchParams.set("startname", "Trafalgar Square");
  // === TEST MODE: Trafalgar Square ===
  
  window.open(url.toString(), "_blank");
});

// === GEO OVERRIDE END ===
