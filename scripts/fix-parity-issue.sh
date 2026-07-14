#!/bin/bash
set -euo pipefail

# Local Parity Fix Script
# This script helps fix parity issues locally using Agent
# Usage: ./scripts/fix-parity-issue.sh [issue_number]

ISSUE_NUMBER="${1:-}"

if [ -z "$ISSUE_NUMBER" ]; then
  echo "No issue number provided. Fetching a random parity-check issue..."

  # Check for required tools
  command -v gh >/dev/null 2>&1 || { echo "Error: GitHub CLI (gh) is required but not installed."; exit 1; }

  # Get all open issues with parity-check label
  PARITY_ISSUES=$(gh issue list --label "parity-check" --state open --json number --jq '.[].number')

  if [ -z "$PARITY_ISSUES" ]; then
    echo "Error: No open issues found with label 'parity-check'"
    echo ""
    echo "Usage: ./scripts/fix-parity-issue.sh [issue_number]"
    echo ""
    echo "Example: ./scripts/fix-parity-issue.sh 123"
    echo ""
    echo "If no issue number is provided, a random issue with label 'parity-check' will be selected."
    exit 1
  fi

  # Select a random issue from the list
  ISSUE_NUMBER=$(echo "$PARITY_ISSUES" | shuf -n 1)

  echo "Selected random issue: #$ISSUE_NUMBER"
  echo ""
fi

# Check for required tools
command -v gh >/dev/null 2>&1 || { echo "Error: GitHub CLI (gh) is required but not installed."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Error: Node.js is required but not installed."; exit 1; }

# Check for Playwright
if ! node -e "require('playwright')" 2>/dev/null; then
  echo "Installing Playwright..."
  npm install -g playwright
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
mkdir -p /tmp/screenshots

# Take screenshot
STORYBOOK_URL="https://react.carbondesignsystem.com/?path=/docs/components-${COMPONENT_NAME,,}--overview"
echo "Taking screenshot from: $STORYBOOK_URL"

node -e "
const playwright = require('playwright');
(async () => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  try {
    await page.goto('$STORYBOOK_URL', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: '/tmp/screenshots/${COMPONENT_NAME}-react.png',
      fullPage: false
    });
    console.log('Screenshot saved to /tmp/screenshots/${COMPONENT_NAME}-react.png');
  } catch (error) {
    console.error('Error taking screenshot:', error.message);
    process.exit(1);
  }

  await browser.close();
})();
"

# Create context file
CONTEXT_FILE="/tmp/component-context-${ISSUE_NUMBER}.md"
cat > "$CONTEXT_FILE" <<EOF
# Component Parity Investigation: $COMPONENT_NAME

## Issue Details
- Issue Number: #$ISSUE_NUMBER
- Component: $COMPONENT_NAME

## Resources
- React Implementation: https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components/$COMPONENT_NAME
- Storybook: $STORYBOOK_URL
- Carbon Design System: https://carbondesignsystem.com/

## Investigation Tasks
$ISSUE_BODY

## Screenshots
React Storybook screenshot: /tmp/screenshots/${COMPONENT_NAME}-react.png

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

  echo "$PROMPT" | claude --dangerously-skip-permissions
else
  # Fallback to simple prompt
  claude --dangerously-skip-permissions -p "Investigate and fix parity issues for the $COMPONENT_NAME component.

Context file: @$CONTEXT_FILE
Screenshot: @/tmp/screenshots/${COMPONENT_NAME}-react.png

Follow the instructions in AGENTS.md for component implementation patterns.
Use the structured approach from the agent prompt template if available.

Your task:
1. Read the context file and review the component requirements
2. Check the React implementation at the provided GitHub URL
3. Look at the screenshot to understand the visual design
4. Check if we have this component in carbon-components-ember/src/components/
5. If we have it, compare and fix any differences
6. If we don't have it, implement it following AGENTS.md patterns
7. Update issue #$ISSUE_NUMBER with your findings
8. If you made fixes, commit them and create a PR linked to the issue
9. If you created a PR, add the 'preview' label to it

Use the screenshot as a visual reference for how the component should look."
fi

echo ""
echo "---"
echo "Agent execution completed!"
echo ""
echo "Next steps:"
echo "  - Review any changes made"
echo "  - Check if a PR was created"
echo "  - Update issue #$ISSUE_NUMBER if needed"
