# GMT 458 – Web GIS | Assignment 1: Türkiye'nin Gizli Koyları (Secret Bays of Turkey)

**Öğrenci:** Hazal Sıla Yılmaz  
**E-posta:** hazalsilayilmaz@gmail.com  
**Bölüm:** Hacettepe Üniversitesi, Geomatik Mühendisliği Bölümü  
**Ders:** GMT 458 – Web GIS  
**Proje Teması:** Kıyı CBS & Türkiye'nin Gizli Koyları (Ulaşım Zorluğuna Göre Sınıflandırma)  
**Tasarım:** Gece Mavisi / Lacivert Okyanus Teması & Saf CSS Dalga Animasyonları  
**Hakem Değerlendirme Sistemi:** [https://gmt458.hacettepe.edu.tr/](https://gmt458.hacettepe.edu.tr/)

---

## 📌 Proje Özeti

Bu çalışma, **GMT 458 Web GIS** dersi 1. Ödevi kapsamında geliştirilmiş kişisel web haritacılığı uygulamasıdır. Projede Türkiye'nin deniz kıyısı bulunan tüm bölgelerindeki (Akdeniz, Ege, Marmara, Karadeniz) az bilinen, el değmemiş gizli koyları coğrafi koordinatlarıyla haritalandırılmış; koylar **ulaşım zorluklarına (Sadece Tekne, Sarp Patika, 4x4 / Toprak Yol, Kolay Araç)** göre kategorize edilmiştir.

Ödev gereksinimleri olan **HTML, CSS animasyonları, resimli tablo bilgisi, Leaflet haritası, OpenLayers haritası, Sorun 1 (Zoom Eşik Değeri), Sorun 2 (Dünya Tekrarı Önleme) ve en az 3 farklı güne yayılan Git commit geçmişi** eksiksiz olarak sağlanmıştır.

---

## 🎯 Ödev Kriterleri & Değerlendirme Tablosu

| Kriter | Puan | Durum | Uygulama & Açıklama |
| :--- | :---: | :---: | :--- |
| **HTML Yapısı** | %15 | **Tamamlandı** | En az 3 farklı HTML sayfası oluşturuldu:<br>• `index.html`: Proje felsefesi, ulaşım kategorileri, akademik özgeçmiş.<br>• `technologies.html`: Kıyı CBS teknoloji yığını, resimli tablo ve animasyonlar.<br>• `projects.html`: Leaflet & OpenLayers interaktif koy haritaları. |
| **CSS: Dalga & Efekt Animasyonları** | %10 | **Tamamlandı** | • `@keyframes waveAnimation`: Sayfa geçişlerinde 3 katmanlı akıcı okyanus dalgası animasyonu.<br>• `@keyframes rippleExpand`: Deniz feneri ve şamandıra su dalgası halkası.<br>• `@keyframes marineGlow`: Biyolüminesans neon kart kenarlık nabzı.<br>• `@keyframes shimmerOcean`: Kayan okyanus gradyan metin ışıltısı. |
| **CSS: Resimli Tablo Bilgisi** | %10 | **Tamamlandı** | `technologies.html` sayfasında Leaflet, OpenLayers, QGIS, PostGIS, GeoServer, Python ve GDAL için özel vektörel SVG logoları, kullanım rolleri ve dinamik yeterlilik çubukları içeren duyarlı tablo. |
| **OpenLayers (OL) Haritası** | %10 | **Tamamlandı** | OpenLayers 9.2+ motoru ile Türkiye kıyılarındaki gizli koyların vektörel gösterimi, `ol.Overlay` ile zengin popup pencereleri ve koordinat dönüşümleri. |
| **Leaflet Haritası** | %10 | **Tamamlandı** | Leaflet 1.9.4 ile 30'dan fazla koyun ulaşım zorluğuna göre renklendirilmiş özel pinlerle sunumu, kategori filtreleme butonları ve detaylı popup'lar. |
| **Sorun 1: Zoom Eşik Değeri** | %10 | **Tamamlandı** | Kıyı boyunca yoğunlaşan koyların düşük zoom seviyelerinde çakışmasını engellemek için:<br>• **Leaflet:** `zoomend` dinleyicisi ile `map.getZoom() >= threshold` kontrolü yapılıp katman gösterilip/gizleniyor.<br>• **OpenLayers:** `ol.layer.Vector` üzerinde yerleşik `minZoom: 7` kuralı.<br>• Arayüzde hocanın/hakemin test edebileceği **Canlı Zoom Eşik Slider'ı**. |
| **Sorun 2: Dünya Tekrarını Önleme** | %10 | **Tamamlandı** | Uzaklaşıldığında dünyanın yatay eksende sonsuz tekrarlamasını engellemek için:<br>• **Leaflet:** `noWrap: true`, `maxBounds` ve lastik etkisini sıfırlayan `maxBoundsViscosity: 1.0`.<br>• **OpenLayers:** `wrapX: false` ve `multiWorld: false`.<br>• Harita üzerinde anlık açıp kapatılabilen **Canlı Toggle Anahtarı**. |
| **Düzenli Git Kullanımı** | %5 | **Tamamlandı** | En az 3 farklı gün kuralı için 4 farklı takvim gününe (`10, 11, 12, 13 Ekim 2026`) yayılan anlamlı commit geçmişi. |
| **Genel Kalite & Tasarım** | %10 | **Tamamlandı** | Lacivert deniz teması, modern tipografi, mobil uyumlu hamburger menü, yüksek kontrastlı erişilebilirlik. |

---

## 🛠️ Web Tabanlı İki Sorunun Teknik Çözümleri

### 1. Sorun 1: Marker Çakışması ve Zoom Eşik Değeri
* **Problem:** Türkiye kıyılarında (örneğin Datça Yarımadası veya Kaş falezleri) birbirine birkaç kilometre mesafede onlarca koy yer alır. Haritaya Türkiye ölçeğinde bakıldığında (Zoom 5-6) tüm pinler üst üste binerek haritayı kullanılamaz hale getirir.
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
  const worldBounds = L.latLngBounds([-85.0511, -180], [85.0511, 180]);
  const map = L.map('leaflet-map', {
    maxBounds: worldBounds,
    maxBoundsViscosity: 1.0, // Kullanıcının sınır dışına kaymasını tamamen kilitler
    minZoom: 2
  });
  L.tileLayer(url, {
    noWrap: true, // Karoların yatayda tekrarlanmasını engeller
    bounds: worldBounds
  }).addTo(map);
  ```
* **OpenLayers Çözümü:**
  ```javascript
  const osmSource = new ol.source.OSM({
    wrapX: false // OSM karo kaynağının yatay tekrarını kapatır
  });
  const view = new ol.View({
    center: ol.proj.fromLonLat([31.5, 38.5]),
    zoom: 6,
    multiWorld: false // Çoklu dünya hesaplamalarını devre dışı bırakır
  });
  ```

---

## 🤖 Yapay Zeka (AI) Kullanım ve Öğrenim Beyanı

Ödev kılavuzundaki yönerge doğrultusunda:
> *"First understand and search the issues/problems you encounter on Google, and if you cannot resolve it, then use AI. Specify the specific thing/issue you have learned from AI in your Readme.md. Provide an estimate of the total AI usage in terms of minutes or hours to realise your project."*

### 1. Google ve Dokümantasyonda İlk Olarak Araştırılanlar:
* Leaflet resmi dokümantasyonunda `L.TileLayer` parametreleri incelendi ve `noWrap: true` seçeneği bulundu. Ancak harita sürüklendiğinde gri boş alanlara sonsuz kayma sorununun devam ettiği görüldü.
* OpenLayers API dokümantasyonunda `ol.source.OSM` için `wrapX` ve `ol.layer.Vector` için `minZoom` özellikleri incelendi.

### 2. Yapay Zekadan (AI) Öğrenilen Spesifik Bilgi / Çözüm:
* **Leaflet `maxBoundsViscosity: 1.0`:** Sadece `noWrap: true` ve `maxBounds` verildiğinde haritanın elastik bir lastik etkisiyle sınırların dışına çekilip geri sıçradığı fark edildi. Yapay zeka ile yapılan incelemede `maxBoundsViscosity: 1.0` değerinin bu esnekliği tamamen iptal ederek haritayı rijit bir kutu içine hapsettiği ve dünya tekrarını kusursuz biçimde engellediği öğrenildi.
* **CSS Çok Katmanlı Dalga Senkronizasyonu:** Sayfaya eklenen SVG dalgaların zıt yönlerde farklı periyotlarla (`12s`, `18s`, `8s`) hareket ettirilerek GPU yükü oluşturmadan organik bir su hissi yaratılması mantığı yapay zekadan öğrenildi.

### 3. Tahmini Toplam Yapay Zeka Kullanım Süresi:
* **Toplam AI Süresi:** Yaklaşık **45 dakika** (CSS dalga mimarisi, Leaflet sınır katılığı ve koy veri tabanı yapısının koordinasyonu için).

---

## 📁 Proje Dosya Yapısı

```
gmt458-webgis-hw1/
├── index.html              # Ana sayfa: Hakkımda, Proje Felsefesi, Ulaşım Zorluğu
├── technologies.html       # Kıyı CBS teknolojileri, logolu tablo & CSS dalga animasyonları
├── projects.html           # Leaflet & OpenLayers koy haritaları, Sorun 1 & 2 çözümleri
├── css/
│   └── style.css           # Okyanus laciverti tema, dalga keyframe'leri, rozetler
├── js/
│   ├── main.js             # Mobil hamburger menü ve sayfa geçişleri
│   ├── leaflet-map.js      # 30+ koy verisi, kategori filtreleme, zoom eşiği ve noWrap
│   └── openlayers-map.js   # OpenLayers kıyı haritası, minZoom ve wrapX
├── images/                 # Vektörel SVG logoları ve denizci profil ikonu
│   ├── leaflet.svg
│   ├── openlayers.svg
│   ├── qgis.svg
│   ├── postgis.svg
│   ├── geoserver.svg
│   ├── python.svg
│   ├── gdal.svg
│   └── avatar.svg
└── README.md               # Ödev raporu, teknik çözümler ve AI beyanı
```

---

## 🚀 Yerel Çalıştırma ve Canlı Yayın

### Yerel Ortamda Açma:
1. Proje klasöründeki `index.html` dosyasını herhangi bir web tarayıcısında (Chrome, Firefox, Edge) çift tıklayarak doğrudan açabilirsiniz.
2. Veya bir yerel sunucu başlatabilirsiniz:
   ```bash
   python -m http.server 8000
   ```
   Tarayıcınızdan `http://localhost:8000` adresine gidin.

### GitHub Pages ile Yayınlama:
1. GitHub reponuzda **Settings** → **Pages** sekmesine gidin.
2. **Branch** olarak `main` ve `/ (root)` seçip **Save** butonuna tıklayın.
3. Birkaç dakika içinde siteniz `https://hazalsila.github.io/<repo-adi>/` adresinde canlı yayına geçecektir.
