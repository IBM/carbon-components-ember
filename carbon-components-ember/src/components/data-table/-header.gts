import { default as Button } from '../button.gts';
import { default as Checkbox } from '../checkbox.gts';
import Component from '@glimmer/component';
import type DataTableComponent from '../data-table.gts';

export type Header = {
  sortable?: boolean;
  label?: string;
};

export type Args = {
  table: DataTableComponent<any>;
  headers: (Header | undefined | null)[];
  isExpandable?: boolean;
  isCheckable?: boolean;
};

export default class ListHeaderComponent extends Component<Args> {
  didSetup = false;
  table?: DataTableComponent<any>;

  constructor(...args: ConstructorParameters<typeof Component<Args>>) {
    super(...args);
    if (this.args.table) {
      this.table = this.args.table;
      this.didSetup = true;
      Object.defineProperty(this.args.table, 'headers', {
        configurable: true,
        get: () => this.args.headers,
      });
      Object.defineProperty(this.args.table, 'isExpandable', {
        configurable: true,
        get: () => this.args.isExpandable,
      });
      Object.defineProperty(this.args.table, 'isCheckable', {
        configurable: true,
        get: () => this.args.isCheckable,
      });
    }
  }

  <template>
    <thead>
      <tr>
        {{#if @isExpandable}}
          <th class='cds--table-expand'>
            {{! checkbox th }}
            {{! sortable th  }}
            <span class='cds--table-header-label'></span>
          </th>
        {{/if}}
        {{#if @isCheckable}}
          <th class='cds--table-column-checkbox'>
            <Checkbox
              @checked={{@table.allChecked}}
              @onChange={{@table.toggleSelectAllItems}}
            />
          </th>
        {{/if}}
        {{#each @headers as |h|}}
          <th>
            {{#if h.sortable}}
              <Button @type='primary' class='cds--table-sort' title={{h.label}}>
                <span class='cds--table-header-label'>
                  {{h.label}}
                </span>
                <svg
                  focusable='false'
                  preserveAspectRatio='xMidYMid meet'
                  style='will-change: transform;'
                  xmlns='http://www.w3.org/2000/svg'
                  class='cds--table-sort__icon'
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  aria-hidden='true'
                >
                  <path
                    d='M12.3 9.3L8.5 13.1 8.5 1 7.5 1 7.5 13.1 3.7 9.3 3 10 8 15 13 10z'
                  ></path>
                </svg>
                <svg
                  focusable='false'
                  preserveAspectRatio='xMidYMid meet'
                  style='will-change: transform;'
                  xmlns='http://www.w3.org/2000/svg'
                  class='cds--table-sort__icon-unsorted'
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  aria-hidden='true'
                >
                  <path
                    d='M13.8 10.3L12 12.1 12 2 11 2 11 12.1 9.2 10.3 8.5 11 11.5 14 14.5 11zM4.5 2L1.5 5 2.2 5.7 4 3.9 4 14 5 14 5 3.9 6.8 5.7 7.5 5z'
                  ></path>
                </svg>
              </Button>
            {{else}}
              <span class='cds--table-header-label'>
                {{h.label}}
              </span>
            {{/if}}
          </th>
        {{/each}}
      </tr>
    </thead>
  </template>
}
