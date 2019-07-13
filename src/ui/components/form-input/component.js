import Component from '@ember/component';
import { computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default Component.extend({
  tagName: '',
  guid: computed(function () {
    return guidFor(this);
  })
});
