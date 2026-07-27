import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { element } from 'ember-element-helper';

export interface OverflowMenuItemComponentSignature {
  Args: {
    itemText?: string;
    title?: string;
    requireTitle?: boolean;
    disabled?: boolean;
    hasDivider?: boolean;
    isDelete?: boolean;
    dangerDescription?: string;
    href?: string;
    className?: string;
    wrapperClassName?: string;
    onClick?: (...args: any) => void;
  };
  Element: HTMLButtonElement | HTMLAnchorElement;
  Blocks: {
    default: [];
  };
}

export default class OverflowMenuItem extends Component<OverflowMenuItemComponentSignature> {
  get tag() {
    return this.args.href ? 'a' : 'button';
  }

  get wrapperClass() {
    const classes = ['cds--overflow-menu-options__option'];
    if (this.args.hasDivider) classes.push('cds--overflow-menu--divider');
    if (this.args.isDelete) classes.push('cds--overflow-menu-options__option--danger');
    if (this.args.disabled) classes.push('cds--overflow-menu-options__option--disabled');
    if (this.args.wrapperClassName) classes.push(this.args.wrapperClassName);
    return classes.join(' ');
  }

  get btnClass() {
    const classes = ['cds--overflow-menu-options__btn'];
    if (this.args.className) classes.push(this.args.className);
    return classes.join(' ');
  }

  get title() {
    if (!this.args.requireTitle) return undefined;
    return this.args.title ?? this.args.itemText;
  }

  onClick = (evt: MouseEvent) => {
    return this.args.onClick?.(evt);
  };

  <template>
    {{#let (element this.tag) as |Tag|}}
      <li class={{this.wrapperClass}} role='none'>
        <Tag
          {{on 'click' this.onClick}}
          class={{this.btnClass}}
          href={{@href}}
          title={{this.title}}
          disabled={{@disabled}}
          role='menuitem'
          tabindex='-1'
          ...attributes
        >
          <span class='cds--overflow-menu-options__option-content'>
            {{@itemText}}{{yield}}
          </span>
          {{#if @dangerDescription}}
            {{#if @isDelete}}
              <span class='cds--visually-hidden'>{{@dangerDescription}}</span>
            {{/if}}
          {{/if}}
        </Tag>
      </li>
    {{/let}}
  </template>
}
