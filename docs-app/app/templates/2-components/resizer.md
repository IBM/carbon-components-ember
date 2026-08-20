<ThemeSwitcher />

# Resizer

A draggable (and keyboard-operable) handle placed between two sibling
elements. By default `Resizer` resizes its previous and next DOM siblings
directly as it's dragged; pass `@onResize` to take full control instead (for
example, to drive a CSS Grid's `grid-template-columns`). Any content passed
to the default block is rendered inside the handle, which is useful for a
custom drag icon.

Drag the handle with a mouse, or focus it and use the arrow keys (hold
<kbd>Shift</kbd> for larger steps, or press <kbd>Home</kbd>/<kbd>End</kbd> to
jump to a boundary). Double-clicking the handle resets the siblings to the
size they had when it was inserted.

## Single panel (no boundaries)

The simplest case &mdash; a panel followed by a horizontal `Resizer`. The
panel's height follows its content, but can be resized freely.

```gjs live preview
import { Resizer } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />
  <div style='display: flex; flex-direction: column; width: 100%; max-width: 600px; overflow: hidden;'>
    <div style='padding: 1rem; background: var(--cds-layer); min-block-size: 3rem; overflow: auto;'>
      <h5>Single panel</h5>
      <p>Drag the handle below, or focus it and use the arrow keys.</p>
    </div>
    <Resizer @orientation='horizontal' />
  </div>
</template>
```

## Single panel (bounded), with `@onResizeEnd`

`@onResizeEnd` is called once a resize interaction ends (mouse-up, or a
debounced moment after the last key-driven resize) with the resizer's own
element &mdash; useful for custom accessibility announcements.

```gjs live preview
import { fn } from '@ember/helper';
import { Resizer } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

function announce(setLastHeight, _event, element) {
  setLastHeight(element.style.height || 'initial');
}

<template>
  <ThemeSupport />
  <br />
  {{#let (newObj lastHeight='initial') as |context|}}
    <div style='width: 100%; max-width: 600px; height: 200px; overflow: hidden; display: flex; flex-direction: column;'>
      <div style='padding: 1rem; background: var(--cds-layer); overflow: auto; flex: 1;'>
        <h5>Single panel (bounded)</h5>
        <p>Constrained within a 200px-tall container.</p>
      </div>
      <Resizer @orientation='horizontal' @onResizeEnd={{fn announce (set context 'lastHeight')}} />
    </div>
    <p>Last announced height: {{context.lastHeight}}</p>
  {{/let}}
</template>
```

## Single panel (overlay)

A resizer also works on an absolutely-positioned panel sliding over other
content.

```gjs live preview
import { Resizer } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />
  <div style='position: relative; width: 100%; max-width: 600px; height: 300px; overflow: hidden; border: 1px solid var(--cds-border-subtle-01, #e0e0e0);'>
    <div style='padding: 1rem; height: 100%; overflow: auto;'>
      <h5>Main content</h5>
      <p>This stays fixed in the background while the overlay panel below is resized from its top edge.</p>
    </div>
    <div style='position: absolute; bottom: 0; left: 0; width: 100%; max-height: 300px; background: var(--cds-layer); display: flex; flex-direction: column;'>
      <Resizer @orientation='horizontal' />
      <div style='padding: 1rem; overflow: auto; height: 120px;'>
        <h5>Overlay panel</h5>
        <p>Resize me from the top edge.</p>
      </div>
    </div>
  </div>
</template>
```

## Two panels (horizontal)

Placed between two stacked panels, a horizontal `Resizer` grows one and
shrinks the other.

```gjs live preview
import { Resizer } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />
  <div style='display: flex; flex-direction: column; width: 100%; max-width: 600px; height: 300px; overflow: hidden;'>
    <div style='height: 100%; background: var(--cds-layer); padding: 1rem; overflow: auto; min-block-size: 48px;'>
      <h5>Top panel</h5>
    </div>
    <Resizer @orientation='horizontal' />
    <div style='height: 100%; background: var(--cds-layer); padding: 1rem; overflow: auto; min-block-size: 48px;'>
      <h5>Bottom panel</h5>
    </div>
  </div>
</template>
```

## Two panels (vertical)

A vertical `Resizer` resizes side-by-side panels horizontally &mdash; a
common shape for navigation-plus-content or editor-plus-preview layouts.

