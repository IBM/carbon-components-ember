<ThemeSwitcher />

# WorkspaceShellHeader

The header section of a [`WorkspaceShell`](./workspace-shell.md): a title, an
optional subtitle/description, and action content - optionally collapsible.
Usually obtained via `WorkspaceShell`'s yielded `header` block param rather
than imported directly - see `WorkspaceShell`'s docs.

```gjs live preview
import { WorkspaceShellHeader } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <div style='max-inline-size: 24rem;'>
    <WorkspaceShellHeader @titleText='Order #1234' @subTitleText='Placed 2 days ago' @collapsible={{true}}>
      <:headerDescription>Additional detail about this order.</:headerDescription>
    </WorkspaceShellHeader>
  </div>
</template>
```

## API Reference

<details>
<summary><h3>WorkspaceShellHeader</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/workspace-shell-header'
    @name='default'
  />
</template>
```
</details>
