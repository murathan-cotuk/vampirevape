# 🎯 Navbar Aktif Menü Rehberi

## 3. Bir Menünün Sürekli Aktif Olması

Bir menü öğesinin sürekli aktif (sürekli #ffd300 rengi ve 1.2em büyüklüğünde) görünmesini istiyorsanız, iki yöntem var:

### Yöntem 1: Belirli Bir Menüyü Her Zaman Aktif Gösterme

`apps/storefront/src/components/header/Navbar.js` dosyasında, menu item'ları map ederken özel bir kontrol ekleyin:

```javascript
{menuItems.map((item) => {
  // Özel menü: "NEUHEITEN" her zaman aktif olsun
  const isAlwaysActive = item.title === 'NEUHEITEN' || item.handle === 'neuheiten';
  const isItemActive = isAlwaysActive || isActive(item.url);
  
  return (
    <li key={item.id}>
      <Link
        href={mapShopifyUrl(item.url)}
        className={`block px-3 py-4 font-bold text-base relative transition-all duration-200 ${
          isItemActive
            ? 'text-[#ffd300] text-[1.2em]'
            : 'group-hover:text-[#ffd300] group-hover:scale-110'
        }`}
      >
        {item.title}
        <span className={`absolute bottom-0 left-0 h-0.5 bg-[#ffd300] transition-all duration-200 ${
          isItemActive ? 'w-full' : 'w-0 group-hover:w-full'
        }`}></span>
      </Link>
    </li>
  );
})}
```

### Yöntem 2: Environment Variable ile Kontrol

Daha esnek bir çözüm için environment variable kullanabilirsiniz:

1. `.env.local` dosyasına ekleyin:
```env
NEXT_PUBLIC_ALWAYS_ACTIVE_MENU=neuheiten
```

2. `Navbar.js` dosyasında kullanın:
```javascript
const alwaysActiveMenu = process.env.NEXT_PUBLIC_ALWAYS_ACTIVE_MENU || '';

const isItemActive = alwaysActiveMenu && (
  item.title.toLowerCase() === alwaysActiveMenu.toLowerCase() ||
  item.url.includes(alwaysActiveMenu)
) || isActive(item.url);
```

### Yöntem 3: Belirli URL'ler İçin Aktif

Belirli bir URL pattern'i için aktif yapmak isterseniz:

```javascript
const isItemActive = 
  item.url.includes('/collections/neuheiten') || // Belirli collection
  item.url.includes('/pages/home') || // Belirli page
  isActive(item.url); // Normal aktif kontrolü
```

---

## 📝 Örnek: "NEUHEITEN" Menüsünü Her Zaman Aktif Yapma

`Navbar.js` dosyasında şu değişikliği yapın:

```javascript
// Line ~98 civarında
{menuItems.map((item) => {
  // "NEUHEITEN" her zaman aktif
  const isAlwaysActive = item.title === 'NEUHEITEN';
  const isItemActive = isAlwaysActive || isActive(item.url);
  
  return (
    <li key={item.id} className="relative group">
      <Link
        href={mapShopifyUrl(item.url)}
        className={`block px-3 py-4 font-bold text-base relative transition-all duration-200 ${
          isItemActive
            ? 'text-[#ffd300] text-[1.2em]'
            : 'group-hover:text-[#ffd300] group-hover:scale-110'
        }`}
      >
        {item.title}
        <span className={`absolute bottom-0 left-0 h-0.5 bg-[#ffd300] transition-all duration-200 ${
          isItemActive ? 'w-full' : 'w-0 group-hover:w-full'
        }`}></span>
      </Link>
      {/* ... dropdown code ... */}
    </li>
  );
})}
```

---

## ✅ Test Etme

1. Localhost'ta test edin: `npm run dev`
2. Belirlediğiniz menü sürekli aktif görünmeli (#ffd300 rengi ve 1.2em büyüklüğünde)
3. Diğer menüler hover'da aktif olmalı

---

**Not:** Aktif menü kontrolü `usePathname` hook'u ile yapılıyor. Sayfa değiştiğinde otomatik olarak güncellenir.

