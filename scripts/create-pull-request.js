import { fork } from 'node:child_process';
import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'yaml';

const actionDir = dirname(
  fileURLToPath(import.meta.resolve('create-pull-request/package.json')),
);

const file = fs.readFileSync(join(actionDir, 'action.yml'), 'utf8');
const info = yaml.parse(file);

process.env.GITHUB_WORKSPACE = process.cwd();
process.env.INPUT_SIGNOFF = true;

for (const [variable, value] of Object.entries(info.inputs)) {
  if (value.default !== undefined) {
    const k = 'INPUT_' + variable.toUpperCase();
    process.env[k] = process.env[k] ?? value.default;
  }
}

const child = fork(join(actionDir, 'dist/index.js'));

child.on('error', (err) => {
  console.log('error', err);
  process.exit(-1);
});
