# 🛍️ Shopify'da Test Ürünü Ekleme ve Sitede Görüntüleme Rehberi

Bu rehber, Shopify'da test ürünü ekleyip Next.js sitede nasıl görüntüleyeceğini **adım adım** öğretir.

---

## 📋 Ön Hazırlık

### 1. Shopify Admin'e Giriş
- Shopify Admin paneline giriş yap: https://admin.shopify.com
- Store: `vampirevape-2.myshopify.com`

### 2. Collection (Kategori) Oluşturma

**Neden?** Ürünlerin sitede görünmesi için bir **kategoriye (collection)** eklenmesi gerekir.

#### Adımlar:
1. **Products → Collections** menüsüne git
2. **"Create collection"** butonuna tıkla
3. **Collection bilgileri:**
   - **Title**: `Test Kategorie` (veya istediğin isim)
   - **Description**: (opsiyonel) Kategori açıklaması
   - **Collection type**: **Manual** seç (kolay test için)
4. **Save** butonuna tıkla
5. **ÖNEMLİ:** Collection kaydedildikten sonra, URL'deki **handle**'ı not al:
   - Örnek: `test-kategorie` (URL: `/collections/test-kategorie`)

---

## 🎯 Test Ürünü Ekleme

### Adım 1: Ürün Oluştur

1. **Products → Add product** butonuna tıkla
2. **Ürün bilgilerini doldur:**

   ```
   Title: Test Produkt 1
   Description: Bu bir test ürünüdür. Shopify'dan eklendi.
   ```

3. **Media (Resimler):**
   - **"Add images"** butonuna tıkla
   - Test için bir resim yükle (opsiyonel ama önerilir)
   - Resim yoksa da çalışır, sitede "Kein Bild" görünür

4. **Pricing:**
   - **Price**: `19.99` (veya istediğin fiyat)
   - **Compare at price**: (opsiyonel) İndirimli fiyat göstermek için

5. **Inventory (Stok):**
   - **Track quantity**: Açık bırakabilirsin
   - **Quantity**: `10` (test için)

6. **Shipping:**
   - **Weight**: (opsiyonel)
   - **Requires shipping**: İşaretli bırak

7. **Variants (Varyantlar):**
   - Eğer ürünün farklı boyutları/renkleri varsa:
     - **"Add variant"** → Örn: `Size: Small, Medium, Large`
   - Tek varyant varsa hiçbir şey yapma

8. **SEO:**
   - **Page title**: (otomatik doldurulur)
   - **Description**: (opsiyonel)

9. **Save** butonuna tıkla

---

### Adım 2: Ürünü Collection'a Ekle

**Neden?** Ürünün sitede kategori sayfasında görünmesi için collection'a eklenmesi gerekir.

1. Ürün sayfasında, sağ tarafta **"Collections"** bölümünü bul
2. **"Add to collection"** butonuna tıkla
3. Oluşturduğun collection'ı seç (örn: `Test Kategorie`)
4. **Save** butonuna tıkla

---

## 🌐 Sitede Görüntüleme

### 1. Kategori Sayfasında Görüntüleme

**URL formatı:**
```
https://SENIN-VERCEL-DOMAININ/kategorien/[collection-handle]
```

**Örnek:**
- Collection handle: `test-kategorie`
- URL: `https://vampirevape-storefront.vercel.app/kategorien/test-kategorie`

**Ne göreceksin?**
- Kategori başlığı
- Kategori açıklaması (varsa)
- Ürünler grid'de listelenir:
  - Ürün resmi
  - Ürün adı
  - Fiyat
  - Tıklanabilir kart (ürün detay sayfasına gider)

---

### 2. Ürün Detay Sayfasında Görüntüleme

**URL formatı:**
```
https://SENIN-VERCEL-DOMAININ/produkte/[product-handle]
```

**Product Handle Nasıl Bulunur?**
1. Shopify Admin → Products → Ürünü aç
2. URL'ye bak: `/admin/products/[ID]`
3. Veya ürün sayfasında **"Search engine listing preview"** bölümünde handle görünür
4. Genelde handle: ürün adının küçük harfli, tire ile ayrılmış hali
   - Örnek: `Test Produkt 1` → handle: `test-produkt-1`

