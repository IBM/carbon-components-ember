#!/usr/bin/env node

/**
 * Carbon Components Parity Check Script
 *
 * This script, for each configured upstream source (see SOURCES below):
 * 1. Fetches the upstream component list from GitHub API
 * 2. Scrapes Storybook for detailed component information (React source only)
 * 3. Compares with Ember components
 * 4. Tracks version changes
 * 5. Creates GitHub issues for differences (when enabled for that source)
 */

import { Octokit } from '@octokit/rest';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Support running from a different repo (standalone mode)
const TARGET_REPO_PATH = process.env.TARGET_REPO_PATH || path.resolve(__dirname, '..');
const ROOT_DIR = TARGET_REPO_PATH;

const PARITY_DATA_FILE = path.join(ROOT_DIR, '.parity-check-data.json');
const EXCLUSIONS_FILE = path.join(ROOT_DIR, '.parity-check-exclusions.json');
const GITHUB_LABEL = 'parity-check';

/**
 * Upstream sources this script tracks parity against. Each source is
 * diffed independently: its own component list, its own commit/version
 * tracking, its own report section and (optionally) its own GitHub issues.
 *
 * `id` is the key used for `.parity-check-data.json`'s `sources` object,
 * for the `--source` CLI flag, and as a component-name namespace, so it
 * must be stable once a source has run at least once.
 *
 * `createIssues` is a per-source kill switch on top of the global
 * CREATE_ISSUES/--create-issues flag - both must allow issue creation for
 * a given source to actually file issues. `carbon-ai-chat` started with
 * this off while there wasn't a single Ember component under that
 * namespace (every upstream component would've shown up as "missing" and
 * a live run would've immediately opened ~20 issues); now that `Launcher`
 * and `ChatShell` have landed (see AGENTS.md's "Porting Carbon AI Chat"
 * section) it's on, and the next live run will open issues for the
 * remaining ~18 still-unported components.
 */
// Ember export name overrides for `carbon-ai-chat` components whose plain
// PascalCase name would collide with an existing Carbon React component of
// the same name in the shared `index.ts` export list (see the source's
// `nameToEmberExport` comment below for why that matters). Keyed by the
// upstream kebab-case directory name.
const AI_CHAT_EXPORT_OVERRIDES = {
  card: 'AiChatCard',
  'truncated-text': 'AiChatTruncatedText',
  'code-snippet': 'AiChatCodeSnippet',
  // Carbon React has its own (not yet implemented) `ChatButton` - see the
  // batch 3 write-up in AGENTS.md's "Porting Carbon AI Chat" section.
  'chat-button': 'AiChatChatButton',
};

const SOURCES = [
  {
    id: 'react',
    label: 'Carbon React',
    owner: 'carbon-design-system',
    repo: 'carbon',
    componentsPath: 'packages/react/src/components',
    excludeDirs: [],
    storybookStoriesUrl: 'https://react.carbondesignsystem.com/stories.json',
    storybookBaseUrl: 'https://react.carbondesignsystem.com/',
    issueTitlePrefix: '[Parity Check]',
    createIssues: true,
    // The Ember side of this addon is a 1:1 mirror of this source (it's
    // the original, and the only one with any implemented components so
    // far), so "components exported from Ember but not in this source"
    // is a meaningful signal.
    trackExtra: true,
    // React's upstream directory names are already PascalCase and match
    // the Ember export names 1:1.
    nameToEmberExport: (name) => name,
  },
  {
    id: 'carbon-ai-chat',
    label: 'Carbon AI Chat',
    owner: 'carbon-design-system',
    repo: 'carbon-ai-chat',
    // The reusable, framework-agnostic Lit widget library - the actual
    // Ember port target. Deliberately NOT packages/ai-chat/src/chat/**,
    // which is the React application's own internal component tree (state
    // machine, views) rather than a reusable component surface, and NOT
    // the web-component shell, which mounts React into shadow DOM rather
    // than providing a framework-native implementation to port.
    componentsPath: 'packages/ai-chat-components/src/components',
    // Not a component - a shared-code folder alongside the real widgets.
    excludeDirs: ['shared'],
    storybookStoriesUrl: null,
    storybookBaseUrl: null,
    issueTitlePrefix: '[Parity Check][AI Chat]',
    // `Launcher` and `ChatShell` landed (see AGENTS.md's "Porting Carbon AI
    // Chat" section), so a normal missing/implemented split now makes
    // sense - flipped on. `.parity-check-data.json` has never had a
    // `sources['carbon-ai-chat']` entry (this source only ever ran in
    // report-only mode before now), so `runSource()`'s
    // `versionChanged ? comparison.missing : comparison.newComponents`
    // branch will take the `missing` path on the very next run (no stored
    // `lastCheckedVersion` to compare against) and file issues for every
    // still-unported component, not just ones that appeared since a
    // previous check - no separate remediation step needed here.
    createIssues: true,
    // Every existing Ember component in this addon mirrors `react`, not
    // this source, so diffing the full Ember export list against this
    // source's component list would report ~all of them as "extra" -
    // meaningless noise, not a real signal. Skip it until this source has
    // its own implemented components to actually compare against.
    trackExtra: false,
    // Upstream directory names are kebab-case (e.g. "chat-shell"); the
    // Ember port exports them as PascalCase (e.g. "ChatShell"). `emberComponents`
    // (see comparison below) is a single flat list built from the *entire*
    // `index.ts` export list, shared across every source - so a plain 1:1
    // name would collide with any Carbon React component of the same name
    // and silently satisfy that source's own "missing" check too (e.g.
    // exporting `Card` here would close out the react source's Card issue
    // #774 despite no React Card ever having been implemented). `Launcher`/
    // `ChatShell` (see PR #838) didn't collide with anything in `react` and
    // stay unprefixed so that PR's export names don't churn; `card`,
    // `truncated-text` and `code-snippet` do collide (checked against
    // `react`'s live component list when each was ported) and are exported
    // with an `AiChat` prefix instead (`AiChatCard`, `AiChatTruncatedText`,
    // `AiChatCodeSnippet`) - add a name here only when a real collision is
    // confirmed, not preemptively.
    nameToEmberExport: (name) =>
      AI_CHAT_EXPORT_OVERRIDES[name] ?? kebabToPascalCase(name),
  },
];

