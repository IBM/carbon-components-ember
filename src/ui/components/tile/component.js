import Ember from 'ember';
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  selectable: false,
  expandable: false,
  clickable: false,
  uuid: computed(() => Ember.uuid()),

  default: computed(function () {
    return !this.selectable && !this.expandable;
  }),

  actions: {
    onClick() {

    }
  }
});
