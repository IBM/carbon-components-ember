import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type { TrustedHTML } from '@ember/template';
import Loading from '../components/loading.gts';
import renderSvgPart from '../components/icon/render-svg-part.ts';
import type DialogManagerService from '../services/dialog-manager.ts';
import './icon.scss';

/** An icon descriptor from `@carbon/icons` (e.g. `@carbon/icons/es/add/16`). */
export type IconType = {
  name: string;
  elem: string;
  attrs: Record<string, string | number>;
  content: {
    elem: string;
    attrs: Record<string, string | number>;
  }[];
  size: number;
};

const IconMap: Record<string, IconType> = {};

export function registerIcon(name: string, icon: IconType) {
  IconMap[name] = icon;
}

export interface IconSignature {
  Args: {
    /**
     * Indicates if the icon is in loading state
     */
    loading?: boolean;
    /**
     * Indicates if the icon is informative
     */
    info?: boolean;
    /**
     * Indicates if the action is dangerous, showing a confirmation dialog before calling `onClick`
     */
    danger?: boolean;
    /**
     * If the action is dangerous, this text message will be shown in the dialog
     */
    confirmText?: string;
    /**
     * Use this component as dialog
     */
    confirmDialog?: string;
    /**
     * Use this icon to display
     */
    icon?: string | IconType;

    /**
     * Use this icon svg to display,
     * marked as trusted with `trustHTML()`
     */
    iconSvg?: TrustedHTML;
    /**
     * Size of icon
     */
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    size?: 16 | 20 | 24 | 32 | number | string;
    /**
     * action to trigger on click
     */
    onClick?: () => void | Promise<never>;

    /**
     * Names the `@onClick` button for assistive technology (the icon itself is
     * decorative). Required whenever `@onClick` is passed.
     */
    iconDescription?: string;

    /**
     * button classes
     */
    btnClass?: string;
    svgClass?: string;
    fill?: string;
    /**
     * Text for an SVG `<title>` element inside the icon, making it accessible
     * to screen readers. Matches `@carbon/icons-react`'s `children` pattern
     * (callers pass `<title>{description}</title>` as children). An empty string
     * renders an empty `<title></title>`, matching React's behaviour when a
     * description prop is present but empty.
     */
    title?: string;
  };
}

export default class Icon extends Component<IconSignature> {
  @service('carbon.dialog-manager')
  dialogManager!: DialogManagerService;
  @tracked loading: boolean = false;
  @tracked disabled: boolean = false;

  get classes() {
    const classes: string[] = [];
    if (this.args.info) classes.push('cds--icon--info');
    if (this.args.danger) classes.push('cds--icon--danger');
    if (this.disabled) classes.push('cds--icon--disabled');
    return classes.join(' ');
  }

  get svg() {
    if (typeof this.args.icon === 'string') {
      return IconMap[this.args.icon];
    }
    return this.args.icon;
  }

  onIconClick = () => {
    const run = () => {
      const promise = this.args.onClick && this.args.onClick();
      this.loading = true;
      this.disabled = true;
      if (promise && promise.then) {
        const finish = () => {
          this.loading = false;
          this.disabled = false;
        };
        promise.then(finish, finish);
      } else {
        setTimeout(() => {
          if (this.isDestroyed) return;
          this.loading = false;
          this.disabled = false;
        }, 350);
      }
    };
    if (this.args.danger) {
      this.dialogManager.open(
        this.args.confirmDialog ||
          'carbon-components-ember/components/dialogs/confirm-dialog.gts',
        {
          type: 'danger',
          header: 'Danger',
          body: this.args.confirmText || 'Confirm this operation',
          onAccept: run,
        },
      );
    } else {
      run();
    }
  };

  // eslint-disable-next-line ember/template-require-splattributes -- the svg comes from a helper; use @svgClass
  <template>
    {{#if (or @loading this.loading)}}
      <span class="cds--ember-icon__loading">
        <Loading
          @small={{true}}
          @withOverlay={{false}}
          class="cds--ember-icon {{this.classes}} loader"
        />
      </span>
    {{else}}
      {{#if @onClick}}
        <button
          class="cds--btn cds--btn--sm cds--btn--ghost {{@btnClass}}"
          type="button"
          aria-label={{@iconDescription}}
          {{on "click" this.onIconClick}}
        >
          {{renderSvgPart
            this.svg
            class=(array (or @svgClass "cds--ember-icon") this.classes)
            fill=(or @fill "currentColor")
            size=@size
            title=@title
          }}
        </button>
      {{else}}
        {{renderSvgPart
          this.svg
          class=(array (or @svgClass "cds--ember-icon") this.classes)
          fill=(or @fill "currentColor")
          size=@size
          title=@title
        }}
      {{/if}}
    {{/if}}
  </template>
}
