import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import {
  DOCS_URL,
  installedVersion,
  instructions,
  manifestProvider,
  releaseUrl,
  resolveManifests,
} from './server.mjs';

const fixtures = path.join(import.meta.dirname, 'fixtures');

test('finds the installed carbon-components-ember above a directory', async (t) => {
  const project = await fs.mkdtemp(path.join(os.tmpdir(), 'cce-mcp-'));
  t.after(() => fs.rm(project, { recursive: true }));
  const addon = path.join(project, 'node_modules', 'carbon-components-ember');
  await fs.mkdir(addon, { recursive: true });
  await fs.writeFile(
    path.join(addon, 'package.json'),
    JSON.stringify({ version: '3.1.0' }),
  );
  const nested = path.join(project, 'app', 'components');
  await fs.mkdir(nested, { recursive: true });

  assert.equal(await installedVersion(nested), '3.1.0');
});

test("serves a release's docs when they're published, else main's", async (t) => {
  t.mock.method(console, 'error', () => {});
  const published = new Set();
  t.mock.method(globalThis, 'fetch', async (url) => {
    return new Response(null, {
      status: published.has(String(url)) ? 200 : 404,
    });
  });

  assert.deepEqual(await resolveManifests({ release: '3.1.0' }), {
    location: `${DOCS_URL}/main`,
    label: 'carbon-components-ember (main)',
  });

  published.add(`${releaseUrl('3.1.0')}/manifests/components.json`);
  assert.deepEqual(await resolveManifests({ release: '3.1.0' }), {
    location: `${DOCS_URL}/v3.1.0-carbon-components-ember`,
    label: 'carbon-components-ember 3.1.0',
  });

  assert.deepEqual(
    await resolveManifests({ manifests: 'http://localhost:6006' }),
    { location: 'http://localhost:6006', label: 'carbon-components-ember' },
  );
});

test('reads each manifest once', async () => {
  const provide = manifestProvider(fixtures);
  const first = provide(undefined, './manifests/components.json');

  assert.equal(provide(undefined, './manifests/components.json'), first);
  assert.match(await first, /"components-button"/);
  await assert.rejects(provide(undefined, './manifests/docs.json'));
});

function connect(...args) {
  const child = spawn(
    process.execPath,
    [path.join(import.meta.dirname, 'bin.mjs'), ...args],
    { stdio: ['pipe', 'pipe', 'inherit'] },
  );
  const pending = new Map();
  let buffer = '';
  let id = 0;

  child.stdout.on('data', (data) => {
    buffer += data;
    let end;
    while ((end = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, end);
      buffer = buffer.slice(end + 1);
      if (line.trim()) {
        const message = JSON.parse(line);
        pending.get(message.id)?.(message);
      }
    }
  });

  const send = (message) =>
    child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', ...message })}\n`);

  return {
    request: (method, params) =>
      new Promise((resolve) => {
        pending.set(++id, resolve);
        send({ id, method, params });
      }),
    notify: (method) => send({ method }),
    close: () => child.kill(),
  };
}

test("serves Storybook's docs tools over stdio", async (t) => {
  const client = connect('--manifests', fixtures);
  t.after(() => client.close());

  const { result: init } = await client.request('initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'test', version: '0' },
  });
  assert.equal(init.serverInfo.name, 'carbon-components-ember-mcp');
  assert.match(init.instructions, /docs for carbon-components-ember/);
  assert.ok(init.instructions.includes(await instructions()));
  client.notify('notifications/initialized');

  const { result: tools } = await client.request('tools/list', {});
  assert.deepEqual(
    tools.tools.map((tool) => tool.name),
    ['docs-list', 'docs-show', 'docs-show-story'],
  );

  const { result: list } = await client.request('tools/call', {
    name: 'docs-list',
    arguments: {},
  });
  assert.match(list.content[0].text, /Button \(components-button\)/);

  const { result: show } = await client.request('tools/call', {
    name: 'docs-show',
    arguments: { id: 'components-button' },
  });
  assert.match(show.content[0].text, /import Button from/);
  assert.match(show.content[0].text, /@kind/);
});

test('publishes the files the server reads', () => {
  // npm 12 keys the result by package name; older versions return an array.
  const [{ files }] = Object.values(
    JSON.parse(
      execFileSync('npm', ['pack', '--dry-run', '--json'], {
        cwd: import.meta.dirname,
        encoding: 'utf-8',
        // Windows runs npm.cmd, which needs a shell.
        shell: process.platform === 'win32',
      }),
    ),
  );
  const packed = files.map((file) => file.path);
  for (const file of ['bin.mjs', 'server.mjs', 'instructions.md']) {
    assert.ok(packed.includes(file), `${file} isn't published`);
  }
});
