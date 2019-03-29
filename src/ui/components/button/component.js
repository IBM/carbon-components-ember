import Component from '@ember/component';
import BxClassNames from 'carbon/src/mixins/bx-class-names';

export default Component.extend(BxClassNames, {
  tagName: '',
  classPrefix: 'bx--btn--',
  confirmText: null,

  init(...args) {
    this.classMappings = [
      'primary:primary',
      'secondary:secondary',
      'danger:danger',
      'ghost:ghost',
      'small:sm'
    ];
    this._super(...args);
  },

  actions: {
    onClick(...args) {
      if (this.danger) {
        const ok = confirm(this.confirmText || 'Confirm this operation');
        if (!ok) {
          return;
        }
      }
      const action = this.get('onClick');
      if (action) {
        const ret = action(...args);
        if (ret && ret.finally) {
          this.set('loading', true);
          this.set('disabled', true);
          ret.finally(() => {
            this.set('loading', false);
            this.set('disabled', false);
          });
        }
      }
      // Prevent bubbling, if specified. If undefined, the event will bubble.
      return this.get('bubbles');
    }
  }
});
