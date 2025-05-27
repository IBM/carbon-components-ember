import Component from '@glimmer/component';
import Icon from '../../icon.gts';
import { on } from '@ember/modifier';

export interface Signature {
  Args: {
    isCurrent: boolean;
    transitionTo: () => void;
    icon: Icon['args']['icon'];
    title: string;
  };
  Element: null;
}


export default class SubMenuComponent extends Component<Signature> {
  <template>
    <li class='cds--side-nav__menu-item' role='menu'>
      <a
        href='#'
        role='menuitem'
        aria-current='{{if @isCurrent "page"}}'
        class='cds--side-nav__link'
        {{on 'click' @transitionTo}}
      >
        {{#if @icon}}
          <div class='cds--side-nav__icon'>
            <Icon @icon={{@icon}} />
          </div>
        {{/if}}
        <span class='cds--side-nav__link-text'>
          {{@title}}
        </span>
      </a>
    </li>
  </template>
}
