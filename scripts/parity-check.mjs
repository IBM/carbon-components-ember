#!/usr/bin/env node

/**
 * Carbon Components Parity Check Script
 * 
 * This script:
 * 1. Fetches Carbon React component list from GitHub API
 * 2. Scrapes Storybook for detailed component information
 * 3. Compares with Ember components
 * 4. Tracks version changes
 * 5. Creates GitHub issues for differences
 */

import { Octokit } from '@octokit/rest';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Support running from a different repo (standalone mode)
const TARGET_REPO_PATH = process.env.TARGET_REPO_PATH || path.resolve(__dirname, '..');
const ROOT_DIR = TARGET_REPO_PATH;

const PARITY_DATA_FILE = path.join(ROOT_DIR, '.parity-check-data.json');
const EXCLUSIONS_FILE = path.join(ROOT_DIR, '.parity-check-exclusions.json');
const GITHUB_LABEL = 'parity-check';

// Initialize Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN || process.env.GH_TOKEN
});

/**
 * Fetch the latest Carbon React version
 */
async function fetchLatestCarbonVersion() {
  try {
    const { data } = await octokit.repos.getLatestRelease({
      owner: 'carbon-design-system',
      repo: 'carbon'
    });
    return data.tag_name.replace(/^v/, '');
  } catch (error) {
    console.error('Error fetching latest Carbon version:', error.message);
    // Fallback to package.json check
    try {
      const { data } = await octokit.repos.getContent({
        owner: 'carbon-design-system',
        repo: 'carbon',
        path: 'packages/react/package.json'
      });
      const content = Buffer.from(data.content, 'base64').toString();
      const pkg = JSON.parse(content);
      return pkg.version;
    } catch (fallbackError) {
      console.error('Fallback version fetch failed:', fallbackError.message);
      return 'unknown';
    }
  }
}

/**
 * Fetch the commit SHA for the latest release tag
 */
async function fetchLatestReleaseCommitSHA() {
  try {
    // Get latest release
    const { data: release } = await octokit.repos.getLatestRelease({
      owner: 'carbon-design-system',
      repo: 'carbon'
    });
    
    // Get the tag reference
    const { data: tag } = await octokit.git.getRef({
      owner: 'carbon-design-system',
      repo: 'carbon',
      ref: `tags/${release.tag_name}`
    });
    
    // The tag object contains the commit SHA
    // If it's an annotated tag, tag.object.sha points to the tag object, not commit
    // We need to get the commit that the tag points to
    let commitSha = tag.object.sha;
    
    // If it's an annotated tag, we need to dereference it
    if (tag.object.type === 'tag') {
      const { data: tagObject } = await octokit.git.getTag({
        owner: 'carbon-design-system',
        repo: 'carbon',
        tag_sha: tag.object.sha
      });
      commitSha = tagObject.object.sha;
    }
    
    // Get the actual commit
    const { data: commit } = await octokit.repos.getCommit({
      owner: 'carbon-design-system',
      repo: 'carbon',
      ref: commitSha
    });
    
    return {
      sha: commitSha,
      date: commit.commit.committer.date,
      message: commit.commit.message.split('\n')[0],
      tag: release.tag_name
    };
  } catch (error) {
    console.error('Error fetching release commit:', error.message);
    return null;
  }
}

/**
 * Fetch commits for a specific component between two SHAs
 */