```gjs live preview
import { Resizer } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />
  <div style='display: flex; width: 100%; max-width: 600px; height: 300px; overflow: hidden;'>
    <div style='background: var(--cds-layer); padding: 1rem; overflow: auto; min-inline-size: 48px;'>
      <h5>Left panel</h5>
    </div>
    <Resizer @orientation='vertical' />
    <div style='background: var(--cds-layer); padding: 1rem; overflow: auto; min-inline-size: 48px;'>
      <h5>Right panel</h5>
    </div>
  </div>
</template>
```

## Four panels

Horizontal and vertical resizers compose &mdash; each only ever affects its
own previous/next DOM sibling.

```gjs live preview
import { Resizer } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />
  <div style='display: flex; height: 300px; width: 100%; max-width: 600px;'>
    <div style='overflow: auto; min-inline-size: 3rem; width: 50%; display: flex; flex-direction: column;'>
      <div style='padding: 1rem; background: var(--cds-layer); overflow: auto; min-block-size: 3rem; height: 50%;'>
        <h5>Top left</h5>
      </div>
      <Resizer @orientation='horizontal' />
      <div style='padding: 1rem; background: var(--cds-layer); overflow: auto; min-block-size: 3rem; height: 50%;'>
        <h5>Bottom left</h5>
      </div>
    </div>
    <Resizer @orientation='vertical' />
    <div style='overflow: auto; min-inline-size: 3rem; width: 50%; display: flex; flex-direction: column;'>
      <div style='padding: 1rem; background: var(--cds-layer); overflow: auto; min-block-size: 3rem; height: 50%;'>
        <h5>Top right</h5>
      </div>
      <Resizer @orientation='horizontal' />
      <div style='padding: 1rem; background: var(--cds-layer); overflow: auto; min-block-size: 3rem; height: 50%;'>
        <h5>Bottom right</h5>
      </div>
    </div>
  </div>
</template>
```

## Fully controlled, via `@onResize` (CSS Grid)

Passing `@onResize` opts out of the default sibling-resizing behavior
entirely &mdash; the resizer becomes fully controlled, and the consumer
decides what a `delta` means. This example drives a CSS Grid's
`grid-template-columns` instead of setting `height`/`width` directly, and
also uses `@onDoubleClick` to reset the grid to an even split.

```gjs live preview
import { fn } from '@ember/helper';
import { Resizer } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

function onResize(context, setFraction, _event, delta) {
  setFraction(Math.max(0.1, Math.min(0.9, context.fraction + delta / 600)));
}

<template>
  <ThemeSupport />
  <br />
  {{#let (newObj fraction=0.5) as |context|}}
    <div
      style='display: grid; grid-template-columns: {{context.fraction}}fr auto {{context.fraction}}fr; width: 100%; max-width: 600px; height: 200px;'
    >
      <div style='background: var(--cds-layer); padding: 1rem; overflow: auto; min-inline-size: 48px;'>
        <h5>Left panel</h5>
      </div>
      <Resizer
        @orientation='vertical'
        @onResize={{fn onResize context (set context 'fraction')}}
        @onDoubleClick={{fn (set context 'fraction') 0.5}}
      />
      <div style='background: var(--cds-layer); padding: 1rem; overflow: auto; min-inline-size: 48px;'>
        <h5>Right panel</h5>
      </div>
    </div>
  {{/let}}
</template>
```

## With a custom drag handle

Content passed to the default block renders inside the handle &mdash; useful
for a visible drag icon such as `DragVertical` from
`carbon-components-ember/icons`.

```gjs live preview
import { Resizer } from 'carbon-components-ember/components';
import { DragVertical } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />
  <div style='display: flex; flex-direction: column; width: 100%; max-width: 400px; height: 160px; overflow: hidden;'>
    <div style='padding: 1rem; background: var(--cds-layer); min-block-size: 3rem; overflow: auto;'>
      <p>This handle shows a custom drag icon.</p>
    </div>
    <Resizer @orientation='horizontal'>
      <DragVertical
        @size='16'
        @svgClass='cds--resizer__custom-icon'
        style='position: absolute; top: -6px; left: 50%; transform: translateX(-50%);'
      />
    </Resizer>
  </div>
</template>
```

## API Reference

<details>
<summary><h3>Resizer</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/resizer'
    @name='default'
  />
</template>
```
</details>
