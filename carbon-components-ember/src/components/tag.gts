import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import type { ComponentLike } from '@glint/template';
import type Icon from './icon.gts';

export type Args = {
  /**
   * Specify the id for the tag.
   */
  id?: string;
  /**
   * Specify if the `Tag` is disabled.
   */
  disabled?: boolean;
  /**
   * A component used to render an icon.
   */
  renderIcon?: typeof Icon;
  /**
   * Specify the size of the Tag. Currently supports either `sm`, `md`
   * (default) or `lg` sizes.
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * **Experimental:** Provide a `decorator` component (e.g. AILabel) to be
   * rendered inside the Tag.
   */
  decorator?: ComponentLike;
  /**
   * @deprecated please use `decorator` instead.
   * **Experimental:** Provide a Slug/AILabel component to be rendered
   * inside the Tag.
   */
  slug?: ComponentLike;
  type:
    | 'red'
    | 'magenta'
    | 'purple'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'green'
    | 'gray'
    | 'cool-gray'
    | 'warm-gray'
    | 'high-contrast'
    | 'outline';
};

export interface TagInterface {
  Args: Args;
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

export default class TagComponent extends Component<TagInterface> {
  guid = guidFor(this);

  get id() {
    return this.args.id ?? `tag-${this.guid}`;
  }

  get type() {
    const types =
      'red magenta purple blue cyan teal green gray cool-gray warm-gray high-contrast outline'.split(
        ' ',
      );
    if (!types.includes(this.args.type)) {
      console.error(
        `${
          this.args.type
        } not supported type for Carbon::Tag, supported are:${types.join(',')}`,
      );
    }
    return this.args.type;
  }

  get classes() {
    const classes = ['cds--tag', `cds--tag--${this.type}`];
    if (this.args.disabled) classes.push('cds--tag--disabled');
    if (this.args.size) {
      classes.push(`cds--tag--${this.args.size}`);
      classes.push(`cds--layout--size-${this.args.size}`);
    }
    return classes.join(' ');
  }

  get showIcon() {
    return !!this.args.renderIcon && this.args.size !== 'sm';
  }

  <template>
    <div class={{this.classes}} id={{this.id}} ...attributes>
      {{#if this.showIcon}}
        <div class='cds--tag__custom-icon'>
          <@renderIcon @size='16' @svgClass='cds--tag__custom-icon-svg' />
        </div>
      {{/if}}
      <span class='cds--tag__label'>
        {{yield}}
      </span>
      {{#if @slug}}
        <@slug />
      {{else if @decorator}}
        <div class='cds--tag__decorator'>
          <@decorator />
        </div>
      {{/if}}
    </div>
  </template>
}
