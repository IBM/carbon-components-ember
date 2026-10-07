import Checkbox from '../checkbox.gts';
import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import { guidFor } from '@ember/object/internals';
import type DataTableComponent from '../data-table.gts';
import { tracked } from '@glimmer/tracking';

export type Args<T> = {
  table: DataTableComponent<T>;
  isExpandable?: boolean;
  /**
   * Whether the row's `<:expanded>` content is shown. Without `@onExpand` it
   * only sets the initial state and the expand button toggles the row
   * itself; with `@onExpand` the row is controlled and shows exactly
   * `@isExpanded`.
   */
  isExpanded?: boolean;
  /**
   * Called with the new expanded state when the expand button is clicked.
   * Passing it makes `@isExpanded` the source of truth.
   */
  onExpand?: (isExpanded: boolean) => void;
  isCheckable?: boolean;
  length?: number;
  item: T;
};

export interface DataTableRowSignature<T> {
  Args: Args<T>;
  Blocks: {
    /** The row's cells. */
    default: [];
    /**
     * Content of the expanded row below this one (Carbon React's
     * `TableExpandedRow` children). Only rendered when `@isExpandable` is set.
     */
    expanded: [];
  };
}

export default class DataTableRow<T> extends Component<
  DataTableRowSignature<T>
> {
  @tracked uncontrolledExpanded: boolean;

  constructor(owner: Owner, args: DataTableRowSignature<T>['Args']) {
    super(owner, args);
    this.uncontrolledExpanded = args.isExpanded ?? false;
    if (args.table) {
      args.table.columnIndexCounter = 0;
    }
  }

  get isSelected() {
    return this.args.table?.state.selectedItems.has(this.args.item) ?? false;
  }

  get isExpanded() {
    if (!this.args.isExpandable) return false;
    if (this.args.onExpand) return this.args.isExpanded ?? false;
    return this.uncontrolledExpanded;
  }

  get classes() {
    const classes = [];
    if (this.args.isExpandable) classes.push('cds--parent-row');
    if (this.isExpanded) classes.push('cds--expandable-row');
    if (this.isSelected) classes.push('cds--data-table--selected');
    return classes.join(' ');
  }

  get expandedRowId() {
    return `${guidFor(this)}-expanded-row`;
  }

  // The expanded row spans every column: the data columns plus the expand
  // and selection columns this row adds in front of them.
  get expandedRowColspan() {
    return (
      (this.args.table?.headers?.length ?? 0) +
      1 +
      (this.args.isCheckable ? 1 : 0)
    );
  }

  toggleExpanded = () => {
    const isExpanded = !this.isExpanded;
    this.uncontrolledExpanded = isExpanded;
    this.args.onExpand?.(isExpanded);
  };

  <template>
    <tr class={{this.classes}} data-parent-row={{if @isExpandable "true"}}>
      {{#if @isExpandable}}
        <td
          class="cds--table-expand"
          data-previous-value={{if this.isExpanded "collapsed"}}
        >
          <button
            type="button"
            class="cds--table-expand__button"
            aria-label={{if
              this.isExpanded
              "Collapse current row"
              "Expand current row"
            }}
            aria-expanded={{if this.isExpanded "true" "false"}}
            aria-controls={{this.expandedRowId}}
            {{on "click" this.toggleExpanded}}
          >
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              class="cds--table-expand__svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M11 8L6 13 5.3 12.3 9.6 8 5.3 3.7 6 3z"></path>
            </svg>
          </button>
        </td>
      {{/if}}
      {{#if @isCheckable}}
        <td class="cds--table-column-checkbox">
          <Checkbox
            @checked={{this.isSelected}}
            @onChange={{fn @table.toggleItemSelection @item}}
            @label="Select row"
            @hideLabel={{true}}
          />
        </td>
      {{/if}}
      {{yield}}
    </tr>
    {{#if @isExpandable}}
      {{! Always rendered, as in Carbon React: Carbon's CSS collapses it to zero
        height unless the parent row has cds--expandable-row. }}
      <tr
        id={{this.expandedRowId}}
        class="cds--expandable-row"
        data-child-row="true"
      >
        <td colspan={{this.expandedRowColspan}}>
          <div class="cds--child-row-inner-container">
            {{yield to="expanded"}}
          </div>
        </td>
      </tr>
    {{/if}}
  </template>
}
