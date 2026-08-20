<ThemeSwitcher />

# Slider

```gjs live preview
import { Slider } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { cell } from 'ember-resources';

const value = cell(50);
const onChange = (data) => (value.current = data.value);

<template>
    <ThemeSupport />
    <br>
    <Slider
      @labelText='Slider label'
      @min={{0}}
      @max={{100}}
      @step={{5}}
      @value={{value.current}}
      @onChange={{onChange}}
    />
</template>
```

## Two handles

```gjs live preview
import { Slider } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { cell } from 'ember-resources';

const lower = cell(10);
const upper = cell(90);
const onChange = (data) => {
  lower.current = data.value;
  upper.current = data.valueUpper;
};

<template>
    <ThemeSupport />
    <br>
    <Slider
      @ariaLabelInput='Lower bound'
      @ariaLabelInputUpper='Upper bound'
      @labelText='Slider label'
      @min={{0}}
      @max={{100}}
      @value={{lower.current}}
      @valueUpper={{upper.current}}
      @onChange={{onChange}}
    />
</template>
```

## Hidden text input & custom value label

```gjs live preview
import { Slider } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { cell } from 'ember-resources';

const value = cell(50);
const onChange = (data) => (value.current = data.value);
const formatLabel = (val) => {
  if (val < 25) return 'Low';
  if (val > 75) return 'High';
  return 'Medium';
};

<template>
    <ThemeSupport />
    <br>
    <Slider
      @labelText='Slider label with low/medium/high'
      @min={{0}}
      @max={{100}}
      @value={{value.current}}
      @onChange={{onChange}}
      @hideTextInput={{true}}
      @formatLabel={{formatLabel}}
    />
</template>
```

## Disabled, invalid and warning states

```gjs live preview
import { Slider } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <br>
    <Slider @labelText='Disabled' @min={{0}} @max={{100}} @value={{50}} @disabled={{true}} />
    <br>
    <Slider
      @labelText='Invalid'
      @min={{0}}
      @max={{100}}
      @value={{50}}
      @invalid={{true}}
      @invalidText='Invalid message goes here'
    />
    <br>
    <Slider
      @labelText='Warning'
      @min={{0}}
      @max={{100}}
      @value={{50}}
      @warn={{true}}
      @warnText='Warning message goes here'
    />
</template>
```

## Skeleton

```gjs live preview
import { SliderSkeleton } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <br>
    <SliderSkeleton />
    <br>
    <SliderSkeleton @twoHandles={{true}} />
</template>
```

## API Reference

<details>
<summary><h3>Slider</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/slider' 
    @name='default' 
  />
</template>
```
</details>

<details>
<summary><h3>SliderSkeleton</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/slider-skeleton' 
    @name='default' 
  />
</template>
```
</details>
