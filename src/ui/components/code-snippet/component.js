import Component from '@ember/component';
import { computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import CodeSnippet from 'carbon-components/es/components/code-snippet/code-snippet';


export default Component.extend({
  tagName: '',
  guid: computed(function () {
    return guidFor(this);
  }),
  type: 'default', // inline, multi-line

  didReceiveAttrs() {

  },

  didInsertElement() {
    if (!document.querySelector(`#${this.guid}`)) {
      return;
    }
    if (this.type === 'inline') return;
    this.carbonComponent = new CodeSnippet(document.querySelector(`#${this.guid}`), this);
  },

  willDestroy() {
    return this.carbonComponent && this.carbonComponent.release();
  }
});
