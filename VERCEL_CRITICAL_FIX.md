# 🚨 Vercel Deployment - Kritik Düzeltmeler

## ⚠️ SORUN: Site Aktif Değil

Environment variable'larına baktım. **Kritik sorun**:

### ❌ `NEXT_PUBLIC_SITE_URL` Sadece Production'da Var!

Bu Preview ve Development build'lerinde sorun yaratabilir.

## ✅ HEMEN YAPILMASI GEREKENLER

### 1. Environment Variable Düzeltmesi

Vercel Dashboard → Settings → Environment Variables:

1. `NEXT_PUBLIC_SITE_URL` değişkenini bul
2. **"Edit"** butonuna tıkla
3. **"Environments"** bölümünde:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
   - Hepsini seç!
4. **"Save"** butonuna tıkla

### 2. Vercel Project Settings Kontrolü

Vercel Dashboard → Settings → General:

#### Root Directory
- **Root Directory**: `apps/storefront` ✅ (Doğru görünüyor)

#### Build & Development Settings
- **Framework Preset**: Next.js (otomatik algılanmalı)
- **Build Command**: **BOŞ BIRAK** (Vercel otomatik algılar)
- **Output Directory**: **BOŞ BIRAK** (Next.js otomatik `.next` kullanır)
- **Install Command**: **BOŞ BIRAK** (Vercel otomatik `npm install` yapar)

### 3. Yeni Deployment

1. Environment variable'ı düzelttikten sonra
2. Vercel Dashboard → Deployments
3. **"Redeploy"** butonuna tıkla
4. Ya da yeni bir commit push et

## 🔍 Build Loglarını Kontrol Et

1. Vercel Dashboard → Deployments
2. Son deployment'a tıkla
3. **"Build Logs"** sekmesine git
4. Hata var mı kontrol et

### Olası Hatalar:

- ❌ "No Next.js version detected"
  - **Çözüm**: Root Directory `apps/storefront` olmalı

- ❌ "Module not found"
  - **Çözüm**: `package.json` dosyaları git'te var mı kontrol et

- ❌ "Environment variable not found"
  - **Çözüm**: Tüm değişkenler **All Environments** için ekli olmalı

## 📋 Kontrol Listesi

- [ ] `NEXT_PUBLIC_SITE_URL` → **All Environments** için ekli
- [ ] Root Directory → `apps/storefront`
- [ ] Build Command → **BOŞ**
- [ ] Output Directory → **BOŞ**
- [ ] Yeni deployment yapıldı
- [ ] Build loglarında hata yok

## 🎯 Hızlı Test

Deployment sonrası:

1. `https://vampirevape.vercel.app` adresini aç
2. 404 hatası mı? → Root Directory kontrolü
3. Blank page? → Browser console'da hata var mı kontrol et
4. Build hatası? → Build logs'u kontrol et

## 💡 İpucu

Eğer hala çalışmıyorsa, build loglarını paylaş. O zaman tam olarak neyin yanlış olduğunu görebiliriz.

