Karar verdiğimiz **Next.js + Firebase (Dahili Admin Paneli)** mimarisine göre güncellenmiş ve son halini almış PRD aşağıdadır. Bu doküman artık projenin teknik anayasasıdır.

-----

# Ürün Gereksinim Dokümanı (PRD): NexaraApps Web Platformu

| Doküman Bilgisi | Detay |
| :--- | :--- |
| **Proje Adı** | NexaraApps Official Portfolio |
| **Versiyon** | 1.1 (Firebase & Internal Admin Architecture) |
| **Mimari** | Serverless / Single Repo |
| **Platform** | Web (Mobile Responsive) |
| **Hedef Kitle** | Oyuncular, Beta Testerlar, Mobil Uygulama Kullanıcıları |

-----

## 1\. Proje Özeti ve Teknik Vizyon

**NexaraApps**, Google Play Store'da yayınlanan uygulamaları tanıtan, modern ve oyuncu bir tasarıma sahip portfolyo sitesidir.
**Teknik Vizyon:** Ayrı bir backend sunucusu (VPS/Django) kullanılmayacaktır. Site, **Next.js** üzerinde çalışacak, veritabanı ve kimlik doğrulama işlemleri **Firebase** (BaaS) üzerinden yönetilecektir. Yönetim paneli (`/admin`), frontend projesinin içine gömülü, şifreli bir rota olacaktır.

-----

## 2\. Kullanıcı Hikayeleri (User Stories)

### Ziyaretçi (Public)

  * **Keşif:** Siteye girdiğimde "Modern ve Oyuncu" bir atmosfer hissetmeli, İngilizce veya Türkçe dil seçeneğini kullanabilmeliyim.
  * **Erişim:** Uygulamaları kartlar halinde görmeli, detaylarına bakmadan direkt Play Store'a gidebilmeliyim.
  * **Katılım:** Geliştirilmekte olan projeler için "Test Ekibine Katıl" formunu doldurabilmeliyim.

### Yönetici (Admin - Sen)

  * **Güvenlik:** `/admin` adresine gittiğimde, giriş yapmamışsam beni login sayfasına atmalı.
  * **Yönetim:** Basit bir arayüzden yeni uygulama ekleyebilmeli, uygulamanın ikonunu yükleyebilmeli ve "Yayında/Pasif" durumunu değiştirebilmeliyim.
  * **Takip:** Test ekibine başvuranların listesini admin panelinde görebilmeliyim.

-----

## 3\. Özellik Gereksinimleri & Sayfa Yapısı

### 3.1. Public (Halka Açık) Sayfalar

  * **Landing Page (`/`):**
      * **Hero:** Slogan + Görsel.
      * **Showcase Grid:** Firestore'dan çekilen `apps` koleksiyonu.
      * **Roadmap:** Gelecek planları.
      * **Newsletter/Tester Form:** Veriyi Firestore'a yazar.
  * **Legal (`/privacy`, `/terms`):** Statik metin sayfaları.

### 3.2. Admin (Yönetim) Modülü

*Bu sayfalar `middleware` ile korunacaktır.*

  * **Login (`/login`):** Sadece Admin girişi için email/password formu.
  * **Dashboard (`/admin`):**
      * Mevcut uygulamaların listesi (Düzenle/Sil butonları ile).
      * Test başvurularının özeti (Son 5 başvuru).
  * **App Editor (`/admin/apps/new` & `/edit/[id]`):**
      * Form: Başlık, Açıklama (TR/EN), Play Store Linki, Sıra No.
      * Görsel Yükleme: Firebase Storage entegrasyonu.
  * **Tester List (`/admin/testers`):** Başvuran tüm kullanıcıların tablo görünümü.

-----

## 4\. Veri Modelleri (Firestore Schema)

İlişkisel tablo yerine **Koleksiyon (Collection) ve Doküman (Document)** yapısı kullanılacaktır.

### A. Collection: `apps`

