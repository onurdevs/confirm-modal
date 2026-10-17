import { afterEach, describe, expect, it, vi } from 'vitest';
import modal, { createModal } from '../src/index';
import { $, click, tick } from './helpers';

afterEach(async () => {
  if (modal.isOpen()) {
    modal.close();
    await tick(450);
  }
  document.body.innerHTML = '';
});

describe('toast', () => {
  it('settles closed with an error when onClose throws', async () => {
    const t = modal.toast({ timer: 0, onClose: () => { throw new Error('Close failed'); } });
    const rejection = expect(t.closed).rejects.toThrow('Close failed');
    t.close();
    await rejection;
    expect(t.element.isConnected).toBe(false);
  });

  it('shows a live-region toast and auto closes', async () => {
    const onClose = vi.fn();
    const t = modal.toast({ title: 'Saved', text: '<i>safe</i>', icon: 'success', timer: 40, onClose });
    expect(t.element.getAttribute('role')).toBe('status');
    expect(t.element.querySelector('i')).toBeNull();
    expect(t.element.closest('.cm-toasts')!.classList.contains('cm-top-end')).toBe(true);
    await t.closed;
    expect(onClose).toHaveBeenCalled();
    expect(t.element.isConnected).toBe(false);
  });

  it('uses role=alert for errors and supports actions', async () => {
    const onClick = vi.fn();
    const t = modal.toast({ title: 'Failed', icon: 'error', timer: 0, action: { text: 'Retry', onClick } });
    expect(t.element.getAttribute('role')).toBe('alert');
    click(t.element.querySelector('.cm-toast-action')!);
    expect(onClick).toHaveBeenCalled();
    await t.closed;
  });

  it('pauses while hovered', async () => {
    const t = modal.toast({ title: 'x', timer: 40 });
    t.element.dispatchEvent(new Event('mouseenter'));
    await tick(80);
    expect(t.element.isConnected).toBe(true);
    t.element.dispatchEvent(new Event('mouseleave'));
    await t.closed;
  });

  it('keeps at most five toasts', async () => {
    const all = Array.from({ length: 7 }, (_, i) => modal.toast({ title: String(i), timer: 0 }));
    await Promise.all([all[0].closed, all[1].closed]);
    expect(document.querySelectorAll('.cm-toast').length).toBe(5);
  });
});

describe('bind (data-cm-confirm)', () => {
  it('preserves default button labels and allows attribute overrides', async () => {
    const api = createModal({ confirmText: 'Continue', cancelText: 'Dismiss' });
    const b = document.createElement('button');
    b.dataset.cmConfirm = 'Delete?';
    document.body.append(b);
    const unbind = api.bind();
    try {
      click(b);
      await tick();
      expect($('.cm-confirm').textContent).toBe('Continue');
      expect($('.cm-cancel').textContent).toBe('Dismiss');
      api.close();
      await tick(450);
      b.dataset.cmConfirmText = 'Delete';
      b.dataset.cmCancelText = 'Cancel';
      click(b);
      await tick();
      expect($('.cm-confirm').textContent).toBe('Delete');
      expect($('.cm-cancel').textContent).toBe('Cancel');
      api.close();
      await tick(450);
    } finally {
      unbind();
    }
  });

  it('asks before letting a click through', async () => {
    document.body.innerHTML = '<button id="b" data-cm-confirm="Delete?" data-cm-danger>Delete</button>';
    const handler = vi.fn();
    const b = document.getElementById('b')!;
    b.addEventListener('click', handler);
    const unbind = modal.bind();

    click(b);
    await tick();
    expect(handler).not.toHaveBeenCalled();
    expect($('.cm-title').textContent).toBe('Delete?');
    click($('.cm-cancel'));
    await tick(450);
    expect(handler).not.toHaveBeenCalled();

    click(b);
    await tick();
    click($('.cm-confirm'));
    await tick(450);
    expect(handler).toHaveBeenCalledTimes(1);
    unbind();
  });

  it('confirms form submissions', async () => {
    document.body.innerHTML = '<form data-cm-confirm="Send?"><button>Send</button></form>';
    const form = document.querySelector('form')!;
    const submitted = vi.fn((e: Event) => e.preventDefault());
    form.addEventListener('submit', submitted);
    const unbind = modal.bind();

    form.requestSubmit();
    await tick();
    expect(submitted).not.toHaveBeenCalled();
    click($('.cm-confirm'));
    await tick(450);
    expect(submitted).toHaveBeenCalledTimes(1);
    unbind();
  });
});
