import Component from '@ember/component';
import { bxClassNames, classPrefix } from 'carbon-components-ember/decorators/bx-class-names';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { styleNamespace } from '/styles';
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
  styleNamespace = styleNamespace;
  args = {
    /**
     * Will display a spinning Wheel inside the button
     @argument loading
     @type boolean
     @public
     */
    loading: null,
    /**
     @argument disabled
     @type boolean
     @public
     */
    disabled: null,
    /**
     @argument bubbles
     @type boolean
     @public
     */
    bubbles: null,
    /**
     @argument onClick
     @type function
     @public
     */
    onClick: null,
    /**
     * Indicates if the action is dangerous, showing a confirmation dialog before calling `onClick`
     @argument danger
     @type boolean
     @public
     */
    danger: null,
    /**
     * If the action is dangerous, this text message will be shown in the dialog
     @argument confirmText
     @type String
     @public
     */
    confirmText: null
  };

  @service('carbon-components-ember@dialog-manager') dialogManager;
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
