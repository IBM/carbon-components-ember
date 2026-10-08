import ListRow from './-row.gts';
import Component from '@glimmer/component';
import type { WithBoundArgs } from '@glint/template';
import type ListRowComponent from '../list/-row.gts';
import type ListComponent from '../list.gts';

export interface ListBodySignature<T> {
  Element: HTMLDivElement;
  Args: {
    items: T[];
    list: ListComponent<T>;
  };
  Blocks: {
    default: [
      {
        Row: WithBoundArgs<
          typeof ListRowComponent<T>,
          'list' | 'isHeader' | 'item'
        >;
        item: T;
      },
    ];
  };
}

export default class ListBody<T> extends Component<ListBodySignature<T>> {
  <template>
    <div class="cds--structured-list-tbody" ...attributes>
      {{#each @items as |item|}}
        {{#let
          (component ListRow item=item isHeader=false list=@list)
          as |Row|
        }}
          {{yield (hash Row=Row item=item)}}
        {{/let}}
      {{/each}}
    </div>
  </template>
}