async function fetchComponentChanges(componentName, sinceSHA) {
  if (!sinceSHA) return [];
  
  try {
    const { data } = await octokit.repos.listCommits({
      owner: 'carbon-design-system',
      repo: 'carbon',
      path: `packages/react/src/components/${componentName}`,
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
    console.error(`Error fetching changes for ${componentName}:`, error.message);
    return [];
  }
}

/**
 * Check if a component has been updated since last check
 */
async function checkComponentUpdates(componentName, lastCheckedSHA) {
  const changes = await fetchComponentChanges(componentName, lastCheckedSHA);
  return {
    hasChanges: changes.length > 0,
    changeCount: changes.length,
    latestCommit: changes[0] || null,
    commits: changes.slice(0, 5) // Keep only last 5 for report
  };
}

/**
 * Fetch React component list from GitHub API
 */
async function fetchReactComponents() {
  try {
    const { data } = await octokit.repos.getContent({
      owner: 'carbon-design-system',
      repo: 'carbon',
      path: 'packages/react/src/components'
    });
    
    return data
      .filter(item => item.type === 'dir')
      .map(item => item.name)
      .sort();
  } catch (error) {
    console.error('Error fetching React components:', error.message);
    return [];
  }
}

/**
 * Get Ember components from index.ts
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
 * Scrape Storybook for component details
 */
async function scrapeStorybookComponents() {
  // This would require a headless browser, but for now we'll use a simpler approach
  // by fetching the stories.json file if available
  try {
    const response = await fetch('https://react.carbondesignsystem.com/stories.json');
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
    console.error('Error scraping Storybook:', error.message);
    return [];
  }
}

/**
 * Load previous parity check data
 */
async function loadParityData() {
  try {
    const content = await fs.readFile(PARITY_DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return {
      lastCheckedVersion: null,
      lastCheckDate: null,
      components: {}
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
 * Load component exclusions (React components intentionally not tracked for parity)
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
 * Compare component lists and identify changes
 */
async function compareComponents(reactComponents, emberComponents, previousData, currentCommitSHA) {
  const missing = reactComponents.filter(c => !emberComponents.includes(c));
  const implemented = reactComponents.filter(c => emberComponents.includes(c));
  const extra = emberComponents.filter(c => !reactComponents.includes(c));
  
  // Identify new components since last check
  const newComponents = [];
  if (previousData.components?.react) {
    newComponents.push(...reactComponents.filter(c => !previousData.components.react.includes(c)));
  }
  
  // Check for outdated components (implemented but React version changed)
  const outdatedComponents = [];
  const componentMetadata = {};
  
  if (previousData.lastCheckedCommitSHA && currentCommitSHA !== previousData.lastCheckedCommitSHA) {
    console.log('\nChecking for component updates...');
    
    for (const component of implemented) {
      const storedLastSyncedCommit = previousData.componentMetadata?.[component]?.lastSyncedCommit;
      const lastSyncedSHA = (storedLastSyncedCommit && storedLastSyncedCommit !== 'N/A') ? storedLastSyncedCommit : previousData.lastCheckedCommitSHA;
      const updateInfo = await checkComponentUpdates(component, lastSyncedSHA);
      
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
      const hasExistingMetadata = previousData.componentMetadata?.[component] !== undefined;

      componentMetadata[component] = {
        lastCheckedCommit: currentCommitSHA,
        lastSyncedCommit: hasExistingMetadata ? previousData.componentMetadata[component].lastSyncedCommit : 'N/A',
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
    parity: Math.round((implemented.length / reactComponents.length) * 100)
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
async function createGitHubIssue(componentName, version, commitSHA, existingTitles) {
  const [owner, repo] = process.env.GITHUB_REPOSITORY?.split('/') || ['', ''];

  if (!owner || !repo) {
    console.log(`Would create issue for: ${componentName} (no GITHUB_REPOSITORY set)`);
    return null;
  }

  const title = `[Parity Check] Investigate ${componentName} component`;
  const body = `## Component Parity Investigation

**Component**: ${componentName}
**Carbon React Version**: ${version}
**Commit**: ${commitSHA?.substring(0, 7) || 'unknown'}
**Status**: Missing in Ember implementation

### Investigation Tasks

- [ ] Review React implementation: https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components/${componentName}
- [ ] Check Storybook examples: https://react.carbondesignsystem.com/?path=/docs/components-${componentName.toLowerCase()}--overview
- [ ] Document component API (props, events, variants)
- [ ] Assess implementation complexity
- [ ] Determine priority (High/Medium/Low)
- [ ] Create implementation plan or decide to skip

### Resources

- [Carbon React Component](https://github.com/carbon-design-system/carbon/tree/${commitSHA || 'main'}/packages/react/src/components/${componentName})
- [Storybook Documentation](https://react.carbondesignsystem.com/)
- [Carbon Design System](https://carbondesignsystem.com/)

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
async function createOutdatedComponentIssue(componentInfo, version, commitSHA, existingTitles) {
  const [owner, repo] = process.env.GITHUB_REPOSITORY?.split('/') || ['', ''];

  if (!owner || !repo) {
    console.log(`Would create issue for outdated: ${componentInfo.name} (no GITHUB_REPOSITORY set)`);
    return null;
  }

  const title = `[Parity Check] Update ${componentInfo.name} component`;
  
  const commitsList = componentInfo.commits.map(commit => 
    `- [\`${commit.sha.substring(0, 7)}\`](${commit.html_url}) ${commit.commit.message.split('\n')[0]}`
  ).join('\n');
  
  const body = `## Component Update Required

**Component**: ${componentInfo.name}
**Carbon React Version**: ${version}
**Latest Commit**: ${commitSHA?.substring(0, 7) || 'unknown'}
**Changes Detected**: ${componentInfo.changeCount} commits since last sync

### Recent Changes in React

${commitsList}

${componentInfo.changeCount > 5 ? `\n*...and ${componentInfo.changeCount - 5} more commits*\n` : ''}

### Investigation Tasks

- [ ] Review recent changes in React implementation
- [ ] Compare with current Ember implementation
- [ ] Identify new props, features, or bug fixes
- [ ] Update Ember component to match
- [ ] Update tests
- [ ] Update documentation

### Resources

- [Carbon React Component](https://github.com/carbon-design-system/carbon/tree/${commitSHA || 'main'}/packages/react/src/components/${componentInfo.name})
- [Component Commits](https://github.com/carbon-design-system/carbon/commits/main/packages/react/src/components/${componentInfo.name})
- [Storybook Documentation](https://react.carbondesignsystem.com/)

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
 * Generate parity report
 */
async function generateReport(comparison, version, commitInfo) {
  const report = `# Component Parity Report
Generated: ${new Date().toISOString()}
Carbon React Version: ${version}
Latest Commit: ${commitInfo?.sha?.substring(0, 7) || 'unknown'} (${commitInfo?.date || 'unknown'})

## Summary
- Total React Components: ${comparison.implemented.length + comparison.missing.length}
- Total Ember Components: ${comparison.implemented.length + comparison.extra.length}
- Parity: ${comparison.parity}%
- Outdated Components: ${comparison.outdatedComponents?.length || 0}

## Missing in Ember (${comparison.missing.length})
${comparison.missing.map(c => `- [ ] ${c}`).join('\n')}

## Implemented in Both (${comparison.implemented.length})
${comparison.implemented.map(c => `- [x] ${c}`).join('\n')}

${comparison.outdatedComponents && comparison.outdatedComponents.length > 0 ? `
## Outdated Components (${comparison.outdatedComponents.length})
These components exist in Ember but have updates in React that need to be synced:

${comparison.outdatedComponents.map(c => `- [ ] ${c.name} (${c.changeCount} changes)`).join('\n')}
` : ''}

## Ember-Specific (${comparison.extra.length})
${comparison.extra.map(c => `- ${c}`).join('\n')}

${comparison.newComponents.length > 0 ? `
## New Components Since Last Check (${comparison.newComponents.length})
${comparison.newComponents.map(c => `- ${c}`).join('\n')}
` : ''}
`;

  const reportPath = path.join(ROOT_DIR, 'PARITY_REPORT.md');
  await fs.writeFile(reportPath, report);
  console.log(`Report generated: PARITY_REPORT.md`);
  
  return report;
}

/**
 * Mark components as synced (update lastSyncedCommit to current release)
 */
async function markComponentsSynced(componentNames) {
  const previousData = await loadParityData();
  const currentCommitInfo = await fetchLatestReleaseCommitSHA();
  
  if (!currentCommitInfo) {
    console.error('Failed to fetch current release commit');
    return;
  }
  
  const updated = [];
  const notFound = [];
  
  for (const componentName of componentNames) {
    if (previousData.componentMetadata?.[componentName]) {
      previousData.componentMetadata[componentName].lastSyncedCommit = currentCommitInfo.sha;
      previousData.componentMetadata[componentName].hasChanges = false;
      previousData.componentMetadata[componentName].changeCount = 0;
      updated.push(componentName);
    } else {
      notFound.push(componentName);
    }
  }
  
  if (updated.length > 0) {
    await saveParityData(previousData);
    console.log(`✅ Marked as synced (${currentCommitInfo.sha.substring(0, 7)}):`);
    updated.forEach(name => console.log(`   - ${name}`));
  }
  
  if (notFound.length > 0) {
    console.log(`\n⚠️  Not found in metadata:`);
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
 * Main execution
 */
async function main() {
  // Check for --mark-synced flag
  const markSyncedIndex = process.argv.indexOf('--mark-synced');
  if (markSyncedIndex !== -1 && process.argv[markSyncedIndex + 1]) {
    const components = process.argv[markSyncedIndex + 1].split(',').map(s => s.trim());
    await markComponentsSynced(components);
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

  console.log('Starting Carbon Components Parity Check...\n');
  
  // Load previous data
  const previousData = await loadParityData();
  console.log(`Last checked version: ${previousData.lastCheckedVersion || 'Never'}`);
  console.log(`Last checked commit: ${previousData.lastCheckedCommitSHA?.substring(0, 7) || 'Never'}`);
  
  // Fetch current version and commit
  const currentVersion = await fetchLatestCarbonVersion();
  console.log(`Current Carbon React version: ${currentVersion}`);
  
  const currentCommitInfo = await fetchLatestReleaseCommitSHA();
  console.log(`Current release commit: ${currentCommitInfo?.sha?.substring(0, 7) || 'unknown'} (${currentCommitInfo?.tag || 'unknown'}, ${currentCommitInfo?.date || 'unknown'})\n`);
  
  // Fetch component lists
  console.log('Fetching React components from GitHub...');
  const reactComponents = await fetchReactComponents();
  console.log(`Found ${reactComponents.length} React components`);
  
  console.log('Fetching React components from Storybook...');
  const storybookComponents = await scrapeStorybookComponents();
  console.log(`Found ${storybookComponents.length} components in Storybook`);
  
  // Merge and deduplicate
  const mergedReactComponents = Array.from(new Set([...reactComponents, ...storybookComponents])).sort();
  console.log(`Total unique React components: ${mergedReactComponents.length}`);

  // Drop components that were deliberately excluded from parity tracking
  // (doesn't make sense in an Ember context, or already covered by another component)
  const exclusions = await loadExclusions();
  const excludedNames = Object.keys(exclusions);
  const allReactComponents = mergedReactComponents.filter(c => !excludedNames.includes(c));
  if (excludedNames.length > 0) {
    console.log(`Excluding ${excludedNames.length} component(s) from tracking: ${excludedNames.join(', ')}`);
  }

  console.log('Reading Ember components...');
  const emberComponents = await getEmberComponents();
  console.log(`Found ${emberComponents.length} Ember components\n`);
  
  // Compare (now async to check for updates)
  const comparison = await compareComponents(
    allReactComponents, 
    emberComponents, 
    previousData,
    currentCommitInfo?.sha
  );
  
  console.log('\n=== Comparison Results ===');
  console.log(`Parity: ${comparison.parity}%`);
  console.log(`Missing: ${comparison.missing.length}`);
  console.log(`Implemented: ${comparison.implemented.length}`);
  console.log(`Outdated: ${comparison.outdatedComponents?.length || 0}`);
  console.log(`Ember-specific: ${comparison.extra.length}`);
  console.log(`New since last check: ${comparison.newComponents.length}\n`);
  
  // Generate report
  await generateReport(comparison, currentVersion, currentCommitInfo);
  
  // Create issues for new/missing/outdated components
  const commitChanged = previousData.lastCheckedCommitSHA !== currentCommitInfo?.sha;
  const versionChanged = previousData.lastCheckedVersion !== currentVersion;
  const shouldCreateIssues = process.env.CREATE_ISSUES === 'true' || process.argv.includes('--create-issues');
  
  if (shouldCreateIssues) {
    console.log('\n=== Creating GitHub Issues ===');

    const [owner, repo] = process.env.GITHUB_REPOSITORY?.split('/') || ['', ''];
    const existingTitles = (owner && repo)
      ? await fetchOpenParityIssueTitles(owner, repo)
      : new Set();

    // Create issues for missing components (new or all if version changed)
    const componentsToInvestigate = versionChanged ? comparison.missing : comparison.newComponents;

    if (componentsToInvestigate.length > 0) {
      console.log(`Creating issues for ${componentsToInvestigate.length} missing components...`);
      for (const component of componentsToInvestigate) {
        await createGitHubIssue(component, currentVersion, currentCommitInfo?.sha, existingTitles);
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Create issues for outdated components
    if (comparison.outdatedComponents && comparison.outdatedComponents.length > 0) {
      console.log(`Creating issues for ${comparison.outdatedComponents.length} outdated components...`);
      for (const componentInfo of comparison.outdatedComponents) {
        await createOutdatedComponentIssue(componentInfo, currentVersion, currentCommitInfo?.sha, existingTitles);
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  // Save current state with enhanced metadata
  const newData = {
    lastCheckedVersion: currentVersion,
    lastCheckedCommitSHA: currentCommitInfo?.sha,
    lastCheckedCommitDate: currentCommitInfo?.date,
    lastCheckDate: new Date().toISOString(),
    components: {
      react: allReactComponents,
      ember: emberComponents,
      missing: comparison.missing,
      implemented: comparison.implemented,
      outdated: comparison.outdatedComponents?.map(c => c.name) || []
    },
    componentMetadata: comparison.componentMetadata || {}
  };
  
  await saveParityData(newData);
  console.log('\nParity check data saved.');
  console.log('Done!');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
