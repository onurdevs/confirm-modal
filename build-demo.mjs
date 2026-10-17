import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

await rm('_site', { recursive: true, force: true });
await mkdir('_site/assets', { recursive: true });
let html = await readFile('demo/index.html', 'utf8');
for (const [source, reference, name, extension] of [
  ['demo/demo.css', 'demo.css', 'demo', 'css'],
  ['demo/demo.js', 'demo.js', 'demo', 'js'],
  ['dist/confirm-modal.min.js', '../dist/confirm-modal.min.js', 'confirm-modal', 'js'],
]) {
  const content = await readFile(source);
  const hash = createHash('sha256').update(content).digest('hex').slice(0, 12);
  const path = `assets/${name}.${hash}.${extension}`;
  await writeFile(`_site/${path}`, content);
  html = html.replace(`"${reference}"`, `"./${path}"`);
}
await writeFile('_site/index.html', html);
await writeFile('_site/.nojekyll', '');
