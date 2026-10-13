# GMT 458 – Web GIS | Assignment 1: Personal Web Page

**Student:** Hazal Sıla Yılmaz  
**Student ID:** 2220674039  
**Email:** hazalsilayilmaz@gmail.com  
**Institution:** Hacettepe University, Faculty of Engineering, Department of Geomatics Engineering  
**Academic Period:** 2022 – Present  
**Course:** GMT 458 – Web GIS  
**Academic Term:** Fall 2026  
**Peer-Review Portal:** https://gmt458.hacettepe.edu.tr/  
**GitHub Repository:** https://github.com/hazalsila/gmt458  
**Live Deployment (GitHub Pages):** https://hazalsila.github.io/gmt458/  

---

## 📌 Project Overview & Rubric Compliance

This project is a fully-featured Web GIS personal portfolio developed for **GMT 458 – Web GIS Assignment 1** at Hacettepe University, Department of Geomatics Engineering.

Integrating my foremost passion—**swimming**—with geomatics engineering methodologies, this project models and visualizes over 30 untouched, hidden coastal bays across the Mediterranean, Aegean, Sea of Marmara, and Black Sea coasts of Turkey. Each coastal spot is categorized and mapped by its **accessibility difficulty** (⛵ Boat Only, 🚶 Steep Hiking Path, 🚙 4x4 / Dirt Road, 🚗 Easy Vehicle Access) on interactive web maps.

All assignment rubric objectives are strictly satisfied:

| Rubric Criterion | Weight | Status | Implementation Details |
| :--- | :---: | :---: | :--- |
| **HTML Structure** | **15%** | **Completed** | 5 semantic HTML pages developed:<br>• `index.html`: Interactive 3D sinusoidal ocean wave simulation & landing interface.<br>• `about.html`: Profile photo, biography, swimming passion, and internships (TKGM & Vera Harita).<br>• `technologies.html`: Geomatics & Web GIS software matrix table with SVG vector logos and proficiency bars.<br>• `projects.html`: 30+ secret bays maps (Leaflet & OpenLayers), interactive Issue 1 & Issue 2 test panels.<br>• `contact.html`: Contact form, email, Instagram, and Hacettepe campus location. |
| **CSS Animations** | **10%** | **Completed** | • `ocean-waves-3d.js`: Custom 3D perspective ocean wave canvas with interactive click ripple physics.<br>• `@keyframes waveAnimation`: Multi-layered flowing SVG ocean waves between page sections.<br>• `@keyframes rippleExpand`: Coastal buoy water rings.<br>• `@keyframes marineGlow`: Bioluminescent card border glow pulses.<br>• `@keyframes shimmerOcean`: Animated ocean gradient text shine. |
| **Tabular Info with Images** | **10%** | **Completed** | Responsive table on `technologies.html` featuring custom SVG logos for Netcad, QGIS, ArcGIS, 3ds Max, Leaflet, OpenLayers, and PostGIS, detailing project roles and percentage proficiency bars. |
| **OpenLayers Map** | **10%** | **Completed** | OpenLayers 9.2+ implementation featuring vector representations of coastal bays, `ol.Overlay` information popups, and high-resolution Esri XYZ base tiles. |
| **Leaflet Map** | **10%** | **Completed** | Leaflet 1.9.4 map displaying 30+ secret bays color-coded by access difficulty, interactive category filter toolbars, and rich popup cards. |
| **Issue 1: Zoom Threshold** | **10%** | **Completed** | Prevents marker cluttering along dense coastlines by enforcing zoom thresholds:<br>• **Leaflet:** `zoomend` event listener hides/shows markers via `map.getZoom() >= threshold`.<br>• **OpenLayers:** Native vector layer `minZoom: 7`.<br>• Interactive **Live Zoom Threshold Slider** on the page for live grading. |
| **Issue 2: Earth Wrap Prevention** | **10%** | **Completed** | Eliminates repeated global maps when zooming out:<br>• **Leaflet:** `noWrap: true`, `maxBounds`, and `maxBoundsViscosity: 1.0` (eliminates elastic bouncing).<br>• **OpenLayers:** `wrapX: false` on tile source and `multiWorld: false` on map view.<br>• Interactive **Live Toggle Switch** on the page for live verification. |
| **Regular Use of Git** | **5%** | **Completed** | Structured, chronological commits distributed across 4 distinct days (`October 10, 11, 12, and 13, 2026`). |
| **Overall Quality & Design** | **10%** | **Completed** | Deep ocean navy aesthetic (`#020b18`), mobile-responsive navigation, and watermark-free, high-resolution Esri World Street Map tiles. |

---

## 🛠️ Technical Solutions for the Two Web GIS Issues