function getSource(id) {
  const source = SOURCES.find((s) => s.id === id);
  if (!source) {
    throw new Error(`Unknown parity source "${id}". Known sources: ${SOURCES.map((s) => s.id).join(', ')}`);
  }
  return source;
}

/**
 * Convert a kebab-case upstream directory name (e.g. "chat-shell") to the
 * PascalCase named export it should correspond to on the Ember side (e.g.
 * "ChatShell").
 */
function kebabToPascalCase(name) {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

// Initialize Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN || process.env.GH_TOKEN
});

/**
 * Fetch the latest release version for a source's upstream repo
 */
async function fetchLatestVersion(source) {
  try {
    const { data } = await octokit.repos.getLatestRelease({
      owner: source.owner,
      repo: source.repo
    });
    return data.tag_name.replace(/^v/, '');
  } catch (error) {
    console.error(`Error fetching latest ${source.label} version:`, error.message);
    return 'unknown';
  }
}

/**
 * Fetch the commit SHA for the latest release tag
 */
async function fetchLatestReleaseCommitSHA(source) {
  try {
    // Get latest release
    const { data: release } = await octokit.repos.getLatestRelease({
      owner: source.owner,
      repo: source.repo
    });

    // Get the tag reference
    const { data: tag } = await octokit.git.getRef({
      owner: source.owner,
      repo: source.repo,
      ref: `tags/${release.tag_name}`
    });

    // The tag object contains the commit SHA
    // If it's an annotated tag, tag.object.sha points to the tag object, not commit
    // We need to get the commit that the tag points to
    let commitSha = tag.object.sha;

    // If it's an annotated tag, we need to dereference it
    if (tag.object.type === 'tag') {
      const { data: tagObject } = await octokit.git.getTag({
        owner: source.owner,
        repo: source.repo,
        tag_sha: tag.object.sha
      });
      commitSha = tagObject.object.sha;
    }

    // Get the actual commit
    const { data: commit } = await octokit.repos.getCommit({
      owner: source.owner,
      repo: source.repo,
      ref: commitSha
    });

    return {
      sha: commitSha,
      date: commit.commit.committer.date,
      message: commit.commit.message.split('\n')[0],
      tag: release.tag_name
    };
  } catch (error) {
    console.error(`Error fetching release commit for ${source.label}:`, error.message);
    return null;
  }
}

/**
 * Fetch commits for a specific component between two SHAs
 */
async function fetchComponentChanges(source, componentName, sinceSHA) {
  if (!sinceSHA) return [];

  try {
    const { data } = await octokit.repos.listCommits({
      owner: source.owner,
      repo: source.repo,
      path: `${source.componentsPath}/${componentName}`,
      since: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // Last 90 days
      per_page: 100
    });

    // Find commits after sinceSHA
    const sinceIndex = data.findIndex(commit => commit.sha === sinceSHA);
    if (sinceIndex === -1) {
      // SHA not found in recent history, return all
      return data;
    }

    return data.slice(0, sinceIndex);
  } catch (error) {
    console.error(`Error fetching changes for ${componentName} (${source.label}):`, error.message);
    return [];
  }
}

