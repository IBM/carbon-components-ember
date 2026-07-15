# Component Implementation Task

## Component: {{COMPONENT_NAME}}

## Context
- **Issue**: #{{ISSUE_NUMBER}}
- **Repository**: {{GITHUB_REPOSITORY}}
- **React Implementation**: https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components/{{COMPONENT_NAME}}
- **Storybook**: https://react.carbondesignsystem.com/?path=/docs/components-{{COMPONENT_NAME_LOWER}}--overview
- **Screenshot**: @/tmp/screenshots/{{COMPONENT_NAME}}-react.png

## Your Mission

Implement or fix the {{COMPONENT_NAME}} component to achieve parity with Carbon React.

## Step-by-Step Instructions

### Phase 0: Check Prior Progress (Required)

This task may have already been attempted in an earlier run. Before doing anything else:

- Run `git status` and `git log origin/main..HEAD` to see if commits already exist on this branch
- Run `git diff origin/main` to see any uncommitted or committed changes already made
- Check `gh pr list --search "{{ISSUE_NUMBER}}"` and `gh issue view {{ISSUE_NUMBER}} --comments` for prior findings, a PR that already exists, or notes about what remains
- If prior work exists, resume and build on it instead of starting over or redoing completed steps

### Phase 1: Investigation (Required)

1. **Read Context**
   - Review @/tmp/component-context-{{ISSUE_NUMBER}}.md
   - Examine the React implementation at the GitHub URL
   - Study the screenshot to understand visual design
   - check if it has already been updated to latest commit in .parity-check-data.json

2. **Check Current State**
   - Look for existing implementation in `carbon-components-ember/src/components/`
   - If exists: Compare with React version
   - If missing: Prepare for new implementation
   - If a component needs other updated components first, skip. If it needs update to other components

### Phase 2: Implementation (Choose One Path)

#### Path A: Component Exists - Fix Discrepancies

1. **Compare APIs**
   - List React props vs Ember args
   - Identify missing or incorrect arguments
   - Check event handlers match

2. **Fix Implementation**
   - Update component signature
   - Add missing functionality
   - Ensure CSS classes use `cds--` prefix
   - Match visual design from screenshot

3. **Update Tests**
   - Add tests for new functionality
   - Verify all variants work

#### Path B: Component Missing - Create New

1. **Create Component File**
   - File: `carbon-components-ember/src/components/{{COMPONENT_NAME_KEBAB}}.gts`
   - Follow pattern from AGENTS.md
   - Use TypeScript signature
   - Add JSDoc with examples

2. **Implement Core Functionality**
   - Match React component API
   - Use `cds--` prefix for all CSS classes
   - Keep it simple - avoid overcomplicating
   - Follow Ember patterns (see AGENTS.md)

3. **Export Component**
   - Add to `carbon-components-ember/src/components/index.ts`
   - Keep alphabetical order

4. **Create Tests**
   - File: `test-app/tests/components/{{COMPONENT_NAME_KEBAB}}-test.gts`
   - Test default rendering
   - Test all variants/props
   - Test edge cases


5. **Add Documentation**
   - Create or update docs in `docs-app/app/routes/components/{{COMPONENT_NAME_KEBAB}}.gts`
   - Include usage examples
   - Document all props/args
   - Show common variants
   - Reference Carbon Design System docs

### Phase 3: Validation (Required)

1. **Build**
   ```bash
   cd carbon-components-ember && pnpm build
   ```
   - Must succeed without errors
   - Fix any TypeScript errors

2. **Test** (if time permits)
   ```bash
   cd test-app && pnpm test -- --filter="*{{COMPONENT_NAME_KEBAB}}*"
   ```

### Phase 4: Documentation (Required)

1. **Update Issue**
   - Comment on #{{ISSUE_NUMBER}} with:
     - What you found
     - What you implemented/fixed
     - Any limitations or notes

2. **Create PR** (if changes made)
   ```bash
   git checkout -b feat/{{COMPONENT_NAME_KEBAB}}
   git add -A
   git commit -m "feat: implement {{COMPONENT_NAME}} component"
   git push -u origin feat/{{COMPONENT_NAME_KEBAB}}
   gh pr create --title "feat: implement {{COMPONENT_NAME}} component" \
     --body "Closes #{{ISSUE_NUMBER}}" \
     --label "parity-check"
   ```

3. **Add Preview Label**
   ```bash
   gh pr edit <PR_NUMBER> --add-label "preview"
   ```

### Marking Components as Synced

After updating Ember components to match React changes, mark them as synced:

```bash
cd scripts
node parity-check.mjs --mark-synced ComponentName
# Or multiple components:
node parity-check.mjs --mark-synced Button,Accordion,DataTable
```

## Success Criteria

Your implementation is complete when ALL of these are true:

- [ ] Component file created/updated in correct location
- [ ] Component exported in `index.ts`
- [ ] Tests created and cover main functionality
- [ ] Documentation added in `docs-app/app/routes/components/`
- [ ] Build succeeds: `cd carbon-components-ember && pnpm build`
- [ ] CSS classes use `cds--` prefix
- [ ] API matches React component (args match props)
- [ ] Visual design matches screenshot/Storybook
- [ ] Issue updated with findings
- [ ] PR created and linked to issue (if changes made)
- [ ] Preview label added to PR
- [ ] mark them as synced

## Important Notes

- **Simplify**: Don't overcomplicate React patterns
- **CSS Prefix**: Always use `cds--` not `carbon--` or `bx--`
- **Native Helpers**: `element` is built-in, don't import it
- **Reference**: Check AGENTS.md for patterns and examples
- **Focus**: Complete one component well, don't start others

## If You Get Stuck

1. Check AGENTS.md for similar examples
2. Look at existing components in `carbon-components-ember/src/components/`
3. Simplify - remove unnecessary complexity
4. Document what you tried in the issue

## Time Management

- Investigation: 5-10 minutes
- Implementation: 15-25 minutes
- Testing/Validation: 5-10 minutes
- Documentation: 5 minutes

**Total: ~30-50 minutes per component**

If you can't complete in this time, document progress in the issue and move on.
