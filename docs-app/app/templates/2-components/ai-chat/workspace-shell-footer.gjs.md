<ThemeSwitcher />

# WorkspaceShellFooter

The footer section of a [`WorkspaceShell`](./workspace-shell.md): a row of
action buttons that reorders and stacks vertically once the shell narrows
below 671px.

```gjs live preview
import { array, hash } from '@ember/helper';
import { WorkspaceShellFooter } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject({ last: '(none yet)' });
const handleAction = (footerAction) => {
  context.last = footerAction.label;
};

<template>
  <ThemeSupport />
  <div style='max-inline-size: 24rem; border: 1px solid var(--cds-border-subtle);'>
    <WorkspaceShellFooter
      @actions={{array (hash label='Cancel' kind='ghost') (hash label='Confirm' kind='primary')}}
      @onClick={{handleAction}}
    />
  </div>
  <br />
  last action: {{context.last}}
</template>
```

## API Reference

<details>
<summary><h3>WorkspaceShellFooter</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/workspace-shell-footer'
    @name='default'
  />
</template>
```
</details>
