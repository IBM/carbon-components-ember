import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { default as eq } from 'ember-truth-helpers/helpers/eq';
import { default as Icon } from '../components/icon.gts';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import NotificationService, {
  type NotificationOptions,
} from '../services/notifications.ts';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { type IconType } from '../components/icon.gts';
import type { WithRequired } from '../utils/type-helpers.ts';
import { CheckmarkFilled24, ErrorFilled24, Information24, InformationSquareFilled24, Warning24, WarningAltFilled24 } from '../icons.ts';

type Args = {
  onClick?: (args: never) => never;
  notification?: NotificationOptions;
} & NotificationOptions;

export interface NotificationComponentSignature {
  Args: Args;
  Element: HTMLDivElement;
}

export default class NotificationComponent extends Component<NotificationComponentSignature> {
  @tracked show = true;
  @service('carbon-components-ember@notifications')
  notifications!: NotificationService;

  get icon(): IconType {
    const mapping: Record<Required<NotificationOptions>['kind'], IconType> = {
      info: Information24,
      error: ErrorFilled24,
      'info-square': InformationSquareFilled24,
      success: CheckmarkFilled24,
      warning: Warning24,
      'warning-alt': WarningAltFilled24,
    };
    return mapping[this.defaultArgs.kind];
  }

  get defaultArgs(): WithRequired<Args, 'display' | 'kind'> {
    const type = this.args.type || 'error';
    return Object.assign(
      {},
      this.args.notification || {},
      {
        display: 'toast',
        kind: this.args.kind || type,
      },
      this.args,
    );
  }

  @action
  onNotificationClick(notification: NotificationOptions) {
    if (this.notifications.has(notification)) {
      this.notifications.remove(notification);
    } else {
      this.show = false;
    }
  }

  <template>
    {{#if this.show}}
      {{#if (eq this.defaultArgs.display 'toast')}}
        <div
          data-notification
          class='cds--toast-notification cds--toast-notification--{{this.defaultArgs.type}}'
          role='alert'
          ...attributes
        >
          <Icon
            @icon={{this.icon}}
            @svgClass='cds--toast-notification__icon'
            @fill='currentColor'
          />
          <div class='cds--toast-notification__details'>
            <h3 class='cds--toast-notification__title'>
              {{this.defaultArgs.title}}
            </h3>
            <p class='cds--toast-notification__subtitle'>
              {{this.defaultArgs.text}}
            </p>
            <p class='cds--toast-notification__caption'>
              {{this.defaultArgs.caption}}
            </p>
          </div>
          <button
            {{on 'click' (fn this.onNotificationClick this.defaultArgs)}}
            data-notification-btn
            class='cds--toast-notification__close-button'
            type='button'
            aria-label='close'
          >
            <Icon
              @icon='close'
              @svgClass='cds--inline-notification__close-icon'
            />
          </button>
        </div>
      {{/if}}
      {{#if (eq this.defaultArgs.display 'inline')}}
        <div
          role='status'
          class='cds--inline-notification cds--inline-notification--error'
        >
          <div class='cds--inline-notification__details'>
            <Icon
              @icon={{this.icon}}
              @svgClass='cds--inline-notification__icon'
              @fill='currentColor'
            />
            <div class='cds--inline-notification__text-wrapper'>
              <div class='cds--inline-notification__title'>
                {{this.defaultArgs.title}}
              </div>
              <div class='cds--inline-notification__subtitle'>
                {{this.defaultArgs.text}}
              </div>
            </div>
          </div>
          <button
            aria-hidden='true'
            tabindex='-1'
            type='button'
            aria-label='close notification'
            title='close notification'
            class='cds--inline-notification__close-button'
          >
            <Icon
              @icon='close'
              @svgClass='cds--inline-notification__close-icon'
            />
          </button>
        </div>
      {{/if}}

      {{#if (eq this.defaultArgs.display 'actionable')}}
        <div
          role='alertdialog'
          class='cds--actionable-notification cds--actionable-notification--toast cds--actionable-notification--{{@type}}'
          aria-labelledby='actionable-notification-3'
        >
          <div class='cds--actionable-notification__details'>
            <Icon
              @icon={{this.icon}}
              @svgClass='cds--toast-notification__icon'
              @fill='currentColor'
            />
            <div class='cds--actionable-notification__text-wrapper'>
              <div class='cds--actionable-notification__content'>
                <div
                  class='cds--actionable-notification__title'
                  id='actionable-notification-3'
                >
                  {{this.defaultArgs.title}}
                </div>
                <div class='cds--actionable-notification__subtitle'>
                  {{this.defaultArgs.text}}
                </div>
              </div>
            </div>
          </div>
          <button
            class='cds--actionable-notification__action-button cds--btn cds--btn--sm cds--layout--size-sm cds--btn--tertiary'
            type='button'
          >
            {{this.defaultArgs.actionTitle}}
          </button>
          <button
            aria-label='close notification'
            type='button'
            title='close notification'
            class='cds--actionable-notification__close-button'
          >
            <Icon
              @icon='close'
              @svgClass='cds--actionable-notification__close-icon'
            />
          </button>
        </div>
      {{/if}}
    {{/if}}
  </template>
}
