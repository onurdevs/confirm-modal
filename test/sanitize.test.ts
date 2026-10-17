import { describe, expect, it } from 'vitest';
import { isSafeUrl, sanitizeHtml, toNode } from '../src/sanitize';

const html = (s: string) => {
  const d = document.createElement('div');
  d.append(sanitizeHtml(s));
  return d.innerHTML;
};

describe('sanitizeHtml', () => {
  it('keeps allowed formatting', () => {
    expect(html('<p>Hi <strong>there</strong> <em>you</em></p>')).toBe('<p>Hi <strong>there</strong> <em>you</em></p>');
  });

  it.each([
    ['<img src=x onerror=alert(1)>', '<img src="x">'],
    ['<script>alert(1)</script>ok', 'ok'],
    ['<a href="javascript:alert(1)">x</a>', '<a>x</a>'],
    ['<a href="  java\nscript:alert(1)">x</a>', '<a>x</a>'],
    ['<a href="JaVaScRiPt:alert(1)">x</a>', '<a>x</a>'],
    ['<a href="data:text/html,<script>alert(1)</script>">x</a>', '<a>x</a>'],
    ['<img src="data:image/svg+xml;base64,PHN2Zz4=">', '<img>'],
    ['<svg><script>alert(1)</script></svg>', ''],
    ['<iframe src="https://evil.test"></iframe>', ''],
    ['<div style="background:url(javascript:alert(1))">x</div>', '<div>x</div>'],
    ['<form action="/steal"><input name=pw></form>', ''],
    ['<custom-el onclick="alert(1)">text</custom-el>', 'text'],
    ['<math><mi xlink:href="javascript:alert(1)">x</mi></math>', ''],
  ])('neutralizes %s', (input, expected) => {
    expect(html(input)).toBe(expected);
  });

  it('keeps safe links and hardens target=_blank', () => {
    expect(html('<a href="https://example.com" target="_blank">x</a>')).toBe(
      '<a href="https://example.com" target="_blank" rel="noopener noreferrer">x</a>',
    );
    expect(html('<a href="/path?q=1">x</a>')).toBe('<a href="/path?q=1">x</a>');
    expect(html('<a href="mailto:a@b.co">x</a>')).toBe('<a href="mailto:a@b.co">x</a>');
  });

  it('blocks DOM clobbering ids', () => {
    expect(html('<p id="cookie">x</p>')).toBe('<p>x</p>');
    expect(html('<p id="my-note">x</p>')).toBe('<p id="my-note">x</p>');
  });

  it('isSafeUrl', () => {
    expect(isSafeUrl('https://a.b')).toBe(true);
    expect(isSafeUrl('relative/page')).toBe(true);
    expect(isSafeUrl('vbscript:x')).toBe(false);
    expect(isSafeUrl('data:image/png;base64,AAAA', true)).toBe(true);
    expect(isSafeUrl('data:image/png;base64,AAAA')).toBe(false);
  });
});

describe('toNode', () => {
  it('passes Nodes through untouched', () => {
    const el = document.createElement('section');
    expect(toNode(el)).toBe(el);
  });

  it('uses a custom sanitizer but parses its output inertly', () => {
    const frag = toNode('<b>x</b>', (s) => s.replace('x', 'y')) as DocumentFragment;
    const d = document.createElement('div');
    d.append(frag);
    expect(d.innerHTML).toBe('<b>y</b>');
  });
});
