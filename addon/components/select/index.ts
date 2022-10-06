import Component from '@glimmer/component';
import { set, action } from '@ember/object';
import { isBlank } from '@ember/utils';
import { defaultArgs } from '../../decorators';
import jQuery from 'jquery'
import { PowerSelectArgs } from 'ember-power-select/components/power-select';
import { ContentValue } from '@glint/template'
import { PowerSelectMultSignature } from 'ember-power-select/components/power-select-multiple';

type Args<T extends ContentValue> = {
    options: T[];
    searchField?: string;
    placeholder?: string;
    disabled?: boolean;
    searchEnabled?: boolean;
    onSelect?: (item) => void;
    addItem?: (item) => void;
    removeItem?: (item) => void;
  }
  & ({
  selected: T[];
  multiple: true;
  onOpen?: PowerSelectMultSignature<T>['Args']['onOpen'];
  search?: PowerSelectMultSignature<T>['Args']['search'];
  selectFocused?: PowerSelectMultSignature<T>['Args']['onFocus'];
} | {
  selected: T;
  multiple?: false;
  onOpen?: PowerSelectArgs<T, any>['onOpen'];
  search?: PowerSelectArgs<T, any>['search'];
  selectFocused?: PowerSelectArgs<T, any>['onFocus'];
})

export interface SelectComponentSignature<T extends ContentValue> {
  Args: Args<T>;
  Element: HTMLDivElement;
  Blocks: {
    default: [option: T];
  };
}

export default class SelectComponent<T extends ContentValue> extends Component<SelectComponentSignature<T>> {

  args: Args<T> = defaultArgs(this, {
    selected: [],
    multiple: false,
    disabled: false,
    onSelect: () => null,
    addItem: () => null,
    removeItem: () => null,
  })

  searchMatcher(item, term) {
    if (!term || term === '') return 1;
    const pass = Object.values(item.toJSON ? item.toJSON() : item)
      .filter(v => v && !(v as any).defaultAdapter)
      .some(v => (typeof v === 'string' ? v.includes(term) : JSON.stringify(v).includes(term)));
    if (pass) return 1;
    return -1;
  }

  @action
  indexOfOption(opt) {
    return this.args.options.indexOf(opt);
  }

  @action
  onChange(choice) {
    if (this.args.multiple) {
      choice.forEach((item) => {
        if (!this.args.selected || !(this.args.selected as T[]).includes(item)) {
          if (this.args.addItem) this.args.addItem(item);
        }
      });
      if (this.args.selected) {
        this.args.selected.forEach((item) => {
          if (!choice.includes(item)) {
            if (this.args.removeItem) this.args.removeItem(item);
          }
        });
      }
    }
    if (this.args.onSelect) this.args.onSelect(choice);
  }

  @action
  selectFocused(select: any, event) {
    return this.args.selectFocused && this.args.selectFocused?.(select, event);
  }

  @action
  handleKeydown(select, event) {
    const selected = this.args.selected || [];


    let backspaceHandled = false;

    // Delete the entire last tag if backspacing into the tags area.
    if (event.keyCode === 8 && isBlank(event.target.value)) { // BACKSPACE === 8
      if (Array.isArray(selected)) {
        if (this.args.removeItem) this.args.removeItem(selected.slice(-1)[0]);
      }
      event.preventDefault();
      backspaceHandled = true;
      return false;
    }

    if (event.keyCode === 13) { // enter === 8
      set(select, 'searchText', '');
      backspaceHandled = true;
    }

    if (backspaceHandled) {
      event.preventDefault();
    }
    return undefined;
  }

  @action
  didInsert(element) {
    // eslint-disable-next-line ember/no-jquery
    jQuery(element).find('.ember-power-select-status-icon').replaceWith(''
      + '<svg class="cds--dropdown__arrow" '
      + 'width="10" height="6" viewBox="0 0 10 6">\n'
      + '    <path d="M5 6L0 1 0.7 0.3 5 4.6 9.3 0.3 10 1z"></path>\n'
      + '  </svg>');
  }
}



