<ThemeSwitcher />

# Popover

`Popover` is used for triggering a pop-up next to a trigger element, typically
a button, in a given direction. It is a controlled component: the consumer
owns the `@open` argument and toggles it (usually from the trigger's `@onClick`
handler), while `Popover` calls `@onRequestClose` whenever the user clicks
outside of the popover or presses <kbd>Escape</kbd> while focus is inside the
popover content.

The trigger element and `PopoverContent` are both yielded as plain children of
`Popover`.

```gjs live preview
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { not } from 'ember-truth-helpers';
import { Popover, PopoverContent } from 'carbon-components-ember/components';
import { Checkbox as CheckboxIcon } from 'carbon-components-ember/icons';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  {{#let (newObj open=true) as |context|}}
    <Popover
      @open={{context.open}}
      @onRequestClose={{fn (set context 'open') false}}
    >
      <button
        type='button'
        aria-label='Available storage'
        aria-expanded={{context.open}}
        {{on 'click' (fn (set context 'open') (not context.open))}}
      >
        <CheckboxIcon />
      </button>
      <PopoverContent style='padding: 1rem;'>
        <h4>Available storage</h4>
        <p>This server has 150 GB of block storage remaining.</p>
      </PopoverContent>
    </Popover>
  {{/let}}
</template>
```

## Caret, drop shadow, border and high contrast

`@align` (not toggled in this example — see the API reference below for the
full list of accepted values) controls which side and edge of the trigger the
popover renders against. `@caret`, `@dropShadow`, `@border`, `@highContrast`
and `@backgroundToken` control its appearance.

```gjs live preview
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { not } from 'ember-truth-helpers';
import {
  Popover,
  PopoverContent,
  Checkbox,
} from 'carbon-components-ember/components';
import { Checkbox as CheckboxIcon } from 'carbon-components-ember/icons';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  {{#let
    (newObj
      open=true
      caret=true
      dropShadow=true
      border=false
      highContrast=false
    )
    as |context|
  }}
    <Checkbox
      @label='caret'
      @checked={{context.caret}}
      @onChange={{fn (set context 'caret')}}
    />
    <Checkbox
      @label='dropShadow'
      @checked={{context.dropShadow}}
      @onChange={{fn (set context 'dropShadow')}}
    />
    <Checkbox
      @label='border'
      @checked={{context.border}}
      @onChange={{fn (set context 'border')}}
    />
    <Checkbox
      @label='highContrast'
      @checked={{context.highContrast}}
      @onChange={{fn (set context 'highContrast')}}
    />
    <br />
    <br />

    <Popover
      @open={{context.open}}
      @caret={{context.caret}}
      @dropShadow={{context.dropShadow}}
      @border={{context.border}}
      @highContrast={{context.highContrast}}
      @onRequestClose={{fn (set context 'open') false}}
    >
      <button
        type='button'
        aria-label='Available storage'
        aria-expanded={{context.open}}
        {{on 'click' (fn (set context 'open') (not context.open))}}
      >
        <CheckboxIcon />
      </button>
      <PopoverContent style='padding: 1rem;'>
        <h4>Available storage</h4>
        <p>This server has 150 GB of block storage remaining.</p>
      </PopoverContent>
    </Popover>
  {{/let}}
</template>
```

## Tab tip variant

Passing `@isTabTip={{true}}` renders the "tab tip" variant used by components
like `DataTable`'s column customization menu. It defaults `@align` to
`bottom-start`, disables the caret, and adds a `cds--popover--tab-tip__button`
class to the trigger.

```gjs live preview
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { not } from 'ember-truth-helpers';
import {
  Popover,
  PopoverContent,
  Checkbox,
  RadioButtonGroup,
} from 'carbon-components-ember/components';
import { Settings } from 'carbon-components-ember/icons';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  {{#let (newObj open=true) as |context|}}
    <Popover
      @open={{context.open}}
      @isTabTip={{true}}
      @onRequestClose={{fn (set context 'open') false}}
    >
      <button
        type='button'
        aria-label='Settings'
        aria-expanded={{context.open}}
        {{on 'click' (fn (set context 'open') (not context.open))}}
      >
        <Settings />
      </button>
      <PopoverContent style='padding: 1rem;'>
        <RadioButtonGroup @name='row-height' @defaultSelected='small'>
          <:heading>Row height</:heading>
          <:default as |Radio|>
            <Radio @value='small'>Small</Radio>
            <Radio @value='large'>Large</Radio>
          </:default>
        </RadioButtonGroup>
        <hr />
        <fieldset class='cds--fieldset'>
          <legend class='cds--label'>Edit columns</legend>
          <Checkbox @label='Name' @checked={{true}} />
          <Checkbox @label='Type' @checked={{true}} />
          <Checkbox @label='Location' @checked={{true}} />
        </fieldset>
      </PopoverContent>
    </Popover>
  {{/let}}
</template>
```

## Auto align

**Experimental:** passing `@autoAlign={{true}}` checks, when the popover
opens, whether the popover content would render outside of the viewport (or
a boundary element passed as `@autoAlignBoundary`) and flips it to the
opposite side of the trigger if so. This is a lighter-weight approximation of
React's `floating-ui`-powered `autoAlign`: it re-checks once when the popover
opens rather than continuously tracking position, and picks from the same set
of alignment values rather than computing arbitrary pixel offsets.

Since this popover is requested to align `top` right at the top of the page,
there typically isn't enough room above it in the viewport, so `@autoAlign`
flips it to render `bottom` instead.

```gjs live preview
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { not } from 'ember-truth-helpers';
import { Popover, PopoverContent } from 'carbon-components-ember/components';
import { Checkbox as CheckboxIcon } from 'carbon-components-ember/icons';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />

  {{#let (newObj open=true) as |context|}}
    <Popover
      @open={{context.open}}
      @align='top'
      @autoAlign={{true}}
      @onRequestClose={{fn (set context 'open') false}}
    >
      <button
        type='button'
        aria-label='Available storage'
        aria-expanded={{context.open}}
        {{on 'click' (fn (set context 'open') (not context.open))}}
      >
        <CheckboxIcon />
      </button>
      <PopoverContent style='padding: 1rem;'>
        <h4>This popover uses autoAlign</h4>
        <p>
          It was requested to align on top, but flips to bottom when there
          isn't enough room above it in the viewport.
        </p>
      </PopoverContent>
    </Popover>
  {{/let}}
</template>
```

## API Reference

<details>
<summary><h3>Popover</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/popover'
    @name='default'
  />
</template>
```
</details>

<details>
<summary><h3>PopoverContent</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/popover'
    @name='PopoverContent'
  />
</template>
```
</details>
