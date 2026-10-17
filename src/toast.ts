import { animateOut, h, icon, injectStyles, isBrowser, themeClass } from './dom';
import { toNode } from './sanitize';
import type { ToastHandle, ToastOptions, ToastPosition } from './types';

const MAX_VISIBLE = 5;
const containers = new Map<ToastPosition, HTMLElement>();

const supportsPopover = () => typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype;

function container(pos: ToastPosition): HTMLElement {
  let el = containers.get(pos);
  if (el?.isConnected) return el;
  el = h('section', {
    class: `cm-toasts cm-${pos}`,
    'aria-label': 'Notifications',
    // A manual popover sits in the top layer, so toasts stay visible above an open modal.
    popover: supportsPopover() ? 'manual' : undefined,
  });
  document.body.append(el);
  containers.set(pos, el);
  return el;
}

function show(el: HTMLElement): void {
  if (!el.hasAttribute('popover')) return;
  try {
    if (el.matches(':popover-open')) el.hidePopover();
    el.showPopover();
  } catch {
    /* not supported */
  }
}

/** Re-enters toast containers into the top layer so they render above a modal opened later. */
export function raiseToasts(): void {
  for (const el of containers.values()) if (el.isConnected && el.childElementCount) show(el);
}

export function openToast(o: ToastOptions, nonce?: string, inject = true): ToastHandle {
  if (!isBrowser) {
    const noop = Promise.resolve();
    return { close() {}, closed: noop, element: undefined as unknown as HTMLElement };
  }
  if (inject) injectStyles(nonce);

  const box = container(o.position ?? 'top-end');
  const assertive = o.icon === 'error' || o.icon === 'warning';
  const el = h('div', {
    class: ['cm-toast', themeClass(o.theme), o.className].filter(Boolean).join(' '),
    role: assertive ? 'alert' : 'status',
    'aria-atomic': 'true',
  });

  if (o.icon) el.append(icon(o.icon));
  const main = h('div', { class: 'cm-toast-main' });
  if (o.title) main.append(h('p', { class: 'cm-title' }, o.title));
  if (o.html !== undefined) {
    const c = h('div', { class: 'cm-content' });
    c.append(toNode(o.html, o.sanitizer));
    main.append(c);
  } else if (o.text) {
    main.append(h('p', { class: 'cm-content' }, o.text));
  }
  if (o.action) {
    const { text, onClick } = o.action;
    const a = h('button', { type: 'button', class: 'cm-toast-action' }, text);
    a.addEventListener('click', () => {
      onClick();
      close();
    });
    main.append(a);
  }
  el.append(main);

  if (o.showCloseButton !== false) {
    const x = h('button', { type: 'button', class: 'cm-close', 'aria-label': 'Dismiss' }, '×');
    x.addEventListener('click', () => close());
    el.append(x);
  }

  const duration = o.timer ?? 4000;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let remaining = duration;
  let startedAt = 0;
  let closing = false;
  let resolveClosed!: () => void;
  let rejectClosed!: (reason: unknown) => void;
  const closed = new Promise<void>((resolve, reject) => {
    resolveClosed = resolve;
    rejectClosed = reject;
  });

  const start = () => {
    if (!duration || closing) return;
    startedAt = Date.now();
    timer = setTimeout(close, remaining);
  };
  const pause = () => {
    if (!duration || timer === undefined) return;
    clearTimeout(timer);
    timer = undefined;
    remaining -= Date.now() - startedAt;
    el.classList.add('cm-paused');
  };
  const resume = () => {
    if (timer !== undefined || el.matches(':hover, :focus-within')) return;
    el.classList.remove('cm-paused');
    start();
  };

  async function close() {
    if (closing) return;
    closing = true;
    clearTimeout(timer);
    await animateOut(el);
    el.remove();
    if (!box.childElementCount) {
      try {
        if (box.matches(':popover-open')) box.hidePopover();
      } catch {
        /* ignore */
      }
    }
    try {
      o.onClose?.();
    } catch (error) {
      rejectClosed(error);
      return;
    }
    resolveClosed();
  }

  if (duration && o.timerProgressBar !== false) {
    const bar = h('div', { class: 'cm-progress', 'aria-hidden': 'true' });
    bar.style.setProperty('--cm-timer', `${duration}ms`);
    el.append(bar);
    requestAnimationFrame(() => bar.classList.add('cm-running'));
  }

  if (o.pauseOnHover !== false) {
    el.addEventListener('mouseenter', pause);
    el.addEventListener('focusin', pause);
    el.addEventListener('mouseleave', () => setTimeout(resume));
    el.addEventListener('focusout', () => setTimeout(resume));
  }

  box.append(el);
  show(box);
  // Drop the oldest toasts beyond the limit.
  const items = box.querySelectorAll<HTMLElement>('.cm-toast:not(.cm-closing)');
  for (let i = 0; i < items.length - MAX_VISIBLE; i++) items[i].dispatchEvent(new CustomEvent('cm:close'));
  el.addEventListener('cm:close', () => close());

  start();
  return { close, closed, element: el };
}
