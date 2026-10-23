import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import CopyTrigger from './-private/copy-trigger.gts';
import type { ButtonSignature } from './button.gts';
import type { PopoverAlignment } from './popover.gts';

export interface CopySignature {
  Element: ButtonSignature['Element'];
  Args: {
    /** How the tooltip aligns with the button. Defaults to `'bottom'`. */
    align?: PopoverAlignment;
    /** **Experimental**: keeps the tooltip in view. */
    autoAlign?: boolean;
    /**
     * Names the button, and is its tooltip until the feedback shows: Carbon
     * React's `aria-label`. Without it, the button has no accessible name.
     */
    ariaLabel?: string;
    disabled?: boolean;
    /** Shown in the tooltip once the button is clicked. Defaults to `'Copied!'`. */
    feedback?: string;
    /** How long the feedback shows, in milliseconds. Defaults to `2000`. */
    feedbackTimeout?: number;
  };
  Blocks: {
    /** The button's content, such as an icon. */
    default: [];
  };
}

/**
 * Carbon React's Copy: a button whose tooltip shows feedback when it's
 * clicked. It copies nothing itself; copy in a click handler, or use
 * `CopyButton`, which copies.
 */
export default class Copy extends Component<CopySignature> {
  @tracked showingFeedback = false;

  get align(): PopoverAlignment {
    return this.args.align ?? 'bottom';
  }

  get feedbackTimeout() {
    return this.args.feedbackTimeout ?? 2000;
  }

  get label() {
    return this.showingFeedback
      ? (this.args.feedback ?? 'Copied!')
      : (this.args.ariaLabel ?? '');
  }

  hideFeedback = task({ restartable: true }, async () => {
    await timeout(this.feedbackTimeout);
    this.showingFeedback = false;
  });

  // As Carbon React: a click handler that prevents the default skips it.
  showFeedback = (event: MouseEvent) => {
    if (event.defaultPrevented) return;
    this.showingFeedback = true;
    void this.hideFeedback.perform();
  };

  <template>
    <CopyTrigger
      @align={{this.align}}
      @autoAlign={{@autoAlign}}
      @disabled={{@disabled}}
      @label={{this.label}}
      @leaveDelayMs={{if this.showingFeedback this.feedbackTimeout 100}}
      ...attributes
      {{on "click" this.showFeedback}}
    >
      {{yield}}
    </CopyTrigger>
  </template>
}
