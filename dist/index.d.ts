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
export declare function createModal(defaults?: Defaults): ModalApi;
/** Ready-to-use default instance. */
export declare const modal: ModalApi;
export default modal;
