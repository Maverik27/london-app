// === CONFIG ===
const DEBUG = true; // true = usa Trafalgar Square, false = usa GPS reale

// === GEO ===
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

// === LINK OVERRIDE ===
document.addEventListener("click", function(e) {
    const link = e.target.closest('a[href*="citymapper.com/directions"]');
    if (!link) return;
    e.preventDefault();
    const url = new URL(link.href);

    if (DEBUG) {
        // TEST MODE: Trafalgar Square
        url.searchParams.set("startcoord", "51.5080,-0.1281");
        url.searchParams.set("startname", "Trafalgar Square");
    } else {
        if (!window.USER_POS) return;
        url.searchParams.set("startcoord", window.USER_POS.lat + "," + window.USER_POS.lng);
    }
    window.open(url.toString(), "_blank");
});
