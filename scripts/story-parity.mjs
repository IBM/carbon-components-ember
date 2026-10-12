#!/usr/bin/env node

/**
 * Compares our Storybook with Carbon React's, story by story: a React story
 * is matched when we have a story of the same name on the page of the same
 * title. Run with --help for usage.
 */

import fs from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';

export const REACT_INDEX_URL =
  'https://react.carbondesignsystem.com/index.json';
export const EMBER_INDEX_URL =
  'https://ibm.github.io/carbon-components-ember/versions/main/index.json';

// React stories we don't mirror, and why.
export const SKIPPED = [
  {
    title: /\/Feature Flags?$/i,
    reason: 'React behaviour behind a feature flag',
  },
  { title: /^Deprecated\//, reason: 'deprecated in React' },
  { title: /^Hooks\//, reason: 'React hooks' },
  {
    name: /Visual Snapshots?$/i,
    reason: "visual-regression fixtures for React's own tests",
  },
];

const USAGE = `Usage: node scripts/story-parity.mjs [options]

Lists the Carbon React stories our Storybook has, by page, and the ones it's
missing.

  --ember <path|url>     Our Storybook's index.json (default: main's, deployed)
  --react <path|url>     Carbon React's index.json (default: its live Storybook)
  --title <title>        Only this page, e.g. "Components/Button"
  --baseline <path|url>  Another index.json of ours to compare with, e.g. main's
  --summary              Write a short summary, with --baseline's changes, to
                         $GITHUB_STEP_SUMMARY (or stdout), and warn about
                         stories that no longer match
  --json                 Print the comparison as JSON
  --help                 Show this message`;

const key = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, '');
const storyKey = (title, name) => `${key(title)}/${key(name)}`;

/** The stories (not docs pages or test entries) in a Storybook index.json. */
export async function loadIndex(location) {
  const text = /^https?:\/\//.test(location)
    ? await fetch(location).then((response) => {
        if (!response.ok) {
          throw new Error(`${location}: HTTP ${response.status}`);
        }
        return response.text();
      })
    : await fs.readFile(location, 'utf-8');

  return Object.values(JSON.parse(text).entries ?? {})
    .filter((entry) => entry.type === 'story' && entry.subtype !== 'test')
    .map(({ title, name }) => ({ title, name }));
}

/**
 * Matches React's stories against ours. Titles and names are compared
 * ignoring case, spaces and punctuation.
 */
export function compareStories(react, ember) {
  const ours = new Set(ember.map((s) => storyKey(s.title, s.name)));
  const ourPages = new Set(ember.map((s) => key(s.title)));
  const pages = new Map();
  const skipped = new Map();

  for (const story of react) {
    const skip = SKIPPED.find(
      (s) => s.title?.test(story.title) || s.name?.test(story.name),
    );
    if (skip) {
      skipped.set(skip.reason, (skipped.get(skip.reason) ?? 0) + 1);
      continue;
    }

    let page = pages.get(story.title);
    if (!page) {
      page = {
        title: story.title,
        hasPage: ourPages.has(key(story.title)),
        matched: [],
        missing: [],
      };
      pages.set(story.title, page);
    }
    (ours.has(storyKey(story.title, story.name))
      ? page.matched
      : page.missing
    ).push(story.name);
  }

  const sorted = [...pages.values()].sort((a, b) =>
    a.title.localeCompare(b.title),
  );
  const matched = sorted.reduce((n, page) => n + page.matched.length, 0);
  const total = sorted.reduce(
    (n, page) => n + page.matched.length + page.missing.length,
    0,
  );

  return {
    matched,
    total,
    pages: sorted,
    skipped: [...skipped].map(([reason, count]) => ({ reason, count })),
  };
}

/** The React stories one comparison matches and the other doesn't. */
export function diffComparisons(before, after) {
  const matchedIn = (comparison) =>
    new Map(
      comparison.pages.flatMap((page) =>
        page.matched.map((name) => [
          storyKey(page.title, name),
          { title: page.title, name },
        ]),
      ),
    );
  const was = matchedIn(before);
  const is = matchedIn(after);

  return {
    gained: [...is].filter(([k]) => !was.has(k)).map(([, s]) => s),
    lost: [...was].filter(([k]) => !is.has(k)).map(([, s]) => s),
  };
}

const percent = (matched, total) =>
  total ? `${Math.round((matched / total) * 100)}%` : 'n/a';

const list = (names) => names.map((name) => `\`${name}\``).join(', ');

/** A Markdown report of a comparison. */
export function storyReport(comparison) {
  const { matched, total, pages, skipped } = comparison;
  const partial = pages.filter((p) => p.hasPage && p.missing.length);
  const absent = pages.filter((p) => !p.hasPage);
  const lines = [
    '## Stories',
    '',
    `Matched **${matched} of ${total}** Carbon React stories (${percent(matched, total)}). ${absent.length} React pages have no page of ours.`,
  ];

  if (partial.length) {
    lines.push(
      '',
      `### Pages missing stories (${partial.length})`,
      '',
      '| Page | Matched | Missing |',
      '| --- | --- | --- |',
      ...partial.map(
        (p) =>
          `| ${p.title} | ${p.matched.length}/${p.matched.length + p.missing.length} | ${list(p.missing)} |`,
      ),
    );
  }

  if (absent.length) {
    lines.push(
      '',
      `### React pages with no page of ours (${absent.length})`,
      '',
      ...absent.map((p) => `- ${p.title} (${p.missing.length})`),
    );
  }

  if (skipped.length) {
    lines.push(
      '',
      '### Not tracked',
      '',
      ...skipped.map(
        ({ reason, count }) =>
          `- ${count} ${count === 1 ? 'story' : 'stories'}: ${reason}`,
      ),
    );
  }

  return `${lines.join('\n')}\n`;
}

/** A short Markdown summary, with what changed since a baseline if given. */
export function storySummary(comparison, changes) {
  const { matched, total } = comparison;
  const lines = [
    '### Story parity with Carbon React',
    '',
    `Matches **${matched} of ${total}** Carbon React stories (${percent(matched, total)}).`,
  ];

  if (changes) {
    const describe = (stories) =>
      stories.map(({ title, name }) => `- ${title}: ${name}`);

    if (!changes.gained.length && !changes.lost.length) {
      lines.push('', 'No change from main.');
    }
    if (changes.gained.length) {
      lines.push(
        '',
        `Newly matched (${changes.gained.length}):`,
        '',
        ...describe(changes.gained),
      );
    }
    if (changes.lost.length) {
      lines.push(
        '',
        `No longer matched (${changes.lost.length}):`,
        '',
        ...describe(changes.lost),
      );
    }
  }

  return `${lines.join('\n')}\n`;
}

async function main() {
  const { values } = parseArgs({
    options: {
      ember: { type: 'string', default: EMBER_INDEX_URL },
      react: { type: 'string', default: REACT_INDEX_URL },
      title: { type: 'string' },
      baseline: { type: 'string' },
      summary: { type: 'boolean' },
      json: { type: 'boolean' },
      help: { type: 'boolean' },
    },
  });

  if (values.help) {
    console.log(USAGE);
    return;
  }

  const onPage = (stories) =>
    values.title
      ? stories.filter((s) => key(s.title) === key(values.title))
      : stories;
  const [react, ember] = await Promise.all([
    loadIndex(values.react).then(onPage),
    loadIndex(values.ember).then(onPage),
  ]);
  const comparison = compareStories(react, ember);

  if (values.summary) {
    let changes;
    if (values.baseline) {
      try {
        changes = diffComparisons(
          compareStories(react, onPage(await loadIndex(values.baseline))),
          comparison,
        );
      } catch (error) {
        console.warn(`Skipping the baseline: ${error.message}`);
      }
    }

    const summary = storySummary(comparison, changes);
    if (process.env.GITHUB_STEP_SUMMARY) {
      await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
    } else {
      console.log(summary);
    }

    for (const { title, name } of changes?.lost ?? []) {
      console.log(
        `::warning title=Story parity::No longer matches Carbon React's "${title}" story "${name}"`,
      );
    }
    return;
  }

  console.log(
    values.json
      ? JSON.stringify(comparison, null, 2)
      : storyReport(comparison).trimEnd(),
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
