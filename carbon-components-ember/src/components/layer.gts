/**
 * Copyright IBM Corp. 2016, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { element } from 'ember-element-helper';
import type { WithBoundArgs } from '@glint/template';

export type LayerLevel = 0 | 1 | 2;

const LEVEL_CLASSES = ['one', 'two', 'three'] as const;
const MIN_LEVEL = 0;
const MAX_LEVEL = 2;

function clampLevel(level: number): LayerLevel {
  return Math.min(Math.max(level, MIN_LEVEL), MAX_LEVEL) as LayerLevel;
}

export interface LayerSignature {
  Element: HTMLElement;
  Args: {
    /** Specify the element type to render, defaults to `div` */
    as?: keyof HTMLElementTagNameMap;
    /**
     * Specify the layer level and override any existing level based on
     * hierarchy. Defaults to `1`, which matches the page's implicit base
     * layer (see `<Theme>`, which applies `cds--layer-one` at the root).
     */
    level?: LayerLevel;
    /** Applies a background color set to the layer's `$layer-background` token */
    withBackground?: boolean;
  };
  Blocks: {
    /**
     * Yields a `Layer` pre-bound to the correct next nesting level. Ember
     * has no equivalent of React's ambient `LayerContext`, so a bare
     * `<Layer>` always renders as if it were the first level of nesting
     * (matching the common case); use the yielded component to nest
     * `Layer`s more than one level deep so each one's level increments
     * correctly.
     */
    default: [WithBoundArgs<typeof Layer, 'level'>];
  };
}

/**
 * Renders content on a specific Carbon layer. Each layer has a set of token
 * values associated with it (`cds--layer-one`, `cds--layer-two`,
 * `cds--layer-three`), which components like `Tile` key off of to determine
 * their own background. `Layer`s can be nested up to three levels deep; past
 * that, the level stays clamped at three.
 *
 * ```gjs
 * import { Layer } from 'carbon-components-ember/components';
 *
 * <template>
 *   <ChildComponent />
 *   <Layer as |L|>
 *     <ChildComponent />
 *     <L>
 *       <ChildComponent />
 *     </L>
 *   </Layer>
 * </template>
 * ```
 */
export default class Layer extends Component<LayerSignature> {
  get tag(): keyof HTMLElementTagNameMap {
    return this.args.as ?? 'div';
  }

  get level(): LayerLevel {
    return this.args.level ?? 1;
  }

  get nextLevel(): LayerLevel {
    return clampLevel(this.level + 1);
  }

  get classes() {
    const classes = [`cds--layer-${LEVEL_CLASSES[this.level]}`];
    if (this.args.withBackground) {
      classes.push('cds--layer__with-background');
    }
    return classes.join(' ');
  }

  <template>
    {{#let (element this.tag) as |Tag|}}
      <Tag class={{this.classes}} ...attributes>
        {{yield (component Layer level=this.nextLevel)}}
      </Tag>
    {{/let}}
  </template>
}
