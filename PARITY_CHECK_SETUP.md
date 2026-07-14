# Parity Check System Setup

This document describes the automated parity check system for maintaining feature parity between Carbon Components Ember and Carbon Components React.

## Overview

The system consists of three main components:

1. **Parity Check Script** (`scripts/parity-check.mjs`) - Compares component lists and tracks versions
2. **Weekly Parity Check Workflow** (`.github/workflows/parity-check-weekly.yml`) - Runs every Monday to check for new components
3. **Daily Parity Fix Workflow** (`.github/workflows/parity-fix-daily.yml`) - Processes 3 parity-check issues daily with automated fixes

## Features

### 1. Component List Comparison (Option 1)
- Fetches Carbon React component list from GitHub API
- Compares with Ember components from `src/components/index.ts`
- Generates parity report with missing, implemented, and Ember-specific components

### 2. Storybook Scraper (Option 2)
- Scrapes React Storybook's `stories.json` for detailed component information
- Extracts component names and variants
- Merges with GitHub API results for comprehensive coverage

### 3. Version Tracking
- Stores last checked Carbon React version in `.parity-check-data.json`
- Detects version changes and identifies new components
- Tracks component status over time

### 4. Automated Issue Creation
- Creates GitHub issues with `parity-check` label for missing components
- Issues include investigation tasks and resource links
- Prevents duplicate issues for the same component

### 5. Visual Comparison
- Takes screenshots of React Storybook components using Playwright
- Provides visual reference for implementation
- Stores screenshots as workflow artifacts

### 6. Automated Fixes
- Bob-Shell processes up to 3 issues daily
- Investigates component differences
- Attempts to fix discrepancies automatically
- Creates PRs for fixes and links them to issues

## Workflows

### Weekly Parity Check (`parity-check-weekly.yml`)

**Schedule**: Every Monday at 9:00 AM UTC

**Actions**:
1. Runs `scripts/parity-check.mjs` with `CREATE_ISSUES=true`
2. Generates `PARITY_REPORT.md`
3. Creates GitHub issues for new/missing components
4. Commits `.parity-check-data.json` to track state
5. Uploads parity report as artifact

**Manual Trigger**: Available via workflow_dispatch

### Daily Parity Fix (`parity-fix-daily.yml`)

**Schedule**: Every day at 10:00 AM UTC

**Actions**:
1. Fetches up to 3 open issues with `parity-check` label
2. For each issue:
   - Extracts component name
   - Takes screenshot of React Storybook
   - Prepares context file with investigation tasks
   - Runs Bob-Shell to investigate and fix
   - Updates issue with findings
   - Creates PR if fixes were made
3. Commits and pushes any changes
4. Uploads screenshots as artifacts

**Manual Trigger**: Available via workflow_dispatch

## File Structure

```
carbon-components-ember/
├── .github/
│   └── workflows/
│       ├── parity-check-weekly.yml    # Weekly parity check
│       ├── parity-fix-daily.yml       # Daily automated fixes
│       └── dispatch-bob-shell.yml     # Manual PR interactions (updated)
├── scripts/
│   ├── parity-check.mjs               # Main parity check script
│   └── package.json                   # Script dependencies
├── .parity-check-data.json            # Version tracking data (auto-generated)
├── PARITY_REPORT.md                   # Latest parity report (auto-generated)
└── PARITY_CHECK_SETUP.md              # This file
```

## Setup Instructions

### Prerequisites

1. **GitHub Token**: Workflows use `GITHUB_TOKEN` (automatically provided)
2. **Bob-Shell API Keys**: Required secrets:
   - `BOBSHELL_API_KEY_1`
   - `BOBSHELL_API_KEY_2`
3. **Repository Permissions**: Workflows need:
   - `contents: write` - To commit parity data
   - `issues: write` - To create and update issues
   - `pull-requests: write` - To create PRs

### Installation

1. **Install Script Dependencies**:
   ```bash
   cd scripts
   npm install
   ```

2. **Run Manual Parity Check** (optional):
   ```bash
   npm run check-parity
   ```

3. **Create Issues Manually** (optional):
   ```bash
   npm run check-parity:create-issues
   ```

### Configuration

#### Adjust Schedule

Edit workflow files to change schedule:

```yaml
on:
  schedule:
    - cron: '0 9 * * 1'  # Change time/day here
```

#### Change Issue Limit

In `parity-fix-daily.yml`, modify the `--limit` parameter:

```bash
gh issue list --limit 3  # Change to process more/fewer issues
```

