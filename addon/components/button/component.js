import Component from '@ember/component';
import { bxClassNames, classPrefix, argsCompat } from 'carbon-components-ember/decorators';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import {tracked} from "@glimmer/tracking";
/** @documenter yuidoc */

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

  @argsCompat
  args = {
    /**
     * Will display a spinning Wheel inside the button
     @argument loading
     @type boolean
     */
    loading: null,
    /**
     @argument disabled
     @type boolean
     */
    disabled: null,
    /**
     @argument bubbles
     @type boolean
     */
    bubbles: null,
    /**
     @argument onClick
     @type function
     */
    onClick: null,
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
     * If the action is tertiary
     @argument tertiary
     @type boolean
     */
    tertiary: null,
    /**
     * If the action is small
     @argument small
     @type boolean
     */
    small: null,
    /**
     * If the action is a ghost button
     @argument ghost
     @type boolean
     */
    ghost: null
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
