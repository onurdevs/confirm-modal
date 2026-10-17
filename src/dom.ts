import { css } from './styles';
import type { Icon } from './types';

export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

type Attrs = Record<string, string | number | boolean | undefined | null>;

/** Tiny element factory. Text goes through textContent, never innerHTML. */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  text?: string,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const k in attrs) {
    const v = attrs[k];
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') el.className = String(v);
    else el.setAttribute(k, v === true ? '' : String(v));
  }
  if (text !== undefined) el.textContent = text;
  return el;
}

let uid = 0;
export const nextId = (p: string) => `cm-${p}-${++uid}`;

const SVG = 'http://www.w3.org/2000/svg';
const ICON_PATHS: Record<Icon, string> = {
  success: 'M15 24.5l6 6 12-13',
  error: 'M17 17l14 14M31 17L17 31',
  warning: 'M24 14v12M24 33v.5',
  info: 'M24 22v12M24 15v.5',
  question: 'M19 19a5 5 0 1 1 7 4.6c-1.3.6-2 1.6-2 3V28M24 33v.5',
};

export function icon(name: Icon): HTMLElement {
  const wrap = h('div', { class: `cm-icon cm-icon-${name}`, 'aria-hidden': 'true' });
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 48 48');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '3.5');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  const ring = document.createElementNS(SVG, 'circle');
  ring.setAttribute('class', 'cm-ring');
  ring.setAttribute('cx', '24');
  ring.setAttribute('cy', '24');
  ring.setAttribute('r', '22');
  ring.setAttribute('fill', 'currentColor');
  ring.setAttribute('stroke', 'none');
  const mark = document.createElementNS(SVG, 'path');
  mark.setAttribute('class', 'cm-mark');
  mark.setAttribute('d', ICON_PATHS[name]);
  svg.append(ring, mark);
  wrap.append(svg);
  return wrap;
}

let stylesInjected = false;
/**
 * Prefers constructable stylesheets (not subject to CSP style-src 'unsafe-inline'),
 * falls back to a <style> element carrying the given nonce.
 */
export function injectStyles(nonce?: string): void {
  if (stylesInjected || !isBrowser) return;
  stylesInjected = true;
  try {
    if ('adoptedStyleSheets' in Document.prototype && 'replaceSync' in CSSStyleSheet.prototype) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(css);
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
      return;
    }
  } catch {
    /* fall through */
  }
  const style = h('style', { 'data-confirm-modal': '', nonce });
  style.textContent = css;
  document.head.append(style);
}

const reducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Adds a class that runs a CSS animation and resolves when it ends (with a safety timeout). */
export function animateOut(el: HTMLElement, cls = 'cm-closing'): Promise<void> {
  return new Promise((resolve) => {
    if (reducedMotion() || typeof el.getAnimations !== 'function') return resolve();
    el.classList.add(cls);
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.removeEventListener('animationend', onEnd);
      resolve();
    };
    const onEnd = (e: AnimationEvent) => e.target === el && finish();
    el.addEventListener('animationend', onEnd);
    setTimeout(finish, 400);
  });
}

export function themeClass(theme: 'light' | 'dark' | 'auto' | undefined): string {
  return theme === 'dark' ? 'cm-dark' : theme === 'light' ? '' : 'cm-auto';
}
