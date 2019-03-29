import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Ember from 'ember';

const { uuid } = Ember;

export default Component.extend({
  tagName: '',
  uuid: computed(() => uuid()),
  disabled: false,
  state: null,
  checked: alias('value'),

  actions: {
    onChange(element) {
      const value = element.target.checked;
      this.onChange(value);
    }
  }
});
