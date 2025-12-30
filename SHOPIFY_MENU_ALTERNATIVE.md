# 🍔 Shopify Menu Alternatif Çözüm

## ❌ Sorun

Shopify Admin API'de **menu/navigation endpoint'i yok**. Test sonuçları:
- ❌ Navigation Menus API: 404 Not Found
- ❌ Legacy Menus API: 403 Forbidden (scope yok)

**Sebep:** Shopify'ın Navigation menüleri Admin API'de direkt erişilebilir değil, theme'e bağlı.

---

## ✅ Çözüm: Collections Tabanlı Dinamik Menu

Shopify'da menu oluşturmak yerine, **collections'ları kullanarak dinamik menu** oluşturuyoruz.

### Nasıl Çalışıyor?

1. **Shopify'dan tüm collections çekilir**
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

**Not:** Shopify'ın Navigation menu'sü Admin API'de erişilebilir değil, bu yüzden collections tabanlı yaklaşım kullanıyoruz. Bu daha basit ve esnek! 🎉

