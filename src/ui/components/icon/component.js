import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import icon from 'carbon-icons';
import BxClassNames from 'carbon/src/mixins/bx-class-names';

export default Component.extend(BxClassNames, {
  tagName: '',
  classPrefix: 'bx--icon--',
  dialogManager: service('carbon::dialog-manager'),

  init(...args) {
    this.classMappings = [
      'info:info',
      'danger:danger',
      'disabled:disabled'
    ];
    this._super(...args);
  },

  svg: computed('attrs.icon', function () {
    return icon.find(i => i.id === `icon--${this.icon}`);
  }),

  actions: {
    onClick() {
      const run = () => {
        const promise = this.onClick && this.onClick();
        this.set('loading', true);
        this.set('disabled', true);
        if (promise && promise.finally) {
          promise.finally(() => {
            this.set('loading', false);
            this.set('disabled', false);
          });
        } else {
          setTimeout(() => {
            if (this.isDestroyed) return;
            this.set('loading', false);
            this.set('disabled', false);
          }, 350);
        }
      };
      if (this.danger) {
        this.dialogManager.open('confirm', {
          type: 'danger',
          header: 'Danger',
          body: this.confirmText || 'Confirm this operation',
          onAccept: run
        });
      } else {
        run();
      }
    }
  }
});
