import type { ModalApi } from './index';
/**
 * Declarative confirmation, no JavaScript per element:
 *
 *   <a href="/logout" data-cm-confirm="Sign out?">Sign out</a>
 *   <button form="f" data-cm-confirm="Delete forever?" data-cm-danger data-cm-confirm-text="Delete">…</button>
 *   <form data-cm-confirm="Send the form?">…</form>
 *
 * Optional: data-cm-title, data-cm-confirm-text, data-cm-cancel-text, data-cm-danger, data-cm-icon.
 */
export declare function bindConfirm(api: ModalApi, root?: Document | HTMLElement): () => void;
