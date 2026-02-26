# Carbon Components Ember - Feature Parity Check

## Overview

This document outlines strategies for maintaining feature parity between Carbon Components Ember and Carbon Components React.

## Current Status

### Ember Implementation
- **Location**: `carbon-components-ember/src/components/`
- **Component Count**: ~29 components (as of analysis)
- **Export File**: `carbon-components-ember/src/components/index.ts`

### React Reference
- **Repository**: https://github.com/carbon-design-system/carbon/tree/main/packages/react
- **Storybook**: https://react.carbondesignsystem.com/?path=/docs/components-accordion--overview
- **Documentation**: https://carbondesignsystem.com/components/overview/

### Current Ember Components

Based on `src/components/index.ts`:
- Accordion
- Breadcrumbs
- Button
- Checkbox
- CodeSnippet
- CopyButton
- DataTable
- FormInput
- Icon
- List
- Loading
- Menu
- Modal
- Notification
- Pagination
- ProgressBar
- Radio (+ RadioGroup)
- SearchInput
- Select
- Tabs
- Tag
- Tile
- Toggle
- UiShell
- Charts (Bar, Line, Pie)
- Dialogs (Confirm)

## Proposed Solutions

### Option 1: Automated Component List Comparison ⭐ RECOMMENDED

**Goal**: Quickly identify missing components

**Implementation**:
```bash
# Create script
scripts/component-parity-check.mjs

# Run
npm run check-parity
```

**Script Tasks**:
1. Fetch Carbon React component list from:
   - GitHub API: `https://api.github.com/repos/carbon-design-system/carbon/contents/packages/react/src/components`
   - Or scrape Storybook navigation
2. Parse Ember components from `src/components/index.ts`
3. Generate comparison report

**Output Format**:
```markdown
# Component Parity Report
Generated: 2026-02-26

## Summary
- Total React Components: XX
- Total Ember Components: XX
- Parity: XX%

## Missing in Ember
- [ ] ComponentName1
- [ ] ComponentName2

## Implemented in Both
- [x] Accordion
- [x] Button
...

## Ember-Specific (Not in React)
- Charts (custom implementation)
```

**Pros**:
- Fast to implement
- Automated updates
- Clear visibility of gaps

**Cons**:
- Doesn't check API compatibility
- Doesn't verify design accuracy

---

### Option 2: Storybook Scraper

**Goal**: Extract detailed component information including variants

**Implementation**:
```javascript
// scripts/scrape-storybook.mjs
// Scrape https://react.carbondesignsystem.com
// Extract:
// - Component names
// - Variants (sizes, types, states)
// - Props documentation
```

**Pros**:
- Gets variant information
- Includes prop documentation
- Official source of truth

**Cons**:
- Requires web scraping
- May break if Storybook structure changes
- Slower than API approach

---

### Option 3: API Surface Comparison

**Goal**: Compare component APIs for implemented components

**Implementation**:
```bash
npm run compare-apis -- --component=Button
```

**Comparison Points**:
1. **Props/Arguments**
   - React: `<Button size="sm" kind="primary" />`
   - Ember: `<Carbon::Button @size="sm" @kind="primary" />`

2. **Events**
   - React: `onClick={handler}`
   - Ember: `{{on "click" handler}}`

3. **Composition**
   - React: Children pattern
   - Ember: Block content or named blocks

4. **Variants**
   - Sizes: sm, md, lg, xl
   - Types/Kinds: primary, secondary, tertiary, ghost, danger
   - States: disabled, loading, etc.

**Output**:
```markdown
## Button Component Comparison

### Props Parity: 85%

✅ Matching:
- size (sm, md, lg, xl)
- kind (primary, secondary, tertiary, ghost, danger)
- disabled

⚠️ Different:
- React: `onClick` → Ember: `{{on "click"}}`
- React: `iconDescription` → Ember: `@iconLabel`

❌ Missing in Ember:
- hasIconOnly
- tooltipPosition
- tooltipAlignment
```

**Pros**:
- Detailed API comparison
- Identifies naming differences
- Helps with migration guides

**Cons**:
- Manual effort per component
- Requires TypeScript/JSDoc parsing
- Needs maintenance

---

### Option 4: Visual Regression Testing

**Goal**: Ensure visual consistency with React implementation

