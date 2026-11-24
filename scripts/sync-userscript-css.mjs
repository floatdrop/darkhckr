import { readFileSync, writeFileSync } from 'node:fs';

const stylesheet = new URL('../extension/hn-dark.css', import.meta.url);
const userscript = new URL('../hn-dark.user.js', import.meta.url);
const source = readFileSync(userscript, 'utf8');
const block = /^  const css = `(\r?\n)[\s\S]*?^`;$/m;

if (!block.test(source)) throw new Error('Userscript CSS block not found');

// Escape template-literal syntax without changing the resulting CSS.
const css = readFileSync(stylesheet, 'utf8').trimEnd()
  .replace(/\r\n/g, '\n')
  .replace(/\\|`|\$\{/g, match => `\\${match}`);
const synced = source.replace(block, (_, eol) =>
  `  const css = \`${eol}${css.replace(/\n/g, eol)}${eol}\`;`);

if (synced !== source) {
  if (process.argv.includes('--check')) {
    console.error('Userscript CSS is out of sync. Run node scripts/sync-userscript-css.mjs.');
    process.exitCode = 1;
  } else {
    writeFileSync(userscript, synced);
  }
}
