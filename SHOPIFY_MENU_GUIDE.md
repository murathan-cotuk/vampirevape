# 🍔 Shopify'da Menü Oluşturma ve Next.js'te Kullanma

Bu rehber, Shopify'da menü oluşturup Next.js sitede dinamik olarak göstermeyi öğretir.

---

## 📝 Shopify'da Menü Oluşturma

### Adım 1: Navigation Menüsü Oluştur

1. **Shopify Admin** → **Online Store** → **Navigation**
2. **"Add menu"** butonuna tıkla
3. **Menu bilgileri:**
   - **Menu name:** `Main Menu` (veya istediğin isim)
   - **Menu handle:** `main-menu` (otomatik oluşur, değiştirebilirsin)

4. **"Save menu"** butonuna tıkla

---

### Adım 2: Menü Öğeleri Ekle

Menü oluşturulduktan sonra, **"Add menu item"** butonuna tıkla.

#### A) Collection (Kategori) Ekleme

1. **"Add menu item"** → **"Collection"** seç
2. Collection'ı seç (örn: "30ml Aroma")
3. **Menu item name:** Görünen isim (örn: "30ml Aroma")
4. **"Add"** butonuna tıkla

#### B) Page (Sayfa) Ekleme

1. **"Add menu item"** → **"Page"** seç
2. Sayfayı seç (örn: "Impressum", "AGB")
3. **Menu item name:** Görünen isim
4. **"Add"** butonuna tıkla

#### C) Product (Ürün) Ekleme

1. **"Add menu item"** → **"Product"** seç
2. Ürünü seç
3. **Menu item name:** Görünen isim
4. **"Add"** butonuna tıkla

#### D) Custom Link (Özel Link) Ekleme

1. **"Add menu item"** → **"Custom link"** seç
2. **Name:** Görünen isim (örn: "Blog")
3. **Link:** URL (örn: `/blog`)
4. **"Add"** butonuna tıkla

---

### Adım 3: Alt Menü (Submenu) Oluşturma

Shopify'da **nested menu** (alt menü) oluşturmak için:

1. Bir menu item'ın yanında **"..."** (üç nokta) butonuna tıkla
2. **"Add submenu item"** seç
3. Submenu item'ı ekle (Collection, Page, Product, veya Custom link)
4. **Drag & drop** ile sıralamayı değiştirebilirsin

**Örnek yapı:**
```
Main Menu
├── E-Liquids
│   ├── Alle Liquids
│   ├── Top Liquids
│   └── Neue Liquids
├── Hardware
│   ├── E-Zigaretten
│   └── Verdampfer
└── Aromen
    └── 30ml Aroma
```

---

### Adım 4: Menüyü Aktif Etme

1. Menü oluşturulduktan sonra, **"Online Store"** → **"Themes"** → **"Customize"**
2. **"Header"** bölümüne git
3. **"Main menu"** dropdown'ından oluşturduğun menüyü seç
4. **"Save"** butonuna tıkla

**Not:** Headless storefront'ta bu adım gerekli değil, sadece menü oluşturman yeterli.

---

## 🔧 Next.js'te Menüyü Kullanma

### Admin API ile Menü Çekme

Shopify Storefront API menü desteklemiyor, **Admin API** kullanman gerekir.

**Environment Variable:**
```env
SHOPIFY_ADMIN_API_TOKEN=shpat_xxxxx
SHOPIFY_STORE=vampirevape-2.myshopify.com
```

**Kod:**
```javascript
import { getShopifyMenu } from '@/utils/shopify';

const { menu } = await getShopifyMenu('main-menu');
// menu.items → menu items array
```

---

## 📋 Menu Item Yapısı

Shopify Admin API'den gelen menu item yapısı:

```javascript
{
  id: 123,
  title: "E-Liquids",
  url: "/collections/e-liquids",
  type: "collection", // "collection", "page", "product", "http"
  items: [ // Submenu items (nested)
    {
      id: 124,
      title: "Alle Liquids",
      url: "/collections/alle-liquids",
      type: "collection"
    }
  ]
}
```

---

## 🎯 URL Mapping

Shopify menu item URL'leri Next.js route'larına map etmen gerekir:

- `/collections/[handle]` → `/kategorien/[handle]`
- `/pages/[handle]` → `/[handle]` (örn: `/pages/impressum` → `/impressum`)
- `/products/[handle]` → `/produkte/[handle]`
- Custom links → olduğu gibi

---

## ✅ Örnek Kullanım

```javascript
// apps/storefront/src/components/header/Navbar.js
const { menu } = await getShopifyMenu('main-menu');

menu.items.map((item) => (
  <Link href={mapShopifyUrl(item.url)}>
    {item.title}
  </Link>
));
```

---

## 🚀 Hızlı Başlangıç

1. **Shopify'da:**
   - Navigation → Add menu → "Main Menu"
   - Menu items ekle (Collections, Pages, Custom links)
   - Submenu items ekle (drag & drop ile)

2. **Next.js'te:**
   - `getShopifyMenu()` fonksiyonu zaten hazır
   - Navbar component'i menüyü otomatik çeker
   - URL mapping yapılır

3. **Test:**
   - Localhost'ta menü görünüyor mu?
   - Menu items doğru linklere gidiyor mu?

---

**Başarılar! 🎉**

