import Component from '@ember/component';
import { computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import Modal from 'carbon-components/es/components/modal/modal';

export default Component.extend({
  tagName: '',
  guid: computed(function () {
    return guidFor(this);
  }),
  show: false,

  didReceiveAttrs() {
    if (this.show) {
      this.modalInstance.show();
    } else {
      this.modalInstance.hide();
    }
  },

  didInsertElement() {
    if (!document.querySelector(`#${this.guid}`)) {
      return;
    }
    this.modalInstance = Modal.create(document.getElementById(`modal-${this.guid}`));
  },

  willDestroy() {
    return this.modalInstance && this.modalInstance.release();
  }
});
