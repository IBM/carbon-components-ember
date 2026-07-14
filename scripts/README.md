# Scripts

This directory contains utility scripts for maintaining the carbon-components-ember project.

## Parity Check Scripts

### parity-check.mjs

Automated script that compares carbon-components-ember with Carbon React to identify missing components.

**Usage:**
```bash
cd scripts
npm install
npm run check-parity
```

**Features:**
- Fetches component list from Carbon React GitHub
- Compares with Ember implementation
- Generates parity report (PARITY_REPORT.md)
- **Tracks commit SHAs** to detect component updates
- **Detects outdated components** when React components change
- Tracks per-component metadata (.parity-check-data.json)
- Can create GitHub issues for missing and outdated components

**Environment Variables:**
- `GITHUB_TOKEN` - GitHub personal access token (required for API access)
- `CREATE_ISSUES` - Set to 'true' to automatically create issues (default: false)

### fix-parity-issue.sh

Local script to investigate and fix parity issues using Bob Shell.

**Prerequisites:**
- [Bob Shell](https://bob-shell.dev) installed (`bob` command available)
- [GitHub CLI](https://cli.github.com/) installed (`gh` command)
- Node.js and npm
- Playwright (will be installed automatically if missing)

**Usage:**
```bash
./scripts/fix-parity-issue.sh <issue_number>
```

**Example:**
```bash
./scripts/fix-parity-issue.sh 123
```

**What it does:**
1. Fetches issue details from GitHub
2. Extracts component name from issue title
3. Takes screenshot of React Storybook for visual reference
4. Generates context file with investigation tasks
5. Runs Bob Shell with structured prompt
6. Bob Shell will:
   - Review React implementation
   - Compare with Ember implementation (if exists)
   - Fix discrepancies or implement missing component
   - Create PR and link to issue
   - Add 'preview' label for deployment

**Output:**
- Screenshot: `/tmp/screenshots/<ComponentName>-react.png`
- Context file: `/tmp/component-context-<issue_number>.md`
- Bob Shell will create commits and PR automatically

**Tips:**
- Review AGENTS.md for component implementation patterns
- Check .github/workflows/templates/bob-shell-prompt.md for the structured prompt
- The script uses the same prompt template as the automated workflow
- You can modify the prompt template to customize Bob Shell's behavior

## Workflow Integration

### Weekly Parity Check (Automated)

The `parity-check-weekly.yml` workflow runs every Monday at 9:00 AM UTC:
- Runs `parity-check.mjs` with `CREATE_ISSUES=true`
- Creates GitHub issues for missing components
- Commits parity data to repository
- Uploads parity report as artifact

### Local Development Workflow

1. **Check for missing components:**
   ```bash
   cd scripts
   npm run check-parity
   cat ../PARITY_REPORT.md
   ```

2. **Pick an issue to work on:**
   ```bash
   gh issue list --label parity-check
   ```

3. **Fix the issue locally:**
   ```bash
   ./scripts/fix-parity-issue.sh <issue_number>
   ```

4. **Review and test:**
   ```bash
   cd carbon-components-ember
   pnpm build
   cd ../test-app
   pnpm test
   ```

5. **Push and create PR:**
   - Bob Shell will handle this automatically
   - Or manually: `git push && gh pr create`

## Maintenance

### Updating Dependencies

```bash
cd scripts
npm update
```

### Testing Parity Check Locally

```bash
cd scripts
npm install
GITHUB_TOKEN=your_token node parity-check.mjs
```

### Marking Components as Synced

After updating Ember components to match React changes, mark them as synced:

```bash
cd scripts
node parity-check.mjs --mark-synced ComponentName
# Or multiple components:
node parity-check.mjs --mark-synced Button,Accordion,DataTable
```

This updates `lastSyncedCommit` to the current release commit, removing them from the "outdated" list.

### How Parity Tracking Works

The enhanced parity check now tracks changes at the commit level:

1. **Initial Run**: Records current commit SHA for React components directory
2. **Subsequent Runs**: 
   - Fetches latest commit SHA
   - If changed, checks each implemented component for updates
   - Uses GitHub API to get commit history per component
   - Identifies components with changes since last sync
3. **Issue Creation**:
   - Missing components → "Investigate" issues
   - Outdated components → "Update" issues with commit details
4. **Metadata Storage**: `.parity-check-data.json` stores:
   - Last checked commit SHA
   - Per-component metadata (lastSyncedCommit, lastCheckedCommit)
   - Change counts and update dates

**Benefits:**
- Detects when React components get new features/fixes
- Creates targeted update issues with commit links
- Tracks sync status per component
- No manual version comparison needed

### Debugging Bob Shell Script

Add `set -x` at the top of `fix-parity-issue.sh` to see detailed execution:

```bash
#!/bin/bash
set -x  # Add this line
set -euo pipefail
```

## Related Documentation

- [AGENTS.md](../AGENTS.md) - Component implementation patterns for AI agents
- [PARITY_CHECK.md](../PARITY_CHECK.md) - Detailed parity maintenance strategy
- [.github/workflows/templates/bob-shell-prompt.md](../.github/workflows/templates/bob-shell-prompt.md) - Structured prompt template
