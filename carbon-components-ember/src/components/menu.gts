import Component from '@glimmer/component';
import Icon from '../components/icon.gts';
import MenuItemComponent from '../components/menu/-item.gts';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';
import defaultTo from '../helpers/default-to.ts';
import { on } from '@ember/modifier';
import AttachTooltip from 'ember-attacher/components/attach-tooltip';
import type { WithBoundArgs } from '@glint/template';
import { OverflowMenuVertical } from '../icons.ts';

export interface MenuComponentSignature {
  Args: {
    icon?: typeof Icon;
    direction: 'bottom' | 'top';
    tooltip?: string;
    disabled?: boolean;
    danger?: boolean;
  };
  Blocks: {
    default: [
      WithBoundArgs<typeof MenuItemComponent, 'isDisabled' | 'isDanger'>,
    ];
  };
}


export default class MenuComponent extends Component<MenuComponentSignature> {

  get icon() {
    return this.args.icon || OverflowMenuVertical;
  }

  <template>
    <BasicDropdown @renderInPlace={{true}} as |dd|>
      <dd.Trigger
        @stopPropagation={{false}}
        @eventType='click'
        class='cds--overflow-menu {{if dd.isOpen "cds--overflow-menu--open"}}'
      >
        {{#if @tooltip}}
          <AttachTooltip @animation="none" @arrow={{true}} >{{@tooltip}}</AttachTooltip>
        {{/if}}
        <this.icon
          @btnClass='cds--overflow-menu__icon'
        />
      </dd.Trigger>
      <dd.Content class='cds--overflow-menu-options--open'>
        <ul
          {{on 'click' dd.actions.close}}
          style='display: block'
          class='cds--overflow-menu-options__content'
          tabindex='-1'
          data-floating-menu-direction={{defaultTo @direction 'buttom'}}
        >
          {{yield
            (component MenuItemComponent isDisabled=@disabled isDanger=@danger)
          }}
        </ul>
      </dd.Content>
    </BasicDropdown>
  </template>
}
