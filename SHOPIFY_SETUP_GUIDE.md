# Shopify Sipariş ve Ödeme Entegrasyonu Rehberi

## Gerekli Shopify Pluginleri ve Ayarlar

### 1. Ödeme Yöntemleri (Payment Providers)

#### PayPal
- **Shopify Admin → Settings → Payments → PayPal**
- PayPal hesabınızı bağlayın
- Test modunda test edebilirsiniz
- **Önemli:** PayPal'ı aktif hale getirmek için PayPal Business hesabı gereklidir

#### CoinGate (Kripto Para)
- **Shopify App Store → "CoinGate"** arayın
- CoinGate hesabı oluşturun
- API key'lerinizi Shopify'a ekleyin
- Desteklenen kripto paraları seçin

#### Kredi Kartı (Stripe veya Shopify Payments)
- **Shopify Admin → Settings → Payments**
- **Shopify Payments** (Almanya için mevcut) veya **Stripe** kullanabilirsiniz
- 3D Secure desteği otomatik olarak dahildir
- Banka hesabı bilgilerinizi eklemeniz gerekir

#### Vorkasse (Manuel Ödeme)
- **Shopify Admin → Settings → Payments → Manual payment methods**
- "Bank deposit" veya "Cash on delivery" seçeneklerini aktif edin
- Banka hesap bilgilerinizi ekleyin

### 2. Bonus Puan Sistemi (Loyalty Points)

#### Önerilen Plugin: **Smile.io** veya **LoyaltyLion**
- **Shopify App Store → "Smile.io"** veya **"LoyaltyLion"** arayın
- Kurulum:
  1. App'i yükleyin
  2. Puan kurallarını ayarlayın:
     - **1 EUR = 1 Puan** (Earn Rate)
     - **20 Puan = 1 EUR İndirim** (Redemption Rate)
  3. API entegrasyonu için API key'lerinizi alın
  4. Webhook'ları ayarlayın (sipariş sonrası puan verme için)

#### Alternatif: Custom Metafields ile
- Shopify Admin → Settings → Custom data → Customers
- Customer metafield oluşturun: `bonus_points` (number)
- Her sipariş sonrası puanları manuel veya script ile güncelleyin

### 3. Sipariş Yönetimi

#### Shopify Order Management (Built-in)
- Shopify zaten sipariş yönetimi içerir
- **Orders** bölümünden tüm siparişleri görebilirsiniz
- Otomatik e-posta bildirimleri gönderilir

#### Önerilen Ek Pluginler:
- **Order Printer** - Fatura ve kargo etiketleri için
- **ShipStation** veya **EasyShip** - Kargo yönetimi için
- **AfterShip** - Kargo takibi için

### 4. Kargo Entegrasyonu

#### DHL
- **Shopify Admin → Settings → Shipping and delivery**
- **DHL** shipping provider'ı ekleyin
- DHL hesap bilgilerinizi girin
- Kargo oranlarını ayarlayın

#### Selbstabholer (Pickup)
- **Shopify Admin → Settings → Shipping and delivery**
- **Local pickup** seçeneğini aktif edin
- Adres bilgilerinizi ekleyin (Neuss)

### 5. Vergi Ayarları

#### Almanya için KDV (MwSt.)
- **Shopify Admin → Settings → Taxes**
- **Automatic tax calculation** aktif edin
- Almanya için %19 KDV otomatik hesaplanır
- Ürün fiyatlarınızın "including tax" olarak işaretlendiğinden emin olun

### 6. API Entegrasyonu için Gerekli Ayarlar

#### Storefront API Scopes
Aşağıdaki scope'ların aktif olduğundan emin olun:
- `unauthenticated_read_product_listings`
- `unauthenticated_read_product_inventory`
- `unauthenticated_read_checkouts`
- `unauthenticated_write_checkouts`
- `unauthenticated_write_customers`
- `unauthenticated_read_customers`

#### Admin API Scopes (Bonus Puanlar için)
- `read_customers`
- `write_customers`
- `read_orders`
- `write_orders`

### 7. Webhook'lar (Sipariş Sonrası İşlemler)

#### Gerekli Webhook'lar:
1. **Order created** - Sipariş oluşturulduğunda bonus puan verme
2. **Order paid** - Ödeme alındığında siparişi onaylama
3. **Order fulfilled** - Kargo gönderildiğinde müşteriye bildirim

**Kurulum:**
- Shopify Admin → Settings → Notifications → Webhooks
- Yeni webhook oluşturun
- Endpoint URL'inizi girin (örn: `https://vampirevape.vercel.app/api/webhooks/order-created`)

## Kurulum Adımları

### Adım 1: PayPal Kurulumu
1. Shopify Admin → Settings → Payments
2. PayPal'ı seçin ve "Activate" tıklayın
3. PayPal Business hesabınızla giriş yapın
4. Onaylayın

### Adım 2: Bonus Puan Plugin'i Kurulumu
1. Shopify App Store'dan Smile.io veya LoyaltyLion'u yükleyin
2. Kurulum sihirbazını takip edin
3. Puan kurallarını ayarlayın (1 EUR = 1 Puan, 20 Puan = 1 EUR)
4. API key'lerinizi not edin

### Adım 3: Kargo Ayarları
1. Settings → Shipping and delivery
2. DHL'i ekleyin ve hesap bilgilerinizi girin
3. Local pickup için adres ekleyin

### Adım 4: API Entegrasyonu
1. App'inizin Storefront API token'ını kontrol edin
2. Gerekli scope'ların aktif olduğundan emin olun
3. Webhook'ları ayarlayın

## Test Etme

1. **Test Siparişi Oluştur:**
   - Test modunda bir ürün ekleyin
   - Checkout sayfasından sipariş verin
   - Tüm ödeme yöntemlerini test edin

2. **Bonus Puan Testi:**
   - Bir sipariş verin
   - Müşteri hesabında puanların eklendiğini kontrol edin
   - Puanları kullanarak indirim almayı test edin

3. **Kargo Testi:**
   - Farklı adreslerle test siparişleri oluşturun
   - Kargo oranlarının doğru hesaplandığını kontrol edin

## Önemli Notlar

- **PayPal:** Test modunda test edebilirsiniz, ancak gerçek ödemeler için PayPal Business hesabı gereklidir
- **Bonus Puanlar:** Şu anda localStorage'da saklanıyor, gerçek kullanım için Shopify Customer metafields veya bir plugin kullanılmalı
- **Vergi:** Ürün fiyatlarınız vergi dahil ise, Shopify'da "Prices include tax" seçeneğini aktif edin
- **Güvenlik:** Tüm API key'lerinizi environment variables'da saklayın, asla kod içine yazmayın

## Sonraki Adımlar

1. PayPal'ı bağlayın
2. Bonus puan plugin'ini kurun ve API'yi entegre edin
3. Webhook'ları ayarlayın
4. Test siparişleri oluşturun
5. Gerçek siparişleri izleyin

