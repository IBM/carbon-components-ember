import Component from '@glimmer/component';
import { bxClassNames, classPrefix, defaultArgs } from 'carbon-components-ember/decorators';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
/** @documenter yuidoc */

type Args = {
  /**
   * Will display a spinning Wheel inside the button
   @argument loading
   @type boolean
   */
  loading: boolean,
  /**
   @argument disabled
   @type boolean
   */
  disabled: boolean,
  /**
   @argument bubbles
   @type boolean
   */
  bubbles: boolean,
  /**
   @argument onClick
   @type function
   */
  onClick: Function|null,
  /**
   * Indicates if the action is the primary one
   @argument primary
   @type boolean
   */
  primary: boolean,
  /**
   * Indicates if the action is dangerous, showing a confirmation dialog before calling `onClick`
   @argument danger
   @type boolean
   */
  danger: boolean,
  /**
   * If the action is dangerous, this text message will be shown in the dialog
   @argument confirmText
   @type String
   */
  confirmText: String,
  /**
   * Use this component as dialog
   @argument confirmDialog
   @type String
   */
  confirmDialog: String,
  /**
   * If the action is tertiary
   @argument tertiary
   @type boolean
   */
  tertiary: boolean,
  /**
   * If the action is small
   @argument small
   @type boolean
   */
  small: boolean,
  /**
   * If the action is a ghost button
   @argument ghost
   @type boolean
   */
  ghost: boolean
};

/**
 The Carbon Button

 ```handlebars
    {{import Button from 'carbon-components-ember/components/button'}}

    <Button @onClick={{fn this.onclick}} @danger={{false}} > Button Text </Button>
 ```
 @class CarbonButton
 @public
 **/
@classPrefix('bx--btn--')
class CarbonButton extends Component {
  tagName = '';
  @tracked loading;
  @tracked disabled;

  @defaultArgs
  args: Args = {
    loading: false,
    disabled: false,
    bubbles: false,
    onClick: null,
    primary: false,
    danger: false,
    confirmText: '',
    confirmDialog: '',
    tertiary: false,
    small: false,
    ghost: false
  };

  @service('carbon-components-ember@dialog-manager') dialogManager;
  @bxClassNames('primary', 'secondary', 'danger', 'tertiary', 'ghost', 'small:sm') bxClassNames;

  @action
  onButtonClick(...args) {
    const run = () => {
      const ac = this.args.onClick;
      if (ac) {
        const ret = ac(...args);
        if (ret && ret.then) {
          this.disabled = true;
          this.loading = true;
          const end = () => {
            this.disabled = false;
            this.loading = false;
          } ;
          ret.then(end, end);
        }
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
    // Prevent bubbling, if specified. If undefined, the event will bubble.
    return this.args.bubbles;
  }
}

export default CarbonButton;
