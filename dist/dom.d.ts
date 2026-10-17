import type { Icon } from './types';
export declare const isBrowser: boolean;
type Attrs = Record<string, string | number | boolean | undefined | null>;
/** Tiny element factory. Text goes through textContent, never innerHTML. */
export declare function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs?: Attrs, text?: string): HTMLElementTagNameMap[K];
export declare const nextId: (p: string) => string;
export declare function icon(name: Icon): HTMLElement;
/**
 * Prefers constructable stylesheets (not subject to CSP style-src 'unsafe-inline'),
 * falls back to a <style> element carrying the given nonce.
 */
export declare function injectStyles(nonce?: string): void;
/** Adds a class that runs a CSS animation and resolves when it ends (with a safety timeout). */
export declare function animateOut(el: HTMLElement, cls?: string): Promise<void>;
export declare function themeClass(theme: 'light' | 'dark' | 'auto' | undefined): string;
export {};
