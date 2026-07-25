import Component from '@glimmer/component';
import { element } from 'ember-element-helper';

export type LayoutDirectionType = 'ltr' | 'rtl';

export interface LayoutDirectionSignature {
  Element: HTMLElement;
  Args: {
    as?: keyof HTMLElementTagNameMap;
    dir: LayoutDirectionType;
  };
  Blocks: {
    default: [];
  };
}

/**
 * Set the layout direction (`ltr` or `rtl`) for a part of the page. Renders
 * a wrapper element with a `dir` attribute, which is inherited by descendant
 * elements per standard HTML/CSS behavior.
 *
 * ```gjs
 * import { LayoutDirection } from 'carbon-components-ember/components';
 *
 * <template>
 *   <LayoutDirection @dir='rtl'>
 *     <p>مرحبا بالعالم</p>
 *   </LayoutDirection>
 * </template>
 * ```
 */
export default class LayoutDirection extends Component<LayoutDirectionSignature> {
  get tag(): keyof HTMLElementTagNameMap {
    return this.args.as ?? 'div';
  }

  <template>
    {{#let (element this.tag) as |Tag|}}
      <Tag dir={{@dir}} ...attributes>
        {{yield}}
      </Tag>
    {{/let}}
  </template>
}
