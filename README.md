# 🧛 Vampire Vape Shopify Plus Headless

Headless E-Commerce Storefront für Vampire Vape, erstellt mit Next.js App Router und Shopify Plus.

## 📋 Projektübersicht

Dieses Projekt ist eine vollständige Headless E-Commerce-Lösung für **Vampire Vape**, die von Shopware6 zu Shopify Plus migriert.

### 🎯 Features

- **Next.js 14** (App Router, JavaScript)
- **Shopify Plus Storefront API** (GraphQL)
- **Shopify Plus Admin API** (Bulk-Import, Metafelder)
- **Strapi CMS** (Blog, Lexikon, statische Seiten)
- **TailwindCSS** (Moderne UI)
- **Framer Motion** (Animationen)
- **Migrations-Skripte** (Shopware6 → Shopify Plus)

## 🏗️ Projektstruktur

```
vampirevape-monorepo/
├── apps/
│   ├── storefront/          # Next.js App Router
│   │   ├── src/
│   │   │   ├── app/         # Routes & Seiten
│   │   │   ├── components/  # React-Komponenten
│   │   │   └── utils/       # Utilities
│   │   └── package.json
│   └── strapi/               # Strapi CMS
├── scripts/
│   └── migrate-shopware/    # Migrations-Skripte
├── infra/
│   ├── docker-compose.yml    # Docker-Setup
│   └── vercel.json          # Vercel-Konfiguration
└── README.md
```

## 🚀 Installation

### Voraussetzungen

- Node.js 18+
- npm oder yarn
- Docker (für Strapi)
- Shopify Partners-Account
- Shopware6 API-Zugang (für Migration)

### 1. Repository klonen

```bash
git clone <repository-url>
cd vampirevape-monorepo
```

### 2. Dependencies installieren

```bash
npm install
```

### 3. Umgebungsvariablen

Erstellen Sie eine `.env.local` Datei für den Storefront:

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

# Strapi (mit Docker)
cd infra
docker-compose up -d
```

## 📦 Migration (Shopware6 → Shopify Plus)

### 1. Datenexport aus Shopware6

```bash
cd scripts/migrate-shopware
npm install

# Umgebungsvariablen
export SHOPWARE_URL=https://your-shopware-instance.com
export SHOPWARE_ACCESS_KEY=your-access-key

# Export 
npm run export
```

### 2. Daten in Shopify-Format konvertieren

```bash
npm run transform
```

### 3. Bilder hochladen

```bash
# Shopify CDN oder Cloudinary
export UPLOAD_METHOD=shopify  # oder cloudinary
npm run upload-images
```

### 4. Import nach Shopify

```bash
export SHOPIFY_STORE=vampirevape-2.myshopify.com
export SHOPIFY_ADMIN_API_TOKEN=your-admin-token
npm run import
```

### 5. Weiterleitungen erstellen

```bash
npm run redirects
# CSV-Datei in Shopify Admin importieren
```

## 🛠️ Entwicklung

### Storefront

```bash
cd apps/storefront
npm run dev      # Development Server
npm run build    # Production Build
npm run start    # Production Server
```

### Strapi CMS

```bash
cd apps/strapi
npm run develop  # Development-Modus
npm run build    # Production Build
```

## 🎨 Komponentenstruktur

### Header-Komponenten
- `AnnouncementBar` - Ankündigungsleiste
- `TopBar` - Top-Leiste (5 Links)
- `LogoSearchCart` - Logo, Suche, Favoriten, Konto, Warenkorb
- `Navbar` - Hauptnavigation

### Container-Komponenten
- `HeroSlider` - Hauptslider
- `BannerSection` - Banner-Bereiche
- `TopLiquidsSlider` - Top Liquids
- `CategoryGrid` - Kategorie-Grid
- `TrustedShopsReviews` - Kundenbewertungen
- `FlavoursGrid` - Aromen-Grid
- `BlogPostsSlider` - Blog-Beiträge

### Produkt-Templates
- `TemplateA` - Klassische Produktseite
- `TemplateB` - Big Media Layout
- `TemplateC` - Bundle-Template
- `TemplateD` - Nicotine/Shot-Template

### Kategorie-Templates
- `TemplateGrid` - Grid-Layout
- `TemplateMasonry` - Masonry-Layout
- `TemplateFilterLeft` - Filter-Sidebar
- `TemplateFilterTop` - Filter-Top-Leiste

## 🔗 Integrationen

### Shopify Plus
- Storefront API (GraphQL) - Produkte, Kollektionen, Lagerbestand
- Admin API - Import, Metafelder, Medien

### Strapi CMS
- Blog-Beiträge
- Lexikon-Einträge
- Statische Seiten

### Zahlungssysteme
- Klarna
- PayPal
- Stripe
- Apple Pay
- Google Pay

### Weitere
- Trusted Shops (Bewertungen)
- Mailchimp (Newsletter)
- Recaptcha (Formulare)
- Uptain (Conversion-Optimierung)
- Xentral & Odoo (ERP)

## 📱 Responsive & PWA

- Alle Komponenten sind responsive
- PWA-Konfiguration (zukünftig)
- Mobile-First-Ansatz

## 🚢 Deployment

### Vercel

```bash
vercel --prod
```

Vercel deployt die Next.js-Anwendung automatisch.

### Strapi

Strapi kann auf einem separaten Server oder in einem Docker-Container ausgeführt werden.

## 📝 SEO

- Meta-Tags (Titel, Beschreibung, Canonical)
- Schema.org-Markup (Product, Breadcrumb, Article)
- Sitemap-Generierung
- 301-Weiterleitungen (Shopware6 → Shopify)

## 🧪 Testing

```bash
# Linting
npm run lint

# Type Checking (falls TypeScript später hinzugefügt wird)
npm run type-check
```

## 📄 Lizenz

Proprietär - Vampire Vape

## 👥 Mitwirkende

- Entwicklungsteam

## 📞 Kontakt

Für Fragen können Sie ein Issue erstellen.

---

**Hinweis:** Dieses Projekt befindet sich in aktiver Entwicklung. Vor dem Produktivbetrieb müssen alle Integrationen getestet werden.