/**
 * Check if a component has been updated since last check
 */
async function checkComponentUpdates(source, componentName, lastCheckedSHA) {
  const changes = await fetchComponentChanges(source, componentName, lastCheckedSHA);
  return {
    hasChanges: changes.length > 0,
    changeCount: changes.length,
    latestCommit: changes[0] || null,
    commits: changes.slice(0, 5) // Keep only last 5 for report
  };
}

/**
 * Fetch a source's component list from GitHub API (directory listing)
 */
async function fetchUpstreamComponents(source) {
  try {
    const { data } = await octokit.repos.getContent({
      owner: source.owner,
      repo: source.repo,
      path: source.componentsPath
    });

    return data
      .filter(item => item.type === 'dir' && !source.excludeDirs?.includes(item.name))
      .map(item => item.name)
      .sort();
  } catch (error) {
    console.error(`Error fetching ${source.label} components:`, error.message);
    return [];
  }
}

/**
 * Get Ember components from index.ts. Shared across all sources: whatever
 * gets added for a new source (e.g. `ChatShell`/`Launcher` for
 * `carbon-ai-chat`) is exported from the same public entrypoint, regardless
 * of which subfolder it lives under, so there is no need for a per-source
 * path here.
 */
async function getEmberComponents() {
  try {
    const indexPath = path.join(ROOT_DIR, 'carbon-components-ember/src/components/index.ts');
    const content = await fs.readFile(indexPath, 'utf-8');

    // Match export statements
    const exportRegex = /export\s*\{\s*default\s+as\s+(\w+)\s*\}/g;
    const components = [];
    let match;

    while ((match = exportRegex.exec(content)) !== null) {
      components.push(match[1]);
    }

    return components.sort();
  } catch (error) {
    console.error('Error reading Ember components:', error.message);
    return [];
  }
}

/**
 * Scrape Storybook for component details (only sources that configure a
 * storybookStoriesUrl support this - carbon-ai-chat does not have a known
 * stories.json endpoint, so it's skipped for that source rather than
 * guessed at).
 */
