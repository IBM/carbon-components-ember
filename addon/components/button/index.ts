import Component from '@glimmer/component';
import { bxClassNames, classPrefix, defaultArgs } from 'carbon-components-ember/decorators';
import DialogManagerService from 'carbon-components-ember/services/dialog-manager';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ConfirmDialogComponent from 'carbon-components-ember/components/dialogs/confirm';


/** @documenter yuidoc */

type Args = {
  /**
   * Will display a spinning Wheel inside the button
   @argument loading
   @type boolean
   */
  loading?: boolean,
  /**
   @argument disabled
   @type boolean
   */
  disabled?: boolean,
  /**
   @argument bubbles
   @type boolean
   */
  bubbles?: boolean,
  /**
   @argument onClick
   @type function
   */
  onClick?: Function|null,

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
  confirmText?: string,
  /**
   * Use this component as dialog
   @argument confirmDialog
   @type ConfirmDialogComponent
   */
  confirmDialog?: typeof ConfirmDialogComponent,
  /**
   * If the action is tertiary
   @argument tertiary
   @type boolean
   */
  tertiary?: boolean,
  /**
   * If the action is small
   @argument small
   @type boolean
   */
  small?: boolean,
  /**
   * If the action is a ghost button
   @argument ghost
   @type boolean
   */
  ghost?: boolean,

  label?: string
};

export interface ButtonSignature {
  // We have a `<table>` as our root element
  Element: HTMLButtonElement;
  // We accept an array of items, one per row
  Args: Args
  // We accept two named blocks: a parameter-less `header` block
  // and a `row` block which will be invoked with each item and
  // its index sequentially.
  Blocks: {
    default: []
  };
}

/**
 The Carbon Button

 ```handlebars
 {{import Button from 'carbon-components-ember/components/button'}}

 <Button @onClick={{fn this.onclick}} @danger={{false}} > Button Text </Button>
 ```
 @class CarbonButton
 @public
 **/
@classPrefix('cds--btn--')
class CarbonButton extends Component<ButtonSignature> {
  @tracked loading: boolean;
  @tracked disabled;
  @tracked showDialog;
  @service('carbon.dialog-manager') dialogManager: DialogManagerService;

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

  @bxClassNames('primary', 'secondary', 'danger', 'tertiary', 'ghost', 'small:sm') bxClassNames;

  @action
  runButtonClick() {
    const ac = this.args.onClick;
    if (ac) {
      const ret = ac();
      if (ret && ret.then) {
        this.disabled = true;
        this.loading = true;
        const end = () => {
          this.disabled = false;
          this.loading = false;
          this.showDialog = false;
        } ;
        ret.then(end, end);
      }
    }
    this.showDialog = false;
  }

  @action
  cancel() {
    this.showDialog = false;
  }

  @action
  onButtonClick() {
    if (this.danger) {
      this.showDialog = true;
    } else {
      this.runButtonClick();
    }
    // Prevent bubbling, if specified. If undefined, the event will bubble.
    return this.args.bubbles;
  }
}

export default CarbonButton;
