# Confirm Modal

[![CI](https://github.com/onurdevs/confirm-modal/actions/workflows/ci.yml/badge.svg)](https://github.com/onurdevs/confirm-modal/actions/workflows/ci.yml) [![npm](https://img.shields.io/npm/v/@onurdev/confirm-modal)](https://www.npmjs.com/package/@onurdev/confirm-modal)

Modern dialogs. Clear decisions. Effortless feedback.

Confirm Modal brings Promise-based dialogs, confirmations, prompts, and toast notifications to the modern web. Built on native browser primitives, it combines a small footprint with thoughtful interaction defaults and a fully typed API. Zero runtime dependencies.

[Live demo](https://onurdevs.github.io/confirm-modal/) · [View on npm](https://www.npmjs.com/package/@onurdev/confirm-modal) · [Source on GitHub](https://github.com/onurdevs/confirm-modal)

- **Native foundation.** Uses `<dialog>` and `showModal()` for modal interactions, with the Popover API for toast placement where available.
- **Compact by design.** Approximately 8 kB gzipped for the browser bundle, including its embedded styles. Safe to import during server rendering.
- **Safer content defaults.** Titles and text render as plain text. HTML strings pass through an allowlist sanitizer that removes scripts, event handlers, unsafe link schemes, and unsupported elements.
- **Accessible interactions.** Dialog labels, focus restoration, live validation messages, reduced motion support, and cancel-first focus for destructive confirmations.
- **Your visual language.** CSS custom properties, light and dark themes, and automatic system theme detection.
- **Fits your stack.** ESM, CommonJS, and browser builds; TypeScript definitions; asynchronous validation; `AbortSignal`; and declarative confirmations.

## Installation

```bash
npm install @onurdev/confirm-modal
```

```js
import modal from '@onurdev/confirm-modal';
```

For a browser script:

```html
<script src="https://cdn.jsdelivr.net/npm/@onurdev/confirm-modal"></script>
<script>ConfirmModal.alert('Hello');</script>
```

Styles are injected automatically using a constructable stylesheet where supported. To load CSS yourself:

```js
import { createModal } from '@onurdev/confirm-modal';
import '@onurdev/confirm-modal/style.css';

const modal = createModal({ injectStyles: false });
```

## Usage

```js
await modal.alert('Saved');
await modal.success('All set', 'Your changes have been saved.');

// Confirmations resolve to a boolean.
if (await modal.confirm({
  title: 'Delete this item?',
  text: 'This action cannot be undone.',
  danger: true,
  confirmText: 'Delete',
})) {
  await api.delete(id);
}

// Prompts resolve to a string, or null when dismissed.
const name = await modal.prompt('What is your name?', 'Ada');

// Validate input and run asynchronous work before closing.
const result = await modal.fire({
  title: 'Join the newsletter',
  input: 'email',
  inputLabel: 'Email address',
  validate: (value) => (String(value).includes('@') ? null : 'Enter a valid email address.'),
  preConfirm: async (email) => api.subscribe(email),
  showCancel: true,
});
if (result.isConfirmed) console.log(result.value);

// Toasts provide feedback without opening a modal.
modal.toast({ title: 'Copied', icon: 'success', position: 'bottom' });
modal.toast({
  title: 'Upload failed',
  icon: 'error',
  action: { text: 'Retry', onClick: retry },
});
```

`fire()` returns `{ isConfirmed, isDenied, isDismissed, value?, dismiss? }`. Dismissal reasons are `cancel`, `backdrop`, `esc`, `close`, `timer`, `abort`, and `programmatic`.

### Defaults and customization

```js
import { createModal } from '@onurdev/confirm-modal';

export const modal = createModal({
  confirmText: 'Continue',
  cancelText: 'Cancel',
  denyText: 'No',
  theme: 'auto', // 'light' | 'dark' | 'auto'
  toast: { position: 'bottom-end' },
});

// Derive an instance with additional defaults.
const dangerModal = modal.create({ danger: true, icon: 'warning' });
```

### Declarative confirmations

Register once, then add confirmation attributes to links, buttons, or forms:

```js
const unbind = modal.bind();
// Call unbind() to remove the event listeners.
```

```html
<a href="/logout" data-cm-confirm="Sign out?">Sign out</a>
<button data-cm-confirm="This item will be permanently deleted." data-cm-title="Delete this item?" data-cm-danger data-cm-confirm-text="Delete">Delete</button>
<form data-cm-confirm="Submit this form?">…</form>
```

### Framework integration

Call the same API from your framework's event handlers:

```tsx
// React
<button onClick={async () => (await modal.confirm('Are you sure?')) && remove()}>Delete</button>
```

```html
<!-- Vue -->
<button @click="async () => (await modal.confirm('Are you sure?')) && remove()">Delete</button>
```

Pass an `AbortSignal` to dismiss a dialog when its component unmounts:

```js
const controller = new AbortController();
modal.fire({ title: 'Edit your details', signal: controller.signal });
// In your cleanup handler: controller.abort();
```

## Options

| Option | Description |
| --- | --- |
| `title`, `text` | Plain text; never interpreted as HTML. |
| `html` | Sanitized when passed as a string. DOM nodes are inserted as provided. |
| `sanitizer` | Replace the built-in sanitizer with your own. String output is parsed before insertion. |
| `icon` | `success`, `error`, `warning`, `info`, `question` |
| `confirmText`, `cancelText`, `denyText` | Button labels. |
| `showConfirm`, `showCancel`, `showDeny`, `showCloseButton` | Control button visibility. |
| `danger` | Apply destructive button styling and prefer Cancel for initial focus when no input is present. |
| `focus` | `confirm`, `cancel`, `deny`, `input`, `none` |
| `reverseButtons` | Reverse the visual button order. |
| `input` | `text`, `email`, `password`, `number`, `tel`, `url`, `textarea`, `select`, `radio`, `checkbox` |
| `inputValue`, `inputPlaceholder`, `inputLabel`, `inputOptions`, `inputAttributes` | Input configuration. Event handler attributes (`on*`) are rejected. |
| `validate(value)` | Return an error message to block confirmation. Supports async functions. |
| `preConfirm(value)` | Run work while the confirm button shows a loading state. Return a value for `result.value`, return `false` to stay open, or throw to display an error. |
| `timer`, `timerProgressBar` | Automatic dismissal and an optional progress bar. |
| `closeOnEsc`, `closeOnBackdrop` | Both default to `true`. |
| `position` | `center`, `top`, `bottom` |
| `theme`, `width`, `className` | Appearance settings. |
| `signal` | Dismiss externally with an `AbortSignal`. |
| `target` | Mount element; defaults to `document.body`. |
| `onOpen(dialog)`, `onClose(result)` | Lifecycle callbacks. |

Dialogs share a queue and open one at a time. `modal.close()` dismisses the current dialog; `modal.isOpen()` reports its state.

If `onOpen` or `onClose` throws, the dialog is cleaned up and the call's Promise rejects. Toast `onClose` errors reject `handle.closed`. Closing a dialog during pending validation prevents `preConfirm` from starting. Work that has already started inside `preConfirm` needs its own cancellation mechanism.

### Toast options

Toasts accept `title`, `text`, `html`, `icon`, `theme`, `className`, and `sanitizer`, plus:

| Option | Description |
| --- | --- |
| `position` | `top`, `top-start`, `top-end`, `bottom`, `bottom-start`, `bottom-end`; defaults to `top-end`. |
| `timer` | Dismiss after this many milliseconds; defaults to `4000`. Use `0` to keep it open. |
| `timerProgressBar` | Show the timer progress bar; defaults to `true`. |
| `pauseOnHover` | Pause the timer while hovered or focused; defaults to `true`. |
| `showCloseButton` | Show a dismiss button; defaults to `true`. |
| `action` | `{ text, onClick }` for an optional action button. |
| `onClose()` | Called after the toast is removed. |

`toast()` returns a handle with `close()`, `closed`, and `element`. Await `closed` to wait for removal.

## Themes

Customize colors, corner radii, and animation timing with `--cm-*` properties:

```css
.cm-root, .cm-toasts {
  --cm-primary: #0ea5e9;
  --cm-radius: 8px;
  --cm-font: "Inter", sans-serif;
}
```

Component classes define the core presentation. Use `.cm-*` rules to customize individual elements.

## Content security

The library does not use inline scripts, `eval`, or `innerHTML`. It uses constructable stylesheets where available. For the `<style>` fallback, provide a nonce with `createModal({ styleNonce })`, or load the exported CSS and disable style injection.

If your policy requires Trusted Types, allow the `confirm-modal` policy:

```text
Content-Security-Policy: script-src 'self'; style-src 'self'; require-trusted-types-for 'script'; trusted-types confirm-modal
```

The built-in sanitizer processes HTML strings. DOM nodes and custom sanitizer output are trusted inputs; you are responsible for their safety.

## Development

```bash
npm install
npm test          # 55 tests across browser-like and server environments
npm run typecheck
npm run build     # ESM, CommonJS, browser bundle, CSS, and type declarations
npm run build:demo # Build the standalone demo in _site/ for GitHub Pages
npx serve .       # Open /demo/ to explore the examples
```

## Publishing

Run `npm version patch` (or `minor` / `major`), then `git push --follow-tags`. A `v*` tag triggers the GitHub Actions publishing workflow, which runs tests and builds before publishing to npm with provenance.

## Browser support

Modal interactions require native `<dialog>` support. Toasts use the Popover API when available and fall back to a positioned container otherwise. Test in your target browsers when using strict content security policies or custom styling.

## License

MIT
