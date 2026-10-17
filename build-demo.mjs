import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

await rm('_site', { recursive: true, force: true });
await mkdir('_site/dist', { recursive: true });
const html = await readFile('demo/index.html', 'utf8');
await writeFile('_site/index.html', html.replace('../dist/confirm-modal.min.js', './dist/confirm-modal.min.js'));
await Promise.all([
  copyFile('demo/demo.js', '_site/demo.js'),
  copyFile('demo/demo.css', '_site/demo.css'),
  copyFile('dist/confirm-modal.min.js', '_site/dist/confirm-modal.min.js'),
  writeFile('_site/.nojekyll', ''),
]);
