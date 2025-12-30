# 🔧 Vercel 404 NOT_FOUND - Kesin Çözüm (Final)

## ❌ Sorun
Ana sayfa `https://vampirevape.vercel.app/` açılmıyor, **404: NOT_FOUND** hatası veriyor.

---

## ✅ Kesin Çözüm (Adım Adım)

### 1. Vercel Project Settings Kontrolü

**Vercel Dashboard → Projeni seç → Settings → General**

**Kontrol listesi:**
- ✅ **Root Directory:** `apps/storefront` (monorepo için)
- ✅ **Node.js Version:** `20.x` (önerilen)

---

### 2. Build & Development Settings (KRİTİK!)

**Settings → Build & Development Settings**

**Bu ayarlar kesinlikle şöyle olmalı:**

```
Framework Preset: Next.js
Build Command: (BOŞ BIRAK - Vercel otomatik next build yapar)
Output Directory: (BOŞ BIRAK - Next.js kendi output'unu yönetir)
Install Command: npm install
```

**⚠️ EN ÖNEMLİSİ: Output Directory BOŞ olmalı!**
- ❌ `public` yazma!
- ❌ `dist` yazma!
- ❌ `.next` yazma!
- ✅ **Tamamen boş bırak!**

---

### 3. Environment Variables Kontrolü

**Settings → Environment Variables**

**Tüm değişkenler "All Environments" için tanımlı olmalı:**

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=vampirevape-2.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN=YOUR_TOKEN
SHOPIFY_ADMIN_API_TOKEN=YOUR_TOKEN
SHOPIFY_STORE=vampirevape-2.myshopify.com
SHOPIFY_API_KEY=YOUR_KEY
SHOPIFY_API_SECRET=YOUR_SECRET
NEXT_PUBLIC_SITE_URL=https://vampirevape.vercel.app
```

**Her değişken için:**
- ✅ **Production** seçili
- ✅ **Preview** seçili

---

### 4. Deployment Kontrolü

**Deployments → Son deployment → View Build Logs**

**Doğru build log şöyle görünmeli:**

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

### 5. Eğer Hala 404 Veriyorsa: Projeyi Sıfırdan Import Et

**En garantili çözüm:**

1. **Yeni Proje Oluştur:**
   - Vercel Dashboard → **Add New Project**
   - GitHub repo'yu seç: `murathan-cotuk/vampirevape`

2. **Import Settings:**
   - **Root Directory:** `apps/storefront`
   - **Framework Preset:** `Next.js` (otomatik seçilmeli)
   - **Build Command:** (boş)
   - **Output Directory:** (boş)
   - **Install Command:** `npm install`

3. **Environment Variables:**
   - Tüm env vars'ı ekle (yukarıdaki listeden)

4. **Deploy:**
   - **Deploy** butonuna tıkla

---

## 🔍 Sorun Tespiti

### Build log'da "115ms /vercel/output" görüyorsan:

**Sebep:** Vercel Next.js'i detect edemiyor veya build çalışmıyor.

**Çözüm:**
1. Root Directory'nin `apps/storefront` olduğundan emin ol
2. `apps/storefront/package.json` dosyasının repoda olduğundan emin ol
3. `next` dependency'sinin `package.json`'da olduğundan emin ol

### Build log'da "No Next.js version detected" görüyorsan:

**Sebep:** `package.json` repoda yok veya yanlış yerde.

**Çözüm:**
1. `apps/storefront/package.json` dosyasının commit edildiğinden emin ol
2. Root Directory'nin `apps/storefront` olduğundan emin ol

---

## ✅ Başarı Kriterleri

Deploy başarılı olduğunda:
- ✅ Ana sayfa açılıyor: `https://vampirevape.vercel.app/`
- ✅ Kategori sayfası çalışıyor: `/kategorien/[handle]`
- ✅ Ürün sayfası çalışıyor: `/produkte/[handle]`
- ✅ Build log'da `next build` görünüyor
- ✅ Build log'da `Generating static pages` görünüyor

---

## 🚨 Son Çare: Manuel Build Test

Lokal olarak build test et:

```powershell
cd apps/storefront
npm install
npm run build
```

Eğer lokal build başarılıysa ama Vercel'de 404 veriyorsa → **Vercel ayarları yanlış** demektir.

---

**Sorun devam ederse:** Vercel deployment log'unun tamamını paylaş, birlikte inceleyelim.

