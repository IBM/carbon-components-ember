var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from '@glimmer/component';
import { bxClassNames, classPrefix, defaultArgs } from 'carbon-components-ember/decorators';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
/**
 The Carbon Button

 ```handlebars
 {{import Button from 'carbon-components-ember/components/button'}}

 <Button @onClick={{fn this.onclick}} @danger={{false}} > Button Text </Button>
 ```
 @class CarbonButton
 @public
 **/
let CarbonButton = class CarbonButton extends Component {
    constructor() {
        super(...arguments);
        this.args = defaultArgs(this, {
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
    }
    get primary() {
        return this.args.primary || this.args.type === 'primary';
    }
    get secondary() {
        return this.args.secondary || this.args.type === 'secondary';
    }
    get danger() {
        return this.args.danger || this.args.type === 'danger';
    }
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
                };
                ret.then(end, end);
            }
        }
        this.showDialog = false;
    }
    cancel() {
        this.showDialog = false;
    }
    onButtonClick() {
        if (this.danger) {
            this.showDialog = true;
        }
        else {
            this.runButtonClick();
        }
        // Prevent bubbling, if specified. If undefined, the event will bubble.
        return this.args.bubbles;
    }
};
__decorate([
    tracked
], CarbonButton.prototype, "loading", void 0);
__decorate([
    tracked
], CarbonButton.prototype, "disabled", void 0);
__decorate([
    tracked
], CarbonButton.prototype, "showDialog", void 0);
__decorate([
    service('carbon.dialog-manager')
], CarbonButton.prototype, "dialogManager", void 0);
__decorate([
    bxClassNames('primary', 'secondary', 'danger', 'tertiary', 'ghost', 'small:sm')
], CarbonButton.prototype, "bxClassNames", void 0);
__decorate([
    action
], CarbonButton.prototype, "runButtonClick", null);
__decorate([
    action
], CarbonButton.prototype, "cancel", null);
__decorate([
    action
], CarbonButton.prototype, "onButtonClick", null);
CarbonButton = __decorate([
    classPrefix('cds--btn--')
], CarbonButton);
export default CarbonButton;
