import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { autoComputed } from 'carbon-components-ember/decorators';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import Icon from 'carbon-components-ember/components/icon';
import set from 'carbon-components-ember/helpers/set';
import not from 'ember-truth-helpers/helpers/not';

type Args = {
  selectable?: boolean;
  clickable?: boolean;
  expandable?: boolean;
  onClick?: () => null;
  onSelect?: () => null;
  tabindex?: string;
}

export interface TileComponentSignature {
  Args: Args;
  Blocks: {
    above: [];
    content: [];
    below: [];
  };
}

export default class TileComponent extends Component<TileComponentSignature> {

  @tracked selected = null;
  @tracked expanded: boolean = false;

  @autoComputed()
  get guid() {
    return guidFor(this);
  }

  get default() {
    return !this.args.selectable && !this.args.expandable && !this.args.clickable;
  }

  @action
  onClick(event) {
    event.preventDefault();
    this.args.onClick?.();
  }

  @action
  onSelect() {
    this.args.onSelect?.();
  }

  <template>
    {{#if @selectable}}
      <label
        for='tile-{{this.guid}}'
        aria-label='tile'
        class='cds--tile cds--tile--selectable
          {{if this.selected "cds--tile--is-selected"}}'
        data-tile='selectable'
        tabindex={{@tabindex}}
      >
        <input
          checked={{this.selected}}
          {{on 'change' this.onSelect}}
          {{on 'change' (set this 'selected' 'target.checked')}}
          tabindex='-1'
          data-tile-input
          id='tile-{{this.guid}}'
          class='cds--tile-input'
          value='tile'
          type='checkbox'
          name='tiles'
          title='tile'
        />
        <div class='cds--tile__checkmark'>
          <Icon @icon='checkmark--filled' />
        </div>
        <div class='cds--tile-content'>
          {{yield to='content'}}
        </div>
      </label>
    {{/if}}
    {{#if @expandable}}
      <div
        data-tile='expandable'
        class='cds--tile cds--tile--expandable
          {{if this.expanded "cds--tile--is-expanded"}}'
        tabindex={{@tabindex}}
      >
        <button
          class='cds--tile__chevron'
          type='button'
          {{on 'click' (fn (set this 'expanded') (not this.expanded))}}
        >
          <Icon @icon='chevron--down' />
        </button>
        <span data-tile-atf class='cds--tile-content__above-the-fold'>
          {{yield to='above'}}
        </span>
        <div class='cds--tile-content'>
          {{yield to='content'}}
        </div>
        <span class='cds--tile-content__below-the-fold'>
          {{yield to='below'}}
        </span>
      </div>
    {{/if}}
    {{#if this.default}}
      <div class='cds--tile'>
        {{yield to='content'}}
      </div>
    {{/if}}
    {{#if @clickable}}
      <a
        role='button'
        class='cds--link cds--tile cds--tile--clickable'
        href='#'
        {{on 'click' this.onClick}}
      >
        {{yield to='content'}}
      </a>
    {{/if}}
  </template>
}
