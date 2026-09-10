<ThemeSwitcher />

# Carousel

`Carousel` is a view-stack carousel for
[Carbon AI Chat](https://github.com/carbon-design-system/carbon-ai-chat).
Each direct child passed to its default block becomes one view. Unlike the
rest of this addon's AI Chat components, navigation, the change event and the
`N / M` index readout aren't reimplemented here — they delegate directly to
`@carbon/utilities`'s `initCarousel`, the same view-stack engine upstream
itself uses.

```gjs live preview
import { Carousel } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <Carousel @previousBtnText='Previous' @nextBtnText='Next'>
    <div>View 1: Welcome to the carousel.</div>
    <div>View 2: Here's some more content.</div>
    <div>View 3: And a final view.</div>
  </Carousel>
</template>
```

## Reacting to view changes

`@onChange` is called with `initCarousel`'s response object whenever the
active view finishes transitioning, including once on initial mount.

```gjs live preview
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { Carousel } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

class Demo extends Component {
  @tracked lastChange = 'none yet';

  onChange = (data) => {
    this.lastChange = `view ${data.currentIndex + 1} of ${data.totalViews}`;
  };

  <template>
    <ThemeSupport />
    <p>Last change: {{this.lastChange}}</p>
    <Carousel
      @previousBtnText='Previous'
      @nextBtnText='Next'
      @onChange={{this.onChange}}
    >
      <div>View 1</div>
      <div>View 2</div>
    </Carousel>
  </template>
}

<template><Demo /></template>
```

## API Reference

<details>
<summary><h3>Carousel</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/carousel'
    @name='default'
  />
</template>
```
</details>
