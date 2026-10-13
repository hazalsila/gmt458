// Leaflet Map Implementation: Türkiye'nin Gizli Koyları (Secret Bays of Turkey)
// Course: GMT 458 - Web GIS
// Student: Hazal Sıla Yılmaz
// Solutions for Issue 1 (Zoom Threshold) and Issue 2 (Earth Wrap Prevention)

document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('leaflet-map');
  if (!mapElement) return;

  // --- Configuration & State ---
  let zoomThreshold = 7;
  let isWrapPreventionEnabled = true;
  let activeCategory = 'all';

  // Map Bounds for Issue 2 (World boundary coordinates)
  const worldBounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));

  // Initialize Map centered on Southern Aegean & Mediterranean coast
  const map = L.map('leaflet-map', {
    center: [37.2, 29.5], // Center of Turkey's scenic coastlines
    zoom: 7, // Zoom 7 ensures markers are visible immediately on load!
    minZoom: 2,
    maxZoom: 18,
    maxBounds: worldBounds,
    maxBoundsViscosity: 1.0
  });

  // Base Tile Layer - Esri World Street Map (100% Free, No Watermark, No API Key, No 403 block)
  const tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';

  let tileLayer = L.tileLayer(tileUrl, {
    attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a> | GMT 458 Web GIS',
    maxZoom: 19,
    noWrap: isWrapPreventionEnabled
  }).addTo(map);

  // Invalidate size to ensure container dimensions are properly rendered
  setTimeout(() => {
    map.invalidateSize();
  }, 200);

  // --- Secret Bays Dataset Across Turkey's Coastlines ---
  const secretBays = [
    // --- AKDENİZ BÖLGESİ ---
    {
      name: "Akvaryum Koyu",
      city: "Antalya (Kaş)",
      sea: "Akdeniz",
      difficulty: "tekne",
      diffLabel: "Sadece Tekne Ulaşımı",
      coords: [36.1885, 29.6948],
      icon: "⛵",
      desc: "Kekova batık şehir yakınlarında, cam gibi berrak turkuaz sulara sahip dalış cenneti."
    },
    {
      name: "Hidayet Koyu",
      city: "Antalya (Kaş)",
      sea: "Akdeniz",
      difficulty: "kolay",
      diffLabel: "Kolay Araç Ulaşımı",
      coords: [36.1952, 29.6234],
      icon: "🚗",
      desc: "Çukurbağ Yarımadası'nda zeytin ağaçlarıyla çevrili, deniz kaplumbağalarının uğrak noktası."
    },
    {
      name: "Alacasu Cennet Koyu",
      city: "Antalya (Kemer)",
      sea: "Akdeniz",
      difficulty: "toprak",
      diffLabel: "4x4 / Toprak Yol",
      coords: [36.5412, 30.5651],
      icon: "🚙",
      desc: "Phaselis antik kenti yakınında, çam ormanlarının denizle kucaklaştığı korunaklı koy."
    },
    {
      name: "Korsan Koyu",
      city: "Antalya (Kumluca)",
      sea: "Akdeniz",
      difficulty: "toprak",
      diffLabel: "Toprak Yol / Patika",
      coords: [36.2625, 30.4395],
      icon: "🚙",
      desc: "Gelidonya Feneri eteğinde, antik Melanippe limanının kalıntıları arasında masmavi bir sığınak."
    },
    {
      name: "Kral Koyu (Delik Deniz)",
      city: "Antalya (Gazipaşa)",
      sea: "Akdeniz",
      difficulty: "patika",
      diffLabel: "Dik Patika / Yürüyüş",
      coords: [36.2086, 32.3382],
      icon: "🚶",
      desc: "Antiochia ad Cragum kenti altında devasa doğal kaya kemeri içinden denize girilen saklı lagün."
    },
    {
      name: "Tisan Koyu",
      city: "Mersin (Silifke)",
      sea: "Akdeniz",
      difficulty: "toprak",
      diffLabel: "Virajlı Dağ Yolu",
      coords: [36.1495, 33.6895],
      icon: "🚙",
      desc: "Kilikya Yarımadası'nda beyaz kumları ve iki taraflı deniziyle Akdeniz'in saklı incisi."
    },

    // --- EGE & LİKYA BÖLGESİ ---
    {
      name: "Soğuksu Koyu",
      city: "Muğla (Fethiye / Kayaköy)",
      sea: "Ege / Akdeniz",
      difficulty: "patika",
      diffLabel: "Likya Yolu Patikası",
      coords: [36.5621, 29.0792],
      icon: "🚶",
      desc: "Kayaköy'den 40 dakikalık orman yürüyüşü ile ulaşılan, kayalardan buz gibi tatlı su kaynayan koy."
    },
    {
      name: "Kabak Koyu",
      city: "Muğla (Fethiye)",
      sea: "Ege",
      difficulty: "patika",
      diffLabel: "Patika / Dik İniş",
      coords: [36.4608, 29.1264],
      icon: "🚶",
      desc: "Likya Yolu üzerindeki el değmemiş kanyon tabiatı, kamp alanları ve serin suları."
    },
    {
      name: "Kelebekler Vadisi",
      city: "Muğla (Fethiye)",
      sea: "Ege",
      difficulty: "tekne",
      diffLabel: "Sadece Tekne Ulaşımı",
      coords: [36.4981, 29.1278],
      icon: "⛵",
      desc: "350 metre yüksekliğindeki sarp kanyon duvarlarının çevrelediği, masalsı turkuaz plaj."
    },
    {
      name: "Cennet Koyu (Balaban)",
      city: "Muğla (Fethiye)",
      sea: "Ege",
      difficulty: "patika",
      diffLabel: "Likya Patikası / Tekne",
      coords: [36.4821, 29.1124],
      icon: "🚶",
      desc: "Kara yolu olmayan, çam ormanı kokularının dalga seslerine karıştığı bakir kıyı."
    },
    {
      name: "Sarsala Koyu",
      city: "Muğla (Dalaman)",
      sea: "Ege",
      difficulty: "kolay",
      diffLabel: "Virajlı Asfalt Yol",
      coords: [36.6575, 28.8542],
      icon: "🚗",
      desc: "Kapukargın göllerinin arasından geçerek ulaşılan, rüzgara kapalı durgun deniz göleti."
    },
    {
      name: "Bedri Rahmi Koyu (Taşyaka)",
      city: "Muğla (Göcek)",
      sea: "Ege",
      difficulty: "tekne",
      diffLabel: "Sadece Tekne Ulaşımı",
      coords: [36.6974, 28.8685],
      icon: "⛵",
      desc: "Ünlü ressam Bedri Rahmi Eyüboğlu'nun 1974'te bir kayaya çizdiği balık resmi ve Likya kaya mezarları."
    },
    {
      name: "Hamam Koyu (Kleopatra)",
      city: "Muğla (Göcek)",
      sea: "Ege",
      difficulty: "tekne",
      diffLabel: "Sadece Tekne Ulaşımı",
      coords: [36.6432, 28.8584],
      icon: "⛵",
      desc: "Denizin içinde yarısı batık tarihi Roma hamamı kalıntıları arasında yüzme imkanı."
    },
    {
      name: "Amos Koyu",
      city: "Muğla (Bozburun / Turunç)",
      sea: "Ege",
      difficulty: "kolay",
      diffLabel: "Kolay Asfalt Yol",
      coords: [36.7585, 28.2642],
      icon: "🚗",
      desc: "Antik Amos tiyatrosu kalıntılarının altındaki çakıl plaj ve cam gibi su."
    },
    {
      name: "Kumlubük Koyu",
      city: "Muğla (Marmaris)",
      sea: "Ege",
      difficulty: "kolay",
      diffLabel: "Marmaris Sahil Yolu",
      coords: [36.7412, 28.2715],
      icon: "🚗",
      desc: "Geniş kumsalı, berrak derin suları ve yeşil tepeleriyle Marmaris'in en huzurlu köşesi."
    },
    {
      name: "Bördübet Koyu",
      city: "Muğla (Marmaris)",
      sea: "Ege",
      difficulty: "toprak",
      diffLabel: "Orman Yolu (Toprak)",
      coords: [36.8185, 28.0582],
      icon: "🚙",
      desc: "Adını İngiliz askerlerinin 'Birds' Bed' demesinden alan, kuş sesleri ve nehirle birleşen saklı deniz."
    },
    {
      name: "Boncuk Koyu",
      city: "Muğla (Gökova)",
      sea: "Ege",
      difficulty: "toprak",
      diffLabel: "Toprak Sahil Yolu",
      coords: [36.9854, 28.2312],
      icon: "🚙",
      desc: "Kum köpekbalıklarının üreme alanı olan, palmiye ağaçlarıyla çevrili berrak koruma alanı."
    },
    {
      name: "Sedir Adası (Kleopatra)",
      city: "Muğla (Karasöğüt / Ula)",
      sea: "Ege",
      difficulty: "tekne",
      diffLabel: "Tekne / Dolmuş Motoru",
      coords: [36.9925, 28.2045],
      icon: "⛵",
      desc: "Jeolojik oolitik altın sarısı özel kumu ve antik Cedrae kenti kalıntıları."
    },
    {
      name: "Palamutbükü",
      city: "Muğla (Datça)",
      sea: "Ege",
      difficulty: "kolay",
      diffLabel: "Datça Asfalt Yolu",
      coords: [36.6712, 27.5085],
      icon: "🚗",
      desc: "Datça Yarımadası'nın meşhur badem çiçekleri ve turkuaz kristal suları."
    },
    {
      name: "Ovabükü",
      city: "Muğla (Datça)",
      sea: "Ege",
      difficulty: "kolay",
      diffLabel: "Virajlı Asfalt Yol",
      coords: [36.6785, 27.5624],
      icon: "🚗",
      desc: "Zeytin bahçeleri ve begonvillerle süslü, sessiz sakin Datça bükü."
    },
    {
      name: "Kurubük Koyu",
      city: "Muğla (Datça)",
      sea: "Ege",
      difficulty: "toprak",
      diffLabel: "Yol Kenarı / Taşlık Patika",
      coords: [36.6872, 27.5765],
      icon: "🚙",
      desc: "Ovabükü ile Palamutbükü arasında hiçbir tesis bulunmayan tamamen bakir kanyon koyu."
    },
    {
      name: "Domuzbükü (Domuz Çukuru)",
      city: "Muğla (Datça)",
      sea: "Ege",
      difficulty: "tekne",
      diffLabel: "Sadece Tekne / Zorlu Patika",
      coords: [36.6842, 27.6542],
      icon: "⛵",
      desc: "Kara yolu olmayan, çam ormanı ve deniz mağaralarıyla kaplı saklı vaha."
    },
    {
      name: "Cennet Koyu",
      city: "Muğla (Bodrum / Göltürkbükü)",
      sea: "Ege",
      difficulty: "toprak",
      diffLabel: "Orman İçi Toprak Yol",
      coords: [37.1352, 27.4785],
      icon: "🚙",
      desc: "Bodrum'un en berrak sularına ve zengin deniz dibi faunasına sahip saklı koyu."
    },
    {
      name: "Çökertme Koyu",
      city: "Muğla (Milas)",
      sea: "Ege",
      difficulty: "kolay",
      diffLabel: "Asfalt Sahil Yolu",
      coords: [37.0012, 27.7954],
      icon: "🚗",
      desc: "Türküye konu olmuş, rüzgardan korunaklı tarihi balıkçı koyu."
    },
    {
      name: "Dolungaz Koyu",
      city: "İzmir (Karaburun)",
      sea: "Ege",
      difficulty: "patika",
      diffLabel: "Falez Patikası",
      coords: [38.6478, 26.4352],
      icon: "🚶",
      desc: "Karaburun falezleri arasında saklı, turkuaz renkli kireçtaşı kayalıklar ve kamp noktası."
    },
    {
      name: "Delikli Koy",
      city: "İzmir (Çeşme / Alaçatı)",
      sea: "Ege",
      difficulty: "toprak",
      diffLabel: "Toprak Yol",
      coords: [38.2582, 26.3312],
      icon: "🚙",
      desc: "Rüzgar ve dalgaların aşındırdığı beyaz doğal kalker kaya oluşumları ve serin sular."
    },
    {
      name: "Sazlıca Koyu",
      city: "İzmir (Yeni Foça)",
      sea: "Ege",
      difficulty: "kolay",
      diffLabel: "Foça Sahil Yolu",
      coords: [38.7185, 26.8542],
      icon: "🚗",
      desc: "Eski ve Yeni Foça arasında dalış kulüplerinin ve yüzücülerin gözdesi soğuk kaynaklı koy."
    },
    {
      name: "Badembükü",
      city: "İzmir (Karaburun)",
      sea: "Ege",
      difficulty: "toprak",
      diffLabel: "Virajlı Toprak Yol",
      coords: [38.5982, 26.3654],
      icon: "🚙",
      desc: "Narenciye bahçelerinin bittiği yerde başlayan geniş ve vahşi Ege plajı."
    },
    {
      name: "Akvaryum Koyu",
      city: "Çanakkale (Bozcaada)",
      sea: "Ege",
      difficulty: "toprak",
      diffLabel: "Ada Toprak Yolu",
      coords: [39.7952, 26.0425],
      icon: "🚙",
      desc: "Bozcaada'nın güneyinde, cam gibi berrak sularında şnorkelle yüzülen doğal deniz akvaryumu."
    },
    {
      name: "Sivrice Koyu",
      city: "Çanakkale (Assos)",
      sea: "Ege",
      difficulty: "kolay",
      diffLabel: "Kolay Asfalt Yol",
      coords: [39.4678, 26.1782],
      icon: "🚗",
      desc: "Midilli Adası manzaralı, tarihi taş evlerin hemen altında berrak derin sular."
    },
    {
      name: "Ortunç Koyu",
      city: "Balıkesir (Ayvalık / Cunda)",
      sea: "Ege",
      difficulty: "kolay",
      diffLabel: "Milli Park Yolu",
      coords: [39.3491, 26.6342],
      icon: "🚗",
      desc: "Cunda Adası'nın en ucunda mavi bayraklı, dalgasız tabiat parkı koyu."
    },
    {
      name: "Turanköy Koyu",
      city: "Balıkesir (Erdek)",
      sea: "Marmara",
      difficulty: "toprak",
      diffLabel: "Kapıdağ Orman Yolu",
      coords: [40.4851, 27.7584],
      icon: "🚙",
      desc: "Kapıdağ Yarımadası'nın kuzeyinde çam ormanlarıyla kaplı, Marmara'nın en temiz kumu."
    },
    {
      name: "Sardala Koyu",
      city: "Kocaeli (Kandıra)",
      sea: "Karadeniz",
      difficulty: "patika",
      diffLabel: "Doğa Yürüyüşü / Patika",
      coords: [41.1554, 30.1582],
      icon: "🚶",
      desc: "Kandıra falezleri arasında gizli cennet havuzu, mağaraları ve kanyon geçişi."
    },
    {
      name: "Kilimli Koyu (Ağva)",
      city: "İstanbul (Şile)",
      sea: "Karadeniz",
      difficulty: "patika",
      diffLabel: "Falez Patikası",
      coords: [41.1495, 29.8785],
      icon: "🚶",
      desc: "Beyaz tebeşir falezleri ve doğal kemerleriyle Karadeniz'in vahşi doğa harikası."
    },

    // --- KARADENİZ BÖLGESİ ---
    {
      name: "Gideros Koyu",
      city: "Kastamonu (Cide)",
      sea: "Karadeniz",
      difficulty: "kolay",
      diffLabel: "Karadeniz Sahil Yolu",
      coords: [41.8682, 32.8854],
      icon: "🚗",
      desc: "Amazonların saklı limanı; fiyort benzeri yapısıyla Karadeniz fırtınalarında bile göl gibi durgun."
    },
    {
      name: "Hamsilos Koyu (Fiyordu)",
      city: "Sinop (Merkez)",
      sea: "Karadeniz",
      difficulty: "kolay",
      diffLabel: "Tabiat Parkı Yolu",
      coords: [42.0612, 35.0418],
      icon: "🚗",
      desc: "Türkiye'nin buzul aşındırmalı tek fiyort oluşumu; yemyeşil çamların arasına giren deniz körfezi."
    },
    {
      name: "Göldere Koyu",
      city: "Bartın (Amasra)",
      sea: "Karadeniz",
      difficulty: "toprak",
      diffLabel: "Dik Toprak İniş",
      coords: [41.7612, 32.4785],
      icon: "🚙",
      desc: "Amasra ve Kurucaşile arasında el değmemiş dağ yamaçları eteğinde kristal sular."
    },
    {
      name: "Yason Burnu Koyu",
      city: "Ordu (Perşembe)",
      sea: "Karadeniz",
      difficulty: "kolay",
      diffLabel: "Kolay Asfalt Yol",
      coords: [41.1315, 37.6715],
      icon: "🚗",
      desc: "Argonotlar efsanesinin geçtiği tarihi kilise yarımadası ve tertemiz dalış koyu."
    },
    {
      name: "Çamburnu Koyu",
      city: "Trabzon (Sürmene)",
      sea: "Karadeniz",
      difficulty: "kolay",
      diffLabel: "Sahil Yolu",
      coords: [40.9254, 40.2115],
      icon: "🚗",
      desc: "Dünyada sarıçam ormanlarının deniz seviyesine kadar indiği ender tabiat parkı koyu."
    },
    {
      name: "Kıyıcık Koyu",
      city: "Rize (Fındıklı)",
      sea: "Karadeniz",
      difficulty: "kolay",
      diffLabel: "Sahil Yolu",
      coords: [41.2854, 41.1452],
      icon: "🚗",
      desc: "Çay bahçelerinin hemen altında, Doğu Karadeniz'in en temiz çakıl plajı."
    },
    {
      name: "Kemalpaşa Koyu",
      city: "Artvin (Hopa)",
      sea: "Karadeniz",
      difficulty: "kolay",
      diffLabel: "Kolay Araç Yolu",
      coords: [41.5125, 41.5485],
      icon: "🚗",
      desc: "Türkiye-Gürcistan sınırında, yemyeşil Kafkas dağlarının Karadeniz'le buluştuğu nokta."
    }
  ];

  function getDifficultyColor(diff) {
    switch (diff) {
      case 'tekne': return '#a855f7';
      case 'patika': return '#ef4444';
      case 'toprak': return '#f59e0b';
      case 'kolay': return '#10b981';
      default: return '#0284c7';
    }
  }

  // Create markers and store in layer group
  const markersLayer = L.layerGroup();

  function buildMarkers() {
    markersLayer.clearLayers();

    secretBays.forEach(bay => {
      if (activeCategory !== 'all' && bay.difficulty !== activeCategory) {
        return;
      }

      const pinColor = getDifficultyColor(bay.difficulty);

      const customPin = L.divIcon({
        className: 'custom-bay-marker',
        html: `
          <div class="bay-marker-pin" style="background: ${pinColor}; border-color: #ffffff;">
            <span>${bay.icon}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -30]
      });

      const marker = L.marker(bay.coords, { icon: customPin });

      // Clean & Elegant Informational Card Popup (No photos)
      marker.bindPopup(`
        <div style="font-family: inherit; min-width: 240px; padding: 6px 4px; color: #f0fdfa;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #38bdf8;">${bay.sea} • ${bay.city}</span>
            <span style="font-size: 0.72rem; padding: 2px 8px; border-radius: 99px; background: ${pinColor}25; color: ${pinColor}; font-weight: 700; border: 1px solid ${pinColor}55;">
              ${bay.diffLabel}
            </span>
          </div>
          <h4 style="margin: 0 0 6px 0; font-size: 1.15rem; color: #ffffff; font-weight: 800;">
            ${bay.icon} ${bay.name}
          </h4>
          <p style="margin: 0 0 10px 0; font-size: 0.88rem; color: #94a3b8; line-height: 1.5;">
            ${bay.desc}
          </p>
          <div style="padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #64748b; font-family: monospace;">
            <span>📍 ${bay.coords[0].toFixed(4)}°K, ${bay.coords[1].toFixed(4)}°D</span>
            <span style="color: #38bdf8; font-weight: 600;">🏊‍♀️ Yüzme Rotası</span>
          </div>
        </div>
      `, {
        maxWidth: 300,
        className: 'custom-bay-leaflet-popup'
      });

      markersLayer.addLayer(marker);
    });
  }

  buildMarkers();

  // UI Element References
  const currentZoomEl = document.getElementById('leaflet-current-zoom');
  const thresholdValEl = document.getElementById('leaflet-threshold-val');
  const thresholdSlider = document.getElementById('leaflet-threshold-slider');
  const markerStatusEl = document.getElementById('leaflet-marker-status');
  const wrapToggle = document.getElementById('leaflet-wrap-toggle');
  const wrapStatusEl = document.getElementById('leaflet-wrap-status');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // --- Solution for Issue 1: Zoom Threshold Logic ---
  function updateMarkersVisibility() {
    const currentZoom = map.getZoom();
    if (currentZoomEl) {
      currentZoomEl.textContent = currentZoom;
    }

    if (currentZoom >= zoomThreshold) {
      if (!map.hasLayer(markersLayer)) {
        map.addLayer(markersLayer);
      }
      if (markerStatusEl) {
        markerStatusEl.innerHTML = `<span style="color:#10b981;">●</span> Koylar Görünür (Zoom ${currentZoom} ≥ ${zoomThreshold})`;
        markerStatusEl.className = 'map-status-pill badge-emerald';
      }
    } else {
      if (map.hasLayer(markersLayer)) {
        map.removeLayer(markersLayer);
      }
      if (markerStatusEl) {
        markerStatusEl.innerHTML = `<span style="color:#f43f5e;">●</span> Çakışmayı Önlemek İçin Gizlendi (Zoom ${currentZoom} < ${zoomThreshold})`;
        markerStatusEl.className = 'map-status-pill badge-rose';
      }
    }
  }

  map.on('zoomend', updateMarkersVisibility);

  if (thresholdSlider) {
    thresholdSlider.addEventListener('input', (e) => {
      zoomThreshold = parseInt(e.target.value, 10);
      if (thresholdValEl) thresholdValEl.textContent = zoomThreshold;
      updateMarkersVisibility();
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter') || 'all';
      buildMarkers();
      updateMarkersVisibility();
    });
  });

  // --- Solution for Issue 2: Earth Repeating Itself When Zoomed Out ---
  function updateEarthWrapSetting(enabled) {
    isWrapPreventionEnabled = enabled;
    map.removeLayer(tileLayer);

    if (isWrapPreventionEnabled) {
      tileLayer = L.tileLayer(tileUrl, {
        attribution: 'Tiles &copy; Esri | GMT 458',
        maxZoom: 19,
        noWrap: true
      }).addTo(map);

      map.setMaxBounds(worldBounds);
      map.options.maxBoundsViscosity = 1.0;

      if (wrapStatusEl) {
        wrapStatusEl.textContent = "Dünya Tekrarı Önleme: AÇIK (noWrap: true)";
        wrapStatusEl.className = "map-status-pill badge-cyan";
      }
    } else {
      tileLayer = L.tileLayer(tileUrl, {
        attribution: 'Tiles &copy; Esri | GMT 458',
        maxZoom: 19,
        noWrap: false
      }).addTo(map);

      map.setMaxBounds(null);
      map.options.maxBoundsViscosity = 0.0;

      if (wrapStatusEl) {
        wrapStatusEl.textContent = "Dünya Tekrarı Önleme: KAPALI (Tekrarlıyor)";
        wrapStatusEl.className = "map-status-pill badge-amber";
      }
    }
  }

  if (wrapToggle) {
    wrapToggle.addEventListener('change', (e) => {
      updateEarthWrapSetting(e.target.checked);
    });
  }

  // Initial trigger
  updateMarkersVisibility();
});
