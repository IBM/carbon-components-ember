import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { htmlSafe as htmlSafeString } from '@ember/template';
import { bxClassNames, classPrefix } from '../utils/decorators.ts';
import { on } from '@ember/modifier';
import Loading from '../components/loading.gts';
import or from '../helpers/or.ts';
import renderSvgPart from '../components/icon/render-svg-part.ts';
import { array } from '@ember/helper';
import htmlSafe from '../helpers/html-safe.ts';
import { stylesheet } from 'astroturf';
import type DialogManagerService from '../services/dialog-manager';

export type IconType = {
  name: string;
  elem: string;
  attrs: Record<string,string>;
  content: {
    elem: string;
    attrs: Record<string,string>;
  },
  size: number;
};

const IconMap: Record<string, IconType> = {} as Record<string, IconType>

export function registerIcon(name: string, icon: IconType) {
  IconMap[name] = icon;
}

export type Args = {
  /**
   * Indicates if the icon is in loading state
   @argument loading
   @type boolean
   */
  loading?: boolean;
  /**
   * Indicates if the icon is informative
   @argument info
   @type boolean
   */
  info?: boolean;
  /**
   * Indicates if the action is dangerous, showing a confirmation dialog before calling `onClick`
   @argument danger
   @type boolean
   */
  danger?: boolean;
  /**
   * If the action is dangerous, this text message will be shown in the dialog
   @argument confirmText
   @type String
   */
  confirmText?: string;
  /**
   * Use this component as dialog
   @argument confirmDialog
   @type String
   */
  confirmDialog?: string;
  /**
   * Use this icon to display
   @argument icon
   @type String
   */
  icon?: string | IconType;

  /**
   * Use this icon svg to display,
   * must be a htmlSafe string
   @argument icon
   */
  iconSvg?: ReturnType<typeof htmlSafeString>;
  /**
   * Size of icon
   @argument size
   @type number
   */
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  size?: 16 | 20 | 24 | 32 | number | string;
  /**
   * action to trigger on click
   @argument onClick
   @type function
   */
  onClick?: () => void | Promise<never>;

  /**
   * button style
   @argument btnStyle
   @type string
   */
  btnStyle?: string;

  /**
   * button classes
   @argument btnClass
   @type string
   */
  btnClass?: string;
  svgClass?: string;
  fill?: string;
};

@classPrefix('cds--icon--')
export default class CarbonIcon extends Component<Args> {
  static positionalParams = ['icon'];
  @service('carbon.dialog-manager')
  dialogManager!: DialogManagerService;
  @bxClassNames('info', 'danger', 'disabled') bxClassNames?: string;
  @tracked loading: boolean = false;
  @tracked disabled: boolean = false;

  get svg() {
    if (typeof this.args.icon === 'string') {
      return IconMap[this.args.icon];
    }
    return this.args.icon;
  }

  @action
  onIconClick() {
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
  }

  styles = stylesheet`
    @import "@carbon/styles/scss/theme";

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
  };

  <template>
    {{#if (or @loading this.loading)}}
      <span style='display: inline-block;'>
        <Loading
          @classNames='{{this.styles.icon}} {{this.bxClassNames}} loader'
          @small={{true}}
          @inline={{true}}
        />
      </span>
    {{else}}
      {{#if @onClick}}
        <button
          class='cds--btn cds--btn--sm cds--btn--ghost {{@btnClass}}'
          style={{if @btnStyle (htmlSafe @btnStyle)}}
          type='button'
          {{on 'click' this.onIconClick}}
        >
          {{renderSvgPart
            this.svg
            class=(array (or @svgClass this.styles.icon) this.bxClassNames)
            fill=(or @fill 'currentColor')
            size=@size
          }}
        </button>
      {{else}}
        {{renderSvgPart
          this.svg
          class=(array (or @svgClass this.styles.icon) this.bxClassNames)
          fill=(or @fill 'currentColor')
          size=@size
        }}
      {{/if}}
    {{/if}}
  </template>
}


