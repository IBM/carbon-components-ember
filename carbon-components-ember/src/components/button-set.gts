/**
 * Copyright IBM Corp. 2016, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

export interface ButtonSetSignature {
  Element: HTMLDivElement;
  Args: {
    /**
     * fluid: button set resize to the size of the container up to a maximum dependant on the
     * number of buttons. Overrides `stacked` property.
     * @default false
     */
    fluid?: boolean;

    /**
     * Specify the button arrangement of the set (vertically stacked or
     * horizontal)
     * @default false
     */
    stacked?: boolean;
  };
  Blocks: {
    default: [];
  };
}

/**
 * ButtonSet component provides a container for grouping buttons together.
 * It supports both horizontal and stacked (vertical) layouts.
 *
 * @example
 * ```gts
 * <ButtonSet>
 *   <Button @kind="secondary">Cancel</Button>
 *   <Button @kind="primary">Submit</Button>
 * </ButtonSet>
 * ```
 *
 * @example Stacked layout
 * ```gts
 * <ButtonSet @stacked={{true}}>
 *   <Button @kind="secondary">Cancel</Button>
 *   <Button @kind="primary">Submit</Button>
 * </ButtonSet>
 * ```
 *
 * @example Fluid layout
 * ```gts
 * <ButtonSet @fluid={{true}}>
 *   <Button @kind="secondary">Cancel</Button>
 *   <Button @kind="primary">Submit</Button>
 * </ButtonSet>
 * ```
 */
export default class ButtonSet extends Component<ButtonSetSignature> {
  get fluid() {
    return this.args.fluid ?? false;
  }

  get stacked() {
    return this.args.stacked ?? false;
  }

  get classes() {
    const classes = ['cds--btn-set'];
    
    if (this.stacked) {
      classes.push('cds--btn-set--stacked');
    }
    
    if (this.fluid) {
      classes.push('cds--btn-set--fluid');
    }
    
    return classes.join(' ');
  }

  get fluidInnerClasses() {
    return 'cds--btn-set__fluid-inner cds--btn-set__fluid-inner--auto-stack';
  }

  <template>
    <div class={{this.classes}} ...attributes>
      {{#if this.fluid}}
        <div class={{this.fluidInnerClasses}}>
          {{yield}}
        </div>
      {{else}}
        {{yield}}
      {{/if}}
    </div>
  </template>
}
