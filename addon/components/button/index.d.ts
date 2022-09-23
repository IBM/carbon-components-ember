import Component from '@glimmer/component';
import DialogManagerService from 'carbon-components-ember/services/dialog-manager';
import ConfirmDialogComponent from 'carbon-components-ember/components/dialogs/confirm';
/** @documenter yuidoc */
declare type Args = {
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
    onClick?: Function | null;
    /**
     * Indicates the type of the button
     @argument type
     @type string
     */
    type: 'primary' | 'secondary' | 'danger';
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
    confirmDialog?: ConfirmDialogComponent;
    /**
     * If the action is tertiary
     @argument tertiary
     @type boolean
     */
    tertiary?: boolean;
    /**
     * If the action is small
     @argument small
     @type boolean
     */
    small?: boolean;
    /**
     * If the action is a ghost button
     @argument ghost
     @type boolean
     */
    ghost?: boolean;
    label?: string;
};
export interface ButtonSignature {
    Element: HTMLButtonElement;
    Args: Args;
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
declare class CarbonButton extends Component<ButtonSignature> {
    loading: boolean;
    disabled: any;
    showDialog: any;
    dialogManager: DialogManagerService;
    args: Args;
    get primary(): any;
    get secondary(): any;
    get danger(): any;
    bxClassNames: any;
    runButtonClick(): void;
    cancel(): void;
    onButtonClick(): boolean | undefined;
}
export default CarbonButton;
