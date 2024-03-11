import { default as Button } from 'carbon-components-ember/components/button';
import { default as Checkbox } from 'carbon-components-ember/components/checkbox';
import { default as set } from 'carbon-components-ember/helpers/set';
import { default as has } from 'carbon-components-ember/helpers/has';
import { fn } from '@ember/helper';
import { default as not } from 'ember-truth-helpers/helpers/not';
import Component from '@glimmer/component';
import DataTableComponent from 'carbon-components-ember/components/data-table';
import { tracked } from '@glimmer/tracking';

type Args<T> = {
  table: DataTableComponent<any>;
  isExpandable?: boolean;
  isExpanded?: boolean;
  isCheckable?: boolean;
  length?: number;
  item: T;
};

export interface DataTableRowSignature<T> {
  Args: Args<T>;
  Blocks: {
    default: [];
  };
}

export default class DataTableRow<T> extends Component<
  DataTableRowSignature<T>
> {
  @tracked isExpanded: boolean;

  <template>
    <tr
      class='{{if
          (has @table.state.selectedItems @item)
          "cds--data-table--selected"
        }}'
    >
      {{#if @isExpandable}}
        <td class='cds--table-expand' data-event='expand'>
          <Button
            class='cds--table-expand__button'
            @onClick={{fn (set this 'isExpanded') (not this.isExpanded)}}
          >
            <svg
              focusable='false'
              preserveAspectRatio='xMidYMid meet'
              style='will-change: transform;'
              xmlns='http://www.w3.org/2000/svg'
              class='cds--table-expand__svg'
              width='16'
              height='16'
              viewBox='0 0 16 16'
              aria-hidden='true'
            >
              <path d='M11 8L6 13 5.3 12.3 9.6 8 5.3 3.7 6 3z'></path>
            </svg>
          </Button>
        </td>
      {{/if}}
      {{#if @isCheckable}}
        <td class='cds--table-column-checkbox'>
          <Checkbox
            @checked={{has @table.state.selectedItems @item}}
            @onChange={{fn @table.toggleItemSelection @item}}
          />
        </td>
      {{/if}}
      {{yield}}
    </tr>
    {{#if @isExpanded}}
      <tr class='cds--expandable-row' data-child-row>
        <td colspan='{{@table.headers.length}}'>
          <div class='cds--child-row-inner-container'>
            {{yield}}
          </div>
        </td>
      </tr>
    {{/if}}
  </template>
}