**Tools**:
- Percy (https://percy.io/)
- Chromatic (https://www.chromatic.com/)
- BackstopJS (open source)

**Implementation**:
1. Deploy Ember Storybook
2. Configure visual testing tool
3. Compare against React Storybook screenshots
4. Review and approve differences

**Pros**:
- Catches visual bugs
- Ensures design consistency
- Automated in CI/CD

**Cons**:
- Requires paid service (Percy/Chromatic) or setup (BackstopJS)
- False positives from minor differences
- Slower feedback loop

---

### Option 5: Feature Matrix Spreadsheet

**Goal**: Manual tracking with team collaboration

**Structure**:
| Component | React | Ember | Props Parity | Design Parity | Priority | Notes |
|-----------|-------|-------|--------------|---------------|----------|-------|
| Accordion | ✅ | ✅ | 90% | ✅ | High | Missing `align` prop |
| Button | ✅ | ✅ | 95% | ✅ | High | - |
| ComboBox | ✅ | ❌ | - | - | Medium | Planned Q2 |

**Automation**:
```javascript
// scripts/update-matrix.mjs
// Updates spreadsheet from codebase analysis
```

**Pros**:
- Easy to understand
- Team collaboration
- Priority tracking
- Notes and context

**Cons**:
- Manual maintenance
- Can become outdated
- Requires discipline

---

## Recommended Implementation Plan

### Phase 1: Quick Assessment (Week 1)

**Goal**: Identify all missing components

1. Create `scripts/component-parity-check.mjs`
2. Implement GitHub API fetching or Storybook scraping
3. Parse Ember component exports
4. Generate initial report
5. Add to CI/CD pipeline

**Deliverable**: `PARITY_REPORT.md` with component checklist

### Phase 2: API Comparison (Weeks 2-4)

**Goal**: Deep dive into implemented components

1. Create `scripts/compare-component-apis.mjs`
2. For each implemented component:
   - Parse React TypeScript definitions
   - Parse Ember .gts component signatures
   - Compare and document differences
3. Generate per-component reports

**Deliverable**: API comparison reports for all implemented components

### Phase 3: Visual Validation (Week 5)

**Goal**: Ensure visual consistency

1. Set up visual regression testing (choose tool)
2. Configure for critical components
3. Integrate into CI/CD
4. Review and document acceptable differences

**Deliverable**: Visual regression test suite

### Phase 4: Continuous Monitoring (Ongoing)

**Goal**: Stay in sync with React updates

1. Schedule weekly parity checks
2. Monitor Carbon React releases
3. Update tracking documents
4. Prioritize new components

**Deliverable**: Automated monitoring and alerts

---

## Script Templates

### Component List Fetcher

```javascript
// scripts/component-parity-check.mjs
import { Octokit } from '@octokit/rest';
import fs from 'fs/promises';

const octokit = new Octokit();

async function fetchReactComponents() {
  const { data } = await octokit.repos.getContent({
    owner: 'carbon-design-system',
    repo: 'carbon',
    path: 'packages/react/src/components'
  });
  
  return data
    .filter(item => item.type === 'dir')
    .map(item => item.name);
}

async function getEmberComponents() {
  const content = await fs.readFile(
    'carbon-components-ember/src/components/index.ts',
    'utf-8'
  );
  
  const exports = content.match(/export \{ default as (\w+) \}/g);
  return exports.map(exp => exp.match(/as (\w+)/)[1]);
}

async function generateReport() {
  const reactComponents = await fetchReactComponents();
  const emberComponents = await getEmberComponents();
  
  const missing = reactComponents.filter(c => !emberComponents.includes(c));
  const implemented = reactComponents.filter(c => emberComponents.includes(c));
  const extra = emberComponents.filter(c => !reactComponents.includes(c));
  
  const report = `
# Component Parity Report
Generated: ${new Date().toISOString()}

## Summary
- Total React Components: ${reactComponents.length}
- Total Ember Components: ${emberComponents.length}
- Parity: ${Math.round(implemented.length / reactComponents.length * 100)}%

## Missing in Ember (${missing.length})
${missing.map(c => `- [ ] ${c}`).join('\n')}

## Implemented in Both (${implemented.length})
${implemented.map(c => `- [x] ${c}`).join('\n')}

## Ember-Specific (${extra.length})
${extra.map(c => `- ${c}`).join('\n')}
  `;
  
  await fs.writeFile('PARITY_REPORT.md', report);
  console.log('Report generated: PARITY_REPORT.md');
}

generateReport().catch(console.error);
```

### Package.json Scripts

```json
{
  "scripts": {
    "check-parity": "node scripts/component-parity-check.mjs",
    "compare-apis": "node scripts/compare-component-apis.mjs",
    "update-matrix": "node scripts/update-feature-matrix.mjs"
  },
  "devDependencies": {
    "@octokit/rest": "^20.0.0",
    "cheerio": "^1.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

## Next Steps

1. **Immediate**: Implement Option 1 (Component List Comparison)
   - Create the script
   - Generate initial report
   - Review with team

2. **Short-term**: Set up tracking
   - Create GitHub issue with checklist
   - Add to project board
   - Assign priorities

3. **Medium-term**: Implement Option 3 (API Comparison)
   - Start with high-priority components
   - Document differences
   - Create migration guides

4. **Long-term**: Set up Option 4 (Visual Regression)
   - Choose tool
   - Configure CI/CD
   - Establish review process

---

## Resources

- **Carbon React**: https://github.com/carbon-design-system/carbon/tree/main/packages/react
- **Carbon Storybook**: https://react.carbondesignsystem.com/
- **Carbon Design**: https://carbondesignsystem.com/
- **Ember Components**: `carbon-components-ember/src/components/`

---

## Maintenance

This document should be updated:
- When new approaches are implemented
- When parity reports are generated
- When significant gaps are identified
- Quarterly review of strategy effectiveness

Last Updated: 2026-02-26
