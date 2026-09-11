<ThemeSwitcher />

# Processing

`Processing` renders a three-dot "processing"/"thinking" animation, used to
indicate an in-progress assistant response.

```gjs live preview
import { Processing } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <div style='display: flex; gap: 2rem;'>
    <Processing />
    <Processing @loop={{true}} />
    <Processing @quickLoad={{true}} />
  </div>
</template>
```

## API Reference

<details>
<summary><h3>Processing</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/processing'
    @name='default'
  />
</template>
```
</details>
