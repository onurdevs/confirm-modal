/* global ConfirmModal */
const out = document.getElementById('out');
const show = (label, value) => (out.textContent = `${label}: ${JSON.stringify(value, null, 2)}`);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

let m = ConfirmModal.create({ confirmText: 'Tamam', cancelText: 'Vazgeç', denyText: 'Hayır', theme: 'auto' });
document.getElementById('theme').addEventListener('change', (e) => {
  m = m.create({ theme: e.target.value });
});

const demos = {
  alert: () => m.alert('Merhaba!', 'Bu, sade bir bilgilendirme penceresi.'),
  success: () => m.success('Kaydedildi', 'Değişiklikleriniz başarıyla kaydedildi.'),
  error: () => m.error('Bir şeyler ters gitti', 'Lütfen daha sonra tekrar deneyin.'),
  confirm: () => m.confirm({ title: 'Devam edilsin mi?', text: 'Bu işlemi onaylıyor musunuz?', icon: 'question' }),
  danger: () =>
    m.confirm({
      title: 'Hesap silinsin mi?',
      text: 'Bu işlem geri alınamaz. Varsayılan odak güvenli seçenekte (Vazgeç).',
      icon: 'warning',
      danger: true,
      confirmText: 'Evet, sil',
    }),
  deny: () =>
    m.fire({
      title: 'Değişiklikler kaydedilsin mi?',
      icon: 'question',
      showDeny: true,
      showCancel: true,
      confirmText: 'Kaydet',
      denyText: 'Kaydetme',
    }),
  prompt: () => m.prompt({ title: 'Adınız nedir?', inputPlaceholder: 'Ada Lovelace' }),
  email: () =>
    m.fire({
      title: 'Bültene katılın',
      input: 'email',
      inputLabel: 'E-posta adresi',
      inputPlaceholder: 'ornek@alan.com',
      validate: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Geçerli bir e-posta adresi girin.'),
    }),
  select: () =>
    m.fire({
      title: 'Şehir seçin',
      input: 'select',
      inputOptions: { ist: 'İstanbul', ank: 'Ankara', izm: 'İzmir' },
      inputPlaceholder: 'Seçiniz…',
      validate: (v) => (v ? null : 'Bir şehir seçmelisiniz.'),
      showCancel: true,
    }),
  radio: () =>
    m.fire({
      title: 'Plan',
      input: 'radio',
      inputOptions: [['free', 'Ücretsiz'], ['pro', 'Pro'], ['team', 'Takım']],
      inputValue: 'pro',
    }),
  checkbox: () =>
    m.fire({
      title: 'Kullanım koşulları',
      input: 'checkbox',
      inputLabel: 'Koşulları okudum ve kabul ediyorum',
      validate: (v) => (v ? null : 'Devam etmek için kabul etmelisiniz.'),
    }),
  textarea: () => m.fire({ title: 'Geri bildirim', input: 'textarea', inputPlaceholder: 'Düşünceleriniz…', showCancel: true }),
  preconfirm: () =>
    m.fire({
      title: 'GitHub kullanıcısı',
      input: 'text',
      inputValue: 'octocat',
      showCancel: true,
      confirmText: 'Getir',
      preConfirm: async (login) => {
        await wait(900);
        if (login.toLowerCase() === 'hata') throw new Error('Sunucu yanıt vermedi, tekrar deneyin.');
        return { login, id: Math.floor(Math.random() * 1e6) };
      },
    }),
  timer: () => m.fire({ title: 'Otomatik kapanacak', text: '3 saniye…', timer: 3000, timerProgressBar: true, showConfirm: false }),
  html: () =>
    m.fire({
      title: 'Güvenli HTML',
      html: '<p>Bu içerik <strong>sanitize</strong> edildi. <a href="https://developer.mozilla.org" target="_blank">MDN</a> bağlantısı güvenle açılır.</p><ul><li>Liste</li><li>öğeleri</li></ul>',
    }),
  xss: () =>
    m.fire({
      title: '<img src=x onerror=alert("XSS")>',
      icon: 'warning',
      html: 'Zararlı kod: <img src=x onerror="alert(1)"><a href="javascript:alert(1)">tıkla</a><script>alert(1)<\/script> — hiçbiri çalışmaz.',
    }),
  queue: async () => {
    const a = m.alert('1 / 3', 'Modaller üst üste binmez, sırayla açılır.');
    const b = m.alert('2 / 3');
    const c = m.alert('3 / 3');
    await Promise.all([a, b, c]);
    return 'sıra bitti';
  },
  abort: () => {
    const ac = new AbortController();
    setTimeout(() => ac.abort(), 2000);
    return m.fire({ title: 'Dışarıdan kapatılacak', text: 'AbortController 2 saniye sonra iptal ediyor.', signal: ac.signal });
  },
  toast: () => (m.toast({ title: 'Kaydedildi', text: 'Taslak otomatik kaydedildi.', icon: 'success' }), 'toast'),
  'toast-error': () =>
    (m.toast({
      title: 'Yükleme başarısız',
      text: 'Bağlantı koptu.',
      icon: 'error',
      timer: 8000,
      action: { text: 'Tekrar dene', onClick: () => m.toast({ title: 'Tekrar deneniyor…', icon: 'info' }) },
    }),
    'toast'),
  'toast-bottom': () => (m.toast({ title: 'Panoya kopyalandı', position: 'bottom', timer: 2500 }), 'toast'),
};

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-demo]');
  if (!btn) return;
  const name = btn.dataset.demo;
  show(name, await demos[name]());
});

// Declarative confirmations
m.bind();
document.getElementById('declarative-delete').addEventListener('click', () => m.toast({ title: 'Silindi', icon: 'success' }));
document.getElementById('declarative-form').addEventListener('submit', (e) => {
  e.preventDefault();
  m.toast({ title: 'Form gönderildi', icon: 'success' });
});