#### Customize Screenshot Settings

In `parity-fix-daily.yml`, adjust viewport size:

```javascript
viewport: { width: 1280, height: 720 }  // Modify dimensions
```

## Usage

### Manual Parity Check

Run the script locally:

```bash
cd scripts
npm run check-parity
```

This generates `PARITY_REPORT.md` without creating issues.

### Create Issues Manually

```bash
cd scripts
npm run check-parity:create-issues
```

This creates GitHub issues for all missing components.

### Trigger Workflows Manually

Via GitHub UI:
1. Go to Actions tab
2. Select workflow (Weekly Parity Check or Daily Parity Fix)
3. Click "Run workflow"

Via GitHub CLI:
```bash
gh workflow run parity-check-weekly.yml
gh workflow run parity-fix-daily.yml
```

### Review Parity Issues

```bash
gh issue list --label parity-check
```

### View Parity Report

```bash
cat PARITY_REPORT.md
```

Or download from workflow artifacts:
1. Go to Actions tab
2. Select workflow run
3. Download "parity-report" artifact

## Data Files

### `.parity-check-data.json`

Tracks parity check state:

```json
{
  "lastCheckedVersion": "11.50.0",
  "lastCheckDate": "2026-02-26T09:00:00.000Z",
  "components": {
    "react": ["Accordion", "Button", ...],
    "ember": ["Accordion", "Button", ...],
    "missing": ["ComboBox", "DatePicker", ...],
    "implemented": ["Accordion", "Button", ...]
  }
}
```

### `PARITY_REPORT.md`

Generated report with:
- Summary statistics
- Missing components checklist
- Implemented components checklist
- Ember-specific components
- New components since last check

## Issue Labels

- `parity-check` - Main label for parity investigation issues
- `enhancement` - Additional label indicating feature request

## Troubleshooting

### Script Fails to Fetch Components

**Problem**: GitHub API rate limiting or network issues

**Solution**:
- Ensure `GITHUB_TOKEN` is set
- Check GitHub API status
- Wait and retry (rate limits reset hourly)

### Screenshots Fail

**Problem**: Playwright not installed or Storybook URL changed

**Solution**:
- Verify Playwright installation: `npx playwright --version`
- Check Storybook URL is accessible
- Update URL in `parity-fix-daily.yml` if needed

### Bob-Shell Fails

**Problem**: API key issues or task complexity

**Solution**:
- Verify `BOBSHELL_API_KEY_1` and `BOBSHELL_API_KEY_2` secrets
- Check Bob-Shell logs in workflow run
- Simplify task or run manually

### No Issues Created

**Problem**: All components already have issues or no new components

**Solution**:
- Check if issues already exist: `gh issue list --label parity-check`
- Verify version changed: `cat .parity-check-data.json`
- Run with `--create-issues` flag manually

## Maintenance

### Weekly Tasks

- Review parity report
- Prioritize missing components
- Close completed parity-check issues

### Monthly Tasks

- Review automated fix quality
- Update component priorities
- Adjust workflow schedules if needed

### Quarterly Tasks

- Review overall parity percentage
- Plan implementation sprints for missing components
- Update documentation

## Integration with Existing Workflows

### dispatch-bob-shell.yml

Updated to include Playwright for screenshot capabilities. Can now handle parity-check tasks when invoked via `@bob-shell` comments.

### Example Usage in PRs

Comment on a PR:
```
@bob-shell Check parity for the Button component and fix any issues
```

Bob-Shell will:
1. Take screenshots of React Storybook
2. Compare with Ember implementation
3. Fix discrepancies
4. Commit changes to the PR

## Future Enhancements

Potential improvements:
- API surface comparison (Option 3 from PARITY_CHECK.md)
- Visual regression testing (Option 4)
- Automated priority assignment based on component usage
- Integration with project planning tools
- Slack/email notifications for new components

## Resources

- [Carbon React Repository](https://github.com/carbon-design-system/carbon/tree/main/packages/react)
- [Carbon Storybook](https://react.carbondesignsystem.com/)
- [Carbon Design System](https://carbondesignsystem.com/)
- [Bob-Shell Documentation](https://github.com/ibm/bob-shell)
- [Playwright Documentation](https://playwright.dev/)

## Support

For issues or questions:
1. Check workflow logs in Actions tab
2. Review this documentation
3. Check existing parity-check issues
4. Create a new issue with `parity-check` label

---

Last Updated: 2026-02-26
