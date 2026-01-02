# Unit Test Kapsamı Genişletme Planı

## Mevcut Durum

### Zaten Test Edilen Modüller
| Test Dosyası | Kapsam | Durum |
|--------------|--------|-------|
| `__tests__/components/ErrorBoundary.test.tsx` | ErrorBoundary component | ✅ Tamam |
| `__tests__/lib/rate-limit.test.ts` | Rate limiting fonksiyonları | ✅ Tamam |
| `__tests__/lib/schemas.test.ts` | Zod validation şemaları | ✅ Tamam |

---

## 1. Lib Modülleri Testleri

### 1.1 `lib/file-validation.ts` ⚠️ YENİ DOSYA
- `validateImageFile()` - Görsel dosyası validasyonu
  - Dosya tipi kontrolü (image/*)
  - Dosya boyutu kontrolü
  - İzin verilen formatlar kontrolü
  - Geçersiz dosya durumları
- `validateAppIcon()` - Uygulama ikonu validasyonu
  - Kare oran kontrolü
  - Minimum/maximum boyut kontrolü
- `validateScreenshotFile()` - Ekran görüntüsü validasyonu

### 1.2 `lib/utils.ts`
- `cn()` - className birleştirme fonksiyonu
  - Çoklu className birleştirme
  - Conditional class'lar
  - Tailwind class merge
- Diğer utility fonksiyonlar

### 1.3 `lib/auth.ts`
- `verifySession()` - Oturum doğrulama
  - Geçerli oturum
  - Geçersiz oturum
  - Süresi dolmuş oturum
- `createSession()` - Oturum oluşturma
- `deleteSession()` - Oturum silme

### 1.4 `lib/firebase.ts`
- Firebase initialization
- Firestore operations
  - `getApps()` - Uygulamaları getirme
  - `getAppBySlug()` - Slug ile uygulama getirme
  - `createApp()` - Yeni uygulama oluşturma
  - `updateApp()` - Uygulama güncelleme
  - `deleteApp()` - Uygulama silme

### 1.5 `lib/data.ts`
- Static data fetching fonksiyonları
- Cache mekanizması
- Error handling

### 1.6 `lib/db.ts`
- Database connection
- CRUD operations
- Transaction handling

### 1.7 `lib/icon-map.ts`
- Icon name to component mapping
- Invalid icon handling

### 1.8 `lib/hooks/useApps.ts`
- `useApps()` hook
  - Loading state
  - Success state
  - Error state
  - Empty state

### 1.9 `lib/hooks.ts`
- Custom hooks
- Form hooks
- API hooks

### 1.10 `lib/LanguageContext.tsx`
- Language provider
- `useLanguage()` hook
  - Dil değiştirme
  - Tercüme fonksiyonu
  - Context value testing

### 1.11 `lib/rate-limit-redis.ts` ⚠️ YENİ DOSYA
- Redis-based rate limiting
- Redis connection handling
- Fallback to in-memory

---

## 2. Component Testleri

### 2.1 Admin Components

#### `components/admin/AppForm.tsx`
- Form rendering
- Input validation
- Form submission
- Image upload preview
- Success/error states
- Edit mode vs create mode

#### `components/admin/Toast.tsx`
- Toast rendering
- Auto-dismiss functionality
- Multiple toasts
- Different toast types (success, error, info, warning)

#### `components/admin/ConfirmModal.tsx`
- Modal open/close
- Confirm callback
- Cancel callback
- Custom message rendering

#### `components/admin/TesterAddModal.tsx`
- Modal rendering
- Form validation
- Tester submission
- Error handling

#### `components/admin/TesterImportModal.tsx`
- CSV upload
- CSV parsing
- Validation
- Import progress

#### `components/admin/AppDetailModal.tsx`
- App details display
- Edit/delete actions
- Screenshot gallery

#### `components/admin/TesterDetailModal.tsx`
- Tester info display
- Status update
- Notes editing

### 2.2 Home Components

#### `components/home/Hero.tsx`
- Hero content rendering
- CTA buttons
- Responsive design
- Animation/rendering

#### `components/home/AppsGrid.tsx`
- App list rendering
- Empty state
- Loading state
- Pagination/scroll
- Filter functionality

#### `components/home/FloatingNavbar.tsx`
- Scroll-based visibility
- Navigation links
- Active link highlighting
- Mobile menu toggle

#### `components/home/ContactForm.tsx`
- Form validation
- Form submission
- Success/error states
- Rate limiting integration

### 2.3 Apps Components

#### `components/apps/PrivacyPolicyViewer.tsx`
- Markdown rendering
- Loading state
- Error state
- Empty state

#### `components/apps/AppDetailsClient.tsx`
- App info display
- Feature list
- Download button
- Screenshot gallery
- Share functionality

### 2.4 Shared Components

#### `components/Footer.tsx`
- Link rendering
- Social links
- Copyright year
- Responsive layout

#### `components/LanguageSwitcher.tsx`
- Language selection
- Dropdown behavior
- Icon display

#### `components/mode-toggle.tsx`
- Theme switching
- Icon changes
- System preference detection
- Persisting preference

#### `components/theme-provider.tsx`
- Theme context provider
- Theme application
- Default theme handling

#### `components/providers.tsx`
- Combined providers
- Provider ordering

#### `components/SkipLink.tsx`
- Skip link visibility on focus
- Anchor target jumping
- Accessibility attributes

#### `components/ServiceWorkerRegistration.tsx`
- SW registration
- Update detection
- Update prompt

---

## 3. App Routes & API Testleri

### 3.1 Public Pages

#### `app/(public)/page.tsx` - Homepage
- Hero section rendering
- Apps grid loading
- Seo metadata

#### `app/(public)/apps/page.tsx` - Apps List
- App listing
- Filter/sort functionality
- Pagination

#### `app/(public)/apps/[slug]/page.tsx` - App Details
- Dynamic routing
- App data fetching
- Error handling (404)
- Metadata generation

#### `app/(public)/about/page.tsx` - About
- Static content rendering

#### `app/(public)/privacy/page.tsx` - Privacy
- Static content rendering

#### `app/(public)/apps/[slug]/privacy/page.tsx` - App Privacy
- Dynamic privacy policy
- Markdown rendering

### 3.2 Admin Pages

#### `app/admin/page.tsx` - Admin Dashboard
- Auth requirement
- Stats display
- Navigation

#### `app/admin/apps/page.tsx` - Apps Management
- App listing
- CRUD operations
- Filtering

#### `app/admin/apps/new/page.tsx` - Create App
- Form rendering
- Creation flow

#### `app/admin/apps/edit/[id]/page.tsx` - Edit App
- Pre-filling form
- Update flow

#### `app/admin/testers/page.tsx` - Testers Management
- Tester listing
- Status management

### 3.3 API Routes

#### `app/api/auth/login/route.ts`
- POST request handling
- Valid credentials
- Invalid credentials
- Rate limiting
- Response format

#### `app/api/auth/logout/route.ts`
- Session clearing
- Response handling

#### `app/api/webhooks/n8n/route.ts`
- POST webhook handling
- Authentication
- Payload validation
- Data processing
- Error responses

### 3.4 Special Pages

#### `app/error.tsx` - Global Error Boundary
- Error rendering
- Recovery button

#### `app/not-found.tsx` - 404 Page
- 404 content rendering
- Back button

#### `app/loading.tsx` - Global Loading
- Loading state rendering

#### `app/offline/page.tsx` - Offline Page
- Offline detection
- Fallback content

---

## 4. Integration & E2E Testleri

### 4.1 User Flows
- App browsing flow
- App detail viewing
- Contact form submission
- Language switching
- Theme toggling

### 4.2 Admin Flows
- Login flow
- App creation flow
- App editing flow
- Tester management flow
- Bulk import flow

---

## 5. Test Coverage Hedefleri

| Modül | Mevcut | Hedef |
|-------|--------|-------|
| lib/ | ~30% | 80%+ |
| components/ | ~10% | 70%+ |
| app/ | 0% | 50%+ |
| API routes | 0% | 70%+ |

**Genel Hedef: 70%+ Code Coverage**

---

## 6. Öncelik Sırası

### Phase 1 - Kritik (Yüksek Öncelik)
1. `lib/schemas.ts` - ✅ Tamamlandı
2. `lib/rate-limit.ts` - ✅ Tamamlandı
3. `lib/file-validation.ts` - ✅ Tamamlandı
4. `lib/auth.ts` - ⚠️ Firebase bağımlılığı (mock gerekli)
5. `components/home/ContactForm.tsx` - ✅ Tamamlandı
6. `components/admin/AppForm.tsx` - ⚠️ Karmaşık form (sonraki fazda)
7. `app/api/webhooks/n8n/route.ts` - ⚠️ API testi (sonraki fazda)

### Phase 2 - Önemli (Orta Öncelik)
8. `lib/utils.ts` - ✅ Tamamlandı
9. `lib/firebase.ts` - ⚠️ Firebase bağımlılığı
10. `components/home/AppsGrid.tsx` - ⚠️ Sonraki fazda
11. `components/apps/AppDetailsClient.tsx` - ⚠️ Sonraki fazda
12. `components/admin/Toast.tsx` - ⚠️ Sonraki fazda
13. `components/admin/ConfirmModal.tsx` - ⚠️ Sonraki fazda

### Phase 3 - Genel (Normal Öncelik)
14. Remaining admin components
15. Home components
16. `lib/LanguageContext.tsx` - ✅ Tamamlandı
17. `lib/hooks/useApps.ts` - ⚠️ Sonraki fazda
18. API routes

### Phase 4 - Tamamlama (Düşük Öncelik)
19. UI-only components - `components/Footer.tsx` ✅ Tamamlandı
20. Layout components
21. Error/Loading states
22. `lib/icon-map.ts` - ✅ Tamamlandı

---

## 7. Test Komutları

```bash
# Tüm testleri çalıştır
npm test

# Testleri watch modunda çalıştır
npm test -- --watch

# Coverage raporu oluştur
npm test -- --coverage

# Belirli bir test dosyasını çalıştır
npm test -- ErrorBoundary.test.tsx

# Belirli bir pattern ile test çalıştır
npm test -- --testPathPattern=lib

# Coverage threshold kontrolü
npm test -- --coverage --coverageThreshold='{"global":{"branches":70,"functions":70,"lines":70,"statements":70}}'
```

---

## 8. Mocking Stratejileri

### Firebase Mock
```typescript
jest.mock('@/lib/firebase', () => ({
  getApps: jest.fn(),
  getAppBySlug: jest.fn(),
  createApp: jest.fn(),
  // ...
}));
```

### Next.js Navigation Mock
```typescript
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));
```

### Context Mock
```typescript
jest.mock('@/lib/LanguageContext', () => ({
  useLanguage: jest.fn(() => ({
    language: 'tr',
    t: (key: string) => key,
    setLanguage: jest.fn(),
  })),
}));
```

---

## 9. İlerleme Takibi

- [ ] Phase 1 - Kritik testler
- [ ] Phase 2 - Önemli testler
- [ ] Phase 3 - Genel testler
- [ ] Phase 4 - Tamamlama testleri
- [ ] 70% coverage hedefine ulaşma
- [ ] CI/CD integration
