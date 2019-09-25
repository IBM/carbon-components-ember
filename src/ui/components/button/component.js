import Component from '@ember/component';
import { bxClassNames, classPrefix } from 'carbon/src/decorators/bx-class-names';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

@classPrefix('bx--btn--')
class CarbonButton extends Component {
  tagName = '';
  @service('carbon@dialog-manager') dialogManager;
  @bxClassNames('primary', 'secondary', 'danger', 'tertiary', 'ghost', 'small:sm') bxClassNames;
  @tracked loading;
  @tracked disabled;

  @action
  onButtonClick(...args) {
    const run = () => {
      const ac = this.attrs.onClick;
      if (ac) {
        const ret = ac(...args);
        if (ret && ret.finally) {
          this.disabled = true;
          this.loading = true;
          ret.finally(() => {
            this.disabled = false;
            this.loading = false;
          });
        }
      }
    };
    if (this.attrs.danger) {
      this.dialogManager.open('confirm', {
        type: 'danger',
        header: 'Danger',
        body: this.attrs.confirmText || 'Confirm this operation',
        onAccept: run
      });
    } else {
      run();
    }
    // Prevent bubbling, if specified. If undefined, the event will bubble.
    return this.attrs.bubbles;
  }
}

export default CarbonButton;
