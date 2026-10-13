# GMT 458 – Web GIS | Assignment 1: Kişisel Web Portfolyosu & Türkiye'nin Gizli Koyları

**Öğrenci:** Hazal Sıla Yılmaz  
**E-posta:** hazalsilayilmaz@gmail.com  
**Instagram:** [@hazalsilayilmazz](https://instagram.com/hazalsilayilmazz)  
**GitHub:** [@hazalsila](https://github.com/hazalsila)  
**Bölüm:** Hacettepe Üniversitesi, Geomatik Mühendisliği Bölümü (Son Sınıf)  
**Ders:** GMT 458 – Web GIS  
**Proje Teması:** Kıyı CBS & Türkiye'nin Gizli Koyları (Yüzme Tutkusu ve Ulaşım Zorluğu Modellemesi)  
**Tasarım:** Gece Mavisi / Lacivert Okyanus Teması, 3 Boyutlu İnteraktif Dalga Simülasyonu ve Saf CSS Dalgaları  
**Hakem Değerlendirme Portalı:** [https://gmt458.hacettepe.edu.tr/](https://gmt458.hacettepe.edu.tr/)

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

Ödev kılavuzundaki yönerge doğrultusunda:
> *"First understand and search the issues/problems you encounter on Google, and if you cannot resolve it, then use AI. Specify the specific thing/issue you have learned from AI in your Readme.md. Provide an estimate of the total AI usage in terms of minutes or hours to realise your project."*

### 1. Google ve Dokümantasyonda İlk Olarak Araştırılanlar:
* Leaflet resmi dokümantasyonunda `L.TileLayer` parametreleri incelendi ve `noWrap: true` seçeneği bulundu. Ancak harita sürüklendiğinde gri boş alanlara sonsuz kayma sorununun devam ettiği görüldü.
* OpenLayers API dokümantasyonunda `ol.source.XYZ` için `wrapX` ve `ol.layer.Vector` için `minZoom` özellikleri incelendi.

### 2. Yapay Zekadan (AI) Öğrenilen Spesifik Bilgi / Çözüm:
* **Leaflet `maxBoundsViscosity: 1.0`:** Sadece `noWrap: true` ve `maxBounds` verildiğinde haritanın elastik bir lastik etkisiyle sınırların dışına çekilip geri sıçradığı fark edildi. Yapay zeka ile yapılan incelemede `maxBoundsViscosity: 1.0` değerinin bu esnekliği tamamen iptal ederek haritayı rijit bir kutu içine hapsettiği ve dünya tekrarını kusursuz biçimde engellediği öğrenildi.
* **3D Canvas Dalga Ripple Matematiği:** 3 boyutlu perspektif dalga simülasyonunda kullanıcı tıkladığında dalga genliğine `Math.cos(dist - radius) * strength` eklenerek gerçekçi su halkaları oluşturulması mantığı yapay zekadan öğrenildi.

### 3. Tahmini Toplam Yapay Zeka Kullanım Süresi:
* **Toplam AI Süresi:** Yaklaşık **45 dakika** (3D dalga mimarisi, Leaflet sınır katılığı ve koy veri tabanı yapısının koordinasyonu için).

---

## 📁 Proje Dosya Yapısı

```
gmt458-webgis-hw1/
├── index.html              # 3 Boyutlu interaktif dalga simülasyonu ve karşılama ekranı
├── about.html              # Biyografi, Hazal Sıla Yılmaz fotoğrafı, yüzme tutkusu, stajlar
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

## 🚀 Yerel Çalıştırma ve Canlı Yayın

### Yerel Ortamda Açma:
Proje klasöründeki `index.html` dosyasını herhangi bir web tarayıcısında (Chrome, Edge, Firefox) çift tıklayarak doğrudan açabilirsiniz.

### GitHub Pages ile Yayınlama:
1. GitHub reponuzda **Settings** → **Pages** sekmesine gidin.
2. **Branch** olarak `main` ve `/ (root)` seçip **Save** butonuna tıklayın.
3. Birkaç dakika içinde siteniz `https://hazalsila.github.io/<repo-adi>/` adresinde canlı yayına geçecektir.
