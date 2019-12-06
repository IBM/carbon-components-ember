import Component from '@ember/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import * as icons from '@carbon/icons';
import { bxClassNames, classPrefix, argsCompat } from 'carbon-components-ember/decorators';

@classPrefix('bx--icon--')
class CarbonIcon extends Component {
  tagName = '';
  static positionalParams = ['icon'];
  @service('carbon-components-ember@dialog-manager') dialogManager;
  @bxClassNames('info', 'danger', 'disabled') bxClassNames;
  @tracked attrs;
  @tracked loading;
  @tracked disabled;
  @argsCompat
  args = {
    /**
     * Indicates if the action is dangerous, showing a confirmation dialog before calling `onClick`
     @argument danger
     @type boolean
     */
    danger: null,
    /**
     * If the action is dangerous, this text message will be shown in the dialog
     @argument confirmText
     @type String
     */
    confirmText: null,
    /**
     * Use this component as dialog
     @argument confirmDialog
     @type String
     */
    confirmDialog: null
  };

  get svg() {
    // eslint-disable-next-line eqeqeq
    return Object.values(icons).find(i => i.name === this.attrs.icon && (i.size == (this.attrs.size || 16)));
  }

  @action
  onIconClick() {
    const run = () => {
      const promise = this.attrs.onClick && this.attrs.onClick();
      this.loading = true;
      this.disabled = true;
      if (promise && promise.then) {
        const finish = () => {
          this.loading = false;
          this.disabled = false;
        };
        promise.then(finish, finish);
      } else {
        setTimeout(() => {
          if (this.isDestroyed) return;
          this.loading = false;
          this.disabled = false;
        }, 350);
      }
    };
    if (this.attrs.danger) {
      this.dialogManager.open(this.args.confirmDialog || 'carbon-components-ember/components/dialogs/confirm', {
        type: 'danger',
        header: 'Danger',
        body: this.args.confirmText || 'Confirm this operation',
        onAccept: run
      });
    } else {
      run();
    }
  }
}

export default CarbonIcon;
