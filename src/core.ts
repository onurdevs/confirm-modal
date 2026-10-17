import { animateOut, h, icon, injectStyles, isBrowser, nextId, themeClass } from './dom';
import { toNode } from './sanitize';
import { raiseToasts } from './toast';
import type { DismissReason, InputType, ModalOptions, ModalResult } from './types';

interface Current {
  dismiss(reason: DismissReason): void;
  dialog: HTMLDialogElement;
}

let current: Current | null = null;
let chain: Promise<unknown> = Promise.resolve();

const dismissed = <V>(reason: DismissReason): ModalResult<V> => ({
  isConfirmed: false,
  isDenied: false,
  isDismissed: true,
  dismiss: reason,
});

/** Modals are queued: a new one opens only after the previous one has closed. */
export function openModal<V>(o: ModalOptions<V>, nonce?: string, inject = true): Promise<ModalResult<V>> {
  if (!isBrowser) return Promise.resolve(dismissed<V>('programmatic'));
  const run = () => render(o, nonce, inject);
  const p = chain.then(run, run);
  chain = p.catch(() => undefined);
  return p;
}

export function closeModal(): void {
  current?.dismiss('programmatic');
}

export function isModalOpen(): boolean {
  return current !== null;
}

export function getDialog(): HTMLDialogElement | null {
  return current?.dialog ?? null;
}

const TEXT_INPUTS = new Set<InputType>(['text', 'email', 'password', 'number', 'tel', 'url']);

function optionEntries(opts: ModalOptions['inputOptions']): Array<[string, string]> {
  if (!opts) return [];
  return Array.isArray(opts) ? opts : Object.entries(opts);
}

function setAttrs(el: Element, attrs: Record<string, string> | undefined): void {
  if (!attrs) return;
  for (const [k, v] of Object.entries(attrs)) {
    // Event handler attributes are never accepted: they would be an XSS vector.
    if (/^on/i.test(k)) continue;
    el.setAttribute(k, v);
  }
}

