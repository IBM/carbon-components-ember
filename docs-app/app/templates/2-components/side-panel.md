<ThemeSwitcher />

# SidePanel

Side panels keep users in-context of a page while performing tasks like
navigating, editing, viewing details, or configuring something new.
`SidePanel` is a controlled component: the consumer owns the `@open`
argument and toggles it (usually from a trigger button's `onClick`
handler), while `SidePanel` calls `@onRequestClose` whenever the close
button, the overlay, or <kbd>Escape</kbd> should close it.

```gjs live preview
import { array, fn, hash } from '@ember/helper';
import { on } from '@ember/modifier';
import { Button, SidePanel } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  {{#let (newObj open=false) as |context|}}
    <Button @type='primary' {{on 'click' (fn (set context 'open') true)}}>
      Open panel
    </Button>

    <SidePanel
      @open={{context.open}}
      @onRequestClose={{fn (set context 'open') false}}
      @size='md'
      @title='Incident management'
      @subtitle='Investigate an incident within this side panel.'
      @includeOverlay={{true}}
      @actions={{array
        (hash label='Cancel' kind='secondary' onClick=(fn (set context 'open') false))
        (hash label='Submit' kind='primary' onClick=(fn (set context 'open') false))
      }}
    >
      <p>Panel body content goes here.</p>
    </SidePanel>
  {{/let}}
</template>
```

## Slide in

Passing `@slideIn={{true}}` renders the panel inline instead of as an
overlay: it shrinks `@selectorPageContent` (a CSS selector for the page's
main content area) rather than covering it, and it no longer closes on
<kbd>Escape</kbd> or an outside click.

```gjs live preview
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { Button, SidePanel } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  {{#let (newObj open=false) as |context|}}
    <div id='side-panel-slide-in-content'>
      <Button @type='primary' {{on 'click' (fn (set context 'open') true)}}>
        Open panel
      </Button>
      <p>This content shrinks to make room for the panel.</p>
    </div>

    <SidePanel
      @open={{context.open}}
      @onRequestClose={{fn (set context 'open') false}}
      @size='md'
      @slideIn={{true}}
      @selectorPageContent='#side-panel-slide-in-content'
      @labelText='Incident management'
      @title='Slide-in panel'
    >
      <p>Panel body content goes here.</p>
    </SidePanel>
  {{/let}}
</template>
```

## With an action toolbar

`@actionToolbarButtons` renders a row of buttons in the header, below the
title. Pass `@leading={{true}}` to show a button's label next to its icon,
or `@hasIconOnly={{true}}` for an icon-only button with a tooltip.

```gjs live preview
import { array, fn, hash } from '@ember/helper';
import { on } from '@ember/modifier';
import { Button, SidePanel } from 'carbon-components-ember/components';
import { Copy, Settings } from 'carbon-components-ember/icons';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

const noop = () => {};

<template>
  <ThemeSupport />
  <br />

  {{#let (newObj open=false) as |context|}}
    <Button @type='primary' {{on 'click' (fn (set context 'open') true)}}>
      Open panel
    </Button>

    <SidePanel
      @open={{context.open}}
      @onRequestClose={{fn (set context 'open') false}}
      @size='md'
      @title='Incident management'
      @includeOverlay={{true}}
      @actionToolbarButtons={{array
        (hash label='Copy' leading=true renderIcon=Copy onClick=noop)
        (hash label='Settings' hasIconOnly=true renderIcon=Settings onClick=noop)
      }}
    >
      <p>Panel body content goes here.</p>
    </SidePanel>
  {{/let}}
</template>
```

## Multi-step panel

`@currentStep` (paired with `@onNavigationBack`) shows a back button in the
header once `@currentStep` is greater than `0`, letting a panel drill into
a detail view and navigate back out of it.

```gjs live preview
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { eq } from 'ember-truth-helpers';
import { Button, SidePanel } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  {{#let (newObj open=false currentStep=0) as |context|}}
    <Button @type='primary' {{on 'click' (fn (set context 'open') true)}}>
      Open panel
    </Button>

    <SidePanel
      @open={{context.open}}
      @onRequestClose={{fn (set context 'open') false}}
      @size='md'
      @title='Incident management'
      @includeOverlay={{true}}
      @currentStep={{context.currentStep}}
      @onNavigationBack={{fn (set context 'currentStep') 0}}
    >
      {{#if (eq context.currentStep 0)}}
        <p>Main view.</p>
        <Button @tertiary={{true}} {{on 'click' (fn (set context 'currentStep') 1)}}>
          View details
        </Button>
      {{else}}
        <p>Detail view.</p>
      {{/if}}
    </SidePanel>
  {{/let}}
</template>
```

