#!/bin/bash
set -euo pipefail

# Change to script directory so it can be run from anywhere
cd "$(dirname "$0")"

# Local Parity Fix Script
# This script helps fix parity issues locally using Agent
# Usage: ./scripts/fix-parity-issue.sh [issue_number]

ISSUE_NUMBER="${1:-}"

# All temporary/generated files are kept locally under scripts/tmp instead of /tmp
TMP_DIR="./tmp"
mkdir -p "$TMP_DIR"

# Check for required tools
command -v gh >/dev/null 2>&1 || { echo "Error: GitHub CLI (gh) is required but not installed."; exit 1; }

if [ -z "$ISSUE_NUMBER" ]; then
  echo "No issue or PR number provided. Checking for work to do..."
  echo ""

  # First, check for open PRs explicitly flagged for review via the "review" label
  echo "Checking for open parity-check PRs labeled 'review'..."

  # Get all open PRs that have BOTH the parity-check and review labels
  PRS_FOR_REVIEW=$(gh pr list --state open --label "parity-check" --label "review" --limit 100 --json number --jq '.[].number')

  if [ -n "$PRS_FOR_REVIEW" ]; then
    # Count PRs labeled for review
    PR_COUNT=$(echo "$PRS_FOR_REVIEW" | wc -l | tr -d ' ')
    echo "Found $PR_COUNT open PR(s) labeled 'review'"

    # Randomly select one PR labeled for review
    SELECTED_PR=$(echo "$PRS_FOR_REVIEW" | shuf -n 1)
    
    echo "Randomly selected PR #$SELECTED_PR for review"
    echo ""
    
    # Get PR details
    PR_JSON=$(gh pr view "$SELECTED_PR" --json number,title,body,comments,reviews)
    PR_TITLE=$(echo "$PR_JSON" | jq -r '.title')
    
    echo "PR: $PR_TITLE"
    echo ""
    
    # Create PR review file
    PR_REVIEW_FILE="$TMP_DIR/pr-review-${SELECTED_PR}.md"
    echo "# PR Review: #$SELECTED_PR" > "$PR_REVIEW_FILE"
    echo "" >> "$PR_REVIEW_FILE"
    echo "## PR Details" >> "$PR_REVIEW_FILE"
    echo "$PR_JSON" | jq '{number,title,body,comments: [.comments[] | {author: .author.login, body: .body, createdAt: .createdAt}], reviews: [.reviews[] | {author: .author.login, state: .state, body: .body}]}' >> "$PR_REVIEW_FILE"
    
    echo "PR review file created: $PR_REVIEW_FILE"
    echo ""
    
    # Checkout the PR branch
    echo "Checking out PR #$SELECTED_PR..."
    gh pr checkout "$SELECTED_PR"
    
    REVIEW_PROMPT="Review and address feedback on PR #$SELECTED_PR

PR Details: @$PR_REVIEW_FILE

Your task:
1. Read the PR details, comments, and review feedback
2. Understand what changes were requested
3. Check the current state of the code
4. Address all feedback and requested changes
5. Run tests to ensure everything works
6. Commit and push your fixes
7. Comment on the PR summarizing what you fixed

Be thorough and address all review comments."

    echo "Starting Agent to review PR..."
    echo "---"
    
    # Run the agent
    RETRY_DELAY=600
    ATTEMPT=1
    
    until claude --dangerously-skip-permissions -p "$REVIEW_PROMPT"; do
      echo "Agent attempt $ATTEMPT failed. Retrying in ${RETRY_DELAY}s..."
      ATTEMPT=$((ATTEMPT + 1))
      sleep "$RETRY_DELAY"
    done
    
    echo ""
    echo "---"
    echo "PR review completed! Removing 'review' label from PR #$SELECTED_PR..."
    gh pr edit "$SELECTED_PR" --remove-label "review"
    exit 0
  fi

  echo "No open PRs labeled 'review' found. Looking for issues to work on..."
  echo ""

  # Get all open issues with parity-check label
  PARITY_ISSUES=$(gh issue list --label "parity-check" --state open --json number --jq '.[].number')

  if [ -z "$PARITY_ISSUES" ]; then
    echo "Error: No open issues found with label 'parity-check'"
    echo ""
    echo "Usage: ./scripts/fix-parity-issue.sh [issue_number]"
    echo ""
    echo "Example: ./scripts/fix-parity-issue.sh 123"
    echo ""
    echo "If no issue number is provided, the script will:"
    echo "  1. First check for open PRs labeled 'review' that need review"
    echo "  2. If none found, select a random issue with label 'parity-check'"
    exit 1
  fi

  # Select a random issue from the list
  ISSUE_NUMBER=$(echo "$PARITY_ISSUES" | shuf -n 1)

  echo "Selected random issue: #$ISSUE_NUMBER"
  echo ""
