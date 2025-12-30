# 📄 Shopify Pages ile İçerik Yönetimi (Strapi Yerine)

**Strapi gereksiz!** Shopify'ın kendi **Pages** ve **Blog** özelliklerini kullanarak tüm içerikleri yönetebilirsin.

---

## ✅ Neden Shopify Pages?

1. **Tek Platform:** Zaten Shopify kullanıyorsun, ekstra CMS'e gerek yok
2. **Basit:** Shopify Admin'den direkt yönetim
3. **Ücretsiz:** Shopify Plus'ın bir parçası
4. **SEO Friendly:** Shopify'ın built-in SEO özellikleri

---

## 📝 Shopify'da İçerik Oluşturma

### A) Blog Posts (Blog Yazıları)

**Adımlar:**
1. Shopify Admin → **Online Store** → **Blog posts**
2. **"Add blog post"** butonuna tıkla
3. Formu doldur:
   - **Title:** Blog başlığı
   - **Content:** Blog içeriği (rich text editor)
   - **Excerpt:** Kısa özet (SEO için)
   - **Featured image:** Resim yükle
   - **Author:** Yazar adı
   - **Tags:** Etiketler
4. **"Save"** → **"Publish"**

**URL formatı:**
- Shopify'da: `/blogs/[blog-handle]/[post-handle]`
- Next.js'te: `/blog/[handle]` (handle mapping gerekir)

---

### B) Pages (Static Sayfalar: Impressum, AGB, vb.)

**Adımlar:**
1. Shopify Admin → **Online Store** → **Pages**
2. **"Add page"** butonuna tıkla
3. Formu doldur:
   - **Title:** Sayfa başlığı (örn: "Impressum")
   - **Content:** Sayfa içeriği
   - **Search engine listing preview:** SEO ayarları
4. **"Save"** → **"Publish"**

**URL formatı:**
- Shopify'da: `/pages/[page-handle]`
- Next.js'te: `/impressum`, `/agb`, vb. (handle mapping)

---

### C) Lexikon (Özel Sayfalar)

**Seçenek 1: Pages olarak oluştur**
- Her lexikon entry'si bir Page olarak oluştur
- Handle: `lexikon-[entry-name]`
- Next.js'te `/lexikon/[slug]` route'unda handle'ı parse et

**Seçenek 2: Blog olarak oluştur**
- Yeni bir Blog oluştur: "Lexikon"
- Her entry bir blog post olarak ekle
- Next.js'te `/lexikon/[slug]` route'unda blog post'u çek

---

## 🔧 Next.js'te Shopify Pages Kullanımı

### Admin API ile Pages Çekme

**Not:** Storefront API Pages desteklemiyor, **Admin API** kullanman gerekir.

**Örnek kod:**
```javascript
// apps/storefront/src/utils/shopify-admin.js
const ADMIN_API_URL = `https://${SHOPIFY_STORE}/admin/api/2024-10/pages.json`;

export async function getShopifyPages() {
  const response = await fetch(ADMIN_API_URL, {
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
    },
  });
  return await response.json();
}
```

---

## 🎯 Önerilen Yaklaşım

### Basit Çözüm: Static Markdown Files

Strapi yerine **Next.js'te markdown dosyaları** kullan:

```
apps/storefront/content/
├── blog/
│   ├── vaping-tipps.md
│   └── liquid-guide.md
├── lexikon/
│   ├── nicotine.md
│   └── pg-vg.md
└── pages/
    ├── impressum.md
    ├── agb.md
    └── datenschutz.md
```

**Avantajlar:**
- ✅ Ekstra API yok
- ✅ Git'te version control
- ✅ Hızlı ve basit
- ✅ SEO friendly

---

## 📋 Karşılaştırma

| Özellik | Strapi | Shopify Pages | Markdown Files |
|---------|--------|---------------|----------------|
| Kurulum | Karmaşık | ✅ Zaten var | ✅ Basit |
| Hosting | Ayrı server | ✅ Shopify'da | ✅ Next.js'te |
| Maliyet | Ekstra | ✅ Ücretsiz | ✅ Ücretsiz |
| Yönetim | Strapi Admin | ✅ Shopify Admin | ✅ Git/Editor |
| API | Strapi API | Admin API | ✅ File system |

---

## ✅ Öneri: Markdown Files Kullan

**Neden?**
- En basit çözüm
- Ekstra dependency yok
- Git'te version control
- Hızlı ve güvenilir

**Nasıl?**
1. `apps/storefront/content/` klasörü oluştur
2. Markdown dosyaları ekle
3. Next.js'te `fs` ile oku
4. `remark` ile parse et

---

## 🚀 Hızlı Başlangıç

**Strapi'yi kaldır:**
```powershell
# Strapi klasörünü sil (opsiyonel)
# apps/strapi klasörü kullanılmıyorsa silebilirsin
```

**Markdown files kullan:**
```powershell
# Content klasörü oluştur
mkdir apps\storefront\content
mkdir apps\storefront\content\blog
mkdir apps\storefront\content\pages
```

**Next.js'te oku:**
- `fs.readFileSync()` ile markdown oku
- `remark` ile HTML'e çevir
- Component'te göster

---

**Sonuç:** Strapi gereksiz karmaşıklık. Shopify Pages veya Markdown files kullan, daha basit ve hızlı! 🚀

