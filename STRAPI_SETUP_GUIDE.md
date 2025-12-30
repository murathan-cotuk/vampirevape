# 📝 Strapi CMS Kurulum ve Kullanım Rehberi

Bu rehber, Strapi CMS'e nasıl erişeceğini ve içerikleri nasıl yöneteceğini **adım adım** öğretir.

---

## 🚀 1. Strapi'yi Başlatma

### Yöntem A: Docker ile (Önerilen - Production için)

```powershell
# Root dizinden
cd infra
docker-compose up -d
```

**İlk başlatmada:**
- Strapi otomatik initialize olur
- Admin kullanıcısı oluşturman istenir (ilk açılışta)

**Erişim:**
- Admin Panel: http://localhost:1337/admin
- API: http://localhost:1337/api

---

### Yöntem B: Local Development (Manuel)

```powershell
# Root dizinden
cd apps/strapi

# Dependencies yükle
npm install

# İlk kez başlatıyorsan (initialize)
npm run develop
```

**İlk başlatmada:**
- Terminal'de admin kullanıcısı oluşturman istenir:
  - Email
  - Password
  - First name
  - Last name

**Erişim:**
- Admin Panel: http://localhost:1337/admin
- API: http://localhost:1337/api

---

## 🔐 2. Admin Paneline İlk Giriş

### İlk Kez Açıyorsan

1. **http://localhost:1337/admin** adresine git
2. **"Create your admin account"** formunu doldur:
   - First name: `Admin`
   - Last name: `User`
   - Email: `admin@vampirevape.de`
   - Password: (güçlü bir şifre)
3. **"Let's start"** butonuna tıkla

### Zaten Admin Kullanıcın Varsa

1. **http://localhost:1337/admin** adresine git
2. Email ve password ile giriş yap

---

## 📋 3. Content Type'ları Oluşturma

Strapi'de içerik yönetmek için **Content Type** oluşturman gerekir.

### A) Blog Post Content Type

**Adımlar:**
1. Admin Panel → **Content-Type Builder** (sol menü)
2. **"Create new collection type"** butonuna tıkla
3. **Display name:** `Blog Post`
4. **API ID (singular):** `blog-post`
5. **API ID (plural):** `blog-posts`
6. **"Continue"** butonuna tıkla

**Fields ekle:**
- **Text** → `title` (Short text, Required)
- **Rich text** → `content` (Long text, Required)
- **Text** → `slug` (Short text, Required, Unique)
- **Media** → `featuredImage` (Single media, Required)
- **Date** → `publishedAt` (Date, Required)
- **Text** → `excerpt` (Short text, Optional)
- **Text** → `author` (Short text, Optional)
- **Text** → `tags` (Short text, Optional - multiple values)

**Save** butonuna tıkla → **"Restart now"**

---

### B) Lexikon Entry Content Type

**Adımlar:**
1. **Content-Type Builder** → **"Create new collection type"**
2. **Display name:** `Lexikon Entry`
3. **API ID (singular):** `lexikon-entry`
4. **API ID (plural):** `lexikon-entries`
5. **"Continue"**

**Fields ekle:**
- **Text** → `title` (Short text, Required)
- **Rich text** → `content` (Long text, Required)
- **Text** → `slug` (Short text, Required, Unique)
- **Media** → `image` (Single media, Optional)
- **Text** → `category` (Short text, Optional)

**Save** → **"Restart now"**

---

### C) Static Page Content Type

**Adımlar:**
1. **Content-Type Builder** → **"Create new collection type"**
2. **Display name:** `Static Page`
3. **API ID (singular):** `static-page`
4. **API ID (plural):** `static-pages`
5. **"Continue"**

**Fields ekle:**
- **Text** → `title` (Short text, Required)
- **Rich text** → `content` (Long text, Required)
- **Text** → `slug` (Short text, Required, Unique)
- **Text** → `pageType` (Short text, Required) - Enum: `impressum`, `agb`, `datenschutz`, `faq`, `kontakt`, `ueber-uns`

**Save** → **"Restart now"**

---

## 🔓 4. API Permissions Ayarlama

Strapi varsayılan olarak API'yi **private** yapar. Next.js'in API'ye erişebilmesi için permissions açman gerekir.

**Adımlar:**
1. Admin Panel → **Settings** → **Users & Permissions plugin** → **Roles**
2. **"Public"** role'üne tıkla
3. **Permissions** bölümünde:
   - **Blog Post** → `find` ve `findOne` işaretle
   - **Lexikon Entry** → `find` ve `findOne` işaretle
   - **Static Page** → `find` ve `findOne` işaretle
4. **"Save"** butonuna tıkla

