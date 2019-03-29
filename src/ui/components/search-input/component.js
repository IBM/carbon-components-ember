import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',
  hasInput: computed.bool('value'),
  value: null,

  actions: {
    onChange(value) {
      this.set('value', value);
    },

    onClear() {
      this.set('value', null);
    }
  }
});
