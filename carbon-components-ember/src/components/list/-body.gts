import ListRow from './-row.gts';
import Component from '@glimmer/component';
import type { WithBoundArgs } from '@glint/template';
import type ListRowComponent from '../list/-row.gts';
import type ListComponent from '../list.gts';

export type Args<T> = {
  items: T[];
  list: ListComponent<T>;
};

export interface ListBodyComponentSignature<T> {
  Args: Args<T>;
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

export default class ListBodyComponent<T> extends Component<
  ListBodyComponentSignature<T>
> {
  <template>
    <div class="cds--structured-list-tbody">
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
