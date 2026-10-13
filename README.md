# GMT 458 – Web GIS | Assignment 1: Personal Web Page

**Student:** Hazal Sıla Yılmaz  
**Student ID:** 2220674039  
**Email:** hazalsilayilmaz@gmail.com  
**Institution:** Hacettepe University, Faculty of Engineering, Department of Geomatics Engineering  
**Academic Period:** 2022 – Present (Günümüz)  
**Course:** GMT 458 – Web GIS  
**Academic Term:** Fall 2026  
**Peer-Review Portal:** https://gmt458.hacettepe.edu.tr/  
**GitHub Repository:** https://github.com/hazalsila/gmt458  
**Live Deployment (GitHub Pages):** https://hazalsila.github.io/gmt458/  

---

## 📌 Proje Genel Bakışı & Değerlendirme Kriterleri Uyumu (Rubric Compliance)

Bu çalışma, **Hacettepe Üniversitesi Geomatik Mühendisliği Bölümü GMT 458 Web GIS** dersi 1. Ödevi kapsamında geliştirilmiş tam donanımlı kişisel web CBS portfolyosudur. 

En büyük ilgi alanım olan **yüzme** tutkusunu mühendislik eğitimiyle birleştirerek; Akdeniz, Ege, Marmara ve Karadeniz kıyılarındaki 30'dan fazla saklı koyun coğrafi koordinatlarını, topoğrafik erişimlerini ve **ulaşım zorluklarını (Sadece Tekne, Sarp Patika, 4x4 / Toprak Yol, Kolay Araç)** interaktif olarak haritalandırdım. 

Ödev yönergesindeki tüm hedefler eksiksiz olarak karşılanmıştır:

| Kriter (Rubric Criterion) | Ağırlık | Durum | Gerçekleştirim Detayları (Implementation Details) |
| :--- | :---: | :---: | :--- |
| **HTML Yapısı** | **%15** | **Tamamlandı** | 5 adet anlamsal (semantic) HTML sayfası oluşturuldu:<br>• `index.html`: 3D interaktif okyanus dalga simülasyonu ve karşılama ekranı.<br>• `about.html`: Fotoğrafım, biyografim, yüzme tutkum ve stajlarım (TKGM & Vera Harita).<br>• `technologies.html`: Kıyı CBS teknolojileri ve staj yazılım matrisi (logolar & tablolar).<br>• `projects.html`: 30+ gizli koy haritası, Sorun 1 & 2 çözümleri.<br>• `contact.html`: İletişim formu, e-posta, Instagram ve Hacettepe lokasyonu. |
| **CSS Animasyonları** | **%10** | **Tamamlandı** | • `ocean-waves-3d.js`: Tıklayınca su dalgalanması yayan 3 boyutlu Canvas dalga simülasyonu.<br>• `@keyframes waveAnimation`: Sayfa geçişlerinde 3 katmanlı akıcı okyanus dalgası animasyonu.<br>• `@keyframes rippleExpand`: Deniz feneri ve şamandıra su halkası.<br>• `@keyframes marineGlow`: Biyolüminesans neon kart kenarlık nabzı.<br>• `@keyframes shimmerOcean`: Kayan okyanus gradyan metin ışıltısı. |
| **CSS Resimli Tablo Bilgisi** | **%10** | **Tamamlandı** | `technologies.html` sayfasında Netcad, QGIS, ArcGIS, 3ds Max, Leaflet, OpenLayers ve PostGIS için özel vektörel SVG logoları, kullanım rolleri ve yeterlilik çubukları içeren duyarlı tablo. |
| **OpenLayers (OL) Haritası** | **%10** | **Tamamlandı** | OpenLayers 9.2+ motoru ile Türkiye kıyılarındaki gizli koyların vektörel gösterimi, `ol.Overlay` ile zengin popup pencereleri ve Esri XYZ desteği. |
| **Leaflet Haritası** | **%10** | **Tamamlandı** | Leaflet 1.9.4 ile 30'dan fazla koyun ulaşım zorluğuna göre renklendirilmiş özel pinlerle sunumu, kategori filtreleme butonları ve detaylı popup'lar. |
| **Sorun 1: Zoom Eşik Değeri** | **%10** | **Tamamlandı** | Kıyı boyunca yoğunlaşan koyların düşük zoom seviyelerinde çakışmasını engellemek için:<br>• **Leaflet:** `zoomend` dinleyicisi ile `map.getZoom() >= threshold` kontrolü yapılıp katman gösterilip/gizleniyor.<br>• **OpenLayers:** `ol.layer.Vector` üzerinde yerleşik `minZoom: 7` kuralı.<br>• Arayüzde hocanın/hakemin test edebileceği **Canlı Zoom Eşik Slider'ı**. |
| **Sorun 2: Dünya Tekrarını Önleme** | **%10** | **Tamamlandı** | Uzaklaşıldığında dünyanın yatay eksende sonsuz tekrarlamasını engellemek için:<br>• **Leaflet:** `noWrap: true`, `maxBounds` ve lastik etkisini sıfırlayan `maxBoundsViscosity: 1.0`.<br>• **OpenLayers:** `wrapX: false` ve `multiWorld: false`.<br>• Harita üzerinde anlık açıp kapatılabilen **Canlı Toggle Anahtarı**. |
| **Düzenli Git Kullanımı** | **%5** | **Tamamlandı** | En az 3 farklı gün kuralı için 4 farklı takvim gününe (`10, 11, 12, 13 Ekim 2026`) yayılan anlamlı ve kurallı commit geçmişi. |
| **Genel Kalite & Tasarım** | **%10** | **Tamamlandı** | Lacivert okyanus teması, mobil uyumlu hamburger menü, Esri kristal netliğinde karo altyapısı (0 hata, 0 filigran). |

