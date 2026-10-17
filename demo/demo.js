/* global ConfirmModal */
const out = document.getElementById('out');
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let m = ConfirmModal.create({ confirmText: 'OK', cancelText: 'Cancel', denyText: 'No', theme: 'auto' });
document.getElementById('theme').addEventListener('change', (event) => {
  document.documentElement.dataset.theme = event.target.value;
  m = m.create({ theme: event.target.value });
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

const examples = [
  ['confirm', 'dialogs', '↗', 'Confirmation', 'Give people a moment to decide.', "const confirmed = await modal.confirm({\n  title: 'Continue?',\n  text: 'Ready for the next step?',\n  icon: 'question',\n});\n\nif (confirmed) {\n  // Take the next step.\n}"],
  ['success', 'dialogs', '✓', 'A little success', 'Celebrate a job well done.', "await modal.success(\n  'Saved',\n  'Your changes have been saved.',\n);"],
  ['alert', 'dialogs', 'i', 'Just a heads-up', 'A simple message, clearly delivered.', "await modal.alert(\n  'Hello!',\n  'A simple message to keep you informed.',\n);"],
  ['danger', 'dialogs', '!', 'Handle with care', 'A safer pause before a destructive action.', "const confirmed = await modal.confirm({\n  title: 'Delete your account?',\n  text: 'This action cannot be undone.',\n  icon: 'warning',\n  danger: true,\n  confirmText: 'Yes, delete',\n});"],
  ['error', 'dialogs', '×', 'Room to recover', 'Help people understand what went wrong.', "await modal.error(\n  'Something went wrong',\n  'Please try again later.',\n);"],
  ['deny', 'dialogs', '⇄', 'More than yes or no', 'Save, discard, or come back later.', "const result = await modal.fire({\n  title: 'Save your changes?',\n  icon: 'question',\n  showDeny: true,\n  showCancel: true,\n  confirmText: 'Save',\n  denyText: 'Discard',\n});"],
  ['prompt', 'inputs', 'Aa', 'Start a conversation', 'Ask a question. Get a useful answer.', "const name = await modal.prompt({\n  title: 'What is your name?',\n  inputPlaceholder: 'Ada Lovelace',\n});\n\n// A string, or null when dismissed."],
  ['email', 'inputs', '@', 'A valid beginning', 'Inline feedback for email input.', "const result = await modal.fire({\n  title: 'Join the newsletter',\n  input: 'email',\n  inputLabel: 'Email address',\n  inputPlaceholder: 'hello@example.com',\n  validate: (value) =>\n    /^\\S+@\\S+\\.\\S+$/.test(value)\n      ? null\n      : 'Enter a valid email address.',\n});"],
  ['select', 'inputs', '⌄', 'Pick your place', 'A familiar select with a clear label.', "const result = await modal.fire({\n  title: 'Choose a city',\n  input: 'select',\n  inputOptions: {\n    ist: 'Istanbul',\n    ank: 'Ankara',\n    izm: 'Izmir',\n  },\n  inputPlaceholder: 'Choose an option…',\n  validate: (value) =>\n    value ? null : 'Choose a city to continue.',\n  showCancel: true,\n});"],
  ['radio', 'inputs', '◉', 'One good choice', 'Let people compare a few options.', "const result = await modal.fire({\n  title: 'Plan',\n  input: 'radio',\n  inputOptions: [\n    ['free', 'Free'],\n    ['pro', 'Pro'],\n    ['team', 'Team'],\n  ],\n  inputValue: 'pro',\n});"],
  ['checkbox', 'inputs', '☑', 'Make it explicit', 'A checkbox with a little validation.', "const result = await modal.fire({\n  title: 'Terms of use',\n  input: 'checkbox',\n  inputLabel: 'I have read and accept the terms',\n  validate: (value) => value\n    ? null\n    : 'Accept the terms to continue.',\n});"],
  ['textarea', 'inputs', '≡', 'Space for a thought', 'Some answers need more than one line.', "const result = await modal.fire({\n  title: 'Feedback',\n  input: 'textarea',\n  inputPlaceholder: 'Share your thoughts…',\n  showCancel: true,\n});"],
  ['preconfirm', 'advanced', '↻', 'Wait for something good', 'Async work with a built-in loading state.', "const result = await modal.fire({\n  title: 'GitHub username',\n  input: 'text',\n  inputValue: 'octocat',\n  showCancel: true,\n  confirmText: 'Fetch',\n  preConfirm: async (login) => {\n    // Simulated request; try \"error\".\n    await new Promise(r => setTimeout(r, 900));\n    if (login.toLowerCase() === 'error') {\n      throw new Error('Please try again.');\n    }\n    return { login, id: 42 };\n  },\n});"],
  ['timer', 'advanced', '◷', 'Here for a moment', 'An automatic goodbye, with progress.', "await modal.fire({\n  title: 'Closing automatically',\n  text: '3 seconds…',\n  timer: 3000,\n  timerProgressBar: true,\n  showConfirm: false,\n});"],
  ['html', 'advanced', '</>', 'A richer message', 'Add formatting with sanitized HTML.', "await modal.fire({\n  title: 'Sanitized HTML',\n  html: '<p>A little <strong>emphasis</strong>.</p>',\n});"],
  ['xss', 'advanced', '◇', 'Safer by default', 'See how untrusted HTML is handled.', "await modal.fire({\n  title: '<img src=x onerror=alert(1)>',\n  icon: 'warning',\n  html: '<a href=\"javascript:alert(1)\">click</a>',\n});\n\n// Titles stay plain text.\n// Unsafe HTML attributes are removed."],
  ['queue', 'advanced', '☷', 'One thing at a time', 'A queue that keeps dialogs in order.', "const first = modal.alert('1 / 3');\nconst second = modal.alert('2 / 3');\nconst third = modal.alert('3 / 3');\n\nawait Promise.all([first, second, third]);\n// Each opens after the previous one closes."],
  ['abort', 'advanced', '↙', 'Stay in control', 'Dismiss externally with an AbortSignal.', "const controller = new AbortController();\n\nsetTimeout(() => controller.abort(), 2000);\n\nawait modal.fire({\n  title: 'Dismissed externally',\n  text: 'Closing after 2 seconds.',\n  signal: controller.signal,\n});"],
  ['toast', 'toasts', '▤', 'Good news, quietly', 'A small update that keeps you in flow.', "modal.toast({\n  title: 'Saved',\n  text: 'Your draft was saved automatically.',\n  icon: 'success',\n});"],
  ['toast-error', 'toasts', '↺', 'Another chance', 'An error notification with a retry action.', "modal.toast({\n  title: 'Upload failed',\n  text: 'The connection was lost.',\n  icon: 'error',\n  timer: 8000,\n  action: {\n    text: 'Retry',\n    onClick: () => modal.toast('Retrying…'),\n  },\n});"],
  ['toast-bottom', 'toasts', '↓', 'Right where you need it', 'A toast at the bottom of the screen.', "modal.toast({\n  title: 'Copied to clipboard',\n  position: 'bottom',\n  timer: 2500,\n});"],
].map(([id, category, icon, title, description, code]) => ({ id, category, icon, title, description, code }));

const grid = document.getElementById('example-grid');
const cards = new Map();
let selected = examples[0];
let category = 'all';
let running = false;
let runSequence = 0;
let resultSequence = 0;
const runButton = document.getElementById('run-example');
const runStatus = document.getElementById('run-status');
const copyStatus = document.getElementById('copy-status');

function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

for (const [index, example] of examples.entries()) {
  const card = element('button', 'example-card');
  card.type = 'button';
  card.dataset.demo = example.id;
  card.setAttribute('aria-label', `Try ${example.title}`);
  const top = element('span', 'card-top');
  const icon = element('span', 'card-icon', String(index + 1).padStart(2, '0'));
  icon.setAttribute('aria-hidden', 'true');
  top.append(icon, element('span', 'card-category', example.category));
  const cta = element('span', 'card-cta', 'Explore');
  const arrow = element('span', '', '↗');
  arrow.setAttribute('aria-hidden', 'true');
  cta.append(arrow);
  card.append(top, element('span', 'card-title', example.title), element('span', 'card-description', example.description), cta);
  grid.append(card);
  cards.set(example.id, card);
}

function selectExample(id) {
  const next = examples.find(example => example.id === id);
  if (!next) return;
  selected = next;
  for (const [key, card] of cards) {
    card.classList.toggle('selected', key === id);
    card.setAttribute('aria-pressed', String(key === id));
  }
  document.getElementById('selected-title').textContent = selected.title;
  document.getElementById('selected-description').textContent = selected.description;
  document.getElementById('example-code').textContent = selected.code;
  setTab('code');
}

function setTab(name, focus = false) {
  for (const key of ['code', 'result']) {
    const button = document.getElementById(`${key}-tab`);
    const active = name === key;
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
    document.getElementById(`${key}-panel`).hidden = !active;
    if (active && focus) button.focus();
  }
  document.getElementById('copy-code').hidden = name !== 'code';
  if (name === 'result') document.getElementById('result-dot').hidden = true;
}

function show(label, value) {
  const serialized = value === undefined ? 'Completed without a return value.' : JSON.stringify(value, null, 2);
  out.textContent = `${label}\n\n${serialized}`;
  document.getElementById('result-dot').hidden = document.getElementById('result-panel').hidden === false;
  resultSequence++;
}

function filterExamples() {
  const query = document.getElementById('search').value.trim().toLowerCase();
  let visible = 0;
  for (const example of examples) {
    const match = (category === 'all' || example.category === category) && `${example.title} ${example.description} ${example.category} ${example.id}`.toLowerCase().includes(query);
    cards.get(example.id).hidden = !match;
    if (match) visible++;
  }
  document.getElementById('empty-state').hidden = visible !== 0;
  document.getElementById('example-count').textContent = `${String(visible).padStart(2, '0')} / ${examples.length} examples · Pick one to try it`;
}

async function runExample(id) {
  if (running || !demos[id]) return;
  selectExample(id);
  running = true;
  const sequence = ++runSequence;
  const previousResult = resultSequence;
  runButton.disabled = true;
  runStatus.textContent = 'Example is running…';
  try {
    const result = await demos[id]();
    if (previousResult === resultSequence) show(selected.title, result);
    runStatus.textContent = 'Done. Open Result to inspect the response.';
  } catch (error) {
    show(selected.title, { error: error instanceof Error ? error.message : String(error) });
    runStatus.textContent = 'The example returned an error. See Result.';
  } finally {
    if (sequence === runSequence) {
      running = false;
      runButton.disabled = false;
    }
  }
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-demo]');
  if (trigger) void runExample(trigger.dataset.demo);
});
runButton.addEventListener('click', () => void runExample(selected.id));
document.getElementById('search').addEventListener('input', filterExamples);
for (const button of document.querySelectorAll('[data-filter]')) {
  button.addEventListener('click', () => {
    category = button.dataset.filter;
    for (const filter of document.querySelectorAll('[data-filter]')) {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    }
    filterExamples();
  });
}
for (const name of ['code', 'result']) {
  const button = document.getElementById(`${name}-tab`);
  button.addEventListener('click', () => setTab(name));
  button.addEventListener('keydown', (event) => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      setTab(event.key === 'Home' ? 'code' : event.key === 'End' ? 'result' : name === 'code' ? 'result' : 'code', true);
    }
  });
}

