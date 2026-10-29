/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import RouterLink from './router-link.gts';
import type { ButtonSignature } from '../button.gts';

export interface ButtonBaseSignature {
  Element: ButtonSignature['Element'];
  Args: Omit<ButtonSignature['Args'], 'kind'> & {
    /** Defaults to `primary`. `''` leaves the kind class out, as in React. */
    kind?: ButtonSignature['Args']['kind'] | '';
  };
  Blocks: ButtonSignature['Blocks'];
}

const DANGER_DESCRIBED = ['danger', 'danger--tertiary', 'danger--ghost'];

/**
 * Carbon React's `ButtonBase`: the `<button>` (or `<a>`, with `@href`) that
 * Button renders, alone or inside an icon-only button's tooltip.
 */
export default class ButtonBase extends Component<ButtonBaseSignature> {
  get kind() {
    return this.args.kind ?? 'primary';
  }

  get isLink() {
    const { as, href, route, externalRoute, disabled } = this.args;
    return !as && Boolean(href || route || externalRoute) && !disabled;
  }

  // Typed as the button or link `@as` stands in for, so callers can pass
  // `type="submit"`, as Carbon React's types do for `as`.
  get tag() {
    return (this.args.as ?? 'button') as 'a' | 'button';
  }

  get classes() {
    const { size, isExpressive, disabled, hasIconOnly, isSelected } = this.args;
    const sized =
      size && !isExpressive && ['xs', 'sm', 'md', 'lg'].includes(size);
    return [
      'cds--btn',
      (sized || size === 'xl' || size === '2xl') && `cds--btn--${size}`,
      size && `cds--layout--size-${size}`,
      this.kind && `cds--btn--${this.kind}`,
      disabled && 'cds--btn--disabled',
      isExpressive && 'cds--btn--expressive',
      hasIconOnly && 'cds--btn--icon-only',
      hasIconOnly &&
        isSelected &&
        this.kind === 'ghost' &&
        'cds--btn--selected',
    ]
      .filter(Boolean)
      .join(' ');
  }

  get dangerDescriptionId() {
    return DANGER_DESCRIBED.includes(this.kind) && this.args.dangerDescription
      ? `${guidFor(this)}-danger-description`
      : undefined;
  }

  get ariaPressed() {
    if (!this.args.hasIconOnly || this.kind !== 'ghost') return undefined;
    return this.args.isSelected === undefined
      ? undefined
      : String(this.args.isSelected);
  }

  <template>
    {{#if this.isLink}}
      <RouterLink
        @href={{@href}}
        @route={{@route}}
        @externalRoute={{@externalRoute}}
        @models={{@models}}
        @query={{@query}}
        class={{this.classes}}
        ...attributes
      >
        {{! Carbon React keeps the description in a link, without aria-describedby. }}
        {{#if this.dangerDescriptionId}}
          <span id={{this.dangerDescriptionId}} class="cds--visually-hidden">
            {{@dangerDescription}}
          </span>
        {{/if}}
        {{yield}}
        {{#if @renderIcon}}
          <@renderIcon @size={{16}} @svgClass="cds--btn__icon" />
        {{/if}}
      </RouterLink>
    {{else}}
      {{#let (element this.tag) as |Tag|}}
        <Tag
          class={{this.classes}}
          disabled={{@disabled}}
          type="button"
          href={{if @as @href}}
          aria-describedby={{this.dangerDescriptionId}}
          aria-pressed={{this.ariaPressed}}
          ...attributes
        >
          {{#if this.dangerDescriptionId}}
            <span id={{this.dangerDescriptionId}} class="cds--visually-hidden">
              {{@dangerDescription}}
            </span>
          {{/if}}
          {{yield}}
          {{#if @renderIcon}}
            <@renderIcon @size={{16}} @svgClass="cds--btn__icon" />
          {{/if}}
        </Tag>
      {{/let}}
    {{/if}}
  </template>
}
