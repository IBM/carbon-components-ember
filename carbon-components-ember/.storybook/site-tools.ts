// Toolbar tools for the published Storybook, replacing docs-app's version
// selector and "Edit this page" link.
import { createElement as h, useEffect, useState } from 'react';
import {
  addons,
  types,
  useStorybookApi,
  useStorybookState,
} from 'storybook/manager-api';
import {
  IconButton,
  TooltipLinkList,
  WithTooltip,
} from 'storybook/internal/components';

const REPO = 'IBM/carbon-components-ember';
const SITE = 'https://ibm.github.io/carbon-components-ember/';
const VERSIONS_API = `https://api.github.com/repos/${REPO}/contents/versions?ref=gh-pages`;

interface Deploy {
  /** The site root the version folders live under. */
  root: string;
  /** `main`, a release tag, `pr-<n>`, or `local`. */
  name: string;
  /** Whether this is a `versions/<name>/` deploy (not a PR preview or local). */
  isVersion: boolean;
}

/** Where this Storybook is deployed: `versions/<name>/` or `pr-previews/pr-<n>/`. */
function currentDeploy(): Deploy {
  const match = window.location.pathname.match(
    /^(.*?\/)(?:versions\/([^/]+)|pr-previews\/(pr-\d+))\//,
  );
  if (!match) return { root: SITE, name: 'local', isVersion: false };
  return {
    root: new URL(match[1]!, window.location.origin).href,
    name: match[2] ?? match[3]!,
    isVersion: Boolean(match[2]),
  };
}

/** `main` first, then release tags, newest first. */
function sortVersions(names: string[]) {
  return [...names].sort((a, b) => {
    if (a === 'main') return -1;
    if (b === 'main') return 1;
    return b.localeCompare(a, undefined, { numeric: true });
  });
}

async function loadVersions(): Promise<string[]> {
  const cached = sessionStorage.getItem('carbon-versions');
  if (cached) return JSON.parse(cached) as string[];
  const response = await fetch(VERSIONS_API);
  if (!response.ok) throw new Error(`GitHub API: ${response.status}`);
  const entries = (await response.json()) as { name: string; type: string }[];
  const names = sortVersions(
    entries.filter((entry) => entry.type === 'dir').map((entry) => entry.name),
  );
  sessionStorage.setItem('carbon-versions', JSON.stringify(names));
  return names;
}

function VersionTool() {
  const deploy = currentDeploy();
  const [versions, setVersions] = useState<string[] | 'loading' | 'error'>(
    'loading',
  );

  useEffect(() => {
    loadVersions().then(setVersions, () => setVersions('error'));
  }, []);

  const links = Array.isArray(versions)
    ? versions.map((version) => ({
        id: version,
        title: version,
        active: version === deploy.name,
        // Keep the current page: newer versions are Storybooks too.
        href: `${deploy.root}versions/${version}/${window.location.search}`,
      }))
    : [
        {
          id: versions,
          title:
            versions === 'loading'
              ? 'Loading versions…'
              : 'Versions unavailable',
        },
      ];

  return h(WithTooltip, {
    placement: 'bottom',
    trigger: 'click',
    closeOnOutsideClick: true,
    tooltip: h(TooltipLinkList, { links }),
    children: h(
      IconButton,
      { title: 'Switch the documented version' },
      `Version: ${deploy.name}`,
    ),
  });
}

function EditTool() {
  const api = useStorybookApi();
  // Subscribes the tool to navigation, so it follows the current entry.
  useStorybookState();
  const importPath = api.getCurrentStoryData()?.importPath;
  if (!importPath) return null;

  const deploy = currentDeploy();
  // A release tag can only be viewed, not edited.
  const tagged = deploy.isVersion && deploy.name !== 'main';
  const href = `https://github.com/${REPO}/${tagged ? 'blob' : 'edit'}/${
    tagged ? deploy.name : 'main'
  }/carbon-components-ember/${importPath.replace(/^\.\//, '')}`;

  return h(
    IconButton,
    {
      title: 'Edit this page on GitHub',
      onClick: () => window.open(href, '_blank', 'noopener'),
    },
    tagged ? 'View source' : 'Edit this page',
  );
}

addons.register('carbon/site-tools', () => {
  addons.add('carbon/site-tools/version', {
    type: types.TOOLEXTRA,
    title: 'Version',
    render: VersionTool,
  });
  addons.add('carbon/site-tools/edit', {
    type: types.TOOLEXTRA,
    title: 'Edit this page',
    render: EditTool,
  });
});
