/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { and } from 'ember-truth-helpers';
import { modifier as eModifier } from 'ember-modifier';
import Tooltip from '../tooltip.gts';
import FileUploaderStatusIcon from './-status-icon.gts';

export interface FileUploaderItemSignature {
  Element: HTMLSpanElement;
  Args: {
    /** Specify whether the file uploader item is disabled */
    disabled?: boolean;
    /** Error message body for an invalid file upload */
    errorBody?: string;
    /** Error message subject for an invalid file upload */
    errorSubject?: string;
    /** Description of the status icon (read by assistive technology) */
    iconDescription?: string;
    /** Specify if the currently uploaded file is invalid */
    invalid?: boolean;
    /** Name of the uploaded file */
    name?: string;
    /** Called after the item is removed, with the item's `uuid` */
    onDelete?: (event: Event, data: { uuid: string }) => void;
    /** Specify the size of the item, from a list of available sizes */
    size?: 'sm' | 'md' | 'lg';
    /** Status of the file upload */
    status?: 'uploading' | 'edit' | 'complete';
    /** Unique identifier for the file, generated when omitted */
    uuid?: string;
  };
}

// Measures whether the filename is actually being clipped by CSS
// text-overflow, so the tooltip only wraps it when truncation is real.
// Re-measures whenever `name` changes, mirroring React's
// `useIsomorphicEffect(..., [prefix, name])`.
const measureEllipsis = eModifier<{
  Element: HTMLElement;
  Args: { Named: { onMeasure: (active: boolean) => void; name?: string } };
}>((element, _positional, { onMeasure, name }) => {
  void name;
  onMeasure(element.offsetWidth < element.scrollWidth);
});

/**
 * A single row in a selected-file list: filename (truncated with a tooltip
 * when it overflows), a status icon (uploading spinner / complete
 * checkmark / edit-mode delete button), and an optional invalid-file error
 * message. Composes with `FileUploaderDropContainer` to build a real
 * drag-and-drop upload flow - see the docs for the full pattern.
 */
export default class FileUploaderItem extends Component<FileUploaderItemSignature> {
  @tracked isEllipsisApplied = false;

  guid = guidFor(this);

  get uuid() {
    return this.args.uuid ?? this.guid;
  }

  get status() {
    return this.args.status ?? 'uploading';
  }

  get filteredName() {
    return this.args.name?.replace(/\s+/g, '');
  }

  get errorId() {
    return `${this.filteredName}-id-error`;
  }

  get classes() {
    const classes = ['cds--file__selected-file'];
    if (this.args.invalid) classes.push('cds--file__selected-file--invalid');
    if (this.args.size === 'md') classes.push('cds--file__selected-file--md');
    if (this.args.size === 'sm') classes.push('cds--file__selected-file--sm');
    if (this.args.disabled) classes.push('cds--file__selected-file--disabled');
    return classes.join(' ');
  }

  @action
  setEllipsisApplied(active: boolean) {
    this.isEllipsisApplied = active;
  }

  @action
  handleDelete(event: Event) {
    this.args.onDelete?.(event, { uuid: this.uuid });
  }

  <template>
    <span class={{this.classes}} ...attributes>
      {{#if this.isEllipsisApplied}}
        <div
          class={{if
            @invalid
            'cds--file-filename-container-wrap-invalid'
            'cds--file-filename-container-wrap'
          }}
        >
          <Tooltip @label={{@name}} @align='bottom' class='cds--file-filename-tooltip'>
            <button type='button' class='cds--file-filename-button'>
              <p
                title={{@name}}
                class='cds--file-filename-button'
                id={{this.filteredName}}
                {{measureEllipsis onMeasure=this.setEllipsisApplied name=@name}}
              >{{@name}}</p>
            </button>
          </Tooltip>
        </div>
      {{else}}
        <p
          title={{@name}}
          class='cds--file-filename'
          id={{this.filteredName}}
          {{measureEllipsis onMeasure=this.setEllipsisApplied name=@name}}
        >{{@name}}</p>
      {{/if}}

      <div class='cds--file-container-item'>
        <span class='cds--file__state-container'>
          <FileUploaderStatusIcon
            @status={{this.status}}
            @name={{@name}}
            @disabled={{@disabled}}
            @iconDescription={{@iconDescription}}
            @onActivate={{this.handleDelete}}
            @ariaDescribedby={{if (and @invalid @errorSubject) this.errorId}}
          />
        </span>
      </div>

      {{#if (and @invalid @errorSubject)}}
        <div class='cds--form-requirement' role='alert' id={{this.errorId}}>
          <div class='cds--form-requirement__title'>{{@errorSubject}}</div>
          {{#if @errorBody}}
            <p class='cds--form-requirement__supplement'>{{@errorBody}}</p>
          {{/if}}
        </div>
      {{/if}}
    </span>
  </template>
}
