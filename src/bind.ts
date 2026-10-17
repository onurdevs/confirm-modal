import { isBrowser } from './dom';
import type { ModalApi } from './index';

const SELECTOR = '[data-cm-confirm]';

/**
 * Declarative confirmation, no JavaScript per element:
 *
 *   <a href="/logout" data-cm-confirm="Sign out?">Sign out</a>
 *   <button form="f" data-cm-confirm="Delete forever?" data-cm-danger data-cm-confirm-text="Delete">…</button>
 *   <form data-cm-confirm="Send the form?">…</form>
 *
 * Optional: data-cm-title, data-cm-confirm-text, data-cm-cancel-text, data-cm-danger, data-cm-icon.
 */
export function bindConfirm(api: ModalApi, root: Document | HTMLElement = document): () => void {
  if (!isBrowser) return () => {};
  const approved = new WeakSet<Element>();

  const ask = (el: HTMLElement) => {
    const d = el.dataset;
    const message = d.cmConfirm || '';
    return api.confirm({
      title: d.cmTitle || message,
      text: d.cmTitle ? message : undefined,
      confirmText: d.cmConfirmText,
      cancelText: d.cmCancelText,
      danger: 'cmDanger' in d,
      icon: (d.cmIcon as any) || ('cmDanger' in d ? 'warning' : undefined),
    });
  };

  const onClick = async (e: Event) => {
    const el = (e.target as Element | null)?.closest?.(SELECTOR) as HTMLElement | null;
    if (!el || el instanceof HTMLFormElement || !root.contains(el)) return;
    if (approved.has(el)) {
      approved.delete(el);
      return;
    }
    e.preventDefault();
    e.stopImmediatePropagation();
    if (await ask(el)) {
      approved.add(el);
      el.click();
    }
  };

  const onSubmit = async (e: Event) => {
    const form = e.target as HTMLFormElement;
    if (!(form instanceof HTMLFormElement) || !form.matches(SELECTOR)) return;
    if (approved.has(form)) {
      approved.delete(form);
      return;
    }
    e.preventDefault();
    e.stopImmediatePropagation();
    const submitter = (e as SubmitEvent).submitter as HTMLElement | null;
    if (await ask(form)) {
      approved.add(form);
      form.requestSubmit(submitter ?? undefined);
    }
  };

  root.addEventListener('click', onClick, true);
  root.addEventListener('submit', onSubmit, true);
  return () => {
    root.removeEventListener('click', onClick, true);
    root.removeEventListener('submit', onSubmit, true);
  };
}
