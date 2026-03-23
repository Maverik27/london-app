# 🇬🇧 London App

PWA per pianificare e vivere un viaggio a Londra. Timeline interattiva, meteo live, trasporti TfL, pint counter e molto altro.

## Funzionalità

**📅 Timeline** - Itinerario giorno per giorno con zone colorate, orari, descrizioni, indicazioni stradali e timer alla prossima tappa.

**🗺 Mappa** - Mappa Leaflet con marker delle tappe del giorno e geolocalizzazione GPS.

**✏️ Modifica itinerario** - Aggiungi, modifica, riordina ed elimina tappe. Cerca nuovi luoghi su OpenStreetMap con tipo e coordinate automatiche.

**💬 Frasi utili** - Frasi contestuali italiano/inglese per ogni tipo di tappa (pub, ristorante, metro, hotel...). Pronuncia vocale e traduttore libero.

**🧭 Navigazione** - Deep link a Citymapper (partenza da GPS) e Google Maps per ogni tappa.

**☀️ Meteo** - Previsioni 14 giorni da Open-Meteo con hero card, accordion dettagli, icone vento a ondine, alba/tramonto e consigli abbigliamento. I giorni del viaggio sono evidenziati.

**🚇 Trasporti** - Stato in tempo reale di tutte le linee TfL (metro, DLR, Elizabeth, Overground, Tram). Aggiornamento automatico all'apertura.

**🍺 Pint Counter** - Beer passport con tutti i pub dell'itinerario. Conta le pinte, sblocca achievement (First Pint, Hat Trick, Pub Crawler...) e consulta statistiche.

**📷 Diario** - Scatta foto o caricale dalla galleria, aggiungi note per ogni tappa. Foto compresse automaticamente. Esportabile come HTML.

**💱 Convertitore** - EUR/GBP con tasso aggiornato in tempo reale.

**🔍 Cerca** - Trova tappe nell'itinerario o cerca nuovi luoghi su OpenStreetMap per aggiungerli.

**👆 Swipe** - Scorri tra giorni nella timeline e tra tab con swipe laterale.

**🌙 Tema** - Dark e light mode dal menu.

**🔒 PIN** - Schermata di blocco a 6 cifre.

## Struttura file

```
index.html           → Shell HTML
styles.css           → Stili (dark/light mode)
config.js            → PIN, versione, URL API, parametri
data.js              → Itinerario, frasi, icone SVG
app.js               → Logica applicativa
favicon.png          → Icona 32px
apple-touch-icon.png → Icona 180px
pint-icon.png        → Icona Pint Counter
```

## Configurazione

Tutte le impostazioni modificabili sono in `config.js`:

| Parametro | Descrizione |
|---|---|
| `pin` | PIN di accesso (default: `000000`) |
| `version` | Versione app (cambiare per forzare reset itinerario) |
| `startDate` / `endDate` | Date del viaggio |
| `hotelLat` / `hotelLng` | Coordinate hotel |
| `stopTypes` | Tipi di tappa disponibili |

## API utilizzate

| Servizio | Utilizzo | Costo |
|---|---|---|
| [Open-Meteo](https://open-meteo.com) | Previsioni meteo 14 giorni | Gratuito |
| [TfL API](https://api.tfl.gov.uk) | Stato linee trasporto Londra | Gratuito |
| [Nominatim](https://nominatim.openstreetmap.org) | Ricerca luoghi (OpenStreetMap) | Gratuito |
| [MyMemory](https://mymemory.translated.net) | Traduzione italiano/inglese | Gratuito |
| [ExchangeRate API](https://exchangerate-api.com) | Tasso cambio EUR/GBP | Gratuito |
| [Leaflet](https://leafletjs.com) + OpenStreetMap | Mappa interattiva | Gratuito |

Nessuna API key richiesta.

## Hosting

Pensata per GitHub Pages (HTTPS necessario per GPS). Carica tutti i file nella root del repository e attiva Pages.

## Dati utente

Tutti i dati (modifiche itinerario, pinte, diario, note, preferenze) sono salvati in `localStorage` del browser. Ogni dispositivo ha i propri dati indipendenti. Nessun dato viene inviato a server esterni.

## Versioning

Quando `config.js > version` cambia, l'itinerario si resetta automaticamente al primo avvio. Le pinte, il diario e le note vengono mantenuti.

---

*London App - Mar 2026* 🐈‍⬛
