import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  compareStories,
  diffComparisons,
  storyReport,
  storySummary,
} from './story-parity.mjs';

const react = [
  { title: 'Components/Button', name: 'Default' },
  { title: 'Components/Button', name: 'Danger Ghost' },
  { title: 'Components/Button', name: 'Icon Button' },
  { title: 'Components/ComboBox', name: 'Default' },
  { title: 'Components/Tile/Feature Flag', name: 'Default' },
  { title: 'Components/Tabs', name: 'Icon Only Visual Snapshots' },
];

const ember = [
  { title: 'Components/Button', name: 'Default' },
  { title: 'components/button', name: 'Icon button' },
  { title: 'Components/Button', name: 'Promise Loading' },
  { title: 'Charts/BarChart', name: 'Default' },
];

test('matches stories by page and name, ignoring case and punctuation', () => {
  const { matched, total, pages } = compareStories(react, ember);

  assert.equal(matched, 2);
  assert.equal(total, 4);
  assert.deepEqual(pages, [
    {
      title: 'Components/Button',
      hasPage: true,
      matched: ['Default', 'Icon Button'],
      missing: ['Danger Ghost'],
    },
    {
      title: 'Components/ComboBox',
      hasPage: false,
      matched: [],
      missing: ['Default'],
    },
  ]);
});

test('skips feature flags and visual snapshots, counting them', () => {
  const { skipped } = compareStories(react, ember);

  assert.deepEqual(skipped, [
    { reason: 'React behaviour behind a feature flag', count: 1 },
    { reason: "visual-regression fixtures for React's own tests", count: 1 },
  ]);
});

test('lists the stories one comparison matches and the other does not', () => {
  const withoutDefault = compareStories(react, ember.slice(1));
  const withComboBox = compareStories(react, [
    ...ember,
    { title: 'Components/ComboBox', name: 'Default' },
  ]);

  assert.deepEqual(diffComparisons(withoutDefault, withComboBox), {
    gained: [
      { title: 'Components/Button', name: 'Default' },
      { title: 'Components/ComboBox', name: 'Default' },
    ],
    lost: [],
  });
  assert.deepEqual(diffComparisons(withComboBox, withoutDefault), {
    gained: [],
    lost: [
      { title: 'Components/Button', name: 'Default' },
      { title: 'Components/ComboBox', name: 'Default' },
    ],
  });
});

test('reports missing stories and pages', () => {
  const report = storyReport(compareStories(react, ember));

  assert.match(report, /Matched \*\*2 of 4\*\* Carbon React stories \(50%\)/);
  assert.match(report, /\| Components\/Button \| 2\/3 \| `Danger Ghost` \|/);
  assert.match(report, /- Components\/ComboBox \(1\)/);
  assert.match(report, /- 1 story: React behaviour behind a feature flag/);
});

test('summarises the changes from a baseline', () => {
  const comparison = compareStories(react, ember);
  const summary = storySummary(comparison, {
    gained: [{ title: 'Components/Button', name: 'Default' }],
    lost: [],
  });

  assert.match(summary, /Matches \*\*2 of 4\*\*/);
  assert.match(
    summary,
    /Newly matched \(1\):\n\n- Components\/Button: Default/,
  );
  assert.doesNotMatch(summary, /No longer matched/);
  assert.match(
    storySummary(comparison, { gained: [], lost: [] }),
    /No change from main/,
  );
});
