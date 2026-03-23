/*==============================================
  LONDON APP - CONFIGURATION
  Edit these values without touching the code
==============================================*/

var CONFIG = {
  // App
  version: "1.0.6",
  appName: "London App",
  footer: "London App - Mar 2026 \ud83d\udc08\u200d\u2b1b",

  // Security
  pin: "000000",

  // Travel dates
  startDate: "2026-03-26",
  endDate: "2026-03-31",

  // Hotel
  hotelLat: 51.521,
  hotelLng: -0.0776,
  hotelAddr: "13-15 Folgate St, E1 6BX",

  // Weather
  weatherLat: 51.5074,
  weatherLng: -0.1278,
  weatherTz: "Europe/London",

  // APIs
  nominatimUrl: "https://nominatim.openstreetmap.org/search",
  tflUrl: "https://api.tfl.gov.uk/Line",
  weatherUrl: "https://api.open-meteo.com/v1/forecast",
  translateUrl: "https://api.mymemory.translated.net/get",

  // TfL lines to monitor
  tflLines: ["circle","district","central","northern","jubilee","hammersmith-city","dlr","elizabeth"],

  // Icon paths (relative)
  iconFavicon: "favicon.png",
  iconApple: "apple-touch-icon.png",
  iconPint: "pint-icon.png",

  // Stop types available for editing
  stopTypes: ["Pub/Birra","Cibo","Attrazione","Mercato","Trasporto","Hotel","Foto","Shopping"]
};
