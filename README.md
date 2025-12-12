# 🧛 Vampire Vape Shopify Plus Headless

Headless e-commerce storefront for Vampire Vape, built with Next.js App Router and Shopify Plus.

## 📋 Proje Özeti

Bu proje, Shopware6'dan Shopify Plus'a geçiş yapan **Vampire Vape** için tam headless bir e-ticaret çözümüdür.

### 🎯 Özellikler

- **Next.js 14** (App Router, JavaScript)
- **Shopify Plus Storefront API** (GraphQL)
- **Shopify Plus Admin API** (Bulk import, metafields)
- **Strapi CMS** (Blog, Lexikon, statik sayfalar)
- **TailwindCSS** (Modern UI)
- **Framer Motion** (Animasyonlar)
- **Migration Scripts** (Shopware6 → Shopify Plus)

## 🏗️ Proje Yapısı

```
vampirevape-monorepo/
├── apps/
│   ├── storefront/          # Next.js App Router
│   │   ├── src/
│   │   │   ├── app/         # Routes & pages
│   │   │   ├── components/  # React components
│   │   │   └── utils/       # Utilities
│   │   └── package.json
│   └── strapi/               # Strapi CMS
├── scripts/
│   └── migrate-shopware/    # Migration scripts
├── infra/
│   ├── docker-compose.yml    # Docker setup
│   └── vercel.json          # Vercel config
└── README.md
```

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+
- npm veya yarn
- Docker (Strapi için)
- Shopify Partners hesabı
- Shopware6 API erişimi (migration için)

### 1. Repository'yi klonlayın

```bash
git clone <repository-url>
cd vampirevape-monorepo
```

### 2. Dependencies yükleyin

```bash
npm install
```

### 3. Environment Variables

Storefront için `.env.local` dosyası oluşturun:

```env
# Shopify
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=vampirevape-2.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN=your-storefront-token
SHOPIFY_ADMIN_API_TOKEN=your-admin-token

# Strapi
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# Site
NEXT_PUBLIC_SITE_URL=https://www.vampirevape.de
```

### 4. Development Server

```bash
# Storefront
npm run dev

# Strapi (Docker ile)
cd infra
docker-compose up -d
```

## 📦 Migration (Shopware6 → Shopify Plus)

### 1. Shopware6'dan Veri Export

```bash
cd scripts/migrate-shopware
npm install

# Environment variables
export SHOPWARE_URL=https://your-shopware-instance.com
export SHOPWARE_ACCESS_KEY=your-access-key

# Export
npm run export
```

### 2. Veriyi Shopify Formatına Dönüştür

```bash
npm run transform
```

### 3. Görselleri Yükle

```bash
# Shopify CDN veya Cloudinary
export UPLOAD_METHOD=shopify  # veya cloudinary
npm run upload-images
```

### 4. Shopify'a Import

```bash
export SHOPIFY_STORE=vampirevape-2.myshopify.com
export SHOPIFY_ADMIN_API_TOKEN=your-admin-token
npm run import
```

### 5. Redirects Oluştur

```bash
npm run redirects
# CSV dosyasını Shopify Admin'e import edin
```

## 🛠️ Development

### Storefront

```bash
cd apps/storefront
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
```

### Strapi CMS

```bash
cd apps/strapi
npm run develop  # Development mode
npm run build    # Production build
```

## 🎨 Component Yapısı

### Header Components
- `AnnouncementBar` - Duyuru çubuğu
- `TopBar` - Üst bar (5 link)
- `LogoSearchCart` - Logo, arama, favoriler, konto, warenkorb
- `Navbar` - Ana navigasyon

### Container Components
- `HeroSlider` - Ana slider
- `BannerSection` - Banner bölümleri
- `TopLiquidsSlider` - Top liquids
- `CategoryGrid` - Kategori grid
- `TrustedShopsReviews` - Kundenbewertungen
- `FlavoursGrid` - Aromen grid
- `BlogPostsSlider` - Blog posts

### Product Templates
- `TemplateA` - Klasik ürün sayfası
- `TemplateB` - Big media layout
- `TemplateC` - Bundle template
- `TemplateD` - Nicotine/Shot template

### Category Templates
- `TemplateGrid` - Grid layout
- `TemplateMasonry` - Masonry layout
- `TemplateFilterLeft` - Filter sidebar
- `TemplateFilterTop` - Filter top bar

## 🔗 Entegrasyonlar

### Shopify Plus
- Storefront API (GraphQL) - Ürün, koleksiyon, stok
- Admin API - Import, metafields, media

### Strapi CMS
- Blog posts
- Lexikon entries
- Static pages

### Ödeme Sistemleri
- Klarna
- PayPal
- Stripe
- Apple Pay
- Google Pay

### Diğer
- Trusted Shops (Reviews)
- Mailchimp (Newsletter)
- Recaptcha (Forms)
- Uptain (Conversion optimization)
- Xentral & Odoo (ERP)

## 📱 Responsive & PWA

- Tüm componentler responsive
- PWA configuration (ileride)
- Mobile-first approach

## 🚢 Deployment

### Vercel

```bash
vercel --prod
```

Vercel otomatik olarak Next.js uygulamasını deploy eder.

### Strapi

Strapi ayrı bir server'da veya Docker container'da çalıştırılabilir.

## 📝 SEO

- Meta tags (title, description, canonical)
- Schema.org markup (Product, Breadcrumb, Article)
- Sitemap generation
- 301 redirects (Shopware6 → Shopify)

## 🧪 Testing

```bash
# Linting
npm run lint

# Type checking (if TypeScript added later)
npm run type-check
```

## 📄 Lisans

Proprietary - Vampire Vape

## 👥 Katkıda Bulunanlar

- Development Team

## 📞 İletişim

Sorularınız için issue açabilirsiniz.

---

**Not:** Bu proje aktif geliştirme aşamasındadır. Production'a geçmeden önce tüm entegrasyonların test edilmesi gerekmektedir.

