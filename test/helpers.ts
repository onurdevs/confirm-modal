export const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

export function dialog(): HTMLDialogElement {
  const d = document.querySelector<HTMLDialogElement>('dialog.cm-root');
  if (!d) throw new Error('no dialog open');
  return d;
}

export const $ = <T extends Element = HTMLElement>(sel: string) => dialog().querySelector<T>(sel)!;

export function click(el: Element) {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}
