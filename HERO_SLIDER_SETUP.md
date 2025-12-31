# Hero Slider Kurulum Rehberi

Hero slider'ı çalıştırmak için 3 seçenek var. En kolayından başlayalım:

## Seçenek 1: Shopify App ile Yönetim (Önerilen)

### Adım 1: App'i Deploy Et

```bash
cd vampire-vape-headless
npm install
npm run deploy
```

### Adım 2: App'e Eriş

1. Shopify Admin → Apps → Vampire Vape Headless
2. Sol menüden "Hero Slider" linkine tıkla
3. Görselleri ekle ve kaydet

### Adım 3: Metafield Oluştur

App otomatik olarak `hero.slider_slides` metafield'ını oluşturur.

## Seçenek 2: Manuel Metafield Oluşturma

### Adım 1: Metafield Oluştur

1. Shopify Admin → Settings → Metafields
2. Metafield definitions → Shop → Add definition
3. Şu bilgileri gir:
   - **Name**: `Hero Slider Slides`
   - **Namespace**: `hero`
   - **Key**: `slider_slides`
   - **Type**: `JSON` (eğer yoksa, Admin API ile oluştur)
   - **Owner**: `Shop`

### Adım 2: JSON Verisi Ekle

Metafield'a şu JSON formatında veri ekle:

```json
[
  {
    "id": 1,
    "image": "https://cdn.shopify.com/s/files/1/0969/5084/5726/files/hero-1.jpg",
    "link": "/e-liquids",
    "alt": "Premium E-Liquids"
  },
  {
    "id": 2,
    "image": "https://cdn.shopify.com/s/files/1/0969/5084/5726/files/hero-2.jpg",
    "link": "/hardware",
    "alt": "Neue Hardware"
  }
]
```

## Seçenek 3: Test İçin Hardcoded Slides (Hızlı Test)

Eğer hemen test etmek istiyorsan, `HeroSlider.js` component'ine hardcoded slides ekleyebiliriz.

## Sorun Giderme

### Hero slider görünmüyor

1. **Browser console'u kontrol et** (F12):
   - `/api/hero-slides` endpoint'ine istek atılıyor mu?
   - Hata var mı?

2. **Metafield kontrolü**:
   - Shopify Admin → Settings → Metafields
   - `hero.slider_slides` metafield'ı var mı?
   - İçinde JSON verisi var mı?

3. **API route testi**:
   - Tarayıcıda şu URL'yi aç: `http://localhost:3000/api/hero-slides`
   - JSON response geliyor mu?

### App görünmüyor

1. App deploy edildi mi?
2. App aktif mi? (Shopify Admin → Apps)
3. App URL'si doğru mu? (`shopify.app.toml` kontrol et)

### Metafield oluşturulamıyor

1. **JSON type yoksa**: Admin API kullanarak oluştur:
   ```bash
   # scripts klasöründe bir script oluştur
   ```

2. **Alternatif**: App'i deploy et, app otomatik oluşturur

## Hızlı Test

Şimdilik test için hardcoded slides ekleyelim mi? Yoksa App'i deploy edip oradan mı yönetelim?

