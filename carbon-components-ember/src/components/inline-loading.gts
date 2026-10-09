/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { task, timeout } from 'ember-concurrency';
import { modifier } from 'ember-modifier';
import Loading from './loading.gts';
import CheckmarkFilled from './icons/checkmark-filled.ts';
import ErrorFilled from './icons/error-filled.ts';

type InlineLoadingStatus = 'inactive' | 'active' | 'finished' | 'error';

export interface InlineLoadingSignature {
  Element: HTMLDivElement;
  Args: {
    /** The loading status. Defaults to `"active"`. */
    status?: InlineLoadingStatus;
    /** Text shown next to the icon. */
    description?: string;
    /** Labels the icon. Defaults to "loading", or to the status when it's finished or an error. */
    iconDescription?: string;
    /** Called `@successDelay` milliseconds after `@status` becomes `"finished"`. */
    onSuccess?: () => void;
    /** How long to wait before calling `@onSuccess`, in milliseconds. Defaults to 1500. */
    successDelay?: number;
  };
}

export default class InlineLoading extends Component<InlineLoadingSignature> {
  get status(): InlineLoadingStatus {
    return this.args.status ?? 'active';
  }

  get successDelay() {
    return this.args.successDelay ?? 1500;
  }

  get iconLabel() {
    return (
      this.args.iconDescription ??
      (this.status === 'active' ? 'loading' : this.status)
    );
  }

  succeed = task({ restartable: true }, async (delay: number) => {
    await timeout(delay);
    this.args.onSuccess?.();
  });

  // Restarts the success timer whenever the status or delay changes.
  successTimer = modifier(
    (
      _element: HTMLDivElement,
      [status, delay]: [InlineLoadingStatus, number],
    ) => {
      if (status === 'finished') void this.succeed.perform(delay);
      return () => void this.succeed.cancelAll();
    },
  );

  <template>
    <div
      class="cds--inline-loading"
      aria-live={{if (eq this.status "inactive") "off" "assertive"}}
      {{this.successTimer this.status this.successDelay}}
      ...attributes
    >
      {{#if (eq this.status "error")}}
        <div class="cds--inline-loading__animation">
          <ErrorFilled
            @size="16"
            @svgClass="cds--inline-loading--error"
            @title={{this.iconLabel}}
          />
        </div>
      {{else if (eq this.status "finished")}}
        <div class="cds--inline-loading__animation">
          <CheckmarkFilled
            @size="16"
            @svgClass="cds--inline-loading__checkmark-container"
            @title={{this.iconLabel}}
          />
        </div>
      {{else if (eq this.status "active")}}
        <div class="cds--inline-loading__animation">
          <Loading
            @small={{true}}
            @withOverlay={{false}}
            @description={{this.iconLabel}}
          />
        </div>
      {{/if}}
      {{#if @description}}
        <div class="cds--inline-loading__text">{{@description}}</div>
      {{/if}}
    </div>
  </template>
}
