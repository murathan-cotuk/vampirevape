Vampire Vape Shopify Headless Projesi
Adım adım yapılacaklar listesi
1. Önce mevcut sistemi test ederek durum netleştir

Önce yeni geliştirme yapma. Önce şu 4 akışı tek tek test et ve sonucu yazılı raporla çıkar:

1.1 Register testi
Newsletter checkbox seçili kayıt ol
Shopify Admin’de customer durumunu kontrol et
Beklenen: SUBSCRIBED
Checkbox seçili değilken tekrar test et
Beklenen: NOT_SUBSCRIBED
1.2 Login testi
Mevcut bir kullanıcı ile giriş yap
Giriş sonrası hesap sayfası açılıyor mu kontrol et
Sayfa yenilenince login state korunuyor mu kontrol et
1.3 Newsletter subscribe testi
/newsletteranmeldung sayfasından abone ol
Shopify Admin’de ilgili customer SUBSCRIBED oluyor mu kontrol et
1.4 Newsletter unsubscribe testi
/newsletteranmeldung sayfasından abonelikten çık
Shopify Admin’de ilgili customer NOT_SUBSCRIBED oluyor mu kontrol et
1.5 Test raporu oluştur
Her test için:
request payload
response
backend log
Shopify Admin sonucu
Bunları tek markdown dosyada topla
2. Newsletter ve unsubscribe akışını tamamen kapat

Bu konu açık kalmasın. Stabil hale getir.

2.1 Subscribe route kontrolü
/api/newsletter/subscribe route’unu kontrol et
Customer varsa update, yoksa create akışı net mi bak
GraphQL mutation ve REST fallback loglarını temizle
2.2 Unsubscribe route kontrolü
/api/newsletter/unsubscribe route’unu kontrol et
Customer bulunamazsa doğru 404 dönüyor mu bak
consentUpdatedAt hardening gerçekten çalışıyor mu kontrol et
Frontend request doğru endpoint’e gidiyor mu kontrol et
2.3 Frontend hata mesajlarını düzelt
Subscribe başarısızsa kullanıcı net mesaj görsün
Unsubscribe başarısızsa kullanıcı net mesaj görsün
2.4 Mailchimp sync durumunu test et
Shopify Admin → Apps → Mailchimp içine gir
Audience mapping doğru mu kontrol et
Customer Event Syncing açık mı kontrol et
Gerekirse re-authenticate yap
Sync now / force resync varsa çalıştır
Sonucu yazılı rapora ekle
3. Login sistemini düzelt

Şu anki login sistemi production için doğru değil. Bunu Shopify Storefront API ile düzelt.

3.1 Mevcut login mantığını analiz et
/api/shopify/login route’unu incele
Admin API ile email lookup yapılıyorsa bunu kaldır
3.2 Shopify Storefront API login’e geç
customerAccessTokenCreate mutation kullan
Başarılı girişte:
access token
expiresAt
döndür
3.3 Frontend login akışını güncelle
Login sonrası token’ı sakla
Şimdilik localStorage kullanılabilir ama yapı temiz olsun
Header account state token’a göre çalışsın
3.4 Logout ekle / düzelt
Logout butonunda token temizlensin
Header state ve hesap sayfası anında güncellensin
3.5 Protected route mantığını düzelt
/konto sayfası girişsiz açılmasın
Token yoksa /anmelden sayfasına yönlendir
4. Register akışını production-ready yap

Register formu büyük ölçüde hazır ama backend tarafını sağlamlaştır.

4.1 Validation’ı gözden geçir
Zorunlu alanlar eksiksiz kontrol ediliyor mu bak
Hatalar field-level düzgün gösteriliyor mu bak
4.2 Duplicate customer kontrolünü güçlendir
Aynı email varsa net hata dön
Frontend’de kullanıcı dostu hata göster
4.3 Customer create sonrası response standardize et
Tüm response formatlarını tek yapıya çevir
success / error / message yapısı tutarlı olsun
4.4 Register sonrası kullanıcı akışını netleştir

Karar ver:

Kayıt sonrası otomatik login mi olacak
yoksa “Bitte bestätigen Sie Ihre E-Mail” mesajı mı gösterilecek

