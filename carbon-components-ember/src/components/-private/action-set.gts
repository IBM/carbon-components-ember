/**
 * Copyright IBM Corp. 2021, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import Button from '../button.gts';
import InlineLoading from '../inline-loading.gts';
import type { ButtonSignature } from '../button.gts';

export interface ActionSetAction {
  /** The button's text. */
  label: string;
  /** The button's style. Defaults to `primary`. */
  kind?: ButtonSignature['Args']['kind'];
  /** Disables the button. */
  disabled?: boolean;
  /** Shows a loading indicator in the button, and disables it. */
  loading?: boolean;
  /** Uses Carbon's expressive button style. Defaults to `true`. */
  isExpressive?: boolean;
  /** The button's size, unless the set has a `@buttonSize`. */
  size?: ButtonSignature['Args']['size'];
  /** Classes added to the button. */
  className?: string;
  onClick?: (event: MouseEvent) => void;
}

export type ActionSetSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ActionSetSignature {
  Element: HTMLDivElement;
  Args: {
    /**
     * The action buttons to show, each an object describing a Carbon button.
     */
    actions: ActionSetAction[];
    /**
     * The size of every button, overriding the `size` of each action.
     */
    buttonSize?: ActionSetSize;
    /**
     * Never stack the buttons, even where the size would: `sm`, or `md` with
     * three or more actions.
     */
    disableStacking?: boolean;
    /**
     * The size of the set. Different button arrangements fit different sizes.
     * Defaults to `md`.
     */
    size?: ActionSetSize;
  };
}

// Ghost buttons first, then danger ghost, tertiary, most others, danger and
// primary last (the opposite when stacked).
const KIND_ORDER: Record<string, number> = {
  ghost: 1,
  'danger--ghost': 2,
  tertiary: 3,
  danger: 5,
  primary: 6,
};

function order(action: ActionSetAction) {
  return KIND_ORDER[action.kind ?? 'primary'] ?? 4;
}

/**
 * Carbon React's `ActionSet`, which `SidePanel` uses for its actions: a
 * `ButtonSet` of buttons laid out by the set's size and their kinds.
 */
export default class ActionSet extends Component<ActionSetSignature> {
  get size(): ActionSetSize {
    return this.args.size ?? 'md';
  }

  get stacking() {
    if (this.args.disableStacking) return false;
    return (
      this.size === 'sm' || (this.size === 'md' && this.args.actions.length > 2)
    );
  }

  get ordered() {
    const direction = this.stacking ? -1 : 1;
    return [...this.args.actions].sort(
      (a, b) => (order(a) - order(b)) * direction,
    );
  }

  get classes() {
    const count = this.args.actions.length;
    const row = this.stacking
      ? undefined
      : (['single', 'double', 'triple', 'quadruple'][Math.min(count, 4) - 1] ??
        undefined);
    return [
      'cds--btn-set',
      this.stacking && 'cds--btn-set--stacked',
      'cds--action-set',
      row && `cds--action-set--row-${row}`,
      this.stacking && 'cds--action-set--stacking',
      `cds--action-set--${this.size}`,
    ]
      .filter(Boolean)
      .join(' ');
  }

  get buttons() {
    return this.ordered.map((action) => {
      const ghost = action.kind === 'ghost' || action.kind === 'danger--ghost';
      const expressive = action.isExpressive ?? true;
      return {
        action,
        size: this.args.buttonSize ?? action.size,
        disabled: Boolean(action.disabled || action.loading),
        expressive,
        classes: [
          'cds--action-set__action-button',
          ghost && 'cds--action-set__action-button--ghost',
          expressive && 'cds--action-set__action-button--expressive',
          action.className,
        ]
          .filter(Boolean)
          .join(' '),
      };
    });
  }

  click = (action: ActionSetAction, event: MouseEvent) => {
    action.onClick?.(event);
  };

  <template>
    <div class={{this.classes}} role="presentation" ...attributes>
      {{#each this.buttons as |button|}}
        <Button
          @kind={{button.action.kind}}
          @size={{button.size}}
          @isExpressive={{button.expressive}}
          @disabled={{button.disabled}}
          class={{button.classes}}
          {{on "click" (fn this.click button.action)}}
        >
          {{button.action.label}}
          {{#if button.action.loading}}<InlineLoading />{{/if}}
        </Button>
      {{/each}}
    </div>
  </template>
}
