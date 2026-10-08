import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import Loading from '../components/loading.gts';
import renderSvgPart from '../components/icon/render-svg-part.ts';
import { stylesheet } from 'astroturf';
import type DialogManagerService from '../services/dialog-manager.ts';

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
     * must be a htmlSafe string
     */
    iconSvg?: ReturnType<typeof htmlSafe>;
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
     * button style
     */
    btnStyle?: string;

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
          'carbon-components-ember/components/dialogs/confirm.gts',
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

  styles = stylesheet`
    @use "@carbon/styles/scss/theme" as *;

    .loading {
      display: inline-block;
    }

    .icon {
      margin: 5px;
      fill: $icon-primary;

      .cds--icon-- {
        &disabled {
          cursor: initial;
          opacity: 0.5;
        }
        &info {
          fill: $background;
          &:hover {
            fill: $background-hover;
          }
        }
        &danger {
          fill: $support-error;
          &:hover {
            filter: brightness(0.85);
          }
        }
      }

      .loader {
        width: 12px;
        height: 16px;
        display: inline-block;
        .cds--loading {
          display: inline-block;
          width: 1rem;
          height: 1rem;
        }
      }
    }
  ` as {
    icon: string;
    loading: string;
  };

  <template>
    {{#if (or @loading this.loading)}}
      <span class={{this.styles.loading}}>
        <Loading
          @classNames="{{this.styles.icon}} {{this.classes}} loader"
          @small={{true}}
          @inline={{true}}
        />
      </span>
    {{else}}
      {{#if @onClick}}
        <button
          class="cds--btn cds--btn--sm cds--btn--ghost {{@btnClass}}"
          style={{if @btnStyle (htmlSafe @btnStyle)}}
          type="button"
          aria-label={{@iconDescription}}
          {{on "click" this.onIconClick}}
        >
          {{renderSvgPart
            this.svg
            class=(array (or @svgClass this.styles.icon) this.classes)
            fill=(or @fill "currentColor")
            size=@size
            title=@title
          }}
        </button>
      {{else}}
        {{renderSvgPart
          this.svg
          class=(array (or @svgClass this.styles.icon) this.classes)
          fill=(or @fill "currentColor")
          size=@size
          title=@title
        }}
      {{/if}}
    {{/if}}
  </template>
}