## With a decorator

Pass a component (e.g. an `AILabel`-style badge) via `@decorator` to render
it next to the close button.

```gjs live preview
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { Button, SidePanel } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

const Decorator = <template>
  <span style='font-size: 0.75rem; font-weight: 600; padding: 0 0.5rem;'>AI</span>
</template>;

<template>
  <ThemeSupport />
  <br />

  {{#let (newObj open=false) as |context|}}
    <Button @type='primary' {{on 'click' (fn (set context 'open') true)}}>
      Open panel
    </Button>

    <SidePanel
      @open={{context.open}}
      @onRequestClose={{fn (set context 'open') false}}
      @size='md'
      @title='Incident management'
      @includeOverlay={{true}}
      @decorator={{Decorator}}
    >
      <p>Panel body content goes here.</p>
    </SidePanel>
  {{/let}}
</template>
```

## Specify an element to have initial focus

By default, the first focusable element in the panel receives focus when it
opens. Pass a CSS selector via `@selectorPrimaryFocus` to focus a specific
element instead.

```gjs live preview
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { Button, SidePanel, TextInput } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  {{#let (newObj open=false) as |context|}}
    <Button @type='primary' {{on 'click' (fn (set context 'open') true)}}>
      Open panel
    </Button>

    <SidePanel
      @open={{context.open}}
      @onRequestClose={{fn (set context 'open') false}}
      @size='md'
      @title='Incident management'
      @includeOverlay={{true}}
      @selectorPrimaryFocus='#side-panel-focus-target'
    >
      <TextInput @id='side-panel-focus-target' @labelText='This field receives focus' />
    </SidePanel>
  {{/let}}
</template>
```

## Static title

`@animateTitle` defaults to `true`, collapsing the title into the sticky
header as the body content scrolls. Pass `@animateTitle={{false}}` to keep
the title static instead.

```gjs live preview
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { Button, SidePanel } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  {{#let (newObj open=false) as |context|}}
    <Button @type='primary' {{on 'click' (fn (set context 'open') true)}}>
      Open panel
    </Button>

    <SidePanel
      @open={{context.open}}
      @onRequestClose={{fn (set context 'open') false}}
      @size='md'
      @title='Incident management'
      @includeOverlay={{true}}
      @animateTitle={{false}}
    >
      <p style='height: 200vh;'>Scroll down within the panel — the title stays put.</p>
    </SidePanel>
  {{/let}}
</template>
```

## Without a title

When there's no `@title`, pass an `aria-label` so the panel is still
labelled for assistive technology.

```gjs live preview
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { Button, SidePanel } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  {{#let (newObj open=false) as |context|}}
    <Button @type='primary' {{on 'click' (fn (set context 'open') true)}}>
      Open panel
    </Button>

    <SidePanel
      @open={{context.open}}
      @onRequestClose={{fn (set context 'open') false}}
      @size='md'
      @includeOverlay={{true}}
      aria-label='SidePanel without title'
    >
      <p>Panel body content goes here.</p>
    </SidePanel>
  {{/let}}
</template>
```

## Resizable

Passing `@resizable={{true}}` renders a drag handle on the panel's inner
edge (on viewports wider than 768px) that lets a user resize it by
dragging, or via <kbd>Home</kbd>/<kbd>End</kbd>/<kbd>←</kbd>/<kbd>→</kbd>
when the handle is focused.

```gjs live preview
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { Button, SidePanel } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  {{#let (newObj open=false) as |context|}}
    <Button @type='primary' {{on 'click' (fn (set context 'open') true)}}>
      Open panel
    </Button>

    <SidePanel
      @open={{context.open}}
      @onRequestClose={{fn (set context 'open') false}}
      @size='md'
      @title='Resizable panel'
      @includeOverlay={{true}}
      @resizable={{true}}
    >
      <p>Drag the left edge of this panel to resize it.</p>
    </SidePanel>
  {{/let}}
</template>
```

## API Reference

<details>
<summary><h3>SidePanel</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/side-panel'
    @name='default'
  />
</template>
```
</details>
