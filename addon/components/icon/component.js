import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import * as icons from '@carbon/icons';
import { bxClassNames, classPrefix, argsCompat } from 'carbon-components-ember/decorators';

const IconMap = {};
Object.values(icons).forEach((i) => {
  IconMap[i.name] = IconMap[i.name] || {};
  IconMap[i.name][i.size] = i;
})

@classPrefix('bx--icon--')
class CarbonIcon extends Component {
  tagName = '';
  static positionalParams = ['icon'];
  @service('carbon-components-ember@dialog-manager') dialogManager;
  @bxClassNames('info', 'danger', 'disabled') bxClassNames;
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
    confirmDialog: null,
    /**
     * Use this component as dialog
     @argument icon
     @type String
     */
    icon: null,
    /**
     * Use this component as dialog
     @argument size
     @type number
     */
    size: null,
    /**
     * Use this component as dialog
     @argument onClick
     @type function
     */
    onClick: null
  };

  get svg() {
    // eslint-disable-next-line eqeqeq
    return IconMap[this.args.icon] && IconMap[this.args.icon][this.args.size || 16];
  }

  @action
  onIconClick() {
    const run = () => {
      const promise = this.args.onClick && this.args.onClick();
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
    if (this.args.danger) {
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