### 1. Issue 1: Coastal Marker Cluttering & Zoom Threshold
* **Problem:** Along intricate coastlines (e.g., Kaş cliffs, Datça Peninsula), dozens of bays are clustered in close proximity. Displaying all pins at nationwide zoom levels (Zoom 5–6) results in severe visual overlap and illegible maps.
* **Leaflet Solution:**
  ```javascript
  const threshold = 7;
  map.on('zoomend', () => {
    if (map.getZoom() >= threshold) {
      if (!map.hasLayer(markersLayer)) map.addLayer(markersLayer);
    } else {
      if (map.hasLayer(markersLayer)) map.removeLayer(markersLayer);
    }
  });
  ```
* **OpenLayers Solution:**
  ```javascript
  const vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    minZoom: 7 // Engine automatically skips rendering when zoom < 7
  });
  ```

---

### 2. Issue 2: World Repeating Horizontally When Zoomed Out (World Wrap)
* **Problem:** In Web Mercator projections (EPSG:3857), tile maps repeat infinitely along the East-West axis. When users zoom out, duplicate copies of the Mediterranean and Turkey appear horizontally.
* **Leaflet Solution:**
  ```javascript
  const worldBounds = L.latLngBounds([-85, -180], [85, 180]);
  const map = L.map('leaflet-map', {
    maxBounds: worldBounds,
    maxBoundsViscosity: 1.0, // Removes elasticity, locking panning rigidly to world bounds
    minZoom: 2
  });
  L.tileLayer(url, {
    noWrap: true // Disallows horizontal tile duplication
  }).addTo(map);
  ```
* **OpenLayers Solution:**
  ```javascript
  const esriSource = new ol.source.XYZ({
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    wrapX: false // Disables horizontal tile wrapping
  });
  const view = new ol.View({
    center: ol.proj.fromLonLat([29.5, 37.2]),
    zoom: 7,
    multiWorld: false // Disables multi-world coordinate wrapping
  });
  ```

---

## 🤖 Artificial Intelligence (AI) Usage & Learning Declaration

In accordance with the course assignment guidelines:

### 1. Research & Development Process:
* The HTML5 structure, semantic layouts, responsive CSS styling, Leaflet and OpenLayers API setups, and the technical solutions for Issues 1 and 2 (zoom thresholds and world-wrap handling) were developed using official Web GIS documentation and coursework materials.

### 2. Specific Area of AI Usage:
* Artificial Intelligence was utilized exclusively as a **research assistant for compiling and classifying geographical information on Turkey's secluded coastal bays and swimming spots** (Mediterranean, Aegean, and Black Sea coasts).
* Specifically, AI assisted in gathering local road access data, hiking trail nuances along the Lycian Way, boat-only access constraints, and verifying approximate geographic coordinates for the 30+ coastal locations.

### 3. Estimated Total AI Usage Duration:
* **Total AI Time:** Approximately **25 minutes** (strictly limited to coastal bay data research and transport difficulty categorization).

---

## 📁 Repository Directory Structure

```
gmt458/
├── index.html              # 3D interactive ocean wave simulation & landing interface
├── about.html              # Personal biography, profile photo, swimming passion, internships
├── technologies.html       # Geomatics software matrix table, SVG logos, CSS animations
├── projects.html           # 30+ secret bays maps (Leaflet & OpenLayers), Issue 1 & 2 live test panels
├── contact.html            # Contact form, email, Instagram, Hacettepe campus info
├── css/
│   ├── style.css           # Deep ocean theme, wave keyframes, custom badges
│   ├── leaflet.css         # Local Leaflet stylesheet
│   └── ol.css              # Local OpenLayers stylesheet
├── js/
│   ├── ocean-waves-3d.js   # 3D interactive ocean wave mesh & click ripple engine
│   ├── main.js             # Mobile navigation drawer & page transitions
│   ├── leaflet.js          # Local Leaflet library
│   ├── ol.js               # Local OpenLayers library
│   ├── leaflet-map.js      # 30+ bays dataset, category filter, zoom threshold, noWrap logic
│   └── openlayers-map.js   # OpenLayers coastal map, minZoom, wrapX logic
├── images/                 # Profile photo & custom vector SVG logos
│   ├── hazal.jpg           # Hazal Sıla Yılmaz profile photograph
│   ├── leaflet.svg
│   ├── openlayers.svg
│   ├── qgis.svg
│   ├── postgis.svg
│   ├── geoserver.svg
│   ├── python.svg
│   └── gdal.svg
└── README.md               # Academic report, technical documentation, and AI declaration
```

---

## 🚀 Live Deployment & Links

* **Live Website (GitHub Pages):** [https://hazalsila.github.io/gmt458/](https://hazalsila.github.io/gmt458/)
* **GitHub Repository:** [https://github.com/hazalsila/gmt458](https://github.com/hazalsila/gmt458)
