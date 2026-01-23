# ChatGPT Rapor - Mailchimp Sync & Unsubscribe Test

## 📋 Test Tarihi
[Test sonrası doldurulacak]

---

## 🎯 Test Öncesi Hazırlık

### Frontend Debug Logging
✅ Frontend'de unsubscribe için debug log'lar eklendi:
- `Unsubscribe request:` - Request detayları
- `Unsubscribe response:` - Response status ve URL
- `Unsubscribe response data:` - Response body

### Backend Logging
✅ Backend'de detaylı log'lar mevcut:
- Customer bulunamazsa: `Customer not found for email: ...`
- Başarılı: `✅ Consent updated successfully { marketingState: "NOT_SUBSCRIBED", ... }`
- Hata: `Consent update failed { status, errors, userErrors, customerId, email }`
- REST fallback: `✅ Email marketing consent updated via REST API fallback`

### Route Endpoint
✅ Unsubscribe route: `/api/newsletter/unsubscribe`
✅ Method: `POST`
✅ Body format: `{ "email": "test@example.com" }`

---

## 1️⃣ Mailchimp Sync Kontrolü

### A) Sync Overview Ekranı

**Shopify Admin → Apps → Mailchimp**

**Kontrol Edilecekler:**
- [ ] "Sync now" / "Force resync" butonu var mı?
  - **Durum:** [Evet/Hayır]
  - **Aksiyon:** [Tıklandı/Tıklanmadı]
  - **Son Sync Zamanı:** [Tarih/Saat]

**Sync Tamamlandıktan Sonra:**
- [ ] Mailchimp → Audience → Contacts'ta email ile arama yapıldı
  - **Email:** [test@example.com]
  - **Sonuç:** [Bulundu/Bulunmadı]

---

### B) Settings → Customer Event Syncing

**Kontrol:**
- [ ] Customer Event Syncing açık mı?
  - **Durum:** [Evet/Hayır]
  - **Aksiyon:** [Açıldı/Zaten açıktı]

---

### C) App Embed

**Kontrol:**
- [ ] "Enable Mailchimp App Embed" banner/ayarı görünüyor mu?
  - **Durum:** [Evet/Hayır]
  - **Aksiyon:** [Turn on yapıldı/Zaten açıktı]

- [ ] Theme settings'te Mailchimp embed aktif mi?
  - **Durum:** [Evet/Hayır]

---

### D) Re-authenticate

**Kontrol:**
- [ ] Mailchimp app içinde "Re-authenticate / Connect" var mı?
  - **Durum:** [Evet/Hayır]
  - **Aksiyon:** [Yeniden bağlandı/Zaten bağlı]

---

### E) Audience Mapping

**Kontrol:**
- [ ] Mailchimp app içinde bağlı audience adı nedir?
  - **Audience Adı:** [Audience adı]

