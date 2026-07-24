/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { element } from 'ember-element-helper';

export type LayoutDensity = 'condensed' | 'normal';

export type LayoutSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const sizes: LayoutSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const densities: LayoutDensity[] = ['condensed', 'normal'];

export interface LayoutSignature {
  Element: HTMLElement;
  Args: {
    /**
     * The element type to render Layout as.
     */
    as?: keyof HTMLElementTagNameMap;
    /**
     * Specify the desired density of components within this layout.
     */
    density?: LayoutDensity;
    /**
     * Specify the desired size of components within this layout.
     */
    size?: LayoutSize;
  };
  Blocks: {
    default: [];
  };
}

/**
 * The `Layout` component provides a way to set layout contexts for specific
 * parts of an application. It controls layout-related settings like size and
 * density for all components rendered within it that support these options.
 *
 * ```gjs
 * import { Layout } from 'carbon-components-ember/components';
 *
 * <template>
 *   <Layout @size="sm" @density="condensed">
 *     ...
 *   </Layout>
 * </template>
 * ```
 */
export default class Layout extends Component<LayoutSignature> {
  get tag(): keyof HTMLElementTagNameMap {
    return this.args.as ?? 'div';
  }

  get classes() {
    const classes = ['cds--layout'];
    if (this.args.size && sizes.includes(this.args.size)) {
      classes.push(`cds--layout--size-${this.args.size}`);
    }
    if (this.args.density && densities.includes(this.args.density)) {
      classes.push(`cds--layout--density-${this.args.density}`);
    }
    return classes.join(' ');
  }

  <template>
    {{#let (element this.tag) as |Tag|}}
      <Tag class={{this.classes}} ...attributes>
        {{yield}}
      </Tag>
    {{/let}}
  </template>
}

export interface LayoutConstraintValue {
  min?: LayoutDensity | LayoutSize | null;
  default?: LayoutDensity | LayoutSize | null;
  max?: LayoutDensity | LayoutSize | null;
}

export interface LayoutConstraintSignature {
  Element: HTMLElement;
  Args: {
    /**
     * The element type to render LayoutConstraint as.
     */
    as?: keyof HTMLElementTagNameMap;
    /**
     * Specify the desired layout density constraints of this element's
     * children.
     */
    density?: LayoutConstraintValue | null;
    /**
     * Specify the desired layout size constraints of this element's
     * children.
     */
    size?: LayoutConstraintValue | null;
  };
  Blocks: {
    default: [];
  };
}

function constraintClasses(
  group: string,
  constraint?: LayoutConstraintValue | null,
) {
  if (!constraint) {
    return [];
  }
  const classes = [];
  if (constraint.default) {
    classes.push(
      `cds--layout-constraint--${group}__default-${constraint.default}`,
    );
  }
  if (constraint.min) {
    classes.push(`cds--layout-constraint--${group}__min-${constraint.min}`);
  }
  if (constraint.max) {
    classes.push(`cds--layout-constraint--${group}__max-${constraint.max}`);
  }
  return classes;
}

/**
 * `LayoutConstraint` applies specific layout size/density constraints to
 * children components that might otherwise differ from their own
 * preferences.
 *
 * ```gjs
 * import { LayoutConstraint } from 'carbon-components-ember/components';
 *
 * <template>
 *   <LayoutConstraint @size={{hash default="md" min="sm" max="lg"}}>
 *     ...
 *   </LayoutConstraint>
 * </template>
 * ```
 */
export class LayoutConstraint extends Component<LayoutConstraintSignature> {
  get tag(): keyof HTMLElementTagNameMap {
    return this.args.as ?? 'div';
  }

  get classes() {
    return [
      ...constraintClasses('size', this.args.size),
      ...constraintClasses('density', this.args.density),
    ].join(' ');
  }

  <template>
    {{#let (element this.tag) as |Tag|}}
      <Tag class={{this.classes}} ...attributes>
        {{yield}}
      </Tag>
    {{/let}}
  </template>
}
