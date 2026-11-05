/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { TOC } from '@ember/component/template-only';
import autoAlignTable from '../../modifiers/auto-align-table.ts';
import type { TableAlignment } from '../../modifiers/auto-align-table.ts';
import { afterRender } from '../../utils/after-render.ts';
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
     * **Experimental:** top-aligns the cells when a body cell or a header
     * label wraps its text. Measured when the table renders, when it
     * resizes, once fonts have loaded and when `@size` changes. Might have
     * performance issues; intended for smaller tables.
     */
    experimentalAutoAlign?: boolean;
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
  Args: Pick<
    TableSignature['Args'],
    'container' | 'experimentalAutoAlign' | 'size'
  > & {
    classes: string;
    onAlign: (alignment: TableAlignment) => void;
  };
  Blocks: { default: [] };
}

// The table in its scrolling wrapper, which a sticky header puts in a section.
const Content: TOC<ContentSignature> = <template>
  <div class="cds--data-table-content">
    <table
      aria-labelledby={{@container.titleId}}
      aria-describedby={{@container.descriptionId}}
      class={{@classes}}
      {{autoAlignTable @experimentalAutoAlign @size @onAlign}}
      ...attributes
    >{{yield}}</table>
  </div>
</template>;

/**
 * A table, as Carbon React's `Table`: put `TableHead`, `TableBody` and their
 * rows in it. Inside a `TableContainer`, use the `Table` it yields to have
 * the container's title and description name the table.
 */
export default class Table extends Component<TableSignature> {
  @tracked alignTopBody = false;
  @tracked alignTopHeader = false;

  // The table measures after it renders, and the result changes the classes
  // it rendered with.
  align = ({ body, header }: TableAlignment) => {
    if (body === this.alignTopBody && header === this.alignTopHeader) return;
    afterRender(this, () => {
      this.alignTopBody = body;
      this.alignTopHeader = header;
    });
  };

  get classes() {
    return classes(
      this.args.size,
      this.args.useZebraStyles,
      this.args.isSortable,
      this.args.useStaticWidth,
      this.args.stickyHeader,
      this.args.overflowMenuOnHover,
      this.alignTopBody,
      this.alignTopHeader,
    );
  }

  <template>
    {{#if @stickyHeader}}
      <section class="cds--data-table_inner-container">
        <Content
          @container={{@container}}
          @classes={{this.classes}}
          @experimentalAutoAlign={{@experimentalAutoAlign}}
          @size={{@size}}
          @onAlign={{this.align}}
          ...attributes
        >
          {{yield}}
        </Content>
      </section>
    {{else}}
      <Content
        @container={{@container}}
        @classes={{this.classes}}
        @experimentalAutoAlign={{@experimentalAutoAlign}}
        @size={{@size}}
        @onAlign={{this.align}}
        ...attributes
      >
        {{yield}}
      </Content>
    {{/if}}
  </template>
}

function classes(
  size: TableSignature['Args']['size'],
  useZebraStyles: boolean | undefined,
  isSortable: boolean | undefined,
  useStaticWidth: boolean | undefined,
  stickyHeader: boolean | undefined,
  overflowMenuOnHover: boolean | undefined,
  alignTopBody: boolean,
  alignTopHeader: boolean,
) {
  return [
    'cds--data-table',
    `cds--data-table--${size ?? 'lg'}`,
    isSortable && 'cds--data-table--sort',
    useZebraStyles && 'cds--data-table--zebra',
    useStaticWidth && 'cds--data-table--static',
    stickyHeader && 'cds--data-table--sticky-header',
    overflowMenuOnHover === false && 'cds--data-table--visible-overflow-menu',
    alignTopBody && 'cds--data-table--top-aligned-body',
    alignTopHeader && 'cds--data-table--top-aligned-header',
  ]
    .filter(Boolean)
    .join(' ');
}
