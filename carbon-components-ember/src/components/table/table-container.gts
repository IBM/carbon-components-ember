/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import type { WithBoundArgs } from '@glint/template';
import Table from './table.gts';

export interface TableContainerSignature {
  Element: HTMLElement;
  Args: {
    /** Marks the whole table as having AI generated content. */
    aiEnabled?: boolean;
    /** A description shown under the title. */
    description?: string;
    /** Makes the table's header stay put, and the container its full width. */
    stickyHeader?: boolean;
    /** The table's title. */
    title?: string;
    /** Sizes the container to the table inside it, not to its parent. */
    useStaticWidth?: boolean;
  };
  Blocks: {
    /** The table. `Table` names it by the title and description. */
    default: [Table: WithBoundArgs<typeof Table, 'container'>];
    /** An AI label or other decorator, beside the title. */
    decorator: [];
  };
}

/**
 * The title, description and table of a hand-built table, as Carbon React's
 * `TableContainer`. It yields a `Table` that the title and description name.
 */
export default class TableContainer extends Component<TableContainerSignature> {
  private baseId = `tc-${guidFor(this)}`;

  get titleId() {
    return this.args.title ? `${this.baseId}-title` : undefined;
  }

  get descriptionId() {
    return this.args.description ? `${this.baseId}-description` : undefined;
  }

  <template>
    <section
      class="cds--data-table-container
        {{if @stickyHeader 'cds--data-table--max-width'}}
        {{if @useStaticWidth 'cds--data-table-container--static'}}
        {{if @aiEnabled 'cds--data-table-container--ai-enabled'}}"
      ...attributes
    >
      {{#if (or @title @description (has-block "decorator"))}}
        <div
          class="cds--data-table-header
            {{if
              (has-block 'decorator')
              'cds--data-table-header__with-decorator'
            }}
            {{if
              (and (has-block 'decorator') (not (or @title @description)))
              'cds--data-table-header__with-decorator--standalone'
            }}"
        >
          {{#if (or @title @description)}}
            <div class="cds--data-table-header__content">
              {{#if @title}}
                <h2
                  class="cds--data-table-header__title"
                  id={{this.titleId}}
                >{{@title}}</h2>
              {{/if}}
              {{#if @description}}
                <p
                  class="cds--data-table-header__description"
                  id={{this.descriptionId}}
                >{{@description}}</p>
              {{/if}}
            </div>
          {{/if}}
          {{#if (has-block "decorator")}}
            <div class="cds--data-table-header__decorator">
              {{yield to="decorator"}}
            </div>
          {{/if}}
        </div>
      {{/if}}
      {{yield (component Table container=this)}}
    </section>
  </template>
}
