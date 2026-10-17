import type { ModalOptions, ModalResult } from './types';
/** Modals are queued: a new one opens only after the previous one has closed. */
export declare function openModal<V>(o: ModalOptions<V>, nonce?: string, inject?: boolean): Promise<ModalResult<V>>;
export declare function closeModal(): void;
export declare function isModalOpen(): boolean;
export declare function getDialog(): HTMLDialogElement | null;