**Örnek URL:**
```
https://vampirevape-storefront.vercel.app/produkte/test-produkt-1
```

**Ne göreceksin?**
- Ürün resimleri (galeri)
- Ürün adı
- Fiyat
- Açıklama
- Varyant seçimi (varsa)
- Miktar seçimi
- "In den Warenkorb" butonu

---

## 🔍 Sorun Giderme

### Ürün Kategori Sayfasında Görünmüyor

**Kontrol listesi:**
1. ✅ Ürün **collection'a eklenmiş** mi?
2. ✅ Collection handle doğru mu? (URL'deki handle ile eşleşiyor mu?)
3. ✅ Ürün **published** (yayınlanmış) mı? (Shopify'da "Draft" değil)
4. ✅ Vercel deployment **güncel** mi? (yeni ürün ekledikten sonra birkaç saniye bekle)

**Çözüm:**
- Shopify'da ürünü kontrol et → Collections bölümünde collection var mı?
- Collection handle'ı URL'den kontrol et (küçük harf, tire ile ayrılmış)

---

### Ürün Detay Sayfası "Produkt nicht gefunden" Gösteriyor

**Kontrol listesi:**
1. ✅ Product handle doğru mu?
2. ✅ Ürün **published** (yayınlanmış) mı?
3. ✅ Storefront API token geçerli mi?

**Çözüm:**
- Shopify'da ürün sayfasını aç → URL'den handle'ı kontrol et
- Handle'ı küçük harfe çevir, boşlukları tire ile değiştir
- Örnek: `Test Produkt 1` → `test-produkt-1`

---

### Resimler Görünmüyor

**Kontrol:**
- Shopify'da ürün resmi yüklü mü?
- Resim URL'si geçerli mi? (Shopify CDN'den geliyor mu?)

**Çözüm:**
- Shopify'da ürün sayfasına git → Media bölümünde resim var mı?
- Resim yoksa sitede "Kein Bild" placeholder görünür (normal)

---

## 📝 Özet: Hızlı Test Akışı

1. **Shopify'da:**
   - Collection oluştur → Handle'ı not al
   - Ürün oluştur → Handle'ı not al
   - Ürünü collection'a ekle

2. **Sitede:**
   - Kategori: `/kategorien/[collection-handle]`
   - Ürün: `/produkte/[product-handle]`

3. **Kontrol:**
   - Her iki sayfada da ürün görünüyor mu?
   - Resimler, fiyat, açıklama doğru mu?

---

## 🎓 Öğrendiklerin

### 1. **Handle Nedir?**
- Handle = URL-friendly versiyonu
- Örnek: `Test Produkt 1` → `test-produkt-1`
- Shopify otomatik oluşturur, manuel değiştirilebilir

### 2. **Collection vs Product**
- **Collection** = Kategori (ürünleri gruplar)
- **Product** = Tek ürün
- Ürün **birden fazla collection'a** eklenebilir

### 3. **Sitede Nasıl Çalışıyor?**
- Next.js **server-side** Shopify Storefront API'den veri çeker
- Her sayfa yüklendiğinde **canlı veri** çekilir
- Cache yok → Shopify'da değişiklik hemen sitede görünür

### 4. **Deployment Sonrası**
- Vercel'de deploy edildikten sonra:
  - Environment variables doğru mu? (`NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN`)
  - Build başarılı mı?
  - Domain doğru mu?

---

## ✅ Test Checklist

- [ ] Collection oluşturuldu
- [ ] Collection handle not edildi
- [ ] Ürün oluşturuldu
- [ ] Ürün handle not edildi
- [ ] Ürün collection'a eklendi
- [ ] Kategori sayfası test edildi (`/kategorien/[handle]`)
- [ ] Ürün detay sayfası test edildi (`/produkte/[handle]`)
- [ ] Resimler görünüyor
- [ ] Fiyat doğru
- [ ] Açıklama görünüyor

---

**Başarılar! 🚀**

