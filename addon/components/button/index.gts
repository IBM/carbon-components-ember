import Component from '@glimmer/component';
import { bxClassNames, classPrefix, defaultArgs } from 'carbon-components-ember/decorators';
import DialogManagerService from 'carbon-components-ember/services/dialog-manager';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ConfirmDialogComponent from 'carbon-components-ember/components/dialogs/confirm';
import or from 'carbon-components-ember/helpers/or';
import Confirm from 'carbon-components-ember/components/dialogs/confirm';
import styles from './styles.scoped.scss';
import Loading from 'carbon-components-ember/components/loading';

/** @documenter yuidoc */

type Args = {
  /**
   * Will display a spinning Wheel inside the button
   @argument loading
   @type boolean
   */
  loading?: boolean;
  /**
   @argument disabled
   @type boolean
   */
  disabled?: boolean;
  /**
   @argument bubbles
   @type boolean
   */
  bubbles?: boolean;
  /**
   @argument onClick
   @type function
   */
  onClick?: Function|null;

  /**
   * Indicates the type of the button
   @argument type
   @type string
   */
  type?: 'primary'|'secondary'|'danger';

  /**
   * If the action is dangerous, this text message will be shown in the dialog
   @argument confirmText
   @type String
   */
  confirmText?: string;
  /**
   * Use this component as dialog
   @argument confirmDialog
   @type ConfirmDialogComponent
   */
  confirmDialog?: typeof ConfirmDialogComponent;
  /**
   * If the button is tertiary
   @argument tertiary
   @type boolean
   */
  tertiary?: boolean;
  /**
   * the button size
   @argument small
   @type 'sm' | 'md' | 'lg' | 'xl'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl',
  /**
   * If the button is a ghost button
   @argument ghost
   @type boolean
   */
  ghost?: boolean;

  label?: string;

  iconOnly?: boolean;
};

export interface ButtonSignature {
  // We have a `<table>` as our root element
  Element: HTMLButtonElement;
  // We accept an array of items, one per row
  Args: Args;
  // We accept two named blocks: a parameter-less `header` block
  // and a `row` block which will be invoked with each item and
  // its index sequentially.
  Blocks: {
    default: [];
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

  @defaultArgs
  args: Args = {
    loading: false,
    disabled: false,
    bubbles: false,
    onClick: null,
    type: 'primary',
    confirmText: '',
    confirmDialog: undefined,
    tertiary: false,
    size: 'md',
    ghost: false
  };

  <template>
    <button
      onclick={{this.onButtonClick}}
      class='cds--btn
        {{this.bxClassNames}}
        {{this.layout}}
        {{styles.namespace}}
        {{if (or this.loading @loading) "cds--btn--ghost"}}'
      aria-label='{{if @type "danger"}}'
      disabled={{or @disabled this.loading @loading}}
      type='button'
      ...attributes
    >
      {{#if this.showDialog}}
        {{#let (or @confirmDialog Confirm) as |Dialog|}}
          {{#in-element this.dialogManager.destinationElement}}
            <Dialog
              @onAccept={{this.runButtonClick}}
              @onCancel={{this.cancel}}
              @header='Danger'
              @body={{or @confirmText 'Confirm this operation'}}
              @type='danger'
            />
          {{/in-element}}
        {{/let}}
      {{/if}}
      {{#if (or this.loading @loading)}}
        <Loading @inline={{true}} />
      {{else}}
        {{#if (has-block)}}
          {{yield}}
        {{else}}
          {{@label}}
        {{/if}}
      {{/if}}
    </button>
  </template>

  get primary() {
    return (this.args as any).primary || this.args.type === 'primary';
  }

  get secondary() {
    return (this.args as any).secondary || this.args.type === 'secondary';
  }

  get danger() {
    return (this.args as any).danger || this.args.type === 'danger';
  }

  get layout() {
    return `cds--layout--size-${this.args.size}`;
  }

  @bxClassNames('primary', 'secondary', 'danger', 'tertiary', 'ghost', 'size', 'disabled', 'iconOnly:icon-only') bxClassNames;

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
