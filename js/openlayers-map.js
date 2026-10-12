// OpenLayers Map: Kıyı Morfolojisi ve Gizli Koylar (Coastal Morphology & Secret Bays)
// Course: GMT 458 - Web GIS
// Student: Hazal Sıla Yılmaz
// Solutions for Issue 1 (Layer minZoom) and Issue 2 (wrapX: false)

document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('openlayers-map');
  if (!mapElement) return;

  // Initial states
  let olZoomThreshold = 7;
  let isOlWrapDisabled = true;

  // Selected coastal locations across Turkey
  const coastalBays = [
    { name: "Akvaryum Koyu (Kaş)", city: "Antalya", coords: [29.6948, 36.1885], type: "⛵ Sadece Tekne", info: "Kekova batık şehir yakınlarında turkuaz dalış cenneti" },
    { name: "Kral Koyu (Delik Deniz)", city: "Antalya", coords: [32.3382, 36.2086], type: "🚶 Dik Patika", info: "Doğal kaya kemeri altından ulaşılan saklı lagün" },
    { name: "Kabak Koyu", city: "Muğla (Fethiye)", coords: [29.1264, 36.4608], type: "🚶 Patika / Yürüyüş", info: "Likya Yolu üzerindeki el değmemiş kanyon sahili" },
    { name: "Kelebekler Vadisi", city: "Muğla (Fethiye)", coords: [29.1278, 36.4981], type: "⛵ Tekne", info: "350 metrelik sarp kanyon duvarlarının çevrelediği masalsı sahil" },
    { name: "Kurubük Koyu", city: "Muğla (Datça)", coords: [27.5765, 36.6872], type: "🚙 Virajlı Yol", info: "Datça'nın akvaryum berraklığındaki bakir koyu" },
    { name: "Dolungaz Koyu", city: "İzmir (Karaburun)", coords: [26.4352, 38.6478], type: "🚶 Falez Patikası", info: "Turkuaz renkli kireçtaşı kayalıklar arasındaki saklı koy" },
    { name: "Delikli Koy", city: "İzmir (Çeşme)", coords: [26.3312, 38.2582], type: "🚙 Toprak Yol", info: "Beyaz aşınmış doğal kaya oluşumları" },
    { name: "Akvaryum Koyu (Bozcaada)", city: "Çanakkale", coords: [26.0425, 39.7952], type: "🚙 Toprak Yol", info: "Ada güneyindeki meşhur şnorkel noktası" },
    { name: "Sardala Koyu", city: "Kocaeli (Kandıra)", coords: [30.1582, 41.1554], type: "🚶 Doğa Yürüyüşü", info: "Cennet havuzu ve kanyon geçişli Karadeniz koyu" },
    { name: "Gideros Koyu", city: "Kastamonu (Cide)", coords: [32.8854, 41.8682], type: "🚗 Sahil Yolu", info: "Fiyort benzeri yapısıyla göl gibi sakin saklı liman" },
    { name: "Hamsilos Koyu (Fiyordu)", city: "Sinop", coords: [35.0418, 42.0612], type: "🚗 Kolay Ulaşım", info: "Türkiye'nin buzul aşındırmalı tek fiyordu" },
    { name: "Çamburnu Koyu", city: "Trabzon", coords: [40.2115, 40.9254], type: "🚗 Sahil Yolu", info: "Sarıçam ormanlarının denizle kucaklaştığı tabiat parkı" }
  ];

  // Convert to OL Features (EPSG:4326 to EPSG:3857)
  const features = coastalBays.map(bay => {
    const f = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat(bay.coords)),
      name: bay.name,
      city: bay.city,
      type: bay.type,
      info: bay.info
    });
    return f;
  });

  const vectorSource = new ol.source.Vector({
    features: features
  });

  // Vector Layer with minZoom threshold for Issue 1
  const vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    minZoom: olZoomThreshold, // OpenLayers native zoom threshold!
    style: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 9,
        fill: new ol.style.Fill({ color: '#14b8a6' }),
        stroke: new ol.style.Stroke({ color: '#ffffff', width: 2.5 })
      })
    })
  });

  // Tile Source with wrapX: false for Issue 2 (Esri World Street Map - No Watermarks, Free)
  const esriTileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';

  let esriSource = new ol.source.XYZ({
    url: esriTileUrl,
    attributions: 'Tiles &copy; Esri',
    wrapX: !isOlWrapDisabled
  });

  let rasterLayer = new ol.layer.Tile({
    source: esriSource
  });

  // Map View centered on Southern Aegean / Mediterranean coast
  const view = new ol.View({
    center: ol.proj.fromLonLat([29.5, 37.2]),
    zoom: 7, // Zoom 7 ensures markers are visible on load!
    minZoom: 2,
    maxZoom: 18,
    multiWorld: !isOlWrapDisabled
  });

  // Create Map
  const map = new ol.Map({
    target: 'openlayers-map',
    layers: [rasterLayer, vectorLayer],
    view: view
  });

  setTimeout(() => {
    map.updateSize();
  }, 200);

  // Overlay for Popup
  const popupContainer = document.getElementById('ol-popup');
  const popupContent = document.getElementById('ol-popup-content');
  const popupCloser = document.getElementById('ol-popup-closer');

  const overlay = new ol.Overlay({
    element: popupContainer,
    autoPan: {
      animation: {
        duration: 250
      }
    }
  });
  map.addOverlay(overlay);

  if (popupCloser) {
    popupCloser.onclick = function () {
      overlay.setPosition(undefined);
      popupCloser.blur();
      return false;
    };
  }

  // Display popup on feature click
  map.on('singleclick', function (evt) {
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feat) {
      return feat;
    });

    if (feature) {
      const coordinates = feature.getGeometry().getCoordinates();
      popupContent.innerHTML = `
        <div style="font-family: inherit; font-size: 0.9rem; color: #f0fdfa;">
          <span style="font-size: 0.72rem; color: #38bdf8; font-weight: 700; text-transform: uppercase;">
            ${feature.get('city')} • ${feature.get('type')}
          </span>
          <h4 style="margin: 4px 0; font-size: 1.05rem; color: #ffffff; font-weight: 800;">
            🌊 ${feature.get('name')}
          </h4>
          <p style="margin: 0; color: #94a3b8; font-size: 0.82rem;">
            ${feature.get('info')}
          </p>
        </div>
      `;
      overlay.setPosition(coordinates);
    } else {
      overlay.setPosition(undefined);
    }
  });

  map.on('pointermove', function (e) {
    const pixel = map.getEventPixel(e.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  });

  // UI Elements
  const olCurrentZoomEl = document.getElementById('ol-current-zoom');
  const olThresholdValEl = document.getElementById('ol-threshold-val');
  const olThresholdSlider = document.getElementById('ol-threshold-slider');
  const olMarkerStatusEl = document.getElementById('ol-marker-status');
  const olWrapToggle = document.getElementById('ol-wrap-toggle');
  const olWrapStatusEl = document.getElementById('ol-wrap-status');

  function updateOlZoomStatus() {
    const currentZoom = Math.round(view.getZoom() || 7);
    if (olCurrentZoomEl) olCurrentZoomEl.textContent = currentZoom;

    if (currentZoom >= olZoomThreshold) {
      if (olMarkerStatusEl) {
        olMarkerStatusEl.innerHTML = `<span style="color:#10b981;">●</span> Koylar Görünür (Zoom ${currentZoom} ≥ ${olZoomThreshold})`;
        olMarkerStatusEl.className = 'map-status-pill badge-emerald';
      }
    } else {
      if (olMarkerStatusEl) {
        olMarkerStatusEl.innerHTML = `<span style="color:#f43f5e;">●</span> Çakışmayı Önlemek İçin Gizlendi (Zoom ${currentZoom} < ${olZoomThreshold})`;
        olMarkerStatusEl.className = 'map-status-pill badge-rose';
      }
    }
  }

  view.on('change:resolution', updateOlZoomStatus);

  if (olThresholdSlider) {
    olThresholdSlider.addEventListener('input', (e) => {
      olZoomThreshold = parseInt(e.target.value, 10);
      if (olThresholdValEl) olThresholdValEl.textContent = olZoomThreshold;
      vectorLayer.setMinZoom(olZoomThreshold);
      updateOlZoomStatus();
    });
  }

  if (olWrapToggle) {
    olWrapToggle.addEventListener('change', (e) => {
      isOlWrapDisabled = e.target.checked;

      const newSource = new ol.source.XYZ({
        url: esriTileUrl,
        attributions: 'Tiles &copy; Esri',
        wrapX: !isOlWrapDisabled
      });
      rasterLayer.setSource(newSource);

      if (isOlWrapDisabled) {
        if (olWrapStatusEl) {
          olWrapStatusEl.textContent = "Dünya Tekrarı Önleme: AÇIK (wrapX: false)";
          olWrapStatusEl.className = "map-status-pill badge-cyan";
        }
      } else {
        if (olWrapStatusEl) {
          olWrapStatusEl.textContent = "Dünya Tekrarı Önleme: KAPALI (Tekrarlıyor)";
          olWrapStatusEl.className = "map-status-pill badge-amber";
        }
      }
    });
  }

  updateOlZoomStatus();
});
