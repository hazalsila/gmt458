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

  // Base Tile Layer with noWrap option for Issue 2
  let tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | GMT 458 Web GIS',
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
      coords: [36.1554, 33.6881],
      icon: "🚙",
      desc: "Kilikya Aphrodisias antik kenti kalıntıları arasında, iki taraflı beyaz kumsala sahip gizli yarımada."
    },
    {
      name: "Gilindire Koyu",
      city: "Mersin (Aydıncık)",
      sea: "Akdeniz",
      difficulty: "patika",
      diffLabel: "Merdivenli Patika",
      coords: [36.1362, 33.4011],
      icon: "🚶",
      desc: "Aynalıgöl Mağarası çıkışında falezlerin eteğinde tertemiz Akdeniz suları."
    },
    {
      name: "Meydan & Çevlik Koyu",
      city: "Hatay (Samandağ)",
      sea: "Akdeniz",
      difficulty: "kolay",
      diffLabel: "Kolay Araç Ulaşımı",
      coords: [35.9524, 35.9182],
      icon: "🚗",
      desc: "Titus Tüneli'nin denize açıldığı tarihi sahil şeridinde sörf ve yüzme alanı."
    },

    // --- EGE BÖLGESİ ---
    {
      name: "Kabak Koyu",
      city: "Muğla (Fethiye)",
      sea: "Ege",
      difficulty: "patika",
      diffLabel: "Dik Patika / Doğa Yürüyüşü",
      coords: [36.4608, 29.1264],
      icon: "🚶",
      desc: "Likya Yolu üzerindeki derin kanyonda, bozulmamış flora ve turkuaz sularıyla meşhur vadi."
    },
    {
      name: "Kelebekler Vadisi",
      city: "Muğla (Fethiye)",
      sea: "Ege",
      difficulty: "tekne",
      diffLabel: "Sadece Tekne / Zor Patika",
      coords: [36.4981, 29.1278],
      icon: "⛵",
      desc: "350 metrelik sarp kanyon duvarlarının çevrelediği, karadan araç yolu olmayan masalsı sahil."
    },
    {
      name: "Kurubük Koyu",
      city: "Muğla (Datça)",
      sea: "Ege",
      difficulty: "toprak",
      diffLabel: "Virajlı Yol / İniş",
      coords: [36.6872, 27.5765],
      icon: "🚙",
      desc: "Ovabükü ve Palamutbükü arasında akvaryum berraklığında bakir ve tesis olmayan koy."
    },
    {
      name: "Domuzbükü (Domuzçukuru)",
      city: "Muğla (Datça)",
      sea: "Ege",
      difficulty: "tekne",
      diffLabel: "Yalnızca Denizden Tekne",
      coords: [36.6711, 27.6083],
      icon: "⛵",
      desc: "Karadan araç yolu bulunmayan, çam ve zeytin ağaçlarıyla çevrili Datça'nın en bakir noktası."
    },
    {
      name: "Bördübet Koyu",
      city: "Muğla (Marmaris)",
      sea: "Ege",
      difficulty: "toprak",
      diffLabel: "Toprak Orman Yolu",
      coords: [36.8197, 28.0684],
      icon: "🚙",
      desc: "Gökova Körfezi'nde dere ile denizin birleştiği, kuş sesleri içindeki huzurlu doğa harikası."
    },
    {
      name: "Mazı Koyu (İnceyalı)",
      city: "Muğla (Bodrum)",
      sea: "Ege",
      difficulty: "toprak",
      diffLabel: "Virajlı Dağ Yolu",
      coords: [37.0012, 27.6654],
      icon: "🚙",
      desc: "Bodrum'un kalabalığından uzak, balıkçı teknelerinin sığındığı berrak taşlık sahil."
    },
    {
      name: "Dolungaz Koyu",
      city: "İzmir (Karaburun)",
      sea: "Ege",
      difficulty: "patika",
      diffLabel: "Kayalık Patika İnişi",
      coords: [38.6478, 26.4352],
      icon: "🚶",
      desc: "Karaburun falezleri arasında turkuaz rengiyle büyüleyen, çadır ve kampçıların saklı mekanı."
    },
    {
      name: "Delikli Koy",
      city: "İzmir (Çeşme / Alaçatı)",
      sea: "Ege",
      difficulty: "toprak",
      diffLabel: "Toprak Yol / Taşlık",
      coords: [38.2582, 26.3312],
      icon: "🚙",
      desc: "Rüzgar ve dalgalarla aşınmış beyaz tebeşir kayaları ve serin tertemiz sular."
    },
    {
      name: "Kalem & Garip Adası Koyu",
      city: "İzmir (Dikili)",
      sea: "Ege",
      difficulty: "tekne",
      diffLabel: "Sadece Tekne Ulaşımı",
      coords: [39.0115, 26.7942],
      icon: "⛵",
      desc: "Ege'nin Maldivleri olarak bilinen, açık turkuaz rengi ve beyaz kumuyla ünlü ada koyu."
    },
    {
      name: "Dilek Yarımadası Karasu Koyu",
      city: "Aydın (Kuşadası)",
      sea: "Ege",
      difficulty: "patika",
      diffLabel: "Milli Park İçi Patika",
      coords: [37.6985, 27.1685],
      icon: "🚶",
      desc: "Yunusların ve Akdeniz foklarının üreme alanı olan koruma altındaki milli park koyu."
    },

    // --- MARMARA VE KUZEY EGE ---
    {
      name: "Akvaryum Koyu",
      city: "Çanakkale (Bozcaada)",
      sea: "Ege / Marmara",
      difficulty: "toprak",
      diffLabel: "Toprak Yol",
      coords: [39.7952, 26.0425],
      icon: "🚙",
      desc: "Bozcaada'nın güneyinde, deniz gözlüğüyle sualtı canlılarının izlendiği şnorkel durağı."
    },
    {
      name: "Beylik Koyu",
      city: "Çanakkale (Bozcaada)",
      sea: "Ege / Marmara",
      difficulty: "patika",
      diffLabel: "Kısa Patika Yürüyüşü",
      coords: [39.8115, 26.0351],
      icon: "🚶",
      desc: "Ada rüzgarından korunaklı, altın rengi kumsalı ve batık gemi manzarasıyla meşhur ıssız koy."
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

      marker.bindPopup(`
        <div style="font-family: inherit; min-width: 230px; padding: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #38bdf8;">${bay.sea} • ${bay.city}</span>
            <span style="font-size: 0.72rem; padding: 2px 8px; border-radius: 99px; background: ${pinColor}22; color: ${pinColor}; font-weight: 700; border: 1px solid ${pinColor}55;">
              ${bay.diffLabel}
            </span>
          </div>
          <h4 style="margin: 0 0 6px 0; font-size: 1.15rem; color: #f0fdfa; font-weight: 800;">
            ${bay.icon} ${bay.name}
          </h4>
          <p style="margin: 0 0 10px 0; font-size: 0.88rem; color: #94a3b8; line-height: 1.45;">
            ${bay.desc}
          </p>
          <div style="padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #64748b; font-family: monospace;">
            <span>📍 ${bay.coords[0].toFixed(4)}°K, ${bay.coords[1].toFixed(4)}°D</span>
            <span style="color: #38bdf8;">GMT 458</span>
          </div>
        </div>
      `);

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
      tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | GMT 458',
        noWrap: true
      }).addTo(map);

      map.setMaxBounds(worldBounds);
      map.options.maxBoundsViscosity = 1.0;

      if (wrapStatusEl) {
        wrapStatusEl.textContent = "Dünya Tekrarı Önleme: AÇIK (noWrap: true)";
        wrapStatusEl.className = "map-status-pill badge-cyan";
      }
    } else {
      tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | GMT 458',
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