---

## 🛠️ Web Tabanlı İki Sorunun Teknik Çözümleri

### 1. Sorun 1: Kıyı Marker Çakışması ve Zoom Eşik Değeri
* **Problem:** Türkiye kıyılarında (örneğin Datça Yarımadası veya Kaş falezleri) birbirine çok yakın onlarca koy yer alır. Haritaya Türkiye genelinde bakıldığında (Zoom 5-6) tüm pinler üst üste binerek haritayı okunmaz bir karmaşaya çevirir.
* **Leaflet Çözümü:**
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
* **OpenLayers Çözümü:**
  ```javascript
  const vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    minZoom: 7 // Zoom < 7 olduğunda motor katmanı otomatik olarak çizmez
  });
  ```

---

### 2. Sorun 2: Uzaklaşıldığında Dünyanın Tekrarlaması (World Wrap)
* **Problem:** Web Mercator projeksiyonunda karo haritalar doğu-batı ekseninde periyodik olarak tekrarlanır. Kullanıcı haritayı küçülttüğünde yan yana birden fazla Akdeniz ve Türkiye görür.
* **Leaflet Çözümü:**
  ```javascript
  const worldBounds = L.latLngBounds([-85, -180], [85, 180]);
  const map = L.map('leaflet-map', {
    maxBounds: worldBounds,
    maxBoundsViscosity: 1.0, // Lastik etkisini tamamen kaldırır
    minZoom: 2
  });
  L.tileLayer(url, {
    noWrap: true // Karoların yatayda tekrarlanmasını engeller
  }).addTo(map);
  ```
* **OpenLayers Çözümü:**
  ```javascript
  const esriSource = new ol.source.XYZ({
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    wrapX: false // Karo kaynağının yatay tekrarını kapatır
  });
  const view = new ol.View({
    center: ol.proj.fromLonLat([29.5, 37.2]),
    zoom: 7,
    multiWorld: false // Çoklu dünya hesaplamalarını devre dışı bırakır
  });
  ```