fi

# Check for open PRs with parity-check label
echo "Checking for open parity-check PRs..."
OPEN_PRS=$(gh pr list --state open --limit 100 --json number,labels --jq '[.[] | select(.labels[]?.name == "parity-check")] | length')

if [ "$OPEN_PRS" -ge 5 ]; then
  echo "Found $OPEN_PRS open parity-check PRs (limit: 5)"
  echo "Checking PR comments to determine if action is needed..."
  
  # Get list of open PR numbers
  PR_NUMBERS=$(gh pr list --state open --limit 100 --json number,labels --jq '.[] | select(.labels[]?.name == "parity-check") | .number')
  
  # Create a summary file for Claude to review
  PR_SUMMARY_FILE="$TMP_DIR/pr-summary.md"
  echo "# Open Parity Check PRs" > "$PR_SUMMARY_FILE"
  echo "" >> "$PR_SUMMARY_FILE"
  echo "Currently $OPEN_PRS open PRs (limit reached: 5)" >> "$PR_SUMMARY_FILE"
  echo "" >> "$PR_SUMMARY_FILE"
  
  for PR_NUM in $PR_NUMBERS; do
    echo "## PR #$PR_NUM" >> "$PR_SUMMARY_FILE"
    gh pr view "$PR_NUM" --json number,title,url,body,comments --jq '{number,title,url,body,comments: [.comments[] | {author: .author.login, body: .body, createdAt: .createdAt}]}' >> "$PR_SUMMARY_FILE"
    echo "" >> "$PR_SUMMARY_FILE"
  done
  
  echo "PR summary created: $PR_SUMMARY_FILE"
  echo ""
  echo "Asking Claude Code to review existing PRs and determine next action..."
  
  REVIEW_PROMPT="Review the open parity-check PRs and determine if any action is needed.

Context: We have reached the limit of 5 open parity-check PRs.

PR Summary: @$PR_SUMMARY_FILE

Your task:
1. Review each open PR and its comments
2. Check if any PR needs attention (e.g., requested changes, failing tests, merge conflicts)
3. Determine if you should:
   - Work on an existing PR that needs fixes
   - Wait for PR reviews/merges (no action needed)
   - Close stale PRs that are no longer relevant

If action is needed on a specific PR:
- Check out that PR's branch
- Address the issues
- Update the PR

If no action is needed:
- Report that we should wait for existing PRs to be reviewed/merged
- Do NOT create new PRs until the count drops below 5

Be specific about which PR (if any) needs work and why."

  # Run Claude Code to review PRs
  if claude --dangerously-skip-permissions -p "$REVIEW_PROMPT"; then
    echo ""
    echo "PR review completed. Exiting."
    exit 0
  else
    echo "Error: Failed to review PRs"
    exit 1
  fi
fi

echo "Open parity-check PRs: $OPEN_PRS (limit: 5)"
echo ""

git fetch origin main

BRANCH_NAME="fix-issue-$ISSUE_NUMBER"
CURRENT_BRANCH=$(git branch --show-current)

if [ "$CURRENT_BRANCH" = "$BRANCH_NAME" ]; then
  echo "Already on branch $BRANCH_NAME"
elif git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
  git checkout "$BRANCH_NAME"
else
  git checkout -b "$BRANCH_NAME" origin/main
fi

