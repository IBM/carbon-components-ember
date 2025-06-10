<ThemeSwitcher />

# Icon

```gjs live preview
import { fn } from '@ember/helper';
import { Bookmark32 as BookmarkSvgInfo } from '@carbon/icons/es/index.js';
import { Bookmark, Task } from 'carbon-components-ember/icons';
import { Icon } from 'carbon-components-ember/components';
import { registerIcon } from 'carbon-components-ember/components/icon';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

registerIcon('bookmark', BookmarkSvgInfo);

function noop() {};

<template>
    <ThemeSupport />
    <Icon @icon='bookmark' />
    <Task @onClick={{fn (noop)}} />
</template>
```
## API Reference

<details>
<summary><h3>Icon</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/icon' 
    @name='default' 
  />
</template>
```
</details>
