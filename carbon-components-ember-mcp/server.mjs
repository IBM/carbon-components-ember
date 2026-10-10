/**
 * An MCP server, over stdio, with the docs of the carbon-components-ember
 * version a project has installed. It serves the same tools as Storybook's
 * own MCP endpoint, reading the components manifest published with that
 * version's docs.
 */

import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { parseArgs } from 'node:util';

import {
  addGetDocumentationTool,
  addGetStoryDocumentationTool,
  addListAllDocumentationTool,
  STORYBOOK_MCP_INSTRUCTIONS,
} from '@storybook/mcp';
import { ValibotJsonSchemaAdapter } from '@tmcp/adapter-valibot';
import { StdioTransport } from '@tmcp/transport-stdio';
import { McpServer } from 'tmcp';

const pkg = createRequire(import.meta.url)('./package.json');

const ADDON = 'carbon-components-ember';
export const DOCS_URL =
  'https://ibm.github.io/carbon-components-ember/versions';

const USAGE = `Usage: carbon-components-ember-mcp [options]

An MCP server, over stdio, with the docs of the ${ADDON} version installed
in the current directory's project.

  --release <version>    Serve this version's docs instead
  --manifests <url|dir>  Read the manifests from this Storybook (e.g.
                         http://localhost:6006) or built Storybook directory
  --help                 Show this message`;

/** The version of carbon-components-ember installed in `dir` or above it. */
export async function installedVersion(dir) {
  for (let current = path.resolve(dir); ;) {
    try {
      const file = path.join(current, 'node_modules', ADDON, 'package.json');
      return JSON.parse(await fs.readFile(file, 'utf-8')).version;
    } catch {
      const parent = path.dirname(current);
      if (parent === current) return undefined;
      current = parent;
    }
  }
}

/** A release's docs, deployed to a folder named after its git tag. */
export const releaseUrl = (version) => `${DOCS_URL}/v${version}-${ADDON}`;

async function hasManifest(location) {
  try {
    const response = await fetch(`${location}/manifests/components.json`, {
      method: 'HEAD',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Where to read the manifests: `manifests` if given, else the docs of
 * `release` or of the installed version, else main's.
 */
export async function resolveManifests({ manifests, release, cwd }) {
  if (manifests) return { location: manifests, label: ADDON };

  const version = release ?? (await installedVersion(cwd));
  if (version) {
    const location = releaseUrl(version);
    if (await hasManifest(location)) {
      return { location, label: `${ADDON} ${version}` };
    }
    console.error(`No published docs for ${ADDON} ${version}; using main's.`);
  } else {
    console.error(`${ADDON} isn't installed here; using main's docs.`);
  }

  return { location: `${DOCS_URL}/main`, label: `${ADDON} (main)` };
}

class NotFound extends Error {}

async function read(location, relative) {
  if (!/^https?:\/\//.test(location)) {
    try {
      return await fs.readFile(path.join(location, relative), 'utf-8');
    } catch (error) {
      throw error.code === 'ENOENT' ? new NotFound(error.message) : error;
    }
  }

  const url = new URL(
    relative,
    location.endsWith('/') ? location : `${location}/`,
  );
  const response = await fetch(url);
  if (!response.ok) {
    const message = `${url}: HTTP ${response.status}`;
    throw response.status === 404 ? new NotFound(message) : new Error(message);
  }
  return response.text();
}

/**
 * Reads the manifests (`./manifests/components.json`, and `docs.json` if
 * there is one) from a URL or directory. The tools ask for them on every
 * call, so each is read once; only a failure other than "not found" is
 * retried.
 */
export function manifestProvider(location) {
  const cache = new Map();

  return (_request, manifestPath) => {
    if (!cache.has(manifestPath)) {
      const result = read(location, manifestPath.replace(/^\.\//, ''));
      result.catch((error) => {
        if (!(error instanceof NotFound)) cache.delete(manifestPath);
      });
      cache.set(manifestPath, result);
    }
    return cache.get(manifestPath);
  };
}

/** How to use the components; the README offers it for AGENTS.md too. */
export const instructions = () =>
  fs.readFile(new URL('./instructions.md', import.meta.url), 'utf-8');

export async function createServer(label) {
  const server = new McpServer(
    { name: pkg.name, version: pkg.version, description: `Docs for ${label}` },
    {
      adapter: new ValibotJsonSchemaAdapter(),
      capabilities: { tools: { listChanged: true } },
      instructions: `These tools serve the docs for ${label}.\n\n${await instructions()}\n${STORYBOOK_MCP_INSTRUCTIONS}`,
    },
  ).withContext();

  await addListAllDocumentationTool(server);
  await addGetDocumentationTool(server);
  await addGetStoryDocumentationTool(server);

  return server;
}

export async function main(args = process.argv.slice(2)) {
  const { values } = parseArgs({
    args,
    options: {
      release: { type: 'string' },
      manifests: { type: 'string' },
      help: { type: 'boolean' },
    },
  });

  if (values.help) {
    console.log(USAGE);
    return;
  }

  const { location, label } = await resolveManifests({
    ...values,
    cwd: process.cwd(),
  });
  const server = await createServer(label);

  new StdioTransport(server).listen({
    manifestProvider: manifestProvider(location),
  });
}
