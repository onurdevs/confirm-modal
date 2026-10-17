import { afterEach, describe, expect, it, vi } from 'vitest';
import modal, { createModal } from '../src/index';
import { $, click, dialog, tick } from './helpers';

afterEach(async () => {
  if (modal.isOpen()) {
    modal.close();
    await tick(450);
  }
  document.body.innerHTML = '';
});

describe('fire', () => {
  it('renders title and text as plain text (no HTML parsing)', async () => {
    const p = modal.fire({ title: '<img src=x onerror=alert(1)>', text: '<b>bold</b>' });
    await tick();
    expect($('.cm-title').textContent).toBe('<img src=x onerror=alert(1)>');
    expect($('.cm-content').textContent).toBe('<b>bold</b>');
    expect(dialog().querySelector('img, b')).toBeNull();
    click($('.cm-confirm'));
    expect(await p).toEqual({ isConfirmed: true, isDenied: false, isDismissed: false, value: true });
  });

  it('supports the (title, text, icon) shorthand', async () => {
    const p = modal.fire('Saved', 'All good', 'success');
    await tick();
    expect($('.cm-icon-success')).toBeTruthy();
    click($('.cm-confirm'));
    expect((await p).isConfirmed).toBe(true);
  });

  it('is accessible: dialog role, labels and modal state', async () => {
    modal.fire({ title: 'Hi', text: 'There' });
    await tick();
    const d = dialog();
    expect(d.open).toBe(true);
    expect(d.getAttribute('role')).toBe('alertdialog');
    expect(document.getElementById(d.getAttribute('aria-labelledby')!)!.textContent).toBe('Hi');
    expect(document.getElementById(d.getAttribute('aria-describedby')!)!.textContent).toBe('There');
    expect(document.activeElement).toBe($('.cm-confirm'));
  });

  it('returns focus to the opener and removes itself on close', async () => {
    const opener = document.createElement('button');
    document.body.append(opener);
    opener.focus();
    const p = modal.fire({ title: 'x' });
    await tick();
    click($('.cm-confirm'));
    await p;
    expect(document.querySelector('dialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it('dismisses with Escape through the native cancel event', async () => {
    const p = modal.fire({ title: 'x' });
    await tick();
    dialog().dispatchEvent(new Event('cancel', { cancelable: true }));
    expect(await p).toMatchObject({ isDismissed: true, dismiss: 'esc' });
  });

  it('ignores Escape when closeOnEsc is false', async () => {
    const p = modal.fire({ title: 'x', closeOnEsc: false });
    await tick();
    const ev = new Event('cancel', { cancelable: true });
    dialog().dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    await tick(20);
    expect(modal.isOpen()).toBe(true);
    click($('.cm-confirm'));
    await p;
  });

  it('closes on backdrop only when press and release both land on it', async () => {
    const p = modal.fire({ title: 'x' });
    await tick();
    const d = dialog();
    // Drag from inside the panel out to the backdrop: must not close.
    $('.cm-title').dispatchEvent(new Event('pointerdown', { bubbles: true }));
    click(d);
    await tick(20);
    expect(modal.isOpen()).toBe(true);
    d.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    click(d);
    expect(await p).toMatchObject({ dismiss: 'backdrop' });
  });

  it('respects closeOnBackdrop: false', async () => {
    modal.fire({ title: 'x', closeOnBackdrop: false });
    await tick();
    dialog().dispatchEvent(new Event('pointerdown', { bubbles: true }));
    click(dialog());
    await tick(20);
    expect(modal.isOpen()).toBe(true);
  });

  it('auto closes with a timer', async () => {
    const p = modal.fire({ title: 'x', timer: 30, timerProgressBar: true });
    await tick();
    expect($('.cm-progress')).toBeTruthy();
    expect(await p).toMatchObject({ dismiss: 'timer' });
  });

  it('closes when the AbortSignal aborts', async () => {
    const ac = new AbortController();
    const p = modal.fire({ title: 'x', signal: ac.signal });
    await tick();
    ac.abort();
    expect(await p).toMatchObject({ dismiss: 'abort' });
  });

  it('supports deny', async () => {
    const p = modal.fire({ title: 'Save?', showDeny: true, showCancel: true });
    await tick();
    click($('.cm-deny'));
    expect(await p).toMatchObject({ isDenied: true, isConfirmed: false, value: false });
  });

  it('queues modals instead of stacking them', async () => {
    const a = modal.fire({ title: 'A' });
    const b = modal.fire({ title: 'B' });
    await tick();
    expect(document.querySelectorAll('dialog').length).toBe(1);
    expect($('.cm-title').textContent).toBe('A');
    click($('.cm-confirm'));
    await a;
    await tick();
    expect($('.cm-title').textContent).toBe('B');
    click($('.cm-confirm'));
    await b;
  });

  it('calls onOpen and onClose', async () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const p = modal.fire({ title: 'x', onOpen, onClose });
    await tick();
    expect(onOpen).toHaveBeenCalledWith(dialog());
    click($('.cm-confirm'));
    const r = await p;
    expect(onClose).toHaveBeenCalledWith(r);
  });

  it('focuses Cancel by default for destructive actions', async () => {
    modal.confirm({ title: 'Delete?', danger: true });
    await tick();
    expect(document.activeElement).toBe($('.cm-cancel'));
    expect($('.cm-confirm').classList.contains('cm-danger')).toBe(true);
  });

  it('locks page scroll while open and restores it', async () => {
    const p = modal.fire({ title: 'x' });
    await tick();
    expect(document.documentElement.style.overflow).toBe('hidden');
    click($('.cm-confirm'));
    await p;
    expect(document.documentElement.style.overflow).toBe('');
  });
});

describe('shortcuts', () => {
  it('confirm resolves a boolean', async () => {
    const yes = modal.confirm('Sure?');
    await tick();
    click($('.cm-confirm'));
    expect(await yes).toBe(true);
    await tick();
    const no = modal.confirm('Sure?');
    await tick();
    click($('.cm-cancel'));
    expect(await no).toBe(false);
  });

  it('prompt resolves the value or null', async () => {
    const p = modal.prompt('Name?', 'Ada');
    await tick();
    const input = $<HTMLInputElement>('input');
    expect(input.value).toBe('Ada');
    expect(document.activeElement).toBe(input);
    input.value = 'Grace';
    $<HTMLFormElement>('form').requestSubmit();
    expect(await p).toBe('Grace');
    await tick();
    const q = modal.prompt('Name?');
    await tick();
    click($('.cm-cancel'));
    expect(await q).toBeNull();
  });
});

describe('inputs', () => {
  it.each(['abort', 'close'] as const)('does not run preConfirm after %s during validation', async (method) => {
    let complete!: () => void;
    const validation = new Promise<void>((resolve) => { complete = resolve; });
    const preConfirm = vi.fn();
    const ac = new AbortController();
    const p = modal.fire({ validate: () => validation, preConfirm, signal: ac.signal });
    await tick();
    click($('.cm-confirm'));
    if (method === 'abort') ac.abort();
    else modal.close();
    complete();
    expect(await p).toMatchObject({ isDismissed: true });
    expect(preConfirm).not.toHaveBeenCalled();
  });

  it('ignores a rejected validation after the next modal opens', async () => {
    let fail!: (error: Error) => void;
    const validation = new Promise<void>((_, reject) => { fail = reject; });
    const first = modal.fire({ input: 'text', validate: () => validation });
    await tick();
    click($('.cm-confirm'));
    modal.close();
    await first;
    const next = modal.prompt('Next');
    await tick();
    const input = $('input');
    fail(new Error('Late failure'));
    await tick();
    expect(document.activeElement).toBe(input);
    expect($('.cm-error').textContent).toBe('');
    modal.close();
    await next;
  });

  it('validate blocks confirmation and shows an accessible error', async () => {
    const p = modal.fire({
      title: 'Email',
      input: 'email',
      validate: (v) => (String(v).includes('@') ? undefined : 'Invalid email'),
    });
    await tick();
    const input = $<HTMLInputElement>('input');
    input.value = 'nope';
    click($('.cm-confirm'));
    await tick();
    expect($('.cm-error').textContent).toBe('Invalid email');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe($('.cm-error').id);
    input.value = 'a@b.co';
    click($('.cm-confirm'));
    expect(await p).toMatchObject({ isConfirmed: true, value: 'a@b.co' });
  });

  it('preConfirm shows loading, can replace the value, and errors keep it open', async () => {
    let attempt = 0;
    const p = modal.fire({
      title: 'Save',
      preConfirm: async () => {
        await tick(10);
        if (++attempt === 1) throw new Error('Network down');
        return { id: 7 };
      },
    });
    await tick();
    click($('.cm-confirm'));
    await tick();
    expect($('.cm-confirm').classList.contains('cm-loading')).toBe(true);
    expect($<HTMLButtonElement>('.cm-confirm').disabled).toBe(true);
    await tick(20);
    expect($('.cm-error').textContent).toBe('Network down');
    click($('.cm-confirm'));
    expect(await p).toMatchObject({ isConfirmed: true, value: { id: 7 } });
  });

  it('select, radio, checkbox and textarea', async () => {
    const s = modal.fire({ input: 'select', inputOptions: { tr: 'Turkey', de: 'Germany' }, inputValue: 'de' });
    await tick();
    click($('.cm-confirm'));
    expect((await s).value).toBe('de');
    await tick();

    const r = modal.fire({ input: 'radio', inputOptions: [['a', 'A'], ['b', 'B']] });
    await tick();
    dialog().querySelectorAll<HTMLInputElement>('input[type=radio]')[1].checked = true;
    click($('.cm-confirm'));
    expect((await r).value).toBe('b');
    await tick();

    const c = modal.fire({ input: 'checkbox', inputLabel: 'I agree' });
    await tick();
    $<HTMLInputElement>('input[type=checkbox]').checked = true;
    click($('.cm-confirm'));
    expect((await c).value).toBe(true);
    await tick();

    const t = modal.fire({ input: 'textarea', inputValue: 'line1\nline2' });
    await tick();
    click($('.cm-confirm'));
    expect((await t).value).toBe('line1\nline2');
  });

  it('never applies on* attributes from inputAttributes', async () => {
    modal.fire({ input: 'text', inputAttributes: { onfocus: 'alert(1)', maxlength: '5' } });
    await tick();
    const input = $<HTMLInputElement>('input');
    expect(input.hasAttribute('onfocus')).toBe(false);
    expect(input.getAttribute('maxlength')).toBe('5');
  });
});

describe('createModal', () => {
  it('cleans up after onOpen throws and continues the queue', async () => {
    const opener = document.createElement('button');
    document.body.append(opener);
    opener.focus();
    const p = modal.fire({ onOpen: () => { throw new Error('Open failed'); } });
    await expect(p).rejects.toThrow('Open failed');
    expect(document.querySelector('dialog')).toBeNull();
    expect(modal.isOpen()).toBe(false);
    expect(document.documentElement.style.overflow).toBe('');
    expect(document.activeElement).toBe(opener);
    const next = modal.alert('Next');
    await tick();
    click($('.cm-confirm'));
    await next;
  });

  it('rejects onClose errors after cleanup without blocking the queue', async () => {
    const p = modal.fire({ onClose: () => { throw new Error('Close failed'); } });
    const rejection = expect(p).rejects.toThrow('Close failed');
    await tick();
    click($('.cm-confirm'));
    await rejection;
    expect(document.querySelector('dialog')).toBeNull();
    const next = modal.alert('Next');
    await tick();
    click($('.cm-confirm'));
    await next;
  });

  it('layers defaults, and per-call options win', async () => {
    const tr = createModal({ confirmText: 'Continue', cancelText: 'Dismiss', theme: 'dark' });
    tr.confirm({ title: 'Are you sure?', confirmText: 'Yes' });
    await tick();
    expect($('.cm-confirm').textContent).toBe('Yes');
    expect($('.cm-cancel').textContent).toBe('Dismiss');
    expect(dialog().classList.contains('cm-dark')).toBe(true);
    expect(tr.create({ width: '20rem' }).defaults.confirmText).toBe('Continue');
  });
});
