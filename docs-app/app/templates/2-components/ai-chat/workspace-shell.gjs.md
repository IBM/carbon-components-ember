<ThemeSwitcher />

# WorkspaceShell

`WorkspaceShell` is the outer AI Chat "workspace" surface: a vertical stack
of an optional toolbar, notification area, header, scrollable body and
footer. See also
[`WorkspaceShellHeader`](./workspace-shell-header.md),
[`WorkspaceShellBody`](./workspace-shell-body.md) and
[`WorkspaceShellFooter`](./workspace-shell-footer.md).

The `header` block yields a `WorkspaceShellHeader` pre-bound with
`@collapsible` - use it instead of importing `WorkspaceShellHeader` directly
to get `@autoCollapsibleHeader`'s automatic behavior.

```gjs live preview
import { array, hash } from '@ember/helper';
import {
  Toolbar,
  WorkspaceShell,
  WorkspaceShellBody,
  WorkspaceShellFooter,
} from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject({ last: '(none yet)' });
const handleAction = (footerAction) => {
  context.last = footerAction.label;
};

<template>
  <ThemeSupport />
  <div style='max-inline-size: 24rem; block-size: 20rem;'>
    <WorkspaceShell>
      <:toolbar>
        <Toolbar @titleText='Order details' />
      </:toolbar>
      <:header as |Header|>
        <Header @titleText='Order #1234' @subTitleText='Placed 2 days ago' />
      </:header>
      <:body>
        <WorkspaceShellBody>
          <p>Workspace body content goes here.</p>
        </WorkspaceShellBody>
      </:body>
      <:footer>
        <WorkspaceShellFooter
          @actions={{array (hash label='Cancel' kind='ghost') (hash label='Confirm' kind='primary')}}
          @onClick={{handleAction}}
        />
      </:footer>
    </WorkspaceShell>
  </div>
  <br />
  last footer action: {{context.last}}
</template>
```

## API Reference

<details>
<summary><h3>WorkspaceShell</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/workspace-shell'
    @name='default'
  />
</template>
```
</details>
