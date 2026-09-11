<ThemeSwitcher />

# FeedbackButtons

`FeedbackButtons` renders a thumbs-up / thumbs-down pair used to collect
quick feedback on a chat response, each optionally wired to its own details
panel (typically a `Feedback`) via `aria-controls`.

```gjs live preview
import { tracked } from '@glimmer/tracking';
import { array } from '@ember/helper';
import Component from '@glimmer/component';
import { Feedback, FeedbackButtons } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

class Demo extends Component {
  @tracked positiveSelected = false;
  @tracked negativeSelected = false;

  onClick = (isPositive) => {
    this.positiveSelected = isPositive;
    this.negativeSelected = !isPositive;
  };

  <template>
    <ThemeSupport />
    <FeedbackButtons
      @isPositiveSelected={{this.positiveSelected}}
      @isNegativeSelected={{this.negativeSelected}}
      @hasNegativeDetails={{true}}
      @isNegativeOpen={{this.negativeSelected}}
      @panelId='response-1'
      @onClick={{this.onClick}}
    />
    {{#if this.negativeSelected}}
      <Feedback
        @id='response-1-feedback-negative'
        @isOpen={{true}}
        @categories={{array 'Inaccurate' 'Unhelpful'}}
      />
    {{/if}}
  </template>
}

<template><Demo /></template>
```

## API Reference

<details>
<summary><h3>FeedbackButtons</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/feedback-buttons'
    @name='default'
  />
</template>
```
</details>
