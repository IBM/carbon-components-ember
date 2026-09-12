/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

export type Args = {
  /** Enables the linear looping animation variant. */
  loop?: boolean;
  /**
   * Removes the ~1s entry delay so the dots appear immediately. Composes
   * with both the looping and non-looping variants.
   */
  quickLoad?: boolean;
};

export interface ProcessingSignature {
  Element: HTMLDivElement;
  Args: Args;
}

/**
 * A three-dot "processing"/"thinking" animation, used to indicate an
 * in-progress assistant response.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-processing`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/processing).
 * Doesn't collide with any Carbon React component name, so it stays
 * unprefixed.
 */
export default class Processing extends Component<ProcessingSignature> {
  get classes() {
    const classes = ['cds-aichat-processing'];
    classes.push(this.args.loop ? 'cds-aichat-processing--linear' : 'cds-aichat-processing--linear-no-loop');
    if (this.args.quickLoad) classes.push('cds-aichat-processing--quick-load');
    return classes.join(' ');
  }

  <template>
    <div class={{this.classes}} ...attributes>
      <svg class='cds-aichat-processing__dots' viewBox='0 0 32 32'>
        <circle class='cds-aichat-processing__dot cds-aichat-processing__dot--left' cx='8' cy='16' />
        <circle class='cds-aichat-processing__dot cds-aichat-processing__dot--center' cx='16' cy='16' r='2' />
        <circle class='cds-aichat-processing__dot cds-aichat-processing__dot--right' cx='24' cy='16' r='2' />
      </svg>
    </div>
  </template>
}