Her bir doküman bir uygulamayı temsil eder.

```json
{
  "id": "auto-generated-id",
  "title": "Walletta",
  "slug": "walletta-app",
  "iconUrl": "https://firebasestorage.../icon.png",
  "description": {
    "tr": "Kişisel finans uygulaması...",
    "en": "Personal finance app..."
  },
  "playStoreUrl": "https://play.google.com/...",
  "status": "live", // veya 'closed_test', 'development'
  "order": 1,
  "createdAt": "Timestamp"
}
```

### B. Collection: `roadmap`

```json
{
  "id": "auto-generated-id",
  "title": { "tr": "Rüya Tabiri AI", "en": "Dream AI" },
  "stage": "Q3 2025",
  "status": "planned" // planned, in-progress, done
}
```

### C. Collection: `testers` (Admin Only Read)

```json
{
  "fullName": "Ahmet Yılmaz",
  "email": "ahmet@gmail.com",
  "device": "Samsung S23 Ultra",
  "appliedAt": "Timestamp"
}
```

-----

## 5\. Teknik Mimari ve Güvenlik

### 5.1. Tech Stack

  * **Framework:** Next.js 14 (App Router)
  * **Language:** TypeScript
  * **Styling:** Tailwind CSS + Framer Motion
  * **Backend:** Firebase (Client SDK + Admin SDK)
  * **Form Handling:** React Hook Form

### 5.2. Güvenlik Kuralları

1.  **Firestore Rules:**
      * `read`: Herkese açık (public) -\> `apps`, `roadmap`.
      * `write`: Sadece authenticated admin -\> `apps`, `roadmap`.
      * `create`: Herkese açık (public) -\> `testers` (Sadece ekleme yapabilirler, okuyamazlar).
2.  **Storage Rules:**
      * Görsel okuma herkese açık.
      * Görsel yükleme sadece Admin'e açık.
3.  **Route Protection (Middleware):**
      * `/admin/*` rotasına gelen isteklerde cookie/token kontrolü yapılır. Geçersizse `/login`'e yönlendirilir.

-----

## 6\. Proje Klasör Yapısı (Öngörülen)

Projenin temiz ve yönetilebilir olması için şu yapıyı kullanacağız:

```text
nexara-apps/
├── app/
│   ├── (public)/        # Ziyaretçi sayfaları (Route Group)
│   │   ├── page.tsx     # Ana sayfa
│   │   └── layout.tsx   # Public Navbar/Footer
│   ├── admin/           # Yönetim Paneli
│   │   ├── layout.tsx   # Admin Sidebar/Layout
│   │   ├── page.tsx     # Dashboard
│   │   ├── apps/        # Uygulama Yönetimi
│   │   └── testers/     # Başvuru Listesi
│   ├── login/           # Admin Giriş
│   └── api/             # Gerekirse API Routes
├── components/
│   ├── ui/              # Butonlar, Kartlar (Reusable)
│   ├── home/            # Hero, Showcase sectionları
│   └── admin/           # Admin tabloları, formları
├── lib/
│   ├── firebase.ts      # Firebase Config (Client)
│   ├── db.ts            # Firestore yardımcı fonksiyonları
│   └── auth.ts          # Auth yardımcı fonksiyonları
└── middleware.ts        # Admin koruması için
```

-----

### Sırada Ne Var?

PRD tamamlandı. Artık kodlama aşamasına geçebiliriz.

İş akışımız şu şekilde olacak:

1.  **Kurulum:** Next.js projesini oluşturup temizlemek.
2.  **Firebase:** Konsoldan projeyi açıp `firebaseConfig` dosyasını projeye eklemek.
3.  **İskelet:** Klasör yapısını yukarıdaki gibi kurmak.

**Başlamak için:** "Projeyi kuralım" dersen, sana terminalde çalıştırman gereken komutları ve ardından oluşturman gereken ilk dosya olan `lib/firebase.ts` içeriğini vereceğim. Hazır mısın?