Bunu netleştir ve tek bir akış uygula

5. Cart ve checkout sistemini sağlamlaştır

Bu kısım kritik. Satış akışı burada bitecek.

5.1 Mevcut cart yapısını analiz et
Sepet local state mi kullanıyor
Shopify cart API bağlı mı
add to cart düzgün çalışıyor mu
5.2 Shopify cart API’ye geç / bağla
Cart create
Cart lines add
Cart lines update
Cart lines remove
Cart fetch
5.3 Checkout akışını düzelt
Checkout için Shopify checkout URL kullan
Headless frontend’den checkoutUrl’e yönlendir
/checkout route’unun çakışma üretmediğini tekrar doğrula
5.4 Mini cart / cart page testi yap
Ürün ekleme
Adet değiştirme
Ürün silme
Checkout’a gitme
6. Hesap sayfasını gerçek customer verisi ile tamamla

Şu an sadece temel yapı varsa bunu geliştir.

6.1 Customer data fetch düzelt
Shopify’dan gerçek customer bilgilerini çek
Ad, soyad, email, telefon, adresler
6.2 Hesap sayfasını bölümlere ayır
Profil bilgileri
Adresler
Siparişler
Newsletter durumu
6.3 Newsletter durumu hesap sayfasında göster
Customer SUBSCRIBED mi NOT_SUBSCRIBED mi görünür hale getir
7. Kategori ve ürün sayfalarını stabilize et

Bunlar çalışıyor gibi görünüyor ama production kontrolü şart.

7.1 Kategori sayfası kontrolleri
Sol sticky filtre düzgün çalışıyor mu
Sağ banner hizası doğru mu
Mobilde layout bozuluyor mu
7.2 Ürün sayfası kontrolleri
Produkt nicht gefunden hatası tekrar ediyor mu
Tüm handle’lar doğru resolve oluyor mu
Metafield’lar eksiksiz geliyor mu
7.3 Ürün varyant testi
Varyant seçimleri doğru mu
Fiyat / stok / görsel değişimi doğru mu
8. API katmanını temizle ve standardize et

Şu an route’lar büyümüş olabilir. Bunları temizle.

8.1 Tüm API route’ları gözden geçir
register
login
customer
newsletter subscribe
newsletter unsubscribe
8.2 Ortak helper yapısı kur
Shopify Admin fetch helper
Shopify Storefront fetch helper
standart error response helper
standart success response helper
8.3 Log formatlarını standardize et

Her route’ta loglar aynı yapıda olsun:

route adı
email / customerId
request sonucu
error varsa detay
9. Güvenlik ve production hazırlığı yap

Bu bölüm atlanmamalı.

9.1 Environment variable kontrolü
Tüm tokenlar .env dosyasında mı
frontend’e gereksiz secret sızıyor mu kontrol et
9.2 Admin API kullanımını sınırla
Customer create/update gibi zorunlu işlemler dışında Admin API’yi frontend login mantığında kullanma
9.3 Kullanıcıya gösterilen hata mesajlarını sadeleştir
Backend detayları kullanıcıya gösterme
Sadece anlaşılır mesaj göster
10. SEO ve performans düzenlemeleri

Core commerce tarafı stabil olduktan sonra buna geç.

10.1 Metadata kontrolü
kategori sayfaları
ürün sayfaları
statik sayfalar
10.2 Schema kontrolü
Product schema
Breadcrumb schema
10.3 Caching / ISR
Sık değişmeyen sayfalar için revalidate kullan
Ürün/kategori fetch’lerde gereksiz request azalt
10.4 Görsel optimizasyon
next/image yapısını kontrol et
büyük banner’lar performansı bozuyor mu kontrol et
Öncelik sırası

Cursor bu sırayla ilerlesin:

Faz 1
Test raporu çıkar
Newsletter subscribe/unsubscribe düzelt ve kapat
Mailchimp sync netleştir
Faz 2
Login sistemini Storefront API’ye geçir
Register backend’i temizle
Hesap sayfasını gerçek customer akışına bağla
Faz 3
Cart + checkout akışını bitir
Kategori / ürün sayfalarını stabilize et
API cleanup
SEO + performance