// Builds the published declarations, then blanks the stylesheet imports
// ember-tsc keeps in them: the stylesheets ship compiled in dist/styles.css,
// not next to the types. Blanking keeps the declaration maps' lines aligned.
// Usage: node scripts/build-declarations.mjs <tsconfig>
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const emberTsc = createRequire(import.meta.url).resolve(
  '@glint/ember-tsc/bin/ember-tsc',
);
execFileSync(
  process.execPath,
  [emberTsc, '--declaration', '--project', process.argv[2]],
  { stdio: 'inherit' },
);

for (const file of readdirSync('declarations', { recursive: true })) {
  // The names addon-dev renames to .d.ts, too.
  if (!/\.d\.(gts\.|gjs\.)?ts$/.test(file)) continue;
  const path = join('declarations', file);
  const text = readFileSync(path, 'utf8');
  const blanked = text.replace(/^import '[^']+\.scss';$/gm, '');
  if (blanked !== text) writeFileSync(path, blanked);
}
