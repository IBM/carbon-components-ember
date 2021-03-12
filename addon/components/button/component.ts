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
   * Indicates the type of the button
   @argument type
   @type string
   */
  type: 'primary'|'secondary'|'danger'

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
class CarbonButton extends Component<Args> {
  @tracked loading;
  @tracked disabled;

  args: Args = defaultArgs(this, {
    primary: false,
    secondary: false,
    danger: false,
    loading: false,
    disabled: false,
    bubbles: false,
    onClick: null,
    type: '',
    confirmText: '',
    confirmDialog: '',
    tertiary: false,
    small: false,
    ghost: false
  });

  get primary() {
    return (this.args as any).primary || this.args.type === 'primary';
  }

  get secondary() {
    return (this.args as any).secondary || this.args.type === 'secondary';
  }

  get danger() {
    return (this.args as any).danger || this.args.type === 'danger';
  }

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
    if (this.danger) {
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