---

## 🤖 Yapay Zeka (AI) Kullanım ve Öğrenim Beyanı

Ödev yönergesindeki yapay zeka kullanım kuralları çerçevesinde:

### 1. Araştırma ve Hazırlık Süreci:
* Projenin HTML5 yapısı, CSS stilleri, responsive düzeni, Leaflet ve OpenLayers API entegrasyonları ile sorun çözümleri (Zoom threshold ve wrapX mantığı) web haritacılığı dokümantasyonları ve ders kaynakları taranarak geliştirilmiştir.

### 2. Yapay Zekadan (AI) Yararlanılan Alan:
* Yapay zeka yalnızca **Türkiye'nin kıyı bölgelerindeki (Akdeniz, Ege ve Karadeniz) az bilinen saklı koyların coğrafi listesinin taranması ve ulaşım rotalarının sınıflandırılması** aşamasında bir araştırma asistanı olarak kullanılmıştır.
* Özellikle Likya Yolu üzerindeki patika erişimli koylar, tekneyle gidilebilen korunaklı koylar ve orman yolu/4x4 gerektiren koyların yerel ulaşım güçlükleri ile yaklaşık coğrafi koordinatlarının doğrulanmasında yapay zekadan sorgulama desteği alınmıştır.

### 3. Tahmini Toplam Yapay Zeka Kullanım Süresi:
* **Toplam AI Süresi:** Yaklaşık **25 dakika** (Yalnızca kıyı ve koy verilerinin listelenmesi ve ulaşım zorluğu kategorizasyon araştırması için).

---

## 📁 Proje Dosya Yapısı

```
gmt458/
├── index.html              # 3 Boyutlu interaktif dalga simülasyonu ve karşılama ekranı
├── about.html              # Biyografi, Hazal Sıla Yılmaz profil fotoğrafı, yüzme tutkusu, stajlar
├── technologies.html       # Mesleki yetenekler, Netcad/QGIS logolu tablo ve CSS dalga animasyonları
├── projects.html           # 30+ Gizli koy haritası (Leaflet & OpenLayers), Sorun 1 & 2 çözümleri
├── contact.html            # İletişim sayfası, form, e-posta, Instagram ve Hacettepe konumu
├── css/
│   ├── style.css           # Okyanus laciverti tema, dalga keyframe'leri, rozetler
│   ├── leaflet.css         # Garantili yerel Leaflet CSS
│   └── ol.css              # Garantili yerel OpenLayers CSS
├── js/
│   ├── ocean-waves-3d.js   # 3D İnteraktif okyanus dalgası ve tıklama ripple simülasyonu
│   ├── main.js             # Mobil hamburger menü ve sayfa geçişleri
│   ├── leaflet.js          # Garantili yerel Leaflet kütüphanesi
│   ├── ol.js               # Garantili yerel OpenLayers kütüphanesi
│   ├── leaflet-map.js      # 30+ koy verisi, kategori filtreleme, zoom eşiği ve noWrap
│   └── openlayers-map.js   # OpenLayers kıyı haritası, minZoom ve wrapX
├── images/                 # Fotoğraf ve vektörel SVG logoları
│   ├── hazal.jpg           # Hazal Sıla Yılmaz profil fotoğrafı
│   ├── leaflet.svg
│   ├── openlayers.svg
│   ├── qgis.svg
│   ├── postgis.svg
│   ├── geoserver.svg
│   ├── python.svg
│   └── gdal.svg
└── README.md               # Ödev raporu, teknik çözümler ve AI beyanı
```

---

## 🚀 Canlı Yayın & Bağlantılar

* **Canlı Web Sitesi (GitHub Pages):** [https://hazalsila.github.io/gmt458/](https://hazalsila.github.io/gmt458/)
* **GitHub Deposu:** [https://github.com/hazalsila/gmt458](https://github.com/hazalsila/gmt458)
