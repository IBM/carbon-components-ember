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
 * Compare component lists and identify changes
 */
function compareComponents(reactComponents, emberComponents, previousData) {
  const missing = reactComponents.filter(c => !emberComponents.includes(c));
  const implemented = reactComponents.filter(c => emberComponents.includes(c));
  const extra = emberComponents.filter(c => !reactComponents.includes(c));
  
  // Identify new components since last check
  const newComponents = [];
  if (previousData.components.react) {
    newComponents.push(...reactComponents.filter(c => !previousData.components.react.includes(c)));
  }
  
  return {
    missing,
    implemented,
    extra,
    newComponents,
    parity: Math.round((implemented.length / reactComponents.length) * 100)
  };
}

/**
 * Create GitHub issue for a missing component
 */
async function createGitHubIssue(componentName, version) {
  const [owner, repo] = process.env.GITHUB_REPOSITORY?.split('/') || ['', ''];
  
  if (!owner || !repo) {
    console.log(`Would create issue for: ${componentName} (no GITHUB_REPOSITORY set)`);
    return null;
  }
  
  const title = `[Parity Check] Investigate ${componentName} component`;
  const body = `## Component Parity Investigation

**Component**: ${componentName}
**Carbon React Version**: ${version}
**Status**: Missing in Ember implementation

### Investigation Tasks

- [ ] Review React implementation: https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components/${componentName}
- [ ] Check Storybook examples: https://react.carbondesignsystem.com/?path=/docs/components-${componentName.toLowerCase()}--overview
- [ ] Document component API (props, events, variants)
- [ ] Assess implementation complexity
- [ ] Determine priority (High/Medium/Low)
- [ ] Create implementation plan or decide to skip

### Resources

- [Carbon React Component](https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components/${componentName})
- [Storybook Documentation](https://react.carbondesignsystem.com/)
- [Carbon Design System](https://carbondesignsystem.com/)

---
*Auto-generated by parity-check script on ${new Date().toISOString()}*
`;

  try {
    // Check if issue already exists
    const { data: existingIssues } = await octokit.issues.listForRepo({
      owner,
      repo,
      labels: GITHUB_LABEL,
      state: 'open'
    });
    
    const exists = existingIssues.some(issue => 
      issue.title.includes(componentName)
    );
    
    if (exists) {
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
    return issue;
  } catch (error) {
    console.error(`Error creating issue for ${componentName}:`, error.message);
    return null;
  }
}

/**
 * Generate parity report
 */
async function generateReport(comparison, version) {
  const report = `# Component Parity Report
Generated: ${new Date().toISOString()}
Carbon React Version: ${version}

## Summary
- Total React Components: ${comparison.implemented.length + comparison.missing.length}
- Total Ember Components: ${comparison.implemented.length + comparison.extra.length}
- Parity: ${comparison.parity}%

## Missing in Ember (${comparison.missing.length})
${comparison.missing.map(c => `- [ ] ${c}`).join('\n')}

## Implemented in Both (${comparison.implemented.length})
${comparison.implemented.map(c => `- [x] ${c}`).join('\n')}

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
 * Main execution
 */
async function main() {
  console.log('Starting Carbon Components Parity Check...\n');
  
  // Load previous data
  const previousData = await loadParityData();
  console.log(`Last checked version: ${previousData.lastCheckedVersion || 'Never'}`);
  
  // Fetch current version
  const currentVersion = await fetchLatestCarbonVersion();
  console.log(`Current Carbon React version: ${currentVersion}\n`);
  
  // Fetch component lists
  console.log('Fetching React components from GitHub...');
  const reactComponents = await fetchReactComponents();
  console.log(`Found ${reactComponents.length} React components`);
  
  console.log('Fetching React components from Storybook...');
  const storybookComponents = await scrapeStorybookComponents();
  console.log(`Found ${storybookComponents.length} components in Storybook`);
  
  // Merge and deduplicate
  const allReactComponents = Array.from(new Set([...reactComponents, ...storybookComponents])).sort();
  console.log(`Total unique React components: ${allReactComponents.length}`);
  
  console.log('Reading Ember components...');
  const emberComponents = await getEmberComponents();
  console.log(`Found ${emberComponents.length} Ember components\n`);
  
  // Compare
  const comparison = compareComponents(allReactComponents, emberComponents, previousData);
  
  console.log('=== Comparison Results ===');
  console.log(`Parity: ${comparison.parity}%`);
  console.log(`Missing: ${comparison.missing.length}`);
  console.log(`Implemented: ${comparison.implemented.length}`);
  console.log(`Ember-specific: ${comparison.extra.length}`);
  console.log(`New since last check: ${comparison.newComponents.length}\n`);
  
  // Generate report
  await generateReport(comparison, currentVersion);
  
  // Create issues for new/missing components if version changed
  const versionChanged = previousData.lastCheckedVersion !== currentVersion;
  const shouldCreateIssues = process.env.CREATE_ISSUES === 'true' || process.argv.includes('--create-issues');
  
  if (shouldCreateIssues && (versionChanged || comparison.newComponents.length > 0)) {
    console.log('\n=== Creating GitHub Issues ===');
    const componentsToInvestigate = versionChanged ? comparison.missing : comparison.newComponents;
    
    for (const component of componentsToInvestigate) {
      await createGitHubIssue(component, currentVersion);
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Save current state
  const newData = {
    lastCheckedVersion: currentVersion,
    lastCheckDate: new Date().toISOString(),
    components: {
      react: allReactComponents,
      ember: emberComponents,
      missing: comparison.missing,
      implemented: comparison.implemented
    }
  };
  
  await saveParityData(newData);
  console.log('\nParity check data saved.');
  console.log('Done!');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
