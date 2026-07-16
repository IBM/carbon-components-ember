/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { type TemplateOnlyComponent } from '@ember/component/template-only';
import AttachTooltip from 'ember-attacher/components/attach-tooltip';
import Critical from './icons/critical.ts';
import CriticalSeverity from './icons/critical-severity.ts';
import Caution from './icons/caution.ts';
import DiamondFill from './icons/diamond-fill.ts';
import LowSeverity from './icons/low-severity.ts';
import CircleFill from './icons/circle-fill.ts';
import CircleStroke from './icons/circle-stroke.ts';

export const ShapeIndicatorKinds = [
  'failed',
  'critical',
  'high',
  'medium',
  'low',
  'cautious',
  'undefined',
  'stable',
  'informative',
  'incomplete',
  'draft',
] as const;

export type ShapeIndicatorKind = (typeof ShapeIndicatorKinds)[number];

export type Args = {
  kind: ShapeIndicatorKind;
  label: string;
  compact?: boolean;
  shapeDescription?: string;
  textSize?: 12 | 14;
};

export interface ShapeIndicatorSignature {
  Element: HTMLDivElement;
  Args: Args;
}

const shapeIcons: Record<string, typeof Critical> = {
  failed: Critical,
  critical: CriticalSeverity,
  high: Caution,
  medium: DiamondFill,
  low: LowSeverity,
  cautious: Caution,
  undefined: DiamondFill,
  stable: CircleFill,
  informative: LowSeverity,
  draft: CircleStroke,
};

// `incomplete` has no dedicated icon in `@carbon/icons`, so it's reproduced
// here as an inline svg, matching the react implementation.
const IncompleteIcon: TemplateOnlyComponent<{ Element: SVGElement }> = <template>
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    fill='none'
    aria-hidden='true'
    ...attributes
  >
    <path
      fill='#fff'
      fill-opacity='0.01'
      d='M0 0h16v16H0z'
      style='mix-blend-mode: multiply;'
    />
    <path
      fill='#161616'
      d='M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2Zm0 2a4.004 4.004 0 0 1 4 4H4a4.004 4.004 0 0 1 4-4Z'
    />
  </svg>
</template>;

export default class ShapeIndicator extends Component<ShapeIndicatorSignature> {
  get isValidKind() {
    return ShapeIndicatorKinds.includes(this.args.kind);
  }

  get shapeIcon() {
    return shapeIcons[this.args.kind];
  }

  get classes() {
    const classes = ['cds--shape-indicator'];
    if (this.args.textSize === 14) classes.push('cds--shape-indicator--14');
    return classes.join(' ');
  }

  get iconClass() {
    return `cds--shape-indicator--${this.args.kind}`;
  }

  get accessibleLabel() {
    return this.args.shapeDescription ?? this.args.label;
  }

  <template>
    {{#if this.isValidKind}}
      <div class={{this.classes}} ...attributes>
        {{#if @compact}}
          <button type='button' class='cds--shape-indicator__button'>
            {{#if this.shapeIcon}}
              <this.shapeIcon
                @size={{16}}
                @svgClass={{this.iconClass}}
                @fill='currentColor'
              />
            {{else}}
              <IncompleteIcon class={{this.iconClass}} />
            {{/if}}
            <span class='cds--visually-hidden'>{{this.accessibleLabel}}</span>
            <AttachTooltip @arrow={{true}} @animation='none'>
              {{@label}}
            </AttachTooltip>
          </button>
        {{else}}
          {{#if this.shapeIcon}}
            <this.shapeIcon
              @size={{16}}
              @svgClass={{this.iconClass}}
              @fill='currentColor'
            />
          {{else}}
            <IncompleteIcon class={{this.iconClass}} />
          {{/if}}
          {{@label}}
        {{/if}}
      </div>
    {{/if}}
  </template>
}