---

## ✍️ 5. İçerik Oluşturma

### Blog Post Oluşturma

1. Admin Panel → **Content Manager** → **Blog Posts**
2. **"Create new entry"** butonuna tıkla
3. Formu doldur:
   - **Title:** Blog başlığı
   - **Slug:** URL-friendly versiyonu (örn: `vaping-tipps`)
   - **Content:** Blog içeriği (rich text editor)
   - **Featured Image:** Resim yükle
   - **Published At:** Yayın tarihi
   - **Excerpt:** Kısa özet
4. **"Save"** butonuna tıkla
5. **"Publish"** butonuna tıkla (yayınlamak için)

**Sitede görünür:**
- URL: `http://localhost:3000/blog/vaping-tipps`

---

### Lexikon Entry Oluşturma

1. **Content Manager** → **Lexikon Entries**
2. **"Create new entry"**
3. Formu doldur:
   - **Title:** Lexikon başlığı
   - **Slug:** URL-friendly versiyonu
   - **Content:** Açıklama
   - **Image:** (opsiyonel)
   - **Category:** (opsiyonel)
4. **"Save"** → **"Publish"**

**Sitede görünür:**
- URL: `http://localhost:3000/lexikon/[slug]`

---

### Static Page Oluşturma (Impressum, AGB, vb.)

1. **Content Manager** → **Static Pages**
2. **"Create new entry"**
3. Formu doldur:
   - **Title:** Sayfa başlığı (örn: "Impressum")
   - **Slug:** URL-friendly versiyonu (örn: `impressum`)
   - **Content:** Sayfa içeriği
   - **Page Type:** Dropdown'dan seç (`impressum`, `agb`, vb.)
4. **"Save"** → **"Publish"**

**Sitede görünür:**
- URL: `http://localhost:3000/impressum`

---

## 🔍 6. API'den İçerik Çekme (Next.js)

Next.js zaten Strapi API'ye bağlı! `apps/storefront/src/utils/strapi.js` dosyasında helper fonksiyonlar var.

**Örnek kullanım:**
```javascript
import { getBlogPostBySlug } from '@/utils/strapi';

const post = await getBlogPostBySlug('vaping-tipps');
```

---

## 🛠️ 7. Strapi Komutları

### Development Mode
```powershell
cd apps/strapi
npm run develop
```
- Hot reload aktif
- Admin panel: http://localhost:1337/admin

### Production Build
```powershell
cd apps/strapi
npm run build
npm run start
```

### Docker ile
```powershell
cd infra
docker-compose up -d        # Başlat
docker-compose down         # Durdur
docker-compose logs strapi  # Logları gör
```

---

## 📁 8. Strapi Klasör Yapısı

```
apps/strapi/
├── config/          # Konfigürasyon dosyaları
│   ├── database.js  # Database ayarları
│   └── server.js    # Server ayarları
├── src/
│   ├── api/         # API endpoints (otomatik oluşur)
│   ├── components/  # Reusable components
│   └── content-types/ # Content type tanımları (otomatik oluşur)
├── public/          # Public dosyalar
└── package.json
```

---

## 🔧 9. Sorun Giderme

### "Cannot connect to database"
**Çözüm:**
- PostgreSQL çalışıyor mu? (`docker-compose ps`)
- Database credentials doğru mu? (`apps/strapi/config/database.js`)

### "Admin panel açılmıyor"
**Çözüm:**
- Port 1337 kullanımda mı? (`netstat -ano | findstr :1337`)
- Strapi çalışıyor mu? (`npm run develop`)

### "API 403 Forbidden"
**Çözüm:**
- Public role permissions açık mı? (Settings → Roles → Public)

---

## ✅ Hızlı Başlangıç Checklist

- [ ] Strapi başlatıldı (`npm run develop` veya `docker-compose up`)
- [ ] Admin kullanıcısı oluşturuldu
- [ ] Admin panele giriş yapıldı (http://localhost:1337/admin)
- [ ] Blog Post content type oluşturuldu
- [ ] Lexikon Entry content type oluşturuldu
- [ ] Static Page content type oluşturuldu
- [ ] Public role permissions açıldı
- [ ] Test içerik oluşturuldu ve publish edildi
- [ ] Next.js'te içerik görünüyor mu test edildi

---

## 🎯 Sonraki Adımlar

1. **Content Type'ları oluştur** (Blog, Lexikon, StaticPage)
2. **Permissions ayarla** (Public role)
3. **Test içerik oluştur**
4. **Next.js'te test et** (`/blog/[slug]`, `/lexikon/[slug]`, `/impressum`)

**Başarılar! 🚀**

