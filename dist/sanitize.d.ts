import type { HtmlContent, Sanitizer } from './types';
export declare function isSafeUrl(url: string, img?: boolean): boolean;
export declare function sanitizeHtml(html: string, doc?: Document): DocumentFragment;
/** Turns user-supplied html content into a Node that is safe to insert. */
export declare function toNode(content: HtmlContent, sanitizer?: Sanitizer): Node;
