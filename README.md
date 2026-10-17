# Confirm Modal

[![CI](https://github.com/onurdevs/confirm-modal/actions/workflows/ci.yml/badge.svg)](https://github.com/onurdevs/confirm-modal/actions/workflows/ci.yml) [![npm](https://img.shields.io/npm/v/@onurdev/confirm-modal)](https://www.npmjs.com/package/@onurdev/confirm-modal)

SweetAlert tarzı, Promise tabanlı modal, onay, prompt ve toast kütüphanesi. Daha modern, daha hafif, varsayılan olarak güvenli.

- **Modern:** native `<dialog>` + `showModal()` (top layer, `inert` arka plan), toastlar için Popover API, CSS değişkenleriyle tema, otomatik koyu mod, `prefers-reduced-motion` desteği.
- **Hızlı ve küçük:** sıfır bağımlılık, CSS dahil ~8 kB gzip (SweetAlert2 ~16 kB). SSR'da import etmek güvenli (import anında `window`'a dokunmaz).
- **Güvenli:** `title` / `text` her zaman `textContent` ile yazılır. `html` string'leri inert bir belgede ayrıştırılıp allowlist ile yeniden kurulur: `<script>`, `on*` öznitelikleri, `javascript:` / `data:` linkleri, `<svg>`, `<iframe>`, DOM clobbering id'leri atılır. Sıkı CSP (`script-src 'self'; style-src 'self'`) ve Trusted Types ile çalışır.
- **Erişilebilir:** doğru `role` / `aria-labelledby` / `aria-describedby`, ESC ile kapanma, açanda odağı geri verme, hata mesajları `aria-live` ile okunur, tehlikeli işlemlerde varsayılan odak "Vazgeç" butonunda.
- **Kolay entegre:** ESM, CJS ve `<script>` build'i, tam TypeScript tipleri, `AbortSignal` ile dışarıdan kapatma, `data-cm-confirm` ile JS yazmadan onay.

## Kurulum

```bash
npm i @onurdev/confirm-modal
```

```js
import modal from '@onurdev/confirm-modal';
```

veya doğrudan sayfaya:

```html
<script src="https://cdn.jsdelivr.net/npm/@onurdev/confirm-modal"></script>
<script>ConfirmModal.alert('Merhaba');</script>
```

Stiller otomatik eklenir (constructable stylesheet, CSP'ye takılmaz). Kendi CSS'inizi yüklemek isterseniz `createModal({ injectStyles: false })` deyip `@onurdev/confirm-modal/style.css` dosyasını import edin.

## Kullanım

```js
// Basit
await modal.alert('Kaydedildi');
await modal.success('Tamam', 'Değişiklikler kaydedildi.');

// Onay → boolean
if (await modal.confirm({ title: 'Silinsin mi?', text: 'Geri alınamaz.', danger: true, confirmText: 'Sil' })) {
  await api.delete(id);
}

// Prompt → string | null
const name = await modal.prompt('Adınız?', 'Ada');

// Tam kontrol
const r = await modal.fire({
  title: 'Bültene katılın',
  input: 'email',
  inputLabel: 'E-posta',
  validate: (v) => (v.includes('@') ? null : 'Geçerli bir e-posta girin'),
  preConfirm: async (email) => api.subscribe(email), // buton loading olur; hata fırlatırsa modal açık kalır
  showCancel: true,
});
if (r.isConfirmed) console.log(r.value);
// r: { isConfirmed, isDenied, isDismissed, value?, dismiss?: 'cancel'|'backdrop'|'esc'|'close'|'timer'|'abort'|'programmatic' }

// Toast (bloklamaz)
modal.toast({ title: 'Kopyalandı', icon: 'success', position: 'bottom' });
modal.toast({ title: 'Yükleme başarısız', icon: 'error', action: { text: 'Tekrar dene', onClick: retry } });
```

### Varsayılanlar ve dil

```js
import { createModal } from '@onurdev/confirm-modal';

export const modal = createModal({
  confirmText: 'Tamam',
  cancelText: 'Vazgeç',
  denyText: 'Hayır',
  theme: 'auto',          // 'light' | 'dark' | 'auto'
  toast: { position: 'bottom-end' },
});

const dangerModal = modal.create({ danger: true, icon: 'warning' }); // üst üste katmanlanır
```

### JS yazmadan onay

```js
modal.bind(); // bir kere çağırın
```

```html
<a href="/logout" data-cm-confirm="Çıkış yapılsın mı?">Çıkış</a>
<button data-cm-confirm="Kalıcı olarak silinecek." data-cm-title="Silinsin mi?" data-cm-danger data-cm-confirm-text="Sil">Sil</button>
<form data-cm-confirm="Form gönderilsin mi?">…</form>
```

### Framework'lerle

Çekirdek framework'ten bağımsız; her yerde aynı şekilde çağrılır:

```tsx
// React
<button onClick={async () => (await modal.confirm('Emin misiniz?')) && remove()}>Sil</button>

// Vue
<button @click="async () => (await modal.confirm('Emin misiniz?')) && remove()">Sil</button>
```

Component unmount olduğunda açık modalı kapatmak için `signal` verin:

```js
const ac = new AbortController();
modal.fire({ title: '…', signal: ac.signal });
// cleanup: ac.abort();
```

## Seçenekler

| Seçenek | Açıklama |
| --- | --- |
| `title`, `text` | Düz metin (HTML olarak yorumlanmaz). |
| `html` | String ise sanitize edilir; `Node` verirseniz olduğu gibi eklenir. |
| `sanitizer` | Kendi sanitizer'ınız (ör. `DOMPurify.sanitize`). Çıktısı yine de inert biçimde ayrıştırılır. |
| `icon` | `success`, `error`, `warning`, `info`, `question` |
| `confirmText`, `cancelText`, `denyText` | Buton metinleri |
| `showConfirm`, `showCancel`, `showDeny`, `showCloseButton` | Görünen butonlar |
| `danger` | Onay butonunu kırmızı yapar, varsayılan odağı "Vazgeç"e taşır. |
| `focus` | `confirm`, `cancel`, `deny`, `input`, `none` |
| `reverseButtons` | Buton sırasını ters çevirir |
| `input` | `text`, `email`, `password`, `number`, `tel`, `url`, `textarea`, `select`, `radio`, `checkbox` |
| `inputValue`, `inputPlaceholder`, `inputLabel`, `inputOptions`, `inputAttributes` | Girdi ayarları (`on*` öznitelikleri her zaman reddedilir) |
| `validate(value)` | Hata mesajı döndürürse onay engellenir. Async olabilir. |
| `preConfirm(value)` | Onaydan sonra loading durumunda çalışır; dönen değer `result.value` olur. Hata fırlatır veya `false` dönerse modal açık kalır. |
| `timer`, `timerProgressBar` | Otomatik kapanma |
| `closeOnEsc`, `closeOnBackdrop` | Varsayılan `true` |
| `position` | `center`, `top`, `bottom` |
| `theme`, `width`, `className` | Görünüm |
| `signal` | `AbortSignal` ile dışarıdan kapatma |
| `target` | Modalın ekleneceği element (varsayılan `document.body`) |
| `onOpen(dialog)`, `onClose(result)` | Yaşam döngüsü |

Modallar üst üste binmez, sıraya girer. `modal.close()` açık olanı kapatır, `modal.isOpen()` durumu verir.

## Tema

Tüm renkler, köşe yarıçapları ve süreler `--cm-*` değişkenleridir:

```css
.cm-root, .cm-toasts {
  --cm-primary: #0ea5e9;
  --cm-radius: 8px;
  --cm-font: "Inter", sans-serif;
}
```

Seçiciler tek sınıf düzeyinde tutuldu: sayfanızdaki `button {}` / `h2 {}` gibi kurallar modala sızmaz, sizin `.cm-*` kurallarınız ise kolayca üstüne yazar.

## CSP

Kütüphane inline script, `eval` veya `innerHTML` kullanmaz. Stiller constructable stylesheet ile eklenir; bunu desteklemeyen eski tarayıcılarda `<style>` etiketine `createModal({ styleNonce })` ile nonce verebilirsiniz. Trusted Types zorunluysa politikaya `confirm-modal` adını ekleyin:

```
Content-Security-Policy: script-src 'self'; style-src 'self'; require-trusted-types-for 'script'; trusted-types confirm-modal
```

## Geliştirme

```bash
npm install
npm test          # vitest + happy-dom, 47 test
npm run build     # dist/: ESM, CJS, <script> build, CSS, .d.ts
npx serve .       # sonra /demo/ adresini açın
```

## Yayınlama

`npm version patch` (veya `minor` / `major`) ve ardından `git push --follow-tags`. `v*` etiketi GitHub Actions'taki yayın akışını tetikler; testler geçerse paket provenance ile npm'e gönderilir.

Tarayıcı desteği: `<dialog>` olan tüm güncel tarayıcılar (Chrome/Edge 37+, Firefox 98+, Safari 15.4+).
