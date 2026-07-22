import Component from '@glimmer/component';
import Icon from '../components/icon.gts';
import MenuItemComponent from '../components/overflow-menu/-item.gts';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';
import defaultTo from '../helpers/default-to.ts';
import { on } from '@ember/modifier';
import AttachTooltip from 'ember-attacher/components/attach-tooltip';
import type { WithBoundArgs } from '@glint/template';
import { OverflowMenuVertical } from '../icons.ts';

export interface OverflowMenuComponentSignature {
  Args: {
    icon?: typeof Icon;
    direction: 'bottom' | 'top';
    tooltip?: string;
    disabled?: boolean;
    danger?: boolean;
    eventType?: 'click' | 'mousedown';
  };
  Blocks: {
    default: [
      WithBoundArgs<typeof MenuItemComponent, 'isDisabled' | 'isDanger'>,
    ];
  };
}

export default class OverflowMenuComponent extends Component<OverflowMenuComponentSignature> {
  get icon() {
    return this.args.icon || OverflowMenuVertical;
  }

  <template>
    <BasicDropdown as |dd|>
      <dd.Trigger
        @stopPropagation={{false}}
        {{! @glint-expect-error: @gavant/glint-template-types types eventType as required, but ember-basic-dropdown itself treats it as optional and defaults to 'click' }}
        @eventType={{@eventType}}
        class='cds--overflow-menu {{if dd.isOpen "cds--overflow-menu--open"}}'
      >
        {{#if @tooltip}}
          <AttachTooltip @animation="none" @arrow={{true}} >{{@tooltip}}</AttachTooltip>
        {{/if}}
        <this.icon
          @btnClass='cds--overflow-menu__icon'
        />
      </dd.Trigger>
      <dd.Content>
        <ul
          {{on 'click' dd.actions.close}}
          class='cds--overflow-menu-options cds--overflow-menu-options--open cds--overflow-menu-options--md'
          style="inset-block-start: 0"
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
