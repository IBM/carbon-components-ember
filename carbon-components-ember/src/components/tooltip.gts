/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { modifier } from 'ember-modifier';
import { task, timeout } from 'ember-concurrency';
import { scheduleTask } from 'ember-lifeline';
import Popover, { PopoverContent } from './popover.gts';

import type { PopoverAlignment, PopoverSignature } from './popover.gts';
import { isActivationKey } from '../utils/keyboard.ts';

/**
 * Puts `attribute` (aria-labelledby / aria-describedby) on the trigger the
 * consumer yields: the wrapper's first element child. Carbon React clones the
 * trigger to add it; the wrapper span itself has no role, so ARIA naming
 * attributes aren't allowed there. Restores the trigger's own value on teardown.
 */
const describeTrigger = modifier(
  (
    wrapper: HTMLElement,
    [attribute, id]: ['aria-labelledby' | 'aria-describedby', string],
  ) => {
    const trigger = wrapper.firstElementChild;
    if (!trigger) return;

    const previous = trigger.getAttribute(attribute);
    trigger.setAttribute(attribute, id);

    return () => {
      if (previous === null) {
        trigger.removeAttribute(attribute);
      } else {
        trigger.setAttribute(attribute, previous);
      }
    };
  },
);

export interface TooltipSignature {
  Element: PopoverSignature['Element'];
  Args: {
    /** Where the tooltip is placed relative to the trigger */
    align?: PopoverAlignment;
    /**
     * Label text identifying the trigger. It names the trigger element through
     * `aria-labelledby` (use it for icon-only triggers).
     */
    label?: string;
    /** Description text for the trigger, linked through `aria-describedby` */
    description?: string;
    /**
     * **Experimental:** Keeps the tooltip within the viewport (or
     * `autoAlignBoundary`, if provided), as `Popover`'s `autoAlign` does.
     */
    autoAlign?: boolean;
    /**
     * **Experimental:** Specify a bounding element to be used for autoAlign
     * calculations. The viewport is used by default.
     */
    autoAlignBoundary?: PopoverSignature['Args']['autoAlignBoundary'];
    /** Close the tooltip when the trigger is activated (click, Enter, Space) */
    closeOnActivation?: boolean;
    /** Render the tooltip open on initial render */
    defaultOpen?: boolean;
    /** Render a drop shadow on the tooltip */
    dropShadow?: boolean;
    /** Delay in ms before the tooltip shows on hover */
    enterDelayMs?: number;
    /** Render with the high contrast theme */
    highContrast?: boolean;
    /** Delay in ms before the tooltip hides after the pointer leaves */
    leaveDelayMs?: number;
  };
  Blocks: {
    /** The trigger element the tooltip is attached to */
    default: [];
    /** Custom tooltip content, used instead of @label/@description */
    content: [];
  };
}

export default class Tooltip extends Component<TooltipSignature> {
  @tracked open: boolean;

  constructor(owner: Owner, args: TooltipSignature['Args']) {
    super(owner, args);
    this.open = args.defaultOpen ?? false;
  }

  get id() {
    return `${guidFor(this)}-tooltip`;
  }

  get align() {
    return this.args.align ?? 'top';
  }

  get dropShadow() {
    return this.args.dropShadow ?? false;
  }

  get highContrast() {
    return this.args.highContrast ?? true;
  }

  get triggerAttribute() {
    return this.args.label ? 'aria-labelledby' : 'aria-describedby';
  }

  setOpen = task(
    { restartable: true },
    async (open: boolean, delayMs: number) => {
      await timeout(delayMs);
      this.open = open;
    },
  );

  onMouseEnter = () => {
    void this.setOpen.perform(true, this.args.enterDelayMs ?? 100);
  };

  onMouseLeave = () => {
    void this.setOpen.perform(false, this.args.leaveDelayMs ?? 300);
  };

  onFocusIn = () => {
    void this.setOpen.cancelAll();
    // Deferred via the runloop: a focusin/focusout can fire synchronously as
    // a side effect of a DOM mutation (e.g. a focused trigger becoming
    // `disabled`, which browsers blur automatically), which can happen while
    // Glimmer is still mid-render. Setting a tracked property directly in
    // that window trips the "already used in this computation" assertion.
    scheduleTask(this, 'actions', () => {
      this.open = true;
    });
  };

  onFocusOut = () => {
    void this.setOpen.cancelAll();
    scheduleTask(this, 'actions', () => {
      this.open = false;
    });
  };

  onKeyDown = (event: KeyboardEvent) => {
    if (this.open && event.key === 'Escape') {
      event.stopPropagation();
      this.open = false;
    }
    if (this.args.closeOnActivation && isActivationKey(event)) {
      void this.setOpen.cancelAll();
      this.open = false;
    }
  };

  onClick = () => {
    if (this.args.closeOnActivation) {
      void this.setOpen.cancelAll();
      this.open = false;
    }
  };

  <template>
    <Popover
      class="cds--tooltip"
      @align={{this.align}}
      @autoAlign={{@autoAlign}}
      @autoAlignBoundary={{@autoAlignBoundary}}
      @dropShadow={{this.dropShadow}}
      @highContrast={{this.highContrast}}
      @open={{this.open}}
      ...attributes
      {{on "mouseenter" this.onMouseEnter}}
      {{on "mouseleave" this.onMouseLeave}}
      {{on "focusin" this.onFocusIn}}
      {{on "focusout" this.onFocusOut}}
      {{on "keydown" this.onKeyDown}}
      {{on "click" this.onClick}}
    >
      <span
        class="cds--tooltip-trigger__wrapper"
        {{describeTrigger this.triggerAttribute this.id}}
      >
        {{yield}}
      </span>
      <PopoverContent
        class="cds--tooltip-content"
        id={{this.id}}
        role="tooltip"
        aria-hidden={{if this.open "false" "true"}}
      >
        {{#if (has-block "content")}}
          {{yield to="content"}}
        {{else if @label}}
          {{@label}}
        {{else}}
          {{@description}}
        {{/if}}
      </PopoverContent>
    </Popover>
  </template>
}