async function copyText(text, button, originalLabel) {
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = 'Copied!';
    copyStatus.textContent = 'Copied to clipboard.';
    setTimeout(() => { button.textContent = originalLabel; }, 1800);
  } catch {
    copyStatus.textContent = 'Clipboard access is unavailable. Select the text to copy it manually.';
    const original = runStatus.textContent;
    runStatus.textContent = 'Select the code to copy it manually.';
    setTimeout(() => { if (runStatus.textContent === 'Select the code to copy it manually.') runStatus.textContent = original; }, 4000);
  }
}
document.getElementById('copy-code').addEventListener('click', (event) => void copyText(selected.code, event.currentTarget, 'Copy code'));
document.getElementById('copy-install').addEventListener('click', () => void copyText('npm install @onurdev/confirm-modal', document.getElementById('install-copy-label'), 'Copy'));

// Declarative examples only simulate actions; no account or data is changed.
m.bind();
document.getElementById('declarative-delete').addEventListener('click', () => {
  m.toast({ title: 'Item deleted', text: 'Demo only. No real data was changed.', icon: 'success' });
  show('Declarative delete', { confirmed: true, demo: true });
});
document.querySelector('a[data-cm-confirm]').addEventListener('click', () => {
  m.toast({ title: 'Signed out', text: 'Demo only. Your session is unchanged.', icon: 'success' });
  show('Declarative sign out', { confirmed: true, demo: true });
});
document.getElementById('declarative-form').addEventListener('submit', (event) => {
  event.preventDefault();
  m.toast({ title: 'Form submitted', text: 'Demo only. Nothing was sent to a server.', icon: 'success' });
  show('Declarative form', { name: new FormData(event.currentTarget).get('name'), demo: true });
});
selectExample('confirm');
filterExamples();