async function scrapeStorybookComponents(source) {
  if (!source.storybookStoriesUrl) return [];

  try {
    const response = await fetch(source.storybookStoriesUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Extract component names from stories
    const components = new Set();
    Object.keys(data.stories || {}).forEach(key => {
      const story = data.stories[key];
      if (story.title) {
        // Extract component name from title like "Components/Accordion"
        const parts = story.title.split('/');
        if (parts.length >= 2 && parts[0] === 'Components') {
          components.add(parts[1]);
        }
      }
    });

    return Array.from(components).sort();
  } catch (error) {
    console.error(`Error scraping Storybook for ${source.label}:`, error.message);
    return [];
  }
}

/**
 * Load previous parity check data. Old (pre-multi-source) files only have
 * the top-level `lastCheckedVersion`/`components`/`componentMetadata`
 * shape, keyed implicitly to what is now the `react` source. This script
 * keeps writing those top-level fields on every save (mirroring `react`)
 * so nothing reading the legacy shape needs to change - but on the way
 * *in*, an old file has no `sources.react` yet, and without migrating it
 * here `runSource('react', ...)` would see `previousSourceData = {}`,
 * treat every run as a first run (re-fetching "Never" as the last
 * checked version), and both re-file "Investigate" issues for components
 * whose issues were already closed and wipe every component's
 * `lastSyncedCommit` back to 'N/A'. Synthesize `sources.react` from the
 * legacy fields once, the first time this runs against an old file.
 */
async function loadParityData() {
  try {
    const content = await fs.readFile(PARITY_DATA_FILE, 'utf-8');
    const data = JSON.parse(content);
    if (!data.sources) data.sources = {};
    if (!data.sources.react && data.lastCheckedVersion) {
      data.sources.react = {
        lastCheckedVersion: data.lastCheckedVersion,
        lastCheckedCommitSHA: data.lastCheckedCommitSHA,
        lastCheckedCommitDate: data.lastCheckedCommitDate,
        lastCheckDate: data.lastCheckDate,
        // Legacy shape stored the upstream component list as
        // `components.react`; the new shape calls it `components.upstream`.
        components: { ...data.components, upstream: data.components?.react },
        componentMetadata: data.componentMetadata ?? {}
      };
    }
    return data;
  } catch (error) {
    return {
      lastCheckedVersion: null,
      lastCheckDate: null,
      components: {},
      componentMetadata: {},
      sources: {}
    };
  }
}

/**
 * Save parity check data
 */
async function saveParityData(data) {
  await fs.writeFile(PARITY_DATA_FILE, JSON.stringify(data, null, 2));
}

/**
 * Load component exclusions (upstream components intentionally not
 * tracked for parity). Shared across all sources: upstream naming
 * conventions don't currently overlap (PascalCase React component
 * directories vs. kebab-case carbon-ai-chat ones), so a single flat map
 * keyed by component name is sufficient without a source prefix.
 */
async function loadExclusions() {
  try {
    const content = await fs.readFile(EXCLUSIONS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return {};
  }
}

/**
 * Save component exclusions
 */
async function saveExclusions(exclusions) {
  await fs.writeFile(EXCLUSIONS_FILE, JSON.stringify(exclusions, null, 2));
}

/**
 * Exclude a component from parity tracking (e.g. it doesn't make sense in an
 * Ember context, or it's actually part of another already-implemented component).
 * Excluded components are dropped before comparison, so they never show up in
 * .parity-check-data.json or PARITY_REPORT.md. If an issue number is given, the
 * corresponding parity-check issue is commented on and closed.
 */
async function excludeComponent(componentName, reason, issueNumber) {
  if (!reason) {
    console.error('Error: --reason is required when excluding a component');
    process.exit(1);
  }

  const exclusions = await loadExclusions();
  exclusions[componentName] = {
    reason,
    excludedAt: new Date().toISOString(),
    issue: issueNumber || null
  };
  await saveExclusions(exclusions);
  console.log(`Excluded ${componentName} from parity tracking: ${reason}`);

  if (issueNumber) {
    const [owner, repo] = process.env.GITHUB_REPOSITORY?.split('/') || ['', ''];
    if (owner && repo) {
      try {
        await octokit.issues.createComment({
          owner,
          repo,
          issue_number: Number(issueNumber),
          body: `Excluded \`${componentName}\` from parity tracking.\n\n**Reason**: ${reason}\n\nIt will no longer appear in \`.parity-check-data.json\` or \`PARITY_REPORT.md\`.`
        });
        await octokit.issues.update({
          owner,
          repo,
          issue_number: Number(issueNumber),
          state: 'closed',
          labels: [GITHUB_LABEL, 'wontfix']
        });
        console.log(`Closed issue #${issueNumber} with exclusion reason.`);
      } catch (error) {
        console.error(`Error updating issue #${issueNumber}:`, error.message);
      }
    }
  }
}

/**
 * Remove a component exclusion, restoring it to parity tracking
 */
async function includeComponent(componentName) {
  const exclusions = await loadExclusions();
  if (!(componentName in exclusions)) {
    console.log(`${componentName} is not excluded.`);
    return;
  }
  delete exclusions[componentName];
  await saveExclusions(exclusions);
  console.log(`Removed exclusion for ${componentName}. It will be tracked again.`);
}

/**
 * Compare component lists and identify changes for a single source
 */
async function compareComponents(source, upstreamComponents, emberComponents, previousSourceData, currentCommitSHA) {
  const missing = upstreamComponents.filter(c => !emberComponents.includes(source.nameToEmberExport(c)));
  const implemented = upstreamComponents.filter(c => emberComponents.includes(source.nameToEmberExport(c)));
  // Meaningless for sources with no naming overlap against the Ember
  // export list yet (see `trackExtra` on the source config).
  const extra = source.trackExtra ? emberComponents.filter(c => !upstreamComponents.includes(c)) : [];

  // Identify new components since last check
  const newComponents = [];
  if (previousSourceData.components?.upstream) {
    newComponents.push(...upstreamComponents.filter(c => !previousSourceData.components.upstream.includes(c)));
  }

  // Check for outdated components (implemented but upstream version changed)
  const outdatedComponents = [];
  const componentMetadata = {};

  if (previousSourceData.lastCheckedCommitSHA && currentCommitSHA !== previousSourceData.lastCheckedCommitSHA) {
    console.log(`\nChecking for component updates (${source.label})...`);

    for (const component of implemented) {
      const storedLastSyncedCommit = previousSourceData.componentMetadata?.[component]?.lastSyncedCommit;
      const lastSyncedSHA = (storedLastSyncedCommit && storedLastSyncedCommit !== 'N/A') ? storedLastSyncedCommit : previousSourceData.lastCheckedCommitSHA;
      const updateInfo = await checkComponentUpdates(source, component, lastSyncedSHA);

      componentMetadata[component] = {
        lastCheckedCommit: currentCommitSHA,
        lastSyncedCommit: lastSyncedSHA,
        hasChanges: updateInfo.hasChanges,
        changeCount: updateInfo.changeCount,
        lastUpdate: updateInfo.latestCommit?.commit?.committer?.date || null
      };

      if (updateInfo.hasChanges) {
        outdatedComponents.push({
          name: component,
          changeCount: updateInfo.changeCount,
          commits: updateInfo.commits
        });
        console.log(`  ⚠️  ${component}: ${updateInfo.changeCount} changes since last sync`);
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  } else {
    // Initialize metadata for all implemented components
    for (const component of implemented) {
      // For components without prior metadata, set lastSyncedCommit to N/A
      const hasExistingMetadata = previousSourceData.componentMetadata?.[component] !== undefined;

      componentMetadata[component] = {
        lastCheckedCommit: currentCommitSHA,
        lastSyncedCommit: hasExistingMetadata ? previousSourceData.componentMetadata[component].lastSyncedCommit : 'N/A',
        hasChanges: false,
        changeCount: 0,
        lastUpdate: null
      };
    }
  }

  return {
    missing,
    implemented,
    extra,
    newComponents,
    outdatedComponents,
    componentMetadata,
    parity: upstreamComponents.length > 0 ? Math.round((implemented.length / upstreamComponents.length) * 100) : 0
  };
}

/**
 * Fetch the titles of all open issues carrying the parity-check label,
 * paginating through the full result set (listForRepo defaults to 30
 * per page, and issues are returned newest-first, so relying on a
 * single page misses older open issues and causes duplicate creation).
 */
async function fetchOpenParityIssueTitles(owner, repo) {
  const issues = await octokit.paginate(octokit.issues.listForRepo, {
    owner,
    repo,
    labels: GITHUB_LABEL,
    state: 'open',
    per_page: 100
  });

  return new Set(issues.map(issue => issue.title));
}

/**
 * Create GitHub issue for a missing component
 */
async function createGitHubIssue(source, componentName, version, commitSHA, existingTitles) {
  const [owner, repo] = process.env.GITHUB_REPOSITORY?.split('/') || ['', ''];

  if (!owner || !repo) {
    console.log(`Would create issue for: ${componentName} (no GITHUB_REPOSITORY set)`);
    return null;
  }

  const title = `${source.issueTitlePrefix} Investigate ${componentName} component`;
  const storybookLine = source.storybookBaseUrl
    ? `- [ ] Check Storybook examples: ${source.storybookBaseUrl}?path=/docs/components-${componentName.toLowerCase()}--overview\n`
    : '';
  const storybookResource = source.storybookBaseUrl
    ? `- [Storybook Documentation](${source.storybookBaseUrl})\n`
    : '';
  const body = `## Component Parity Investigation

**Source**: ${source.label} (${source.owner}/${source.repo})
**Component**: ${componentName}
**Version**: ${version}
**Commit**: ${commitSHA?.substring(0, 7) || 'unknown'}
**Status**: Missing in Ember implementation

### Investigation Tasks

- [ ] Review upstream implementation: https://github.com/${source.owner}/${source.repo}/tree/main/${source.componentsPath}/${componentName}
${storybookLine}- [ ] Document component API (props, events, variants)
- [ ] Assess implementation complexity
- [ ] Determine priority (High/Medium/Low)
- [ ] Create implementation plan or decide to skip

### Resources

- [Upstream Component](https://github.com/${source.owner}/${source.repo}/tree/${commitSHA || 'main'}/${source.componentsPath}/${componentName})
${storybookResource}- [${source.label}](https://github.com/${source.owner}/${source.repo})

---
*Auto-generated by parity-check script on ${new Date().toISOString()}*
`;

  try {
    if (existingTitles.has(title)) {
      console.log(`Issue for ${componentName} already exists, skipping...`);
      return null;
    }

    const { data: issue } = await octokit.issues.create({
      owner,
      repo,
      title,
      body,
      labels: [GITHUB_LABEL, 'enhancement']
    });

    console.log(`Created issue #${issue.number} for ${componentName}`);
    existingTitles.add(title);
    return issue;
  } catch (error) {
    console.error(`Error creating issue for ${componentName}:`, error.message);
    return null;
  }
}

/**
 * Create GitHub issue for an outdated component
 */
async function createOutdatedComponentIssue(source, componentInfo, version, commitSHA, existingTitles) {
  const [owner, repo] = process.env.GITHUB_REPOSITORY?.split('/') || ['', ''];

  if (!owner || !repo) {
    console.log(`Would create issue for outdated: ${componentInfo.name} (no GITHUB_REPOSITORY set)`);
    return null;
  }

  const title = `${source.issueTitlePrefix} Update ${componentInfo.name} component`;

  const commitsList = componentInfo.commits.map(commit =>
    `- [\`${commit.sha.substring(0, 7)}\`](${commit.html_url}) ${commit.commit.message.split('\n')[0]}`
  ).join('\n');

  const body = `## Component Update Required

**Source**: ${source.label} (${source.owner}/${source.repo})
**Component**: ${componentInfo.name}
**Version**: ${version}
**Latest Commit**: ${commitSHA?.substring(0, 7) || 'unknown'}
**Changes Detected**: ${componentInfo.changeCount} commits since last sync

### Recent Changes Upstream

${commitsList}

${componentInfo.changeCount > 5 ? `\n*...and ${componentInfo.changeCount - 5} more commits*\n` : ''}

### Investigation Tasks

- [ ] Review recent changes in upstream implementation
- [ ] Compare with current Ember implementation
- [ ] Identify new props, features, or bug fixes
- [ ] Update Ember component to match
- [ ] Update tests
- [ ] Update documentation

### Resources

- [Upstream Component](https://github.com/${source.owner}/${source.repo}/tree/${commitSHA || 'main'}/${source.componentsPath}/${componentInfo.name})
- [Component Commits](https://github.com/${source.owner}/${source.repo}/commits/main/${source.componentsPath}/${componentInfo.name})
- [${source.label}](https://github.com/${source.owner}/${source.repo})

---
*Auto-generated by parity-check script on ${new Date().toISOString()}*
`;

  try {
    if (existingTitles.has(title)) {
      console.log(`Update issue for ${componentInfo.name} already exists, skipping...`);
      return null;
    }

    const { data: issue } = await octokit.issues.create({
      owner,
      repo,
      title,
      body,
      labels: [GITHUB_LABEL, 'enhancement', 'needs-update']
    });

    console.log(`Created update issue #${issue.number} for ${componentInfo.name}`);
    existingTitles.add(title);
    return issue;
  } catch (error) {
    console.error(`Error creating update issue for ${componentInfo.name}:`, error.message);
    return null;
  }
}

/**
 * Generate the parity report section for a single source
 */
function generateReportSection(source, comparison, version, commitInfo) {
  return `# ${source.label} Parity Report
Generated: ${new Date().toISOString()}
Upstream: ${source.owner}/${source.repo}
Version: ${version}
Latest Commit: ${commitInfo?.sha?.substring(0, 7) || 'unknown'} (${commitInfo?.date || 'unknown'})

## Summary
- Total Upstream Components: ${comparison.implemented.length + comparison.missing.length}${source.trackExtra ? `
- Total Ember Components (in this namespace): ${comparison.implemented.length + comparison.extra.length}` : ''}
- Parity: ${comparison.parity}%
- Outdated Components: ${comparison.outdatedComponents?.length || 0}
- Issue creation for this source: ${source.createIssues ? 'enabled' : 'disabled (report-only)'}

## Missing in Ember (${comparison.missing.length})
${comparison.missing.map(c => `- [ ] ${c}`).join('\n')}

## Implemented in Both (${comparison.implemented.length})
${comparison.implemented.map(c => `- [x] ${c}`).join('\n')}

${comparison.outdatedComponents && comparison.outdatedComponents.length > 0 ? `
## Outdated Components (${comparison.outdatedComponents.length})
These components exist in Ember but have updates upstream that need to be synced:

${comparison.outdatedComponents.map(c => `- [ ] ${c.name} (${c.changeCount} changes)`).join('\n')}
` : ''}

${source.trackExtra ? `
## Ember-Specific (${comparison.extra.length})
${comparison.extra.map(c => `- ${c}`).join('\n')}
` : ''}
${comparison.newComponents.length > 0 ? `
## New Components Since Last Check (${comparison.newComponents.length})
${comparison.newComponents.map(c => `- ${c}`).join('\n')}
` : ''}
`;
}

/**
 * Write the combined parity report (one section per source) to disk
 */
async function generateReport(sections) {
  const report = sections.join('\n---\n\n');
  const reportPath = path.join(ROOT_DIR, 'PARITY_REPORT.md');
  await fs.writeFile(reportPath, report);
  console.log(`Report generated: PARITY_REPORT.md`);
  return report;
}

/**
 * Mark components as synced (update lastSyncedCommit to current release)
 */
async function markComponentsSynced(componentNames, sourceId) {
  const source = getSource(sourceId);
  const previousData = await loadParityData();
  const sourceData = previousData.sources?.[source.id] || {};
  const currentCommitInfo = await fetchLatestReleaseCommitSHA(source);

  if (!currentCommitInfo) {
    console.error('Failed to fetch current release commit');
    return;
  }

  const updated = [];
  const notFound = [];

  for (const componentName of componentNames) {
    if (sourceData.componentMetadata?.[componentName]) {
      sourceData.componentMetadata[componentName].lastSyncedCommit = currentCommitInfo.sha;
      sourceData.componentMetadata[componentName].hasChanges = false;
      sourceData.componentMetadata[componentName].changeCount = 0;
      updated.push(componentName);
    } else {
      notFound.push(componentName);
    }
  }

  if (updated.length > 0) {
    previousData.sources[source.id] = sourceData;
    if (source.id === 'react') {
      // Legacy top-level mirror, see loadParityData()
      previousData.componentMetadata = sourceData.componentMetadata;
    }
    await saveParityData(previousData);
    console.log(`✅ Marked as synced (${currentCommitInfo.sha.substring(0, 7)}):`);
    updated.forEach(name => console.log(`   - ${name}`));
  }

  if (notFound.length > 0) {
    console.log(`\n⚠️  Not found in metadata for source "${source.id}":`);
    notFound.forEach(name => console.log(`   - ${name}`));
  }
}

/**
 * Get the value following a CLI flag, e.g. getArgValue('--reason')
 */
function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  return index !== -1 ? process.argv[index + 1] : undefined;
}

/**
 * Run the full fetch/compare/report/issue-creation pipeline for one source
 */
async function runSource(source, exclusions) {
  console.log(`\n\n=== ${source.label} (${source.owner}/${source.repo}) ===\n`);

  const previousData = await loadParityData();
  const previousSourceData = previousData.sources?.[source.id] || {};

  console.log(`Last checked version: ${previousSourceData.lastCheckedVersion || 'Never'}`);
  console.log(`Last checked commit: ${previousSourceData.lastCheckedCommitSHA?.substring(0, 7) || 'Never'}`);

  const currentVersion = await fetchLatestVersion(source);
  console.log(`Current ${source.label} version: ${currentVersion}`);

  const currentCommitInfo = await fetchLatestReleaseCommitSHA(source);
  console.log(`Current release commit: ${currentCommitInfo?.sha?.substring(0, 7) || 'unknown'} (${currentCommitInfo?.tag || 'unknown'}, ${currentCommitInfo?.date || 'unknown'})\n`);

  console.log(`Fetching ${source.label} components from GitHub...`);
  const upstreamDirComponents = await fetchUpstreamComponents(source);
  console.log(`Found ${upstreamDirComponents.length} components`);

  const storybookComponents = await scrapeStorybookComponents(source);
  if (source.storybookStoriesUrl) {
    console.log(`Found ${storybookComponents.length} components in Storybook`);
  }

  const mergedUpstreamComponents = Array.from(new Set([...upstreamDirComponents, ...storybookComponents])).sort();
  console.log(`Total unique ${source.label} components: ${mergedUpstreamComponents.length}`);

  const excludedNames = Object.keys(exclusions);
  const allUpstreamComponents = mergedUpstreamComponents.filter(c => !excludedNames.includes(c));
  if (excludedNames.length > 0) {
    console.log(`Excluding ${excludedNames.length} component(s) from tracking: ${excludedNames.join(', ')}`);
  }

  const emberComponents = await getEmberComponents();

  const comparison = await compareComponents(
    source,
    allUpstreamComponents,
    emberComponents,
    { ...previousSourceData, components: { upstream: previousSourceData.components?.upstream } },
    currentCommitInfo?.sha
  );

  console.log(`\n=== ${source.label} Comparison Results ===`);
  console.log(`Parity: ${comparison.parity}%`);
  console.log(`Missing: ${comparison.missing.length}`);
  console.log(`Implemented: ${comparison.implemented.length}`);
  console.log(`Outdated: ${comparison.outdatedComponents?.length || 0}`);
  console.log(`Ember-specific: ${comparison.extra.length}`);
  console.log(`New since last check: ${comparison.newComponents.length}\n`);

  const commitChanged = previousSourceData.lastCheckedCommitSHA !== currentCommitInfo?.sha;
  const versionChanged = previousSourceData.lastCheckedVersion !== currentVersion;
  const globalCreateIssues = process.env.CREATE_ISSUES === 'true' || process.argv.includes('--create-issues');
  const shouldCreateIssues = globalCreateIssues && source.createIssues;

  if (globalCreateIssues && !source.createIssues) {
    console.log(`Issue creation requested but disabled for source "${source.id}" (createIssues: false) - report-only.`);
  }

  if (shouldCreateIssues) {
    console.log(`\n=== Creating GitHub Issues (${source.label}) ===`);

    const [owner, repo] = process.env.GITHUB_REPOSITORY?.split('/') || ['', ''];
    const existingTitles = (owner && repo)
      ? await fetchOpenParityIssueTitles(owner, repo)
      : new Set();

    const componentsToInvestigate = versionChanged ? comparison.missing : comparison.newComponents;

    if (componentsToInvestigate.length > 0) {
      console.log(`Creating issues for ${componentsToInvestigate.length} missing components...`);
      for (const component of componentsToInvestigate) {
        await createGitHubIssue(source, component, currentVersion, currentCommitInfo?.sha, existingTitles);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (comparison.outdatedComponents && comparison.outdatedComponents.length > 0) {
      console.log(`Creating issues for ${comparison.outdatedComponents.length} outdated components...`);
      for (const componentInfo of comparison.outdatedComponents) {
        await createOutdatedComponentIssue(source, componentInfo, currentVersion, currentCommitInfo?.sha, existingTitles);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  const newSourceData = {
    lastCheckedVersion: currentVersion,
    lastCheckedCommitSHA: currentCommitInfo?.sha,
    lastCheckedCommitDate: currentCommitInfo?.date,
    lastCheckDate: new Date().toISOString(),
    components: {
      upstream: allUpstreamComponents,
      ember: emberComponents,
      missing: comparison.missing,
      implemented: comparison.implemented,
      outdated: comparison.outdatedComponents?.map(c => c.name) || []
    },
    componentMetadata: comparison.componentMetadata || {}
  };

  return {
    source,
    comparison,
    currentVersion,
    currentCommitInfo,
    newSourceData,
    reportSection: generateReportSection(source, comparison, currentVersion, currentCommitInfo)
  };
}

/**
 * Main execution
 */
async function main() {
  const sourceIdArg = getArgValue('--source');
  const sourceId = sourceIdArg || 'react';

  // Check for --mark-synced flag
  const markSyncedIndex = process.argv.indexOf('--mark-synced');
  if (markSyncedIndex !== -1 && process.argv[markSyncedIndex + 1]) {
    const components = process.argv[markSyncedIndex + 1].split(',').map(s => s.trim());
    await markComponentsSynced(components, sourceId);
    return;
  }

  // Check for --exclude flag: exclude a component from parity tracking
  const excludeName = getArgValue('--exclude');
  if (excludeName) {
    await excludeComponent(excludeName, getArgValue('--reason'), getArgValue('--issue'));
    return;
  }

  // Check for --include flag: undo a previous exclusion
  const includeName = getArgValue('--include');
  if (includeName) {
    await includeComponent(includeName);
    return;
  }

  // Check for --list-exclusions flag
  if (process.argv.includes('--list-exclusions')) {
    const exclusions = await loadExclusions();
    const names = Object.keys(exclusions);
    if (names.length === 0) {
      console.log('No components are excluded.');
    } else {
      console.log('Excluded components:');
      names.forEach(name => console.log(`  - ${name}: ${exclusions[name].reason}`));
    }
    return;
  }

  console.log('Starting Carbon Components Parity Check...');

  const sourcesToRun = sourceIdArg ? [getSource(sourceIdArg)] : SOURCES;

  const previousData = await loadParityData();
  const exclusions = await loadExclusions();

  const results = [];
  for (const source of sourcesToRun) {
    results.push(await runSource(source, exclusions));
  }

  await generateReport(results.map(r => r.reportSection));

  const sources = { ...previousData.sources };
  for (const result of results) {
    sources[result.source.id] = result.newSourceData;
  }

  const reactResult = results.find(r => r.source.id === 'react');

  const newData = {
    // Legacy top-level shape, mirroring the `react` source, kept for
    // backward compatibility with anything still reading the pre-multi-
    // source file layout (see loadParityData()).
    lastCheckedVersion: reactResult?.newSourceData.lastCheckedVersion ?? previousData.lastCheckedVersion,
    lastCheckedCommitSHA: reactResult?.newSourceData.lastCheckedCommitSHA ?? previousData.lastCheckedCommitSHA,
    lastCheckedCommitDate: reactResult?.newSourceData.lastCheckedCommitDate ?? previousData.lastCheckedCommitDate,
    lastCheckDate: new Date().toISOString(),
    components: reactResult
      ? {
          react: reactResult.newSourceData.components.upstream,
          ember: reactResult.newSourceData.components.ember,
          missing: reactResult.newSourceData.components.missing,
          implemented: reactResult.newSourceData.components.implemented,
          outdated: reactResult.newSourceData.components.outdated
        }
      : previousData.components,
    componentMetadata: reactResult?.newSourceData.componentMetadata ?? previousData.componentMetadata,
    sources
  };

  await saveParityData(newData);
  console.log('\nParity check data saved.');
  console.log('Done!');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
