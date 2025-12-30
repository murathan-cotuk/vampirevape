# 🔑 Environment Variables Rehberi

## ✅ 1. Vercel Environment Variables - DOĞRU

Vercel'deki ayarların **doğru**! "All Environments" seçili, bu hem Production hem Preview için geçerli demek.

**Tek düzeltme:**
- `NEXT_PUBLIC_SITE_URL` production'da Vercel domain'in olmalı:
  - Production: `https://vampirevape.vercel.app` (veya custom domain)
  - Preview: `https://vampirevape-git-dev-xxx.vercel.app` (otomatik)

**Öneri:** Vercel'de `NEXT_PUBLIC_SITE_URL` için:
- Production: `https://vampirevape.vercel.app`
- Preview: `https://www.vampirevape.de` (veya boş bırak, otomatik alır)

---

## ✅ 2. .env.local - DOĞRU

`.env.local` dosyan **doğru**! Localhost için yeterli.

---

## 📝 3. 3 Farklı Environment (Localhost, Dev, Main)

### Localhost (.env.local)
```env
NEXT_PUBLIC_SITE_URL=https://www.vampirevape.de
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

### Dev Branch (Vercel Preview)
- Vercel otomatik preview deployment yapar
- Environment variables Vercel'den gelir
- `NEXT_PUBLIC_SITE_URL` preview URL'si olabilir

### Main Branch (Vercel Production)
- Production deployment
- Environment variables Vercel'den gelir
- `NEXT_PUBLIC_SITE_URL` production domain olmalı

**Özet:** Her environment için farklı `NEXT_PUBLIC_SITE_URL` olmalı, diğerleri aynı kalabilir.

---

## 🛍️ 5. Menüler ve Sayfalar - Shopify vs Strapi

### Shopify Koleksiyonları (Ürün Kategorileri)
**Sadece ürün koleksiyonları için Shopify kullanılır:**
- ✅ E-Liquids → Shopify Collection
- ✅ Hardware → Shopify Collection
- ✅ Aromen → Shopify Collection (örn: "30ml Aroma")
- ✅ Nicotine Shots → Shopify Collection
- ✅ Bundles → Shopify Collection
- ✅ Angebote → Shopify Collection

**Nasıl çalışır:**
- Shopify'da collection oluştur
- Menü otomatik collection'ları gösterir (eğer filter varsa)
- `/kategorien/[handle]` sayfası collection'ı gösterir

### Strapi CMS (İçerik Sayfaları)
**Static sayfalar ve içerik için Strapi kullanılır:**
- ✅ Blog → Strapi Blog Posts
- ✅ Lexikon → Strapi Lexikon Entries
- ✅ Impressum → Strapi Static Page
- ✅ AGB → Strapi Static Page
- ✅ Datenschutz → Strapi Static Page
- ✅ FAQ → Strapi Static Page
- ✅ Kontakt → Strapi Static Page
- ✅ Über Uns → Strapi Static Page

**Nasıl çalışır:**
- Strapi'de content type oluştur (Blog, Lexikon, StaticPage)
- Next.js sayfaları Strapi API'den çeker
- `/blog/[slug]`, `/lexikon/[slug]`, `/impressum` gibi sayfalar

### Next.js Static Sayfalar (Hardcoded)
**Bazı sayfalar direkt Next.js'te:**
- ✅ Warenkorb (Cart) → Next.js component
- ✅ Konto (Account) → Next.js component
- ✅ Anmelden (Login) → Next.js component

---

## 📋 Özet Tablo

| Sayfa Tipi | Kaynak | Örnek |
|------------|--------|-------|
| Ürün Kategorileri | Shopify Collections | `/kategorien/30ml-aroma` |
| Ürün Detay | Shopify Products | `/produkte/heisenberg` |
| Blog | Strapi Blog | `/blog/vaping-tipps` |
| Lexikon | Strapi Lexikon | `/lexikon/nicotine` |
| Static Pages | Strapi StaticPage | `/impressum`, `/agb` |
| Cart/Account | Next.js Components | `/warenkorb`, `/konto` |

---

## 🎯 Sonuç

1. ✅ Vercel env vars doğru (sadece NEXT_PUBLIC_SITE_URL production'da güncellenebilir)
2. ✅ .env.local doğru
3. ✅ 3 environment için farklı NEXT_PUBLIC_SITE_URL mantıklı
4. ✅ Menüler için sadece ürün koleksiyonları Shopify'dan gelir
5. ✅ Static sayfalar (impressum, agb) Strapi'den gelecek