- [ ] Mailchimp dashboard'da kontrol edilen audience aynı mı?
  - **Durum:** [Evet/Hayır]
  - **Fark varsa:** [Hangi audience'lar farklı?]

---

## 2️⃣ Unsubscribe Route Testi

### A) Frontend Network Kontrolü

**Test Adımları:**
1. `/newsletteranmeldung` sayfasına git
2. "Abmelden" tab'ına tıkla
3. Email gir
4. "Abmelden" butonuna tıkla
5. DevTools → Network tab'ını aç

**Kontrol Edilecekler:**

#### Request URL
- **Beklenen:** `/api/newsletter/unsubscribe`
- **Gerçek:** [URL]
- **Durum:** [✅ Doğru / ❌ Yanlış]

#### Method
- **Beklenen:** `POST`
- **Gerçek:** [Method]
- **Durum:** [✅ Doğru / ❌ Yanlış]

#### Request Body
- **Beklenen:** `{ "email": "test@example.com" }`
- **Gerçek:** [Body içeriği]
- **Durum:** [✅ Doğru / ❌ Yanlış]

#### Response Status
- **Beklenen:** `200` (başarılı) veya `404` (customer bulunamadı) veya `500` (server hatası)
- **Gerçek:** [Status code]
- **Durum:** [✅ 200 / ⚠️ 404 / ❌ 500 / ❌ Diğer]

#### Response Body
- **Beklenen (Başarılı):** `{ "success": true, "message": "Erfolgreich vom Newsletter abgemeldet!" }`
- **Beklenen (Hata):** `{ "error": "..." }`
- **Gerçek:** [Response body]
- **Durum:** [✅ Başarılı / ❌ Hata]

---

### B) Backend Log Kontrolü

**Kontrol Edilecekler:**

#### Başarılı Durum
- [ ] Log'da şu mesaj görünüyor mu?
  ```
  ✅ Consent updated successfully {
    marketingState: "NOT_SUBSCRIBED",
    marketingOptInLevel: "UNKNOWN",
    consentUpdatedAt: "...",
    customerId: ...,
    email: "..."
  }
  ```
  - **Durum:** [Evet/Hayır]
  - **Log Çıktısı:** [Log mesajını buraya yapıştır]

#### Hata Durumları

**1. Customer Bulunamadı:**
- [ ] Log'da şu mesaj görünüyor mu?
  ```
  Customer not found for email: ...
  ```
  - **Durum:** [Evet/Hayır]
  - **Log Çıktısı:** [Log mesajını buraya yapıştır]

**2. Consent Update Failed:**
- [ ] Log'da şu mesaj görünüyor mu?
  ```
  Consent update failed {
    status: 200,
    errors: null,
    userErrors: [...],
    customerId: ...,
    email: "..."
  }
  ```
  - **Durum:** [Evet/Hayır]
  - **userErrors İçeriği:** [userErrors array'ini buraya yapıştır]
  - **Log Çıktısı:** [Tam log mesajını buraya yapıştır]

**3. REST Fallback:**
- [ ] Log'da şu mesaj görünüyor mu?
  ```
  ✅ Email marketing consent updated via REST API fallback
  ```
  - **Durum:** [Evet/Hayır]
  - **Log Çıktısı:** [Log mesajını buraya yapıştır]

---

### C) Shopify Admin Kontrolü

**Test Sonrası:**
- [ ] Customer'ın "Email marketing" bölümünde state nedir?
  - **State:** [SUBSCRIBED / NOT_SUBSCRIBED / PENDING]
  - **Durum:** [✅ Doğru / ❌ Yanlış]

- [ ] "Customer agreed to receive marketing emails" checkbox durumu nedir?
  - **Durum:** [✅ Seçili / ❌ Seçili değil]
  - **Beklenen:** ❌ Seçili değil (unsubscribe sonrası)

---

## 3️⃣ Sonuç ve Aksiyonlar

### Mailchimp Sync
- **Durum:** [✅ Çalışıyor / ❌ Çalışmıyor]
- **Sorun Varsa:**
  - [ ] Wrong audience seçili → Düzeltildi
  - [ ] Sync disabled → Açıldı
  - [ ] Embed off → Açıldı
  - [ ] Auth broken → Re-authenticate yapıldı
  - [ ] Diğer: [Açıklama]

### Unsubscribe Route
- **Durum:** [✅ Çalışıyor / ❌ Çalışmıyor]
- **Sorun Varsa:**
  - [ ] Frontend request yanlış endpoint'e gidiyor → [Açıklama]
  - [ ] Body'de email gitmiyor → [Açıklama]
  - [ ] Route customer'ı bulamıyor → [Açıklama]
  - [ ] Mutation userErrors üretiyor → [userErrors detayları]
  - [ ] Diğer: [Açıklama]

---

## 4️⃣ Teknik Detaylar

### Test Edilen Email
- **Email:** [test@example.com]

### Test Zamanı
- **Başlangıç:** [Tarih/Saat]
- **Bitiş:** [Tarih/Saat]

### Test Ortamı
- [ ] Development
- [ ] Production

### Test Eden
- **İsim:** [İsim]

---

## 📝 Notlar

[Test sırasında gözlemlenen diğer detaylar buraya yazılacak]

---

## 🔧 Teknik Detaylar (Kod Tarafı)

### Unsubscribe Route Özellikleri
- ✅ Customer bulunamazsa `404` dönüyor
- ✅ `consentUpdatedAt` hardening eklendi (timestamp geriye gitmiyor)
- ✅ GraphQL mutation: `customerEmailMarketingConsentUpdate`
- ✅ REST fallback: `email_marketing_consent` object kullanılıyor
- ✅ Detaylı error logging: `customerId` ve `email` her log'da

### Frontend Özellikleri
- ✅ Unsubscribe mode'da console log'lar aktif
- ✅ Network tab'ında request/response görülebilir
- ✅ Error handling: Kullanıcıya net hata mesajları gösteriliyor

---

## 🚀 Hızlı Test Adımları

### 1. Mailchimp Sync Testi (5 dakika)
1. Shopify Admin → Apps → Mailchimp
2. Sync overview'da "Sync now" butonuna tıkla
3. Settings → Customer Event Syncing açık mı kontrol et
4. Mailchimp dashboard → Audience → Contacts'ta email ara
5. Sonuçları CHATGPTRAPOR.md'ye yaz

### 2. Unsubscribe Testi (5 dakika)
1. `/newsletteranmeldung` sayfasına git
2. "Abmelden" tab'ına tıkla
3. Email gir (Shopify'da kayıtlı bir email)
4. DevTools → Console ve Network tab'larını aç
5. "Abmelden" butonuna tıkla
6. Network tab'ında request/response kontrol et
7. Console log'larını kontrol et
8. Backend log'larını kontrol et (terminal/server log)
9. Shopify Admin → Customer → Email marketing status kontrol et
10. Sonuçları CHATGPTRAPOR.md'ye yaz

---

**Son Güncelleme:** [Tarih/Saat]