# Check for required tools
command -v gh >/dev/null 2>&1 || { echo "Error: GitHub CLI (gh) is required but not installed."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Error: Node.js is required but not installed."; exit 1; }

# Check for Playwright and install if needed
if ! node -e "require('playwright')" 2>/dev/null; then
  echo "Installing Playwright..."
  npm install --legacy-peer-deps --no-save playwright
  npx playwright install chromium
fi

echo "Fetching issue #$ISSUE_NUMBER..."

# Get issue details
ISSUE_JSON=$(gh issue view "$ISSUE_NUMBER" --json number,title,body)
ISSUE_TITLE=$(echo "$ISSUE_JSON" | jq -r '.title')
ISSUE_BODY=$(echo "$ISSUE_JSON" | jq -r '.body')

echo "Issue: $ISSUE_TITLE"

# Extract component name
COMPONENT_NAME=$(echo "$ISSUE_TITLE" | sed -n 's/.*Investigate \(.*\) component.*/\1/p')

if [ -z "$COMPONENT_NAME" ]; then
  echo "Error: Could not extract component name from issue title"
  exit 1
fi

echo "Component: $COMPONENT_NAME"

# Create screenshots directory
mkdir -p "$TMP_DIR/screenshots"

echo "Searching for stories file for $COMPONENT_NAME..."

# List files in component directory to find stories file
COMPONENT_DIR="packages/react/src/components/${COMPONENT_NAME}"
FILES_JSON=$(gh api repos/carbon-design-system/carbon/contents/"$COMPONENT_DIR" 2>/dev/null || echo "[]")

# Find stories file
STORIES_FILE=$(echo "$FILES_JSON" | jq -r '.[] | select(.name | test("\\.stories\\.(js|tsx|ts)$")) | .name' | head -1)

if [ -z "$STORIES_FILE" ]; then
  echo "Note: Could not find stories file in $COMPONENT_DIR"
  STORY_URLS="No stories file found in the repository"
else
  echo "Found stories file: $STORIES_FILE"

  # Fetch the stories file content
  STORIES_PATH="${COMPONENT_DIR}/${STORIES_FILE}"
  echo "Fetching: $STORIES_PATH"

  STORIES_FILE_CONTENT=$(gh api repos/carbon-design-system/carbon/contents/"$STORIES_PATH" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null || echo "")

  if [ -n "$STORIES_FILE_CONTENT" ]; then
    echo "Parsing stories file..."

    # Write stories content to temp file to avoid issues with backticks
    TEMP_STORIES_FILE="$TMP_DIR/stories-${ISSUE_NUMBER}.tsx"
    echo "$STORIES_FILE_CONTENT" > "$TEMP_STORIES_FILE"

    # Parse the stories file to extract title and story exports, then take screenshots
    cat > "$TMP_DIR/parse-stories.cjs" <<'NODESCRIPT'
const fs = require("fs");
const playwright = require("playwright");
const content = fs.readFileSync(process.env.TEMP_STORIES_FILE, "utf-8");

// Extract title from export default
const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
if (!titleMatch) {
  console.error("Error: Could not extract title from stories file");
  process.exit(1);
}

const title = titleMatch[1]; // e.g., "Components/Accordion"
const componentPart = title.split("/")[1]; // e.g., "Accordion"
const componentKebab = componentPart.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");

// Extract all export const declarations
const exportMatches = [...content.matchAll(/export\s+const\s+(\w+)\s*=/g)];
const storyNames = exportMatches.map(match => match[1]);

// Generate URLs for each story
const urls = storyNames.map(story =>
  `https://react.carbondesignsystem.com/?path=/story/components-${componentKebab}--${story.toLowerCase()}`
);

// Write URLs to file for later reference
fs.writeFileSync(process.env.URLS_FILE, urls.join("\n"));

// Take screenshots for each URL
(async () => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  for (const [index, url] of urls.entries()) {
    const storyName = storyNames[index];
    const screenshotPath = `${process.env.SCREENSHOTS_DIR}/${process.env.COMPONENT_NAME}-${storyName}-react.png`;

    try {
      console.log(`Taking screenshot for ${storyName}: ${url}`);
      await page.goto(url, { waitUntil: "load", timeout: 15000 });
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: screenshotPath,
        fullPage: false
      });
      console.log(`Screenshot saved: ${screenshotPath}`);
    } catch (error) {
      console.warn(`Skipping screenshot for ${storyName} (${error.message})`);
    }
  }

  await browser.close();
})();
NODESCRIPT

    # Run the parsing script with environment variables
    TEMP_STORIES_FILE="$TEMP_STORIES_FILE" \
    URLS_FILE="$TMP_DIR/story-urls-${ISSUE_NUMBER}.txt" \
    SCREENSHOTS_DIR="$TMP_DIR/screenshots" \
    COMPONENT_NAME="$COMPONENT_NAME" \
    node "$TMP_DIR/parse-stories.cjs"
    STORY_URLS=$(cat "$TMP_DIR/story-urls-${ISSUE_NUMBER}.txt" 2>/dev/null || echo "")
  else
    echo "Note: Could not fetch stories file content"
    STORY_URLS=""
  fi
fi

# Create context file
CONTEXT_FILE="$TMP_DIR/component-context-${ISSUE_NUMBER}.md"
SCREENSHOTS_LIST=$(ls "$TMP_DIR"/screenshots/${COMPONENT_NAME}-*-react.png 2>/dev/null | sed 's|^|  - |' || echo "  No screenshots found")

cat > "$CONTEXT_FILE" <<EOF
# Component Parity Investigation: $COMPONENT_NAME

