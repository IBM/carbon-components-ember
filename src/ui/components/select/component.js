import Component from '@ember/component';
import { set } from '@ember/object';
import { isBlank } from '@ember/utils';

export default Component.extend({
  content: null,
  options: null,
  multiple: false,
  selected: null,

  init(...args) {
    this._super(...args);
  },

  searchMatcher(item, term) {
    if (!term || term === '') return true;
    const pass = Object.values(item.toJSON ? item.toJSON() : item)
      .filter(v => v && !v.defaultAdapter)
      .some(v => (typeof v === 'string' ? v.includes(term) : JSON.stringify(v).includes(term)));
    if (pass) return 1;
    return -1;
  },

  actions: {
    onChange(choice) {
      if (this.multiple) {
        choice.forEach((item) => {
          if (!this.content || !this.content.includes(item)) {
            if (this.addItem) this.addItem(item);
          }
        });
        if (this.content) {
          this.content.forEach((item) => {
            if (!choice.includes(item)) {
              if (this.removeItem) this.removeItem(item);
            }
          });
        }
        return;
      }
      if (this.onSelect) this.onSelect(choice);
    },

    selectFocused(...args) {
      return this.selectFocused && this.selectFocused(...args);
    },

    handleKeydown(select, event) {
      const selected = this.get('content') || [];


      let backspaceHandled = false;

      // Delete the entire last tag if backspacing into the tags area.
      if (event.keyCode === 8 && isBlank(event.target.value)) { // BACKSPACE === 8
        if (this.removeItem) this.removeItem(selected.slice(-1)[0]);
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
  },

  didInsertElement() {
    this.$('.ember-power-select-status-icon').replaceWith(''
      + '<svg class="bx--dropdown__arrow ember-power-select-status-icon" '
      + 'width="10" height="5" viewBox="0 0 10 5" fill-rule="evenodd">\n'
      + '    <path d="M10 0L5 5 0 0z"></path>\n'
      + '  </svg>');
  }
});
