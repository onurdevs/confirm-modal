import { build, transform } from 'esbuild';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });

// Load the stylesheet source once and minify it, for both the bundles and the standalone file.
await build({ entryPoints: ['src/styles.ts'], format: 'esm', outfile: 'dist/.styles.mjs', logLevel: 'error' });
const { css } = await import(`./dist/.styles.mjs?${Date.now()}`);
await rm('dist/.styles.mjs');
const minCss = (await transform(css, { loader: 'css', minify: true })).code.trim();
await writeFile('dist/confirm-modal.css', minCss);

const inlineMinCss = {
  name: 'inline-min-css',
  setup(b) {
    b.onLoad({ filter: /src[\\/]styles\.ts$/ }, () => ({
      contents: `export const css = ${JSON.stringify(minCss)};`,
      loader: 'ts',
    }));
  },
};

const common = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  target: 'es2020',
  legalComments: 'none',
  plugins: [inlineMinCss],
};

await Promise.all([
  build({ ...common, format: 'esm', outfile: 'dist/confirm-modal.js', minifySyntax: true }),
  build({ ...common, format: 'cjs', outfile: 'dist/confirm-modal.cjs', minifySyntax: true }),
  // <script> build: window.ConfirmModal is the default instance, with every export attached.
  build({
    ...common,
    format: 'iife',
    globalName: 'ConfirmModal',
    footer: { js: 'ConfirmModal=Object.assign(ConfirmModal.modal,ConfirmModal);' },
    outfile: 'dist/confirm-modal.min.js',
    minify: true,
  }),
]);

for (const f of ['confirm-modal.min.js', 'confirm-modal.css']) {
  const buf = await readFile(`dist/${f}`);
  console.log(`${f.padEnd(22)} ${(buf.length / 1024).toFixed(1)} kB  (gzip ${(gzipSync(buf).length / 1024).toFixed(1)} kB)`);
}
