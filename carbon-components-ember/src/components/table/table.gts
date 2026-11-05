/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';
import type TableContainer from './table-container.gts';

export interface TableSignature {
  Element: HTMLTableElement;
  Args: {
    /** Makes the header stay put while the rows scroll. */
    stickyHeader?: boolean;
    /** Sets the table's width to `auto` rather than 100%. */
    useStaticWidth?: boolean;
    /** Stripes the rows. */
    useZebraStyles?: boolean;
    /** Styles the sortable headers. */
    isSortable?: boolean;
    /** The row height. Defaults to `lg`. */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    /**
     * Whether an overflow menu in a row shows only on hover. Defaults to
     * `true`.
     */
    overflowMenuOnHover?: boolean;
    /**
     * The `TableContainer` it is in, which names the table by its title and
     * description. Set by the container's yielded `Table`.
     */
    container?: TableContainer;
  };
  Blocks: {
    default: [];
  };
}

interface ContentSignature {
  Element: HTMLTableElement;
  Args: Pick<TableSignature['Args'], 'container'> & { classes: string };
  Blocks: { default: [] };
}

// The table in its scrolling wrapper, which a sticky header puts in a section.
const Content: TOC<ContentSignature> = <template>
  <div class="cds--data-table-content">
    <table
      aria-labelledby={{@container.titleId}}
      aria-describedby={{@container.descriptionId}}
      class={{@classes}}
      ...attributes
    >{{yield}}</table>
  </div>
</template>;

/**
 * A table, as Carbon React's `Table`: put `TableHead`, `TableBody` and their
 * rows in it. Inside a `TableContainer`, use the `Table` it yields to have
 * the container's title and description name the table.
 */
const Table: TOC<TableSignature> = <template>
  {{#let
    (classes
      @size
      @useZebraStyles
      @isSortable
      @useStaticWidth
      @stickyHeader
      @overflowMenuOnHover
    )
    as |classes|
  }}
    {{#if @stickyHeader}}
      <section class="cds--data-table_inner-container">
        <Content @container={{@container}} @classes={{classes}} ...attributes>
          {{yield}}
        </Content>
      </section>
    {{else}}
      <Content @container={{@container}} @classes={{classes}} ...attributes>
        {{yield}}
      </Content>
    {{/if}}
  {{/let}}
</template>;

function classes(
  size: TableSignature['Args']['size'],
  useZebraStyles: boolean | undefined,
  isSortable: boolean | undefined,
  useStaticWidth: boolean | undefined,
  stickyHeader: boolean | undefined,
  overflowMenuOnHover: boolean | undefined,
) {
  return [
    'cds--data-table',
    `cds--data-table--${size ?? 'lg'}`,
    isSortable && 'cds--data-table--sort',
    useZebraStyles && 'cds--data-table--zebra',
    useStaticWidth && 'cds--data-table--static',
    stickyHeader && 'cds--data-table--sticky-header',
    overflowMenuOnHover === false && 'cds--data-table--visible-overflow-menu',
  ]
    .filter(Boolean)
    .join(' ');
}

export default Table;
