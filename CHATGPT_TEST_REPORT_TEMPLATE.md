# Shopify Mailchimp Entegrasyonu - Test Raporu

## 📋 Test Sonuçları

### 1. Register API Çağrısı Sonrası Log

**Console Log:**
```
✅ Consent updated successfully {
  marketingState: "SUBSCRIBED" | "NOT_SUBSCRIBED",
  marketingOptInLevel: "SINGLE_OPT_IN" | "UNKNOWN",
  consentUpdatedAt: "2024-..."
}
```

VEYA hata durumunda:
```
Consent update failed {
  status: 200,
  errors: null,
  userErrors: [...]
}
```

---

### 2. Shopify Admin Kontrolü

**Customer Email:** [test@example.com]

**Email Marketing Status:**
- [ ] SUBSCRIBED
- [ ] NOT_SUBSCRIBED
- [ ] PENDING
- [ ] Değişmedi / Hâlâ eski durumda

**"Customer agreed to receive marketing emails" checkbox:**
- [ ] ✅ Seçili
- [ ] ❌ Seçili değil
- [ ] Durum belirsiz

**Screenshot veya detaylı açıklama:**
[Buraya Shopify Admin'deki customer kartının Email marketing bölümünün screenshot'ını veya detaylı açıklamasını ekleyin]

---

### 3. Mailchimp Sync Durumu

**Sync oldu mu?**
- [ ] Evet, 1-5 dk içinde sync oldu
- [ ] Evet, ama daha uzun sürdü
- [ ] Hayır, sync olmadı

**Mailchimp Dashboard'da görünüyor mu?**
- [ ] Evet, listede görünüyor
- [ ] Hayır, listede görünmüyor

**Unsubscribe testi:**
- [ ] Unsubscribe yapıldı, Mailchimp'te de unsubscribe oldu
- [ ] Unsubscribe yapıldı, ama Mailchimp'te hâlâ subscribed

---

### 4. Token & Permission Kontrolü

**Token Kontrol Script Çıktısı:**
```bash
npm run check-token
```

**Çıktı:**
```
[Script çıktısını buraya yapıştırın]
```

**Token Tipi:**
- [ ] Custom App Admin API token
- [ ] Private app token
- [ ] Diğer

**Scope'lar:**
- [ ] write_customers ✅
- [ ] read_customers ✅
- [ ] Scope'lar eksik ❌

**API Version:**
- [ ] 2024-10 ✅

---

## 🔍 Sorun Varsa Detaylar

### Eğer Shopify Admin'de "SUBSCRIBED" görünmüyorsa:

**Console Log'ları:**
```
[Consent update failed log'unu buraya yapıştırın]
```

**userErrors içeriği:**
```
[userErrors array'ini buraya yapıştırın]
```

**Permission hatası var mı?**
- [ ] Evet, permission hatası var
- [ ] Hayır, başka bir hata var
- [ ] Hata yok ama UI değişmedi

---

### Eğer Mailchimp sync olmuyorsa:

**Shopify Admin'de state doğru mu?**
- [ ] Evet, SUBSCRIBED görünüyor
- [ ] Hayır, hâlâ yanlış

**Mailchimp App Ayarları:**
- [ ] Audience mapping kontrol edildi
- [ ] "Sync subscribed customers only" toggle açık
- [ ] Double opt-in ayarları uyumlu
- [ ] Tags / segmentation rule'ları kontrol edildi

---

## 📊 Özet

**Genel Durum:**
- [ ] ✅ Başarılı - Her şey çalışıyor
- [ ] ⚠️ Kısmen başarılı - Shopify doğru ama Mailchimp sync olmuyor
- [ ] ❌ Başarısız - Shopify'da da doğru görünmüyor

**Sonraki Adımlar:**
[Test sonrası ne yapılması gerektiğini buraya yazın]

---

**Test Tarihi:** [Tarih]
**Test Eden:** [İsim]
**Test Ortamı:** [Development / Production]
