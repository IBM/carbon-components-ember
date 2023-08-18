import Component from '@glimmer/component';
import Icon,  { IconNames } from 'carbon-components-ember/components/icon';
import MenuItemComponent from 'carbon-components-ember/components/menu/-item';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';
import defaultTo from 'carbon-components-ember/helpers/default-to';
import { on } from '@ember/modifier';
import EmberTooltip from 'ember-tooltips/components/ember-tooltip';

export interface MenuComponentSignature {
  Args: {
    icon: IconNames;
    direction: 'bottom'|'top';
    tooltip?: string;
    disabled?: boolean;
    danger?: boolean;
  };
  Blocks: {
    default: [typeof MenuItemComponent];
  };
}


export default class MenuComponent extends Component<MenuComponentSignature> {
  <template>
    <BasicDropdown as |dd|>
      <dd.Trigger
        @stopPropagation={{false}}
        @eventType='click'
        class='cds--overflow-menu {{if dd.isOpen "cds--overflow-menu--open"}}'
      >
        {{#if @tooltip}}
          <EmberTooltip>{{@tooltip}}</EmberTooltip>
        {{/if}}
        <Icon
          @fill='white'
          @size={{24}}
          @icon={{defaultTo @icon 'overflow-menu--vertical'}}
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
          {{yield (component MenuItemComponent isDisabled=@disabled isDanger=@danger)}}
        </ul>
      </dd.Content>
    </BasicDropdown>
  </template>
}

