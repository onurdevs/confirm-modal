import { closeModal, getDialog, isModalOpen, openModal } from './core';
import { openToast } from './toast';
import { bindConfirm } from './bind';
import { sanitizeHtml } from './sanitize';
import type { Defaults, Icon, ModalOptions, ModalResult, ToastHandle, ToastOptions } from './types';

export type * from './types';
export { sanitizeHtml };

export interface ModalApi {
  /** Open a modal. Resolves when it closes. */
  fire<V = unknown>(options: ModalOptions<V>): Promise<ModalResult<V>>;
  fire(title: string, text?: string, icon?: Icon): Promise<ModalResult<true>>;
  /** OK / Cancel. Resolves true only when confirmed. */
  confirm(options: ModalOptions | string, text?: string): Promise<boolean>;
  /** A single OK button. */
  alert(options: ModalOptions | string, text?: string): Promise<void>;
  /** Text input. Resolves the value, or null when dismissed. */
  prompt(options: ModalOptions<string> | string, defaultValue?: string): Promise<string | null>;
  success(title: string, text?: string): Promise<void>;
  error(title: string, text?: string): Promise<void>;
  warning(title: string, text?: string): Promise<void>;
  info(title: string, text?: string): Promise<void>;
  /** Non-blocking notification. */
  toast(options: ToastOptions | string): ToastHandle;
  /** Dismiss the open modal (reason 'programmatic'). */
  close(): void;
  isOpen(): boolean;
  getDialog(): HTMLDialogElement | null;
  /** A new instance with extra defaults layered on top of this one's. */
  create(defaults: Defaults): ModalApi;
  /** Ask for confirmation on clicks of [data-cm-confirm] elements. Returns an unbind function. */
  bind(root?: Document | HTMLElement): () => void;
  readonly defaults: Readonly<Defaults>;
}

const asOptions = <V>(o: ModalOptions<V> | string, text?: string): ModalOptions<V> =>
  typeof o === 'string' ? { title: o, text } : o;

export function createModal(defaults: Defaults = {}): ModalApi {
  const { toast: toastDefaults, styleNonce, injectStyles = true, ...modalDefaults } = defaults;

  const fire = <V>(o: ModalOptions<V>) => openModal<V>({ ...modalDefaults, ...o }, styleNonce, injectStyles);
  const shortcut = (icon: Icon) => (title: string, text?: string) =>
    fire({ title, text, icon }).then(() => undefined);

  const api: ModalApi = {
    fire(o: ModalOptions | string, text?: string, icon?: Icon) {
      return fire(typeof o === 'string' ? { title: o, text, icon } : o) as Promise<ModalResult<any>>;
    },
    confirm: (o, text) => fire({ showCancel: true, ...asOptions(o, text) }).then((r) => r.isConfirmed),
    alert: (o, text) => fire({ showCancel: false, ...asOptions(o, text) }).then(() => undefined),
    prompt: (o, defaultValue) =>
      fire<string>({ input: 'text', showCancel: true, inputValue: defaultValue, ...asOptions(o) }).then((r) =>
        r.isConfirmed ? String(r.value ?? '') : null,
      ),
    success: shortcut('success'),
    error: shortcut('error'),
    warning: shortcut('warning'),
    info: shortcut('info'),
    toast: (o) =>
      openToast(
        { theme: modalDefaults.theme, ...toastDefaults, ...(typeof o === 'string' ? { title: o } : o) },
        styleNonce,
        injectStyles,
      ),
    close: closeModal,
    isOpen: isModalOpen,
    getDialog,
    create: (more) =>
      createModal({ ...defaults, ...more, toast: { ...toastDefaults, ...more.toast } }),
    bind: (root) => bindConfirm(api, root),
    defaults: Object.freeze({ ...defaults }),
  };
  return api;
}

/** Ready-to-use default instance. */
export const modal: ModalApi = createModal();
export default modal;
