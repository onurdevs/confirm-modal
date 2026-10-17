/* global ConfirmModal */
const out = document.getElementById('out');
const show = (label, value) => (out.textContent = `${label}: ${JSON.stringify(value, null, 2)}`);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

let m = ConfirmModal.create({ confirmText: 'OK', cancelText: 'Cancel', denyText: 'No', theme: 'auto' });
document.getElementById('theme').addEventListener('change', (e) => {
  m = m.create({ theme: e.target.value });
});

const demos = {
  alert: () => m.alert('Hello!', 'A simple message to keep you informed.'),
  success: () => m.success('Saved', 'Your changes have been saved.'),
  error: () => m.error('Something went wrong', 'Please try again later.'),
  confirm: () => m.confirm({ title: 'Continue?', text: 'Do you want to continue with this action?', icon: 'question' }),
  danger: () =>
    m.confirm({
      title: 'Delete your account?',
      text: 'This action cannot be undone. Cancel receives focus by default.',
      icon: 'warning',
      danger: true,
      confirmText: 'Yes, delete',
    }),
  deny: () =>
    m.fire({
      title: 'Save your changes?',
      icon: 'question',
      showDeny: true,
      showCancel: true,
      confirmText: 'Save',
      denyText: 'Discard',
    }),
  prompt: () => m.prompt({ title: 'What is your name?', inputPlaceholder: 'Ada Lovelace' }),
  email: () =>
    m.fire({
      title: 'Join the newsletter',
      input: 'email',
      inputLabel: 'Email address',
      inputPlaceholder: 'hello@example.com',
      validate: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Enter a valid email address.'),
    }),
  select: () =>
    m.fire({
      title: 'Choose a city',
      input: 'select',
      inputOptions: { ist: 'Istanbul', ank: 'Ankara', izm: 'Izmir' },
      inputPlaceholder: 'Choose an option…',
      validate: (v) => (v ? null : 'Choose a city to continue.'),
      showCancel: true,
    }),
  radio: () =>
    m.fire({
      title: 'Plan',
      input: 'radio',
      inputOptions: [['free', 'Free'], ['pro', 'Pro'], ['team', 'Team']],
      inputValue: 'pro',
    }),
  checkbox: () =>
    m.fire({
      title: 'Terms of use',
      input: 'checkbox',
      inputLabel: 'I have read and accept the terms',
      validate: (v) => (v ? null : 'Accept the terms to continue.'),
    }),
  textarea: () => m.fire({ title: 'Feedback', input: 'textarea', inputPlaceholder: 'Share your thoughts…', showCancel: true }),
  preconfirm: () =>
    m.fire({
      title: 'GitHub username',
      input: 'text',
      inputValue: 'octocat',
      showCancel: true,
      confirmText: 'Fetch',
      preConfirm: async (login) => {
        await wait(900);
        if (login.toLowerCase() === 'error') throw new Error('The server did not respond. Please try again.');
        return { login, id: Math.floor(Math.random() * 1e6) };
      },
    }),
  timer: () => m.fire({ title: 'Closing automatically', text: '3 seconds…', timer: 3000, timerProgressBar: true, showConfirm: false }),
  html: () =>
    m.fire({
      title: 'Sanitized HTML',
      html: '<p>This content is <strong>sanitized</strong>. Learn more on <a href="https://developer.mozilla.org" target="_blank">MDN</a>.</p><ul><li>Formatted content</li><li>Readable structure</li></ul>',
    }),
  xss: () =>
    m.fire({
      title: '<img src=x onerror=alert("XSS")>',
      icon: 'warning',
      html: 'Untrusted HTML: <img src=x onerror="alert(1)"><a href="javascript:alert(1)">click</a><script>alert(1)<\/script> — scripts and event handlers are removed.',
    }),
  queue: async () => {
    const a = m.alert('1 / 3', 'Dialogs open one at a time in the order they are requested.');
    const b = m.alert('2 / 3');
    const c = m.alert('3 / 3');
    await Promise.all([a, b, c]);
    return 'queue complete';
  },
  abort: () => {
    const ac = new AbortController();
    setTimeout(() => ac.abort(), 2000);
    return m.fire({ title: 'Dismissed externally', text: 'AbortController will dismiss this dialog after 2 seconds.', signal: ac.signal });
  },
  toast: () => (m.toast({ title: 'Saved', text: 'Your draft was saved automatically.', icon: 'success' }), 'toast'),
  'toast-error': () =>
    (m.toast({
      title: 'Upload failed',
      text: 'The connection was lost.',
      icon: 'error',
      timer: 8000,
      action: { text: 'Retry', onClick: () => m.toast({ title: 'Retrying…', icon: 'info' }) },
    }),
    'toast'),
  'toast-bottom': () => (m.toast({ title: 'Copied to clipboard', position: 'bottom', timer: 2500 }), 'toast'),
};

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-demo]');
  if (!btn) return;
  const name = btn.dataset.demo;
  show(name, await demos[name]());
});

// Declarative confirmations
m.bind();
document.getElementById('declarative-delete').addEventListener('click', () => m.toast({ title: 'Deleted', icon: 'success' }));
document.getElementById('declarative-form').addEventListener('submit', (e) => {
  e.preventDefault();
  m.toast({ title: 'Form submitted', icon: 'success' });
});
