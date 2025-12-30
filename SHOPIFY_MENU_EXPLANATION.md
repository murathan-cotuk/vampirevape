# 🍔 Shopify Menu Açıklaması

## ❌ Sorun

Shopify'da **Content > Menus** altından oluşturduğunuz menüler **Admin API'de erişilebilir değil**.

**Test Sonuçları:**
- ❌ REST API: `/admin/api/2024-10/online_store/navigation_menus.json` → **404 Not Found**
- ❌ GraphQL Admin API: `navigationMenus` field → **Field doesn't exist**
- ❌ Legacy Menus API: `/admin/api/2024-10/menus.json` → **403 Forbidden (scope yok)**

**Sebep:** Shopify'ın Content > Menus altından oluşturulan menüler **theme'e bağlı** ve Admin API'de direkt erişilebilir değil.

---

## ✅ Çözüm: Collections Tabanlı Dinamik Menu

Shopify'da menu oluşturmak yerine, **collections'ları kullanarak dinamik menu** oluşturuyoruz.

### Nasıl Çalışıyor?

1. **Shopify'dan tüm collections çekilir** (Storefront API ile)
2. **Collections, isim/handle'a göre kategorilere ayrılır:**
   - "Aroma" içeren → "Aromen" menüsü altında
   - "Liquid" içeren → "E-Liquids" menüsü altında
   - vb.

3. **Menu otomatik oluşur:**
   - Ana kategoriler: E-Liquids, Hardware, Aromen, vb.
   - Alt kategoriler: Collections (örn: "30ml Aroma")

---

## 📝 Shopify'da Collection Oluşturma

### "30ml Aroma" Collection'ını "Aromen" Altında Göstermek İçin:

1. **Shopify Admin** → **Products** → **Collections**
2. Collection oluştur veya düzenle
3. **Collection title:** `30ml Aroma` (veya "Aroma" içeren bir isim)
4. **Collection handle:** `30ml-aroma` (otomatik oluşur)

**Sonuç:** Collection otomatik olarak "Aromen" menüsü altında görünür!

---

## 🎯 Menu Yapısı

Menu şu şekilde çalışır:

```
E-Liquids
├── [Collections with "liquid" in name]
Hardware
├── [Collections with "hardware", "zigarette", etc. in name]
Aromen
├── 30ml Aroma (collection)
├── [Other collections with "aroma" in name]
Nicotine Shots
├── [Collections with "nicotine" or "shot" in name]
```

---

## 🔧 Özelleştirme

Menu yapısını değiştirmek için `Navbar.js` dosyasındaki `menuStructure` array'ini düzenle:

```javascript
const menuStructure = [
  {
    name: 'Aromen',
    href: '/aromen',
    filters: ['aroma'], // Bu kelimeleri içeren collections burada görünür
    subcategories: [],
  },
  // ...
];
```

---

## ✅ Avantajlar

1. **Basit:** Ekstra API endpoint yok
2. **Otomatik:** Yeni collection ekle → menu'de görünür
3. **Esnek:** Collection isimlerine göre filtreleme
4. **Güvenilir:** Storefront API her zaman çalışır

---

## 🚀 Kullanım

1. **Shopify'da collection oluştur:**
   - Title: "30ml Aroma"
   - Handle: otomatik

2. **Sitede kontrol et:**
   - "Aromen" menüsüne hover yap
   - "30ml Aroma" görünmeli

3. **Tıklayınca:**
   - `/kategorien/30ml-aroma` sayfasına gider

---

## 💡 Alternatif Çözümler (İleri Seviye)

Eğer Content > Menus altından oluşturduğunuz menüyü kullanmak istiyorsanız:

1. **Metafield ile Menu Saklama:**
   - Menu yapısını JSON olarak bir metafield'da saklayın
   - Admin API ile metafield'ı çekin

2. **Shopify Page ile Menu:**
   - Menu yapısını bir Shopify Page'de JSON olarak saklayın
   - Storefront API ile page'i çekin

3. **Custom App ile Menu:**
   - Shopify App oluşturup menu'yu custom endpoint'ten çekin

**Not:** Bu çözümler daha karmaşık ve ekstra geliştirme gerektirir. Collections tabanlı yaklaşım daha basit ve esnek! 🎉

