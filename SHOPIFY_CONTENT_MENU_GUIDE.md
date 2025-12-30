# 🍔 Shopify Content > Menus Kullanım Kılavuzu

## ✅ Çözüm: Storefront API ile Menu Çekme

Shopify'da **Content > Menus** altından oluşturduğunuz menüleri **Storefront API** ile çekebilirsiniz!

---

## 📝 Shopify'da Menu Oluşturma

### Adım 1: Menu Oluştur

1. **Shopify Admin** → **Content** → **Menus**
2. **"Add menu"** butonuna tıkla
3. **Menu title:** Örn: "Main Menu"
4. **Menu handle:** Otomatik oluşur (örn: `main-menu-1`)

### Adım 2: Menu Items Ekle

1. **"Add menu item"** butonuna tıkla
2. **Item type** seç:
   - **Collection:** Bir collection'a link
   - **Product:** Bir ürüne link
   - **Page:** Bir sayfaya link (Impressum, Blog, vb.)
   - **Custom link:** Özel URL

3. **Item title:** Menüde görünecek isim
4. **URL:** Otomatik oluşur (collection/product/page seçtiysen)

### Adım 3: Nested Menu Items (Alt Menü)

1. Bir menu item'ın yanındaki **"..."** butonuna tıkla
2. **"Add submenu item"** seç
3. Alt menü item'ları ekle

**Örnek Yapı:**
```
Main Menu
├── E-Liquids
│   ├── Alle Liquids
│   └── Top Liquids
├── Hardware
│   ├── E-Zigaretten
│   └── Verdampfer
└── Aromen
    └── 30ml Aroma
```

---

## 🔧 Next.js'te Menu Kullanımı

### Otomatik Çalışıyor! 🎉

Kod zaten hazır ve çalışıyor:

1. **Menu handle'ı kontrol et:**
   - Shopify Admin → Content → Menus
   - Menu'nun handle'ını not et (örn: `main-menu-1`)

2. **Kod otomatik olarak:**
   - `main-menu-1` handle'ını dener
   - Bulamazsa `main-menu` handle'ını dener
   - Menu'yu Storefront API'den çeker
   - Navbar'da gösterir

---

## 🎯 Menu Handle'ını Değiştirme

Eğer menu handle'ını değiştirmek istersen:

### Yöntem 1: Menu Title'ı Değiştir

1. **Shopify Admin** → **Content** → **Menus**
2. Menu'yu aç
3. **Menu title**'ı değiştir
4. Handle otomatik güncellenir

**Not:** Handle'ı manuel değiştiremezsin, sadece title'ı değiştirerek etkileyebilirsin.

### Yöntem 2: Kod'da Handle Değiştir

`apps/storefront/src/components/header/Header.js` dosyasında:

```javascript
// main-menu-1 yerine kendi handle'ını kullan
fetch('/api/shopify-menu?handle=YOUR-MENU-HANDLE')
```

---

## 🚀 Test Etme

1. **Shopify'da menu oluştur:**
   - Content → Menus → Add menu
   - Menu items ekle

2. **Menu handle'ını kontrol et:**
   - Menu'nun handle'ı ne? (örn: `main-menu-1`)

3. **Localhost'ta test et:**
   ```bash
   npm run dev
   ```
   - `http://localhost:3000` aç
   - Navbar'da menu görünmeli

4. **Eğer görünmüyorsa:**
   - Browser console'u kontrol et
   - Menu handle'ını doğru mu kontrol et
   - Storefront API token'ı doğru mu kontrol et

---

## 📋 Menu Item Types

Shopify'da menu item'ları şu tiplerde olabilir:

1. **Collection:** `/collections/[handle]` → Next.js'te `/kategorien/[handle]`
2. **Product:** `/products/[handle]` → Next.js'te `/produkte/[handle]`
3. **Page:** `/pages/[handle]` → Next.js'te `/[handle]`
4. **Blog:** `/blogs/[handle]` → Next.js'te `/blog/[handle]`
5. **Custom Link:** Olduğu gibi kullanılır

**URL mapping otomatik yapılıyor!** ✅

---

## ✅ Avantajlar

1. **Shopify Admin'den yönet:** Kod değiştirmeden menu'yu yönet
2. **Nested menus:** Alt menüler destekleniyor
3. **Otomatik URL mapping:** Shopify URL'leri Next.js route'larına otomatik map ediliyor
4. **Storefront API:** Hızlı ve güvenilir

---

## 🐛 Sorun Giderme

### Menu görünmüyor

1. **Menu handle'ını kontrol et:**
   - Shopify Admin → Content → Menus
   - Menu'nun handle'ı ne?

2. **Storefront API token kontrol:**
   - `.env.local` dosyasında `NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN` var mı?

3. **Browser console kontrol:**
   - F12 → Console
   - Hata var mı?

### Menu items görünmüyor

1. **Menu'da item'lar var mı?**
   - Shopify Admin → Content → Menus
   - Menu'yu aç, item'lar var mı?

2. **Menu handle doğru mu?**
   - Kod `main-menu-1` arıyor, senin menu handle'ın ne?

---

## 🎉 Başarılı!

Artık Shopify'da Content > Menus altından oluşturduğun menüleri Next.js'te kullanabilirsin!

**Özet:**
1. Shopify'da menu oluştur (Content → Menus)
2. Menu items ekle
3. Menu handle'ını not et
4. Kod otomatik çalışır! 🚀

