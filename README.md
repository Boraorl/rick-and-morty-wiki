# Multiverse Index · Rick and Morty Wiki

React tabanlı, **The Rick and Morty API** ile beslenen resmi olmayan bir “field guide” arayüzü. Karakterler, bölümler ve mekanlar için listeleme, detay sayfaları, arama / filtreler ve küçük bir rehber (guide) içerir.

**Canlı veri:** [Rick and Morty API](https://rickandmortyapi.com)  
**Rehber özeti (isteğe bağlı):** Wikipedia (MediaWiki) kısa alıntılar — tarayıcıdan okunur.

> Bu depo ve site **Adult Swim / Warner** veya dizinin hak sahipleriyle bağlantılı değildir; hayran yapımı bir projedir.

---

## Özellikler

- **Sayfalar:** Ana sayfa (hero), Karakterler, Bölümler (sezonlara göre), Mekanlar, Favoriler, 404
- **Karakterler:** İsim araması (debounce), durum / tür / cinsiyet filtreleri, sıralama (isim, origin, son konum), sayfalama, URL ile paylaşılabilir filtreler
- **Detay:** Bölümler grid, ilişkili karakterler (aynı mekan / tür), favori yıldızı, son görüntülenenler (`localStorage`)
- **Tema:** Açık / koyu mod (`localStorage`, `html.dark` + Tailwind `darkMode: 'class'`)
- **UX:** Skeleton yükleme, hata / boş durumlar, skip link, error boundary, “back to top”, sticky navbar
- **Stack:** Vite 5, React 18, React Router 6, Tailwind CSS 3

---

## Kurulum

```bash
cd movie-wiki
npm install
```

### Geliştirme

```bash
npm run dev
```

Varsayılan adres: `http://localhost:5173`

### Üretim derlemesi

```bash
npm run build
npm run preview   # dist önizleme
```

---

## Gereksinimler

- **Node.js** 18+ (önerilir 20 LTS)
- `npm` veya uyumlu bir paket yöneticisi

---

## Ortam değişkenleri

Şu an **zorunlu `.env` yok**. Tüm API çağrıları tarayıcıdan doğrudan public endpoint’lere gider.

---

## Proje yapısı (kısa)

```
src/
  App.jsx              # Rotalar, layout, error boundary
  pages/               # Sayfa bileşenleri
  components/          # Navbar, kartlar, chat, tema vb.
  services/            # API, Wikipedia, rehber mantığı
  hooks/               # Favoriler, tema, son görüntülenenler
  utils/               # Yardımcılar (ör. bölüm sıralama)
```

---

## Lisans

Bu depodaki **kaynak kod** için bkz. [LICENSE](LICENSE).  
Dizi, görseller ve ticari markalar ilgili hak sahiplerine aittir; bu proje yalnızca public API verisini gösterir.

---

## Teşekkür

- [The Rick and Morty API](https://rickandmortyapi.com) — veri ve dokümantasyon  
- [Wikipedia / MediaWiki API](https://www.mediawiki.org/wiki/API:Main_page) — isteğe bağlı kısa özetler
