<ThemeSwitcher />

# ProgressIndicator

```gjs live preview
import { ProgressIndicator } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { cell } from 'ember-resources';

const currentIndex = cell(1);
const onChange = (index) => (currentIndex.current = index);

<template>
    <ThemeSupport />
    <br>
    <ProgressIndicator @currentIndex={{currentIndex.current}} @onChange={{onChange}} as |Step|>
        <Step @label='First step' @description='Step 1: getting started' />
        <Step @label='Second step' @secondaryLabel='Optional' @description='Step 2: getting started' />
        <Step @label='Third step' @invalid={{true}} @description='Step 3: invalid step' />
        <Step @label='Fourth step' @disabled={{true}} @description='Step 4: disabled step' />
    </ProgressIndicator>

    <br>

    <ProgressIndicator @currentIndex={{1}} @vertical={{true}} as |Step|>
        <Step @label='First step' />
        <Step @label='Second step' />
        <Step @label='Third step' />
    </ProgressIndicator>
</template>
```

## API Reference

<details>
<summary><h3>ProgressIndicator</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/progress-indicator'
    @name='default'
  />
</template>
```
</details>
