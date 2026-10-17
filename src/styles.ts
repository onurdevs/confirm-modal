/**
 * Every rule is a single class selector (plus state), so page-level element rules like
 * `button {}` or `h2 {}` cannot leak in, and your own `.cm-*` rules loaded later still win.
 * Theme everything through the --cm-* custom properties.
 */
export const css: string = /* css */ `
.cm-root, .cm-toasts {
  --cm-bg: #ffffff;
  --cm-fg: #1f2328;
  --cm-muted: #59636e;
  --cm-border: #d8dee4;
  --cm-backdrop: rgb(15 18 25 / 0.45);
  --cm-primary: #4f46e5;
  --cm-primary-fg: #ffffff;
  --cm-danger: #dc2626;
  --cm-danger-fg: #ffffff;
  --cm-neutral: #eef0f3;
  --cm-neutral-fg: #1f2328;
  --cm-success: #16a34a;
  --cm-error: #dc2626;
  --cm-warning: #d97706;
  --cm-info: #0284c7;
  --cm-question: #7c3aed;
  --cm-radius: 16px;
  --cm-btn-radius: 10px;
  --cm-shadow: 0 24px 48px -12px rgb(0 0 0 / 0.25), 0 0 0 1px rgb(0 0 0 / 0.04);
  --cm-font: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --cm-width: 28rem;
  --cm-duration: 180ms;
  --cm-ease: cubic-bezier(0.2, 0.9, 0.3, 1.2);
  color-scheme: light;
}
.cm-dark {
  --cm-bg: #1c1f26;
  --cm-fg: #e6e8eb;
  --cm-muted: #9aa3ad;
  --cm-border: #343944;
  --cm-backdrop: rgb(0 0 0 / 0.6);
  --cm-primary: #818cf8;
  --cm-primary-fg: #0d0f14;
  --cm-danger: #f87171;
  --cm-danger-fg: #0d0f14;
  --cm-neutral: #2b303a;
  --cm-neutral-fg: #e6e8eb;
  --cm-shadow: 0 24px 48px -12px rgb(0 0 0 / 0.6), 0 0 0 1px rgb(255 255 255 / 0.06);
  color-scheme: dark;
}
@media (prefers-color-scheme: dark) {
  .cm-auto {
    --cm-bg: #1c1f26;
    --cm-fg: #e6e8eb;
    --cm-muted: #9aa3ad;
    --cm-border: #343944;
    --cm-backdrop: rgb(0 0 0 / 0.6);
    --cm-primary: #818cf8;
    --cm-primary-fg: #0d0f14;
    --cm-danger: #f87171;
    --cm-danger-fg: #0d0f14;
    --cm-neutral: #2b303a;
    --cm-neutral-fg: #e6e8eb;
    --cm-shadow: 0 24px 48px -12px rgb(0 0 0 / 0.6), 0 0 0 1px rgb(255 255 255 / 0.06);
    color-scheme: dark;
  }
}

.cm-root {
  box-sizing: border-box;
  width: min(var(--cm-width), calc(100vw - 2rem));
  max-height: calc(100dvh - 2rem);
  margin: auto;
  padding: 0;
  border: 0;
  border-radius: var(--cm-radius);
  background: var(--cm-bg);
  color: var(--cm-fg);
  font: 15px/1.5 var(--cm-font);
  box-shadow: var(--cm-shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.cm-root:not([open]) { display: none; }
.cm-root *, .cm-root *::before, .cm-root *::after,
.cm-toasts *, .cm-toasts *::before, .cm-toasts *::after { box-sizing: border-box; }
.cm-root::backdrop { background: var(--cm-backdrop); backdrop-filter: blur(2px); }
.cm-form { display: flex; flex-direction: column; min-height: 0; margin: 0; padding: 0; border: 0; }
.cm-root.cm-top { margin-top: 1rem; }
.cm-root.cm-bottom { margin-bottom: 1rem; }

.cm-root[open] { animation: cm-in var(--cm-duration) var(--cm-ease); }
.cm-root[open]::backdrop { animation: cm-fade var(--cm-duration) ease-out; }
.cm-root.cm-closing { animation: cm-out calc(var(--cm-duration) * 0.8) ease-in forwards; }
.cm-root.cm-closing::backdrop { animation: cm-fade calc(var(--cm-duration) * 0.8) ease-in reverse forwards; }
.cm-root.cm-shake { animation: cm-shake 320ms ease-in-out; }

@keyframes cm-in { from { opacity: 0; transform: translateY(8px) scale(0.96); } }
@keyframes cm-out { to { opacity: 0; transform: translateY(4px) scale(0.98); } }
@keyframes cm-fade { from { opacity: 0; } }
@keyframes cm-shake {
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

.cm-body { padding: 1.75rem 1.5rem 1.25rem; overflow: auto; text-align: center; }
.cm-close {
  position: absolute; top: 0.5rem; right: 0.5rem;
  width: 2rem; height: 2rem; margin: 0; padding: 0; min-width: 0; border: 0; border-radius: 8px;
  background: transparent; color: var(--cm-muted); font-size: 1.25rem; line-height: 1; cursor: pointer;
}
.cm-close:hover { background: var(--cm-neutral); color: var(--cm-fg); }

.cm-icon { width: 3.5rem; height: 3.5rem; margin: 0 auto 1rem; color: var(--cm-c); }
.cm-icon svg { width: 100%; height: 100%; display: block; }
.cm-icon .cm-ring { opacity: 0.18; }
.cm-icon .cm-mark { stroke-dasharray: 48; stroke-dashoffset: 48; animation: cm-draw 380ms 120ms ease-out forwards; }
@keyframes cm-draw { to { stroke-dashoffset: 0; } }
.cm-icon-success { --cm-c: var(--cm-success); }
.cm-icon-error { --cm-c: var(--cm-error); }
.cm-icon-warning { --cm-c: var(--cm-warning); }
.cm-icon-info { --cm-c: var(--cm-info); }
.cm-icon-question { --cm-c: var(--cm-question); }

.cm-title {
  margin: 0 0 0.375rem; padding: 0; font: inherit; font-size: 1.25rem; font-weight: 650; line-height: 1.3;
  color: var(--cm-fg); text-transform: none; letter-spacing: normal; text-align: inherit; text-wrap: balance;
}
.cm-content { margin: 0; padding: 0; color: var(--cm-muted); text-align: inherit; overflow-wrap: anywhere; }
.cm-content a { color: var(--cm-primary); }

.cm-field { margin-top: 1rem; text-align: left; }
.cm-field-label { display: block; margin-bottom: 0.375rem; font-size: 0.875rem; font-weight: 550; }
.cm-input {
  display: block; width: 100%; margin: 0; padding: 0.625rem 0.75rem; box-shadow: none;
  border: 1px solid var(--cm-border); border-radius: var(--cm-btn-radius);
  background: var(--cm-bg); color: var(--cm-fg); font: inherit;
}
textarea.cm-input { min-height: 6rem; resize: vertical; }
.cm-input:focus-visible { outline: 2px solid var(--cm-primary); outline-offset: 1px; border-color: transparent; }
.cm-input[aria-invalid="true"] { border-color: var(--cm-error); }
.cm-choices { display: grid; gap: 0.375rem; border: 0; margin: 0; padding: 0; }
.cm-choice { display: flex; gap: 0.5rem; align-items: center; cursor: pointer; }
.cm-choice input { accent-color: var(--cm-primary); width: 1rem; height: 1rem; margin: 0; }
.cm-error {
  margin: 0.5rem 0 0; font-size: 0.875rem; color: var(--cm-error); text-align: left;
}
.cm-error:empty { display: none; }

.cm-actions {
  display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;
  padding: 0 1.5rem 1.5rem;
}
.cm-actions.cm-reverse { flex-direction: row-reverse; }
.cm-btn {
  position: relative; min-width: 6rem; margin: 0; padding: 0.625rem 1.125rem;
  border: 0; border-radius: var(--cm-btn-radius); box-shadow: none;
  font: inherit; font-weight: 600; line-height: 1.25; text-align: center; text-transform: none; letter-spacing: normal;
  cursor: pointer;
  transition: filter 120ms, transform 120ms;
}
.cm-btn:hover { filter: brightness(1.06); }
.cm-btn:active { transform: translateY(1px); }
.cm-btn:focus-visible { outline: 2px solid var(--cm-primary); outline-offset: 2px; }
.cm-btn:disabled { cursor: progress; opacity: 0.7; }
.cm-confirm { background: var(--cm-primary); color: var(--cm-primary-fg); }
.cm-confirm.cm-danger, .cm-deny { background: var(--cm-danger); color: var(--cm-danger-fg); }
.cm-cancel { background: var(--cm-neutral); color: var(--cm-neutral-fg); }
.cm-loading { color: transparent !important; }
.cm-loading::after {
  content: ""; position: absolute; inset: 0; margin: auto; width: 1.1em; height: 1.1em;
  border: 2px solid var(--cm-primary-fg); border-right-color: transparent; border-radius: 50%;
  animation: cm-spin 700ms linear infinite;
}
@keyframes cm-spin { to { transform: rotate(1turn); } }

.cm-progress { height: 3px; background: var(--cm-primary); transform-origin: left; opacity: 0.8; }
.cm-progress.cm-running { animation: cm-progress var(--cm-timer) linear forwards; }
@keyframes cm-progress { to { transform: scaleX(0); } }

/* Toasts */
.cm-toasts {
  position: fixed; z-index: 2147483000; display: flex; flex-direction: column; gap: 0.5rem;
  margin: 0; padding: 0; border: 0; background: transparent; overflow: visible;
  inset: auto; width: min(22rem, calc(100vw - 2rem)); pointer-events: none;
  font: 14px/1.45 var(--cm-font); color: var(--cm-fg);
}
.cm-toasts.cm-top, .cm-toasts.cm-top-start, .cm-toasts.cm-top-end { top: 1rem; }
.cm-toasts.cm-bottom, .cm-toasts.cm-bottom-start, .cm-toasts.cm-bottom-end { bottom: 1rem; flex-direction: column-reverse; }
.cm-toasts.cm-top, .cm-toasts.cm-bottom { left: 0; right: 0; margin-inline: auto; }
.cm-toasts.cm-top-start, .cm-toasts.cm-bottom-start { inset-inline-start: 1rem; }
.cm-toasts.cm-top-end, .cm-toasts.cm-bottom-end { inset-inline-end: 1rem; }
.cm-toast {
  pointer-events: auto; position: relative; display: flex; gap: 0.75rem; align-items: flex-start;
  padding: 0.875rem 1rem; border-radius: 12px; overflow: hidden;
  background: var(--cm-bg); color: var(--cm-fg); box-shadow: var(--cm-shadow);
  animation: cm-in var(--cm-duration) var(--cm-ease);
}
.cm-toast.cm-closing { animation: cm-out calc(var(--cm-duration) * 0.8) ease-in forwards; }
.cm-toast .cm-icon { width: 1.5rem; height: 1.5rem; margin: 0; flex: none; }
.cm-toast .cm-title { font-size: 0.9375rem; margin: 0; }
.cm-toast-main { flex: 1; min-width: 0; }
.cm-toast .cm-close { position: static; width: 1.5rem; height: 1.5rem; font-size: 1rem; margin: -0.125rem -0.375rem 0 0; flex: none; }
.cm-toast-action {
  margin-top: 0.375rem; padding: 0; border: 0; background: none; font: inherit; font-weight: 600;
  color: var(--cm-primary); cursor: pointer;
}
.cm-toast .cm-progress { position: absolute; left: 0; right: 0; bottom: 0; }
.cm-toast:hover .cm-progress.cm-running, .cm-toast:focus-within .cm-progress.cm-running,
.cm-toast.cm-paused .cm-progress.cm-running { animation-play-state: paused; }

@media (prefers-reduced-motion: reduce) {
  .cm-root, .cm-root::backdrop, .cm-toast, .cm-icon .cm-mark { animation-duration: 1ms !important; animation-delay: 0ms !important; }
  .cm-progress.cm-running { animation-duration: var(--cm-timer) !important; }
}
`;
