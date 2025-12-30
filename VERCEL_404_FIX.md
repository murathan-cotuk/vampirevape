# 🔧 Vercel 404 NOT_FOUND Sorunu - Kesin Çözüm

## ❌ Sorun
Ana sayfa (`https://vampirevape.vercel.app/`) açılmıyor, **404: NOT_FOUND** hatası veriyor.

## 🔍 Root Cause
Vercel proje ayarlarında **Output Directory** yanlış veya **Framework detection** çalışmıyor.

---

## ✅ Kesin Çözüm (Adım Adım)

### 1. Vercel Project Settings'e Git
- Vercel Dashboard → Projeni seç → **Settings**

### 2. General Ayarları
**Settings → General**
- **Root Directory**: `apps/storefront` ✅
- **Node.js Version**: `20.x` (önerilen)

### 3. Build & Development Settings
**Settings → Build & Development Settings**

**Kritik ayarlar:**
- **Framework Preset**: `Next.js` ✅
- **Build Command**: **BOŞ BIRAK** (Vercel otomatik `next build` yapar)
  - Veya: `npm run build` (eğer custom script varsa)
- **Output Directory**: **BOŞ BIRAK** ⚠️ (EN ÖNEMLİSİ!)
  - ❌ `public` yazma!
  - ❌ `dist` yazma!
  - ✅ Tamamen boş bırak
- **Install Command**: `npm install` ✅

### 4. Environment Variables
**Settings → Environment Variables**

Aşağıdaki değişkenlerin **hem Production hem Preview** için tanımlı olduğundan emin ol:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=vampirevape-2.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN=YOUR_STOREFRONT_TOKEN_HERE
SHOPIFY_ADMIN_API_TOKEN=YOUR_ADMIN_TOKEN_HERE
SHOPIFY_STORE=vampirevape-2.myshopify.com
SHOPIFY_API_KEY=YOUR_API_KEY_HERE
SHOPIFY_API_SECRET=YOUR_API_SECRET_HERE
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=https://vampirevape.vercel.app
```

**Not:** Token'ları `.env.local` dosyasından veya Vercel Environment Variables'dan alın.

**Her değişken için:**
- ✅ **Production** seçili
- ✅ **Preview** seçili (dev branch için)

### 5. Redeploy
**Deployments** → Son deployment → **Redeploy**

---

## 🧪 Doğru Build Log Nasıl Görünür?

Redeploy sonrası logda şunları görmelisin:

```
Installing dependencies...
added 1827 packages, and audited 1830 packages in 1m

Running "npm run build"
▲ Next.js 14.2.33
Creating an optimized production build ...
✓ Compiled successfully
Generating static pages (11/11)
```

**❌ Yanlış log (404'e sebep olur):**
```
Build Completed in /vercel/output [115ms]
Skipping cache upload because no files were prepared
```

---

## 🚨 Hala 404 Veriyorsa?

### Alternatif Çözüm: Projeyi Sıfırdan Import Et

1. Vercel Dashboard → **Add New Project**
2. GitHub repo'yu seç
3. **Import Project** ekranında:
   - **Root Directory**: `apps/storefront`
   - **Framework Preset**: `Next.js` (otomatik seçilmeli)
   - **Build Command**: boş
   - **Output Directory**: boş
4. Environment variables'ı ekle (yukarıdaki listeden)
5. **Deploy**

---

## 📝 Notlar

- **Output Directory boş olmalı** çünkü Next.js kendi output'unu yönetir
- **Root Directory `apps/storefront`** olmalı (monorepo için)
- Environment variables **hem Production hem Preview** için tanımlı olmalı

---

## ✅ Başarı Kriterleri

- ✅ Ana sayfa açılıyor: `https://vampirevape.vercel.app/`
- ✅ Kategori sayfası çalışıyor: `/kategorien/[handle]`
- ✅ Ürün sayfası çalışıyor: `/produkte/[handle]`
- ✅ Build log'da `next build` görünüyor
- ✅ Build log'da `Generating static pages` görünüyor

---

**Sorun devam ederse:** Vercel deployment log'unun tamamını paylaş, birlikte inceleyelim.