function render<V>(o: ModalOptions<V>, nonce?: string, inject = true): Promise<ModalResult<V>> {
  if (o.signal?.aborted) return Promise.resolve(dismissed<V>('abort'));
  if (inject) injectStyles(nonce);

  return new Promise((resolve) => {
    const titleId = nextId('title');
    const contentId = nextId('content');
    const errorId = nextId('error');
    const hasInput = !!o.input;

    const dialog = h('dialog', {
      class: ['cm-root', themeClass(o.theme), o.position && o.position !== 'center' && `cm-${o.position}`, o.className]
        .filter(Boolean)
        .join(' '),
      role: hasInput ? undefined : 'alertdialog',
      'aria-modal': 'true',
      'aria-labelledby': o.title ? titleId : undefined,
      'aria-describedby': o.text || o.html ? contentId : undefined,
      'aria-label': o.title ? undefined : 'Dialog',
    });
    if (o.width) dialog.style.setProperty('--cm-width', o.width);

    const form = h('form', { class: 'cm-form', method: 'dialog', novalidate: true });
    const body = h('div', { class: 'cm-body' });
    form.append(body);
    dialog.append(form);

    if (o.showCloseButton) {
      const x = h('button', { type: 'button', class: 'cm-close', 'aria-label': 'Close' }, '×');
      x.addEventListener('click', () => dismiss('close'));
      body.append(x);
    }
    if (o.icon) body.append(icon(o.icon));
    if (o.title) body.append(h('h2', { class: 'cm-title', id: titleId }, o.title));
    if (o.html !== undefined) {
      const c = h('div', { class: 'cm-content', id: contentId });
      c.append(toNode(o.html, o.sanitizer));
      body.append(c);
    } else if (o.text) {
      body.append(h('p', { class: 'cm-content', id: contentId }, o.text));
    }

    // ---- input ----
    let field: HTMLElement | null = null;
    let focusTarget: HTMLElement | null = null;
    let getValue: () => string | boolean = () => true;
    const error = h('p', { class: 'cm-error', id: errorId, 'aria-live': 'assertive' });

    if (o.input) {
      const inputId = nextId('input');
      const type = o.input;
      field = h('div', { class: 'cm-field' });
      const label = o.inputLabel;
      const describe = { 'aria-describedby': errorId };

      if (TEXT_INPUTS.has(type) || type === 'textarea') {
        if (label) field.append(h('label', { class: 'cm-field-label', for: inputId }, label));
        const el =
          type === 'textarea'
            ? h('textarea', { class: 'cm-input', id: inputId, ...describe })
            : h('input', { class: 'cm-input', id: inputId, type, autocomplete: 'off', ...describe });
        if (!label) el.setAttribute('aria-label', o.title || 'Input');
        if (o.inputPlaceholder) el.placeholder = o.inputPlaceholder;
        setAttrs(el, o.inputAttributes);
        if (o.inputValue !== undefined) el.value = String(o.inputValue);
        field.append(el);
        focusTarget = el;
        getValue = () => el.value;
      } else if (type === 'select') {
        if (label) field.append(h('label', { class: 'cm-field-label', for: inputId }, label));
        const el = h('select', { class: 'cm-input', id: inputId, ...describe });
        if (!label) el.setAttribute('aria-label', o.title || 'Select');
        if (o.inputPlaceholder) el.append(h('option', { value: '', disabled: true, selected: true }, o.inputPlaceholder));
        for (const [value, text] of optionEntries(o.inputOptions)) el.append(h('option', { value }, text));
        setAttrs(el, o.inputAttributes);
        if (o.inputValue !== undefined) el.value = String(o.inputValue);
        field.append(el);
        focusTarget = el;
        getValue = () => el.value;
      } else if (type === 'radio') {
        const set = h('fieldset', { class: 'cm-choices', ...describe });
        set.append(h('legend', { class: 'cm-field-label' }, label || o.title || ''));
        const name = inputId;
        const radios: HTMLInputElement[] = [];
        for (const [value, text] of optionEntries(o.inputOptions)) {
          const r = h('input', { type: 'radio', name, value });
          if (String(o.inputValue) === value) r.checked = true;
          radios.push(r);
          const l = h('label', { class: 'cm-choice' });
          l.append(r, document.createTextNode(text));
          set.append(l);
        }
        field.append(set);
        focusTarget = radios.find((r) => r.checked) ?? radios[0] ?? null;
        getValue = () => radios.find((r) => r.checked)?.value ?? '';
      } else if (type === 'checkbox') {
        const c = h('input', { type: 'checkbox', id: inputId, ...describe });
        c.checked = !!o.inputValue;
        setAttrs(c, o.inputAttributes);
        const l = h('label', { class: 'cm-choice' });
        l.append(c, document.createTextNode(label || o.inputPlaceholder || ''));
        field.append(l);
        focusTarget = c;
        getValue = () => c.checked;
      }
      body.append(field);
    }
    body.append(error);

    // ---- buttons ----
    const actions = h('div', { class: `cm-actions${o.reverseButtons ? ' cm-reverse' : ''}` });
    const btn = (cls: string, text: string) => h('button', { type: 'button', class: `cm-btn ${cls}` }, text);
    const cancelBtn = o.showCancel ? btn('cm-cancel', o.cancelText ?? 'Cancel') : null;
    const denyBtn = o.showDeny ? btn('cm-deny', o.denyText ?? 'No') : null;
    const confirmBtn =
      o.showConfirm !== false ? btn(`cm-confirm${o.danger ? ' cm-danger' : ''}`, o.confirmText ?? 'OK') : null;
    if (confirmBtn) confirmBtn.type = 'submit';
    for (const b of [cancelBtn, denyBtn, confirmBtn]) if (b) actions.append(b);
    if (actions.childElementCount) form.append(actions);

    // ---- timer ----
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (o.timer && o.timerProgressBar) {
      const bar = h('div', { class: 'cm-progress', 'aria-hidden': 'true' });
      bar.style.setProperty('--cm-timer', `${o.timer}ms`);
      dialog.append(bar);
      requestAnimationFrame(() => bar.classList.add('cm-running'));
    }

    // ---- lifecycle ----
    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    let settled = false;
    let busy = false;

    const finish = async (result: ModalResult<V>) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      o.signal?.removeEventListener('abort', onAbort);
      if (current?.dialog === dialog) current = null;
      await animateOut(dialog);
      if (dialog.open) dialog.close();
      dialog.remove();
      root.style.overflow = prevOverflow;
      if (opener && opener.isConnected && typeof opener.focus === 'function') opener.focus({ preventScroll: true });
      try {
        o.onClose?.(result);
      } finally {
        resolve(result);
      }
    };

    const dismiss = (reason: DismissReason) => {
      if (busy && reason !== 'abort' && reason !== 'programmatic') return;
      finish(dismissed<V>(reason));
    };
    const onAbort = () => dismiss('abort');

    const showError = (msg: string) => {
      error.textContent = msg;
      focusTarget?.setAttribute('aria-invalid', 'true');
      dialog.classList.remove('cm-shake');
      void dialog.offsetWidth;
      dialog.classList.add('cm-shake');
      focusTarget?.focus();
    };

    const setBusy = (on: boolean) => {
      busy = on;
      for (const b of [cancelBtn, denyBtn, confirmBtn]) if (b) b.disabled = on;
      confirmBtn?.classList.toggle('cm-loading', on);
      confirmBtn?.setAttribute('aria-busy', String(on));
    };

    const confirm = async () => {
      if (busy || settled) return;
      const raw = getValue();
      let value: unknown = hasInput ? raw : true;
      error.textContent = '';
      focusTarget?.removeAttribute('aria-invalid');
      setBusy(true);
      try {
        if (o.validate) {
          const msg = await o.validate(raw);
          if (msg) {
            setBusy(false);
            return showError(msg);
          }
        }
        if (o.preConfirm) {
          const out = await o.preConfirm(value as V);
          if (out === false) {
            setBusy(false);
            return;
          }
          if (out !== undefined) value = out;
        }
      } catch (e) {
        setBusy(false);
        return showError(e instanceof Error ? e.message : String(e));
      }
      busy = false;
      finish({ isConfirmed: true, isDenied: false, isDismissed: false, value: value as V });
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      confirm();
    });
    cancelBtn?.addEventListener('click', () => dismiss('cancel'));
    denyBtn?.addEventListener('click', () => {
      if (!busy) finish({ isConfirmed: false, isDenied: true, isDismissed: false, value: false as V });
    });

    // Escape: the native `cancel` event. Prevent it when ESC is disabled.
    dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      if (o.closeOnEsc !== false) dismiss('esc');
    });
    // Some browsers close anyway on repeated ESC; keep our state consistent.
    dialog.addEventListener('close', () => {
      if (!settled) finish(dismissed<V>('esc'));
    });

    // Backdrop: only when both press and release happen outside the panel (no drag-select closes).
    let downOnBackdrop = false;
    dialog.addEventListener('pointerdown', (e) => {
      downOnBackdrop = e.target === dialog;
    });
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog && downOnBackdrop && o.closeOnBackdrop !== false) dismiss('backdrop');
      downOnBackdrop = false;
    });

    o.signal?.addEventListener('abort', onAbort, { once: true });
    if (o.timer) timer = setTimeout(() => dismiss('timer'), o.timer);

    (o.target ?? document.body).append(dialog);
    root.style.overflow = 'hidden';
    if (typeof dialog.showModal === 'function') {
      try {
        dialog.showModal();
      } catch {
        dialog.setAttribute('open', '');
      }
    } else {
      dialog.setAttribute('open', '');
    }
    current = { dialog, dismiss };
    raiseToasts();

    const pick =
      o.focus === 'none'
        ? null
        : o.focus === 'cancel'
          ? cancelBtn
          : o.focus === 'deny'
            ? denyBtn
            : o.focus === 'confirm'
              ? confirmBtn
              : o.focus === 'input'
                ? focusTarget
                : // Destructive actions default to the safe choice.
                  (focusTarget ?? (o.danger && cancelBtn ? cancelBtn : confirmBtn ?? cancelBtn));
    if (pick) {
      pick.focus();
      if (pick instanceof HTMLInputElement && TEXT_INPUTS.has(o.input!)) pick.select?.();
    } else {
      dialog.focus();
    }

    o.onOpen?.(dialog);
  });
}
