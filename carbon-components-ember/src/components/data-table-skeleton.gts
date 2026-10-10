/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

import type { Header } from './data-table/-header.gts';

export interface DataTableSkeletonSignature {
  Element: HTMLTableElement;
  Args: {
    /** Defaults to one column per header, or 5 without `@headers`. */
    columnCount?: number;
    /**
     * Column headings to show in place of placeholders, in the shape
     * `DataTable`'s `Header` takes.
     */
    headers?: (Header | undefined | null)[];
    /** Defaults to 5. */
    rowCount?: number;
    /** Shows placeholders for the title and description. Defaults to `true`. */
    showHeader?: boolean;
    /** Shows a placeholder toolbar. Defaults to `true`. */
    showToolbar?: boolean;
    /** Row height. Defaults to `lg`. */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    zebra?: boolean;
  };
}

/**
 * A loading placeholder for a `DataTable`, for before there's any data to
 * give it. A `DataTable` that has its data can show `@isLoading` instead.
 */
export default class DataTableSkeleton extends Component<DataTableSkeletonSignature> {
  get columns() {
    const { headers } = this.args;

    return Array.from(
      { length: this.args.columnCount ?? headers?.length ?? 5 },
      (_, i) => headers?.[i]?.label,
    );
  }

  get rows() {
    return Array.from({ length: this.args.rowCount ?? 5 });
  }

  get tableClasses() {
    const classes = [
      'cds--skeleton',
      'cds--data-table',
      `cds--data-table--${this.args.size ?? 'lg'}`,
    ];

    if (this.args.zebra) classes.push('cds--data-table--zebra');

    return classes.join(' ');
  }

  <template>
    <div class="cds--skeleton cds--data-table-container">
      {{#unless (eq @showHeader false)}}
        <div class="cds--data-table-header">
          <div class="cds--data-table-header__title"></div>
          <div class="cds--data-table-header__description"></div>
        </div>
      {{/unless}}
      {{#unless (eq @showToolbar false)}}
        <section aria-label="data table toolbar" class="cds--table-toolbar">
          <div class="cds--toolbar-content">
            <span class="cds--skeleton cds--btn cds--btn--sm"></span>
          </div>
        </section>
      {{/unless}}
      <table class={{this.tableClasses}} ...attributes>
        <thead>
          <tr>
            {{#each this.columns as |header|}}
              <th>
                {{#if @headers}}
                  <div class="cds--table-header-label">{{header}}</div>
                {{else}}
                  <span></span>
                {{/if}}
              </th>
            {{/each}}
          </tr>
        </thead>
        <tbody>
          {{#each this.rows}}
            <tr>
              {{#each this.columns}}
                <td><span></span></td>
              {{/each}}
            </tr>
          {{/each}}
        </tbody>
      </table>
    </div>
  </template>
}
