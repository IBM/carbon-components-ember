import Component from '@ember/component';
import { computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import Loading from 'carbon-components/es/components/loading/loading';

export default Component.extend({
  tagName: '',
  guid: computed(function () {
    return guidFor(this);
  }),

  didReceiveAttrs() {
    if (this.active !== undefined) {
      if (this.loading) this.loading.set(this.active);
    }
  },

  didInsertElement() {
    if (!document.querySelector(`#${this.guid}`)) {
      return;
    }
    this.loading = new Loading(document.querySelector(`#${this.guid}`), this);
  },

  willDestroy() {
    return this.loading && this.loading.end();
  }
});
