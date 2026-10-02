import { default as ListRow } from './-row.gts';
import Component from '@glimmer/component';
import type { WithBoundArgs } from '@glint/template';
import ListRowComponent from '../list/-row.gts';
import type ListComponent from '../list.gts';
import { hash } from '@ember/helper';

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
    <div class='cds--structured-list-tbody'>
      {{#each @items as |item|}}
        {{! @glint-expect-error: Glint 2 widens the bound item to T | undefined when inferring ListRow's generic, so Row no longer matches the declared WithBoundArgs<typeof ListRowComponent<T>> }}
        {{yield (hash Row=(component ListRow item=item isHeader=false list=@list) item=item)}}
      {{/each}}
    </div>
  </template>
}
