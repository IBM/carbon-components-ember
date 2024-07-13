import { default as Icon } from '../../components/icon.gts';
import { default as not } from 'ember-truth-helpers/helpers/not';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import Component from '@glimmer/component';

export interface UiShellHeaderSignature {
  Args: {
    title: string;
    subtitle: string;
    open?: boolean;
    onToggle?: (value: boolean) => void;
  };
  Blocks: {
    header: [];
    headerGlobal: [];
  };
}

export default class UiShellHeader extends Component<UiShellHeaderSignature> {
  <template>
    <header aria-label='IBM Platform Name' class='cds--header'>
      <a class='cds--skip-to-content' href='#main-content' tabindex='0'>
        Skip to main content
      </a>
      {{#if @onToggle}}
        <button
          aria-label='Open menu'
          class='cds--header__action cds--header__menu-trigger cds--header__menu-toggle
            {{if @open "" "cds--header__menu-toggle"}}'
          title='Open menu'
          type='button'
          {{on 'click' (fn @onToggle (not @open))}}
        >
          <Icon @icon={{if @open 'close' 'menu'}} />
        </button>
      {{/if}}
      <a class='cds--header__name' href='#'>
        <span class='cds--header__name--prefix'>
          {{@title}}
          <small>
            {{@subtitle}}
          </small>
        </span>
      </a>
      {{yield to='header'}}
      <div class='cds--header__global'>
        {{yield to='headerGlobal'}}
      </div>
    </header>
  </template>
}
