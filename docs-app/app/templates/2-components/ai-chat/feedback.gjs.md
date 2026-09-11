<ThemeSwitcher />

# Feedback

`Feedback` renders a panel requesting free-text and/or categorized feedback
on a chat response, typically opened from a `FeedbackButtons` thumbs-down
click.

```gjs live preview
import { tracked } from '@glimmer/tracking';
import { array } from '@ember/helper';
import Component from '@glimmer/component';
import { Feedback } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

class Demo extends Component {
  @tracked lastSubmission = 'none yet';

  onSubmit = (details) => {
    this.lastSubmission = JSON.stringify(details);
  };

  <template>
    <ThemeSupport />
    <p>Last submission: {{this.lastSubmission}}</p>
    <Feedback
      @isOpen={{true}}
      @showBody={{true}}
      @showTextArea={{true}}
      @categories={{array 'Inaccurate' 'Unhelpful' 'Offensive'}}
      @disclaimerCheckbox='I agree my feedback may be reviewed'
      @onSubmit={{this.onSubmit}}
    />
  </template>
}

<template><Demo /></template>
```

## Read-only mode

`@isReadonly` disables every control (categories, text area, disclaimer
checkbox, submit) without hiding the panel.

```gjs live preview
import { array, hash } from '@ember/helper';
import { Feedback } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <Feedback
    @isOpen={{true}}
    @isReadonly={{true}}
    @categories={{array 'Inaccurate' 'Unhelpful'}}
    @initialValues={{hash text='Already submitted' selectedCategories=(array 'Inaccurate')}}
    @showTextArea={{true}}
  />
</template>
```

## API Reference

<details>
<summary><h3>Feedback</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/feedback'
    @name='default'
  />
</template>
```
</details>
