/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { eq } from 'ember-truth-helpers';
import Loading from '../loading.gts';
import { Close, CheckmarkFilled } from '../../icons.ts';

export interface FileUploaderStatusIconSignature {
  Args: {
    status?: 'uploading' | 'edit' | 'complete';
    name?: string;
    disabled?: boolean;
    iconDescription?: string;
    ariaDescribedby?: string;
    onActivate?: (event: Event) => void;
  };
}

/**
 * Renders the status indicator at the end of a selected-file row (mirrors
 * React's private `Filename` component, which this addon does not expose
 * publicly - it has no story/usage of its own in Carbon React's docs, only
 * as an implementation detail of `FileUploader`/`FileUploaderItem`).
 */
export default class FileUploaderStatusIcon extends Component<FileUploaderStatusIconSignature> {
  get status() {
    return this.args.status ?? 'uploading';
  }

  get iconDescription() {
    return this.args.iconDescription ?? 'Uploading file';
  }

  @action
  handleClick(event: Event) {
    this.args.onActivate?.(event);
  }

  <template>
    {{#if (eq this.status 'uploading')}}
      <Loading
        @description={{this.iconDescription}}
        @small={{true}}
        @withOverlay={{false}}
        class='cds--file-loading'
      />
    {{else if (eq this.status 'edit')}}
      <button
        type='button'
        disabled={{@disabled}}
        aria-label='{{this.iconDescription}} - {{@name}}'
        aria-describedby={{@ariaDescribedby}}
        class='cds--file-close'
        {{on 'click' this.handleClick}}
      >
        <Close @size='16' @svgClass='cds--file-close__icon' />
      </button>
    {{else if (eq this.status 'complete')}}
      <span aria-label={{this.iconDescription}} tabindex='-1'>
        <CheckmarkFilled @size='16' @svgClass='cds--file-complete' />
      </span>
    {{/if}}
  </template>
}
