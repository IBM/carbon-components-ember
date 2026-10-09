import Component from '@glimmer/component';
import { defaultArgs } from '../utils/decorators.ts';
import type DialogManagerService from '../services/dialog-manager.ts';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type ConfirmDialogComponent from './dialogs/confirm.gts';
import Confirm from './dialogs/confirm.gts';
import Loading from './loading.gts';

export interface ButtonSignature {
  Element: HTMLButtonElement;
  Args: {
    /**
     * Will display a spinning Wheel inside the button
     */
    loading?: boolean;

    disabled?: boolean;

    /**
     * Pass `false` to cancel the click's default action, such as a
     * `type="submit"` button submitting its form. The click still bubbles.
     */
    bubbles?: boolean;

    onClick?: () => void | null | Promise<unknown>;

    /**
     * Indicates the type of the button
     */
    type?: 'primary' | 'secondary' | 'danger';
    /** Same as `@type="primary"`. */
    primary?: boolean;
    /** Same as `@type="secondary"`. */
    secondary?: boolean;
    /**
     * Same as `@type="danger"`, including the confirmation dialog before
     * `@onClick` runs.
     */
    danger?: boolean;

    /**
     * If the action is dangerous, this text message will be shown in the dialog
     */
    confirmText?: string;
    /**
     * Use this component as dialog
     */
    confirmDialog?: typeof ConfirmDialogComponent;
    /**
     * If the button is tertiary
     */
    tertiary?: boolean;
    /**
     * the button size
     */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /**
     * If the button is a ghost button
     */
    ghost?: boolean;

    label?: string;

    iconOnly?: boolean;
  };
  Blocks: {
    default: [];
  };
}

export default class Button extends Component<ButtonSignature> {
  @tracked loading: boolean = false;
  @tracked disabled = false;
  @tracked showDialog = false;
  @service('carbon.dialog-manager')
  dialogManager!: DialogManagerService;

  @defaultArgs
  args: ButtonSignature['Args'] = {
    loading: false,
    disabled: false,
    onClick: undefined,
    type: 'primary',
    confirmText: '',
    confirmDialog: undefined,
    tertiary: false,
    size: 'md',
    ghost: false,
  };

  <template>
    <button
      onclick={{this.onButtonClick}}
      class="cds--btn
        {{this.classes}}
        {{this.layout}}
        {{if (or this.loading @loading) 'cds--btn--ghost'}}"
      disabled={{or @disabled this.loading @loading}}
      type="button"
      ...attributes
    >
      {{#if this.showDialog}}
        {{#let (or @confirmDialog Confirm) as |Dialog|}}
          {{#in-element this.dialogManager.destinationElement}}
            <Dialog
              @onAccept={{this.runButtonClick}}
              @onCancel={{this.cancel}}
              @header="Danger"
              @body={{or @confirmText "Confirm this operation"}}
              @type="danger"
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

  // @type has no "off" value (it defaults to 'primary'), so a caller that
  // only sets @tertiary/@ghost still has @type default to 'primary' behind
  // the scenes - without this guard, `primary` would also resolve true and
  // `cds--btn--tertiary`/`cds--btn--ghost` would render alongside a
  // conflicting `cds--btn--primary`. A caller that wants a plain @type-based
  // kind with neither @tertiary nor @ghost set (the common case, and the
  // only way @type ever resolves to its real default) is unaffected.
  get primary() {
    if (this.args.tertiary || this.args.ghost) return false;
    return this.args.primary || this.args.type === 'primary';
  }

  get secondary() {
    if (this.args.tertiary || this.args.ghost) return false;
    return this.args.secondary || this.args.type === 'secondary';
  }

  get danger() {
    if (this.args.tertiary || this.args.ghost) return false;
    return this.args.danger || this.args.type === 'danger';
  }

  get layout() {
    return this.args.size ? `cds--layout--size-${this.args.size}` : '';
  }

  get classes() {
    const classes: string[] = [];
    if (this.primary) classes.push('cds--btn--primary');
    if (this.secondary) classes.push('cds--btn--secondary');
    if (this.danger) classes.push('cds--btn--danger');
    if (this.args.tertiary) classes.push('cds--btn--tertiary');
    if (this.args.ghost) classes.push('cds--btn--ghost');
    if (this.disabled || this.args.disabled) classes.push('cds--btn--disabled');
    if (this.args.iconOnly) classes.push('cds--btn--icon-only');
    if (this.args.size) classes.push(`cds--btn--${this.args.size}`);
    return classes.join(' ');
  }

  runButtonClick = () => {
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
        };
        ret.then(end, end);
      }
    }
    this.showDialog = false;
  };

  cancel = () => {
    this.showDialog = false;
  };

  onButtonClick = () => {
    if (this.danger) {
      this.showDialog = true;
    } else {
      this.runButtonClick();
    }
    // Returning false cancels the default action; undefined leaves it. A
    // danger button cancels it, so a submit waits for the confirmation.
    return this.danger ? false : this.args.bubbles;
  };
}
