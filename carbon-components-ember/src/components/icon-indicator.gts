/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { on } from '@ember/modifier';
import Popover, { PopoverContent } from './popover.gts';
import ErrorFilled from './icons/error-filled.ts';
import CheckmarkFilled from './icons/checkmark-filled.ts';
import CheckmarkOutline from './icons/checkmark-outline.ts';
import WarningAltFilled from './icons/warning-alt-filled.ts';
import WarningAltInvertedFilled from './icons/warning-alt-inverted-filled.ts';
import UndefinedFilled from './icons/undefined-filled.ts';
import InProgress from './icons/in-progress.ts';
import Incomplete from './icons/incomplete.ts';
import CircleDash from './icons/circle-dash.ts';
import PendingFilled from './icons/pending-filled.ts';
import UnknownFilled from './icons/unknown-filled.ts';
import WarningSquareFilled from './icons/warning-square-filled.ts';

export const IconIndicatorKinds = [
  'failed',
  'caution-major',
  'caution-minor',
  'undefined',
  'succeeded',
  'normal',
  'in-progress',
  'incomplete',
  'not-started',
  'pending',
  'unknown',
  'informative',
] as const;

export type IconIndicatorKind = (typeof IconIndicatorKinds)[number];

export const IconIndicatorAlignments = [
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
  'right',
  'right-start',
  'right-end',
] as const;

export type IconIndicatorAlignment = (typeof IconIndicatorAlignments)[number];

const icons: Record<IconIndicatorKind, typeof ErrorFilled> = {
  failed: ErrorFilled,
  'caution-major': WarningAltInvertedFilled,
  'caution-minor': WarningAltFilled,
  undefined: UndefinedFilled,
  succeeded: CheckmarkFilled,
  normal: CheckmarkOutline,
  'in-progress': InProgress,
  incomplete: Incomplete,
  'not-started': CircleDash,
  pending: PendingFilled,
  unknown: UnknownFilled,
  informative: WarningSquareFilled,
};

export type Args = {
  /**
   * Specify how the tooltip should align with the icon in compact mode
   */
  align?: IconIndicatorAlignment;
  /**
   * Will auto-align the tooltip in compact mode so it stays within the
   * viewport, flipping to the opposite side when it would otherwise overflow
   */
  autoAlign?: boolean;
  /**
   * When true, displays only the icon with the label in a tooltip
   */
  compact?: boolean;
  /**
   * Description for the icon announced to screen readers in compact mode.
   * Defaults to `label` when not provided.
   */
  iconDescription?: string;
  /**
   * Specify the kind of icon to be used
   */
  kind: IconIndicatorKind;
  /**
   * Label next to the icon
   */
  label: string;
  /**
   * Specify the size of the Icon Indicator. Defaults to 16.
   */
  size?: 16 | 20;
};

export interface IconIndicatorSignature {
  Element: HTMLDivElement;
  Args: Args;
}

/**
 * `IconIndicator` pairs a status icon with a label to communicate the state
 * of an item, e.g. `failed`, `succeeded`, `in-progress`.
 *
 * ```gjs
 * import { IconIndicator } from 'carbon-components-ember/components';
 *
 * <template>
 *   <IconIndicator @kind='succeeded' @label='Succeeded' />
 * </template>
 * ```
 *
 * Pass `@compact={{true}}` to render only the icon, with the label shown in
 * a tooltip on hover/focus.
 */
export default class IconIndicator extends Component<IconIndicatorSignature> {
  @tracked isOpen = false;

  tooltipId = `${guidFor(this)}-icon-indicator-tooltip`;

  get size() {
    return this.args.size ?? 16;
  }

  get icon() {
    return icons[this.args.kind];
  }

  get classes() {
    const classes = ['cds--icon-indicator'];
    if (this.size === 20) classes.push('cds--icon-indicator--20');
    return classes.join(' ');
  }

  get iconClass() {
    return `cds--icon-indicator--${this.args.kind}`;
  }

  get accessibleLabel() {
    return this.args.iconDescription ?? this.args.label;
  }

  show = () => {
    this.isOpen = true;
  };

  hide = () => {
    this.isOpen = false;
  };

  <template>
    {{#if this.icon}}
      <div class={{this.classes}} ...attributes>
        {{#if @compact}}
          <Popover
            @open={{this.isOpen}}
            @align={{if @align @align 'right'}}
            @autoAlign={{@autoAlign}}
          >
            <span
              class='cds--icon-indicator__button'
              tabindex='0'
              aria-describedby={{this.tooltipId}}
              {{on 'mouseenter' this.show}}
              {{on 'mouseleave' this.hide}}
              {{on 'focusin' this.show}}
              {{on 'focusout' this.hide}}
            >
              <this.icon
                @size={{this.size}}
                @svgClass={{this.iconClass}}
                @fill='currentColor'
              />
              <span class='cds--visually-hidden'>{{this.accessibleLabel}}</span>
            </span>
            <PopoverContent
              id={{this.tooltipId}}
              role='tooltip'
              aria-hidden={{if this.isOpen 'false' 'true'}}
            >
              {{@label}}
            </PopoverContent>
          </Popover>
        {{else}}
          <this.icon
            @size={{this.size}}
            @svgClass={{this.iconClass}}
            @fill='currentColor'
          />
          {{@label}}
        {{/if}}
      </div>
    {{/if}}
  </template>
}
