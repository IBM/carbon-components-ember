<ThemeSwitcher />

# ProgressBar

```gjs live preview
import { ProgressBar } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <br>
    <ProgressBar />
    <ProgressBar @status='error' @size='big' />
    <ProgressBar @status='indeterminate' />
    <ProgressBar @status='finished' @size='small' />

    <ProgressBar @value={{30}} @status='active' />
    <ProgressBar
        @label='indented'
        @value={{50}}
        @type='indented'
        @status='active'
    />
    <ProgressBar @label='inline' @value={{50}} @type='inline' />
</template>
```

## API Reference

<details>
<summary><h3>Progress</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/progress-bar' 
    @name='default' 
  />
</template>
```
</details>
