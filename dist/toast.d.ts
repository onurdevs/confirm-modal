import type { ToastHandle, ToastOptions } from './types';
/** Re-enters toast containers into the top layer so they render above a modal opened later. */
export declare function raiseToasts(): void;
export declare function openToast(o: ToastOptions, nonce?: string, inject?: boolean): ToastHandle;