## Issue Details
- Issue Number: #$ISSUE_NUMBER
- Component: $COMPONENT_NAME

## Resources
- React Implementation: https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components/$COMPONENT_NAME
- Carbon Design System: https://carbondesignsystem.com/

## Storybook Stories
$STORY_URLS

## React Storybook Screenshots
$SCREENSHOTS_LIST

## Investigation Tasks
$ISSUE_BODY

## Reference Documentation
- See AGENTS.md for component patterns and examples
- See PARITY_CHECK.md for parity workflow details
EOF

echo "Context file created: $CONTEXT_FILE"
echo ""
echo "Starting Agent..."
echo "---"


PROMPT_TEMPLATE=".github/workflows/templates/agent-prompt.md"

if [ -f "$PROMPT_TEMPLATE" ]; then
  # Use template and replace variables
  PROMPT=$(cat "$PROMPT_TEMPLATE" | \
    sed "s/{{COMPONENT_NAME}}/$COMPONENT_NAME/g" | \
    sed "s/{{COMPONENT_NAME_LOWER}}/${COMPONENT_NAME,,}/g" | \
    sed "s/{{COMPONENT_NAME_KEBAB}}/$(echo $COMPONENT_NAME | sed 's/\([A-Z]\)/-\1/g' | sed 's/^-//' | tr '[:upper:]' '[:lower:]')/g" | \
    sed "s/{{ISSUE_NUMBER}}/$ISSUE_NUMBER/g" | \
    sed "s|{{GITHUB_REPOSITORY}}|$(gh repo view --json nameWithOwner -q .nameWithOwner)|g")

else
  # Fallback to simple prompt
  PROMPT="Investigate and fix parity issues for the $COMPONENT_NAME component.

Context file: @$CONTEXT_FILE
Screenshots directory: $TMP_DIR/screenshots/

Follow the instructions in AGENTS.md for component implementation patterns.
Use the structured approach from the agent prompt template if available.

This task may have already been attempted in an earlier run. Before doing anything else:
- Run 'git status' and 'git log origin/main..HEAD' to see if commits already exist on this branch
- Run 'git diff origin/main' to see any uncommitted or committed changes already made
- Check 'gh pr list --search \"$ISSUE_NUMBER\"' and 'gh issue view $ISSUE_NUMBER --comments' for prior findings, a PR that already exists, or notes about what remains
- If prior work exists, resume and build on it instead of starting over or redoing completed steps

Your task:
1. Read the context file and review the component requirements
2. Check the React implementation at the provided GitHub URL
3. Review the Storybook screenshots in $TMP_DIR/screenshots/ to understand the component and its variations
4. Check if we have this component in carbon-components-ember/src/components/ (including under a different name)
5. Decide which of these applies:
   - Naming mismatch only (the same functionality already exists in Ember under a different name): align the name/export to match React rather than treating it as missing
   - Doesn't make sense in an Ember context, or is really just a piece of another already-implemented component: exclude it instead of implementing it (see below) - only do this for a genuine reason, when in doubt implement it
   - Otherwise: implement it (new or fix existing) following AGENTS.md patterns
6. If excluding, run from the scripts directory: node parity-check.mjs --exclude $COMPONENT_NAME --reason \"<why this doesn't apply to Ember>\" --issue $ISSUE_NUMBER
   - This drops the component from .parity-check-data.json and PARITY_REPORT.md, and comments on + closes the issue for you. Don't create a PR or make component changes in this case - you're done.
7. Otherwise, update issue #$ISSUE_NUMBER with your findings
8. If you made fixes, commit them and create a PR linked to the issue
9. If you created a PR, also add exactly one of these labels based on the change: 'bug' (fixing broken behavior), 'enhancement' (new/missing component or functionality), or 'breaking' (renamed/changed a public API, e.g. a naming-mismatch alignment)
10. If you created a PR, add the 'preview' label to it

Use the screenshots as visual references for how the component should look."
fi

# Run the agent in a loop, retrying indefinitely until it succeeds
RETRY_DELAY=600
ATTEMPT=1

until claude --dangerously-skip-permissions -p "$PROMPT"; do
  echo "Agent attempt $ATTEMPT failed. Retrying in ${RETRY_DELAY}s..."
  ATTEMPT=$((ATTEMPT + 1))
  sleep "$RETRY_DELAY"
done

echo ""
echo "---"
echo "Agent execution completed!"
echo ""
echo "Next steps:"
echo "  - Review any changes made"
echo "  - Check if a PR was created"
echo "  - Update issue #$ISSUE_NUMBER if needed"
