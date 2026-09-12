<ThemeSwitcher />

# WorkspaceShellBody

The main, scrollable content area of a
[`WorkspaceShell`](./workspace-shell.md).

```gjs live preview
import { WorkspaceShellBody } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <div style='max-inline-size: 24rem; border: 1px solid var(--cds-border-subtle);'>
    <WorkspaceShellBody>
      <p>Workspace body content goes here.</p>
    </WorkspaceShellBody>
  </div>
</template>
```

## API Reference

<details>
<summary><h3>WorkspaceShellBody</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/workspace-shell-body'
    @name='default'
  />
</template>
```
</details>
