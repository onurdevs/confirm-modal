import type { HtmlContent, Sanitizer } from './types';

/**
 * Allowlist sanitizer.
 *
 * The string is parsed in an inert document (DOMParser: no scripts run, no resources load),
 * then rebuilt node by node in the live document. Anything not on the allowlist is dropped,
 * including every event handler attribute and every non-http(s)/mailto/tel URL.
 */

const TAGS = new Set([
  'a', 'abbr', 'b', 'blockquote', 'br', 'code', 'del', 'div', 'em', 'h1', 'h2', 'h3', 'h4',
  'h5', 'h6', 'hr', 'i', 'img', 'kbd', 'li', 'mark', 'ol', 'p', 'pre', 's', 'small', 'span',
  'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'u', 'ul',
]);

/** Elements whose content is dropped along with the element itself. */
const DROP_WITH_CONTENT = new Set([
  'script', 'style', 'template', 'iframe', 'object', 'embed', 'noscript', 'svg', 'math', 'form',
  'textarea', 'select', 'button', 'title', 'link', 'meta', 'base',
]);

const GLOBAL_ATTRS = new Set(['class', 'title', 'lang', 'dir', 'role', 'id']);
const TAG_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'target', 'rel']),
  img: new Set(['src', 'alt', 'width', 'height', 'loading']),
  td: new Set(['colspan', 'rowspan']),
  th: new Set(['colspan', 'rowspan', 'scope']),
  ol: new Set(['start', 'reversed']),
};

const SAFE_URL = /^(?:https?:|mailto:|tel:|[^:/?#]*(?:[/?#]|$))/i;
const SAFE_IMG = /^(?:https?:|[^:/?#]*(?:[/?#]|$)|data:image\/(?:png|gif|jpe?g|webp|avif);base64,)/i;

export function isSafeUrl(url: string, img = false): boolean {
  // Strip whitespace and control chars that browsers ignore inside schemes ("java\nscript:").
  const v = url.replace(/[\u0000- \u007f-\u009f]/g, '');
  return (img ? SAFE_IMG : SAFE_URL).test(v);
}

let policy: { createHTML(s: string): unknown } | null | undefined;
function toTrusted(html: string): string {
  if (policy === undefined) {
    const tt = (globalThis as any).trustedTypes;
    try {
      // Only feeds DOMParser, whose output is inert and fully rebuilt below.
      policy = tt?.createPolicy ? tt.createPolicy('confirm-modal', { createHTML: (s: string) => s }) : null;
    } catch {
      policy = null;
    }
  }
  return policy ? (policy.createHTML(html) as string) : html;
}

function clean(src: Node, doc: Document): Node | null {
  if (src.nodeType === 3) return doc.createTextNode(src.nodeValue ?? '');
  if (src.nodeType !== 1) return null;

  const el = src as Element;
  const tag = el.localName;
  if (DROP_WITH_CONTENT.has(tag)) return null;

  const out: Node = TAGS.has(tag) ? doc.createElement(tag) : doc.createDocumentFragment();

  if (out.nodeType === 1) {
    const allowed = TAG_ATTRS[tag];
    for (const { name, value } of Array.from(el.attributes)) {
      const n = name.toLowerCase();
      if (!GLOBAL_ATTRS.has(n) && !allowed?.has(n)) continue;
      if ((n === 'href' || n === 'src') && !isSafeUrl(value, n === 'src')) continue;
      // Prevent DOM clobbering of globals like `document.forms`.
      if (n === 'id' && (value in doc || value in globalThis)) continue;
      (out as Element).setAttribute(n, value);
    }
    if (tag === 'a' && (out as Element).getAttribute('target') === '_blank') {
      (out as Element).setAttribute('rel', 'noopener noreferrer');
    }
  }

  for (const child of Array.from(el.childNodes)) {
    const c = clean(child, doc);
    if (c) out.appendChild(c);
  }
  return out;
}

export function sanitizeHtml(html: string, doc: Document = document): DocumentFragment {
  const frag = doc.createDocumentFragment();
  const parsed = parse(html);
  for (const child of Array.from(parsed.body.childNodes)) {
    const c = clean(child, doc);
    if (c) frag.appendChild(c);
  }
  return frag;
}

function parse(html: string): Document {
  return new DOMParser().parseFromString(toTrusted(html), 'text/html');
}

/** Turns user-supplied html content into a Node that is safe to insert. */
export function toNode(content: HtmlContent, sanitizer?: Sanitizer): Node {
  if (typeof content !== 'string') return content;
  if (!sanitizer) return sanitizeHtml(content);
  const out = sanitizer(content);
  if (typeof out !== 'string') return out;
  // Trust the custom sanitizer's allowlist, but still parse inertly: scripts never execute.
  const frag = document.createDocumentFragment();
  for (const n of Array.from(parse(out).body.childNodes)) frag.appendChild(document.importNode(n, true));
  return frag;
}
