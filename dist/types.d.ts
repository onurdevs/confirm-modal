export type Icon = 'success' | 'error' | 'warning' | 'info' | 'question';
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'radio' | 'checkbox';
export type DismissReason = 'cancel' | 'backdrop' | 'esc' | 'close' | 'timer' | 'abort' | 'programmatic';
export type Position = 'center' | 'top' | 'bottom';
export type ToastPosition = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end';
/** A string goes through the built-in sanitizer (or your own); a Node is inserted as-is. */
export type HtmlContent = string | Node;
export type Sanitizer = (html: string) => string | Node;
export interface ModalOptions<V = unknown> {
    title?: string;
    /** Plain text body. Always rendered with textContent, never parsed as HTML. */
    text?: string;
    /**
     * Rich body. Strings are sanitized with an allowlist before they touch the page.
     * Pass a DOM Node to take full control (you are responsible for its safety).
     */
    html?: HtmlContent;
    icon?: Icon;
    confirmText?: string;
    cancelText?: string;
    denyText?: string;
    showConfirm?: boolean;
    showCancel?: boolean;
    showDeny?: boolean;
    /** Styles the confirm button as destructive. */
    danger?: boolean;
    reverseButtons?: boolean;
    /** Which element gets focus on open. Defaults to the input, then the confirm button. */
    focus?: 'confirm' | 'cancel' | 'deny' | 'input' | 'none';
    showCloseButton?: boolean;
    input?: InputType;
    inputValue?: string | number | boolean;
    inputPlaceholder?: string;
    inputLabel?: string;
    /** For select / radio: value → label map, or an array of [value, label] pairs. */
    inputOptions?: Record<string, string> | Array<[string, string]>;
    inputAttributes?: Record<string, string>;
    /** Return an error message to block confirmation. May be async. */
    validate?: (value: string | boolean) => string | void | null | undefined | Promise<string | void | null | undefined>;
    /**
     * Runs after confirm, while the button shows a loading state.
     * Its resolved value becomes `result.value`. Throw or return `false` to keep the modal open.
     */
    preConfirm?: (value: V) => unknown;
    /** Close the modal automatically after this many milliseconds. */
    timer?: number;
    timerProgressBar?: boolean;
    /** Allow closing with Escape. Default true. */
    closeOnEsc?: boolean;
    /** Allow closing by clicking the backdrop. Default true. */
    closeOnBackdrop?: boolean;
    position?: Position;
    /** 'auto' follows prefers-color-scheme. */
    theme?: 'light' | 'dark' | 'auto';
    width?: string;
    /** Extra class names added to the dialog element. */
    className?: string;
    /** Replace the built-in HTML sanitizer, e.g. with DOMPurify.sanitize. */
    sanitizer?: Sanitizer;
    /** Abort to close the modal from outside (dismiss reason 'abort'). */
    signal?: AbortSignal;
    /** Element to mount into. Defaults to document.body. */
    target?: HTMLElement;
    onOpen?: (dialog: HTMLDialogElement) => void;
    onClose?: (result: ModalResult<V>) => void;
}
export interface ModalResult<V = unknown> {
    isConfirmed: boolean;
    isDenied: boolean;
    isDismissed: boolean;
    value?: V;
    dismiss?: DismissReason;
}
export interface ToastOptions {
    title?: string;
    text?: string;
    html?: HtmlContent;
    icon?: Icon;
    /** Milliseconds before auto close. 0 keeps it open. Default 4000. */
    timer?: number;
    timerProgressBar?: boolean;
    position?: ToastPosition;
    theme?: 'light' | 'dark' | 'auto';
    showCloseButton?: boolean;
    /** Pause the timer while hovered or focused. Default true. */
    pauseOnHover?: boolean;
    className?: string;
    sanitizer?: Sanitizer;
    /** Optional action button. */
    action?: {
        text: string;
        onClick: () => void;
    };
    onClose?: () => void;
}
export interface ToastHandle {
    close(): void;
    /** Resolves when the toast has left the screen. */
    closed: Promise<void>;
    element: HTMLElement;
}
export type Defaults = Partial<ModalOptions<any>> & {
    toast?: Partial<ToastOptions>;
    /** CSP nonce for the injected <style> fallback (only used without constructable stylesheets). */
    styleNonce?: string;
    /** Set false if you load dist/confirm-modal.css yourself. Default true. */
    injectStyles?: boolean;
};
