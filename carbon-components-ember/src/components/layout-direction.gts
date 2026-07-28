import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import { element } from 'ember-element-helper';

export type LayoutDirectionType = 'ltr' | 'rtl';

export interface LayoutDirectionSignature {
  Element: HTMLElement;
  Args: {
    as?: keyof HTMLElementTagNameMap;
    dir: LayoutDirectionType;
  };
  Blocks: {
    default: [{ dir: LayoutDirectionType; isRTL: boolean }];
  };
}

/**
 * Set the layout direction (`ltr` or `rtl`) for a part of the page. Renders
 * a wrapper element with a `dir` attribute, which is inherited by descendant
 * elements per standard HTML/CSS behavior.
 *
 * The block receives `dir` and `isRTL`, the Ember analog of React's
 * `useLayoutDirection` hook.
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

  get isRTL() {
    return this.args.dir === 'rtl';
  }

  <template>
    {{#let (element this.tag) as |Tag|}}
      <Tag dir={{@dir}} ...attributes>
        {{yield (hash dir=@dir isRTL=this.isRTL)}}
      </Tag>
    {{/let}}
  </template>
}
