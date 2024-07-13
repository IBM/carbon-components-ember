import { default as Icon } from '../../components/icon.gts';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { default as eq } from 'ember-truth-helpers/helpers/eq';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import ListComponent from '../../components/list.gts';

type Args<T> = {
  onSelect?(item: any): void;
  list: ListComponent<T>;
  isHeader: boolean;
  item: T;
};

export interface ListRowComponentSignature<T> {
  Args: Args<T>;
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

export default class ListRowComponent<T> extends Component<
  ListRowComponentSignature<T>
> {
  @action
  onSelect(item: T) {
    this.args.onSelect?.(item);
  }

  <template>
    <div
      class='cds--structured-list-row
        {{if @isHeader "cds--structured-list-row--header-row"}}'
      ...attributes
    >
      {{yield}}
      {{#if @list.args.selectable}}
        <input
          aria-label='none'
          type='radio'
          checked={{eq @list.currentItem @item}}
          class='cds--structured-list-input cds--visually-hidden'
          {{on 'click' (fn this.onSelect @item)}}
        />
        <div class='cds--structured-list-td'>
          <Icon
            @icon='checkmark--filled'
            @btnClass='cds--structured-list-svg'
          />
        </div>
      {{/if}}
    </div>
  </template>
}
