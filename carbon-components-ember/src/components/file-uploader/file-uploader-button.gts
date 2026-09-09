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
import { on } from '@ember/modifier';
import type Owner from '@ember/owner';
import captureElement from './-capture-element.ts';

export interface FileUploaderButtonSignature {
  Element: HTMLButtonElement;
  Args: {
    /** Specify the types of files that this input should be able to receive */
    accept?: string[];
    /** Specify the type of underlying button */
    buttonKind?:
      | 'primary'
      | 'secondary'
      | 'danger'
      | 'ghost'
      | 'danger--primary'
      | 'danger--ghost'
      | 'danger--tertiary'
      | 'tertiary';
    /** Specify whether file input is disabled */
    disabled?: boolean;
    /** Specify whether you want to disable any updates to the button's label */
    disableLabelChanges?: boolean;
    /** Provide a unique id for the underlying `<input>` node */
    id?: string;
    /** Provide the label text to be read by screen readers when interacting with this control */
    labelText?: string;
    /** Specify if the component should accept multiple files to upload */
    multiple?: boolean;
    /** Provide a name for the underlying `<input>` node */
    name?: string;
    /** Called each time the `<input>` value changes */
    onChange?: (event: Event) => void;
    /** Specify the size of the FileUploaderButton, from a list of available sizes */
    size?: 'sm' | 'small' | 'md' | 'field' | 'lg';
  };
}

/**
 * A button that opens the native file picker for a hidden
 * `<input type="file">`. Used internally by `FileUploader`, and usable
 * standalone as the minimal button-triggered (non-drag-and-drop) upload
 * pattern.
 */
export default class FileUploaderButton extends Component<FileUploaderButtonSignature> {
  @tracked internalLabel: string;

  guid = guidFor(this);
  inputElement?: HTMLInputElement;

  constructor(owner: Owner, args: FileUploaderButtonSignature['Args']) {
    super(owner, args);
    this.internalLabel = args.labelText ?? 'Add file';
  }

  get inputId() {
    return this.args.id ?? `file-uploader-button-${this.guid}`;
  }

  get label() {
    return this.args.disableLabelChanges
      ? (this.args.labelText ?? 'Add file')
      : this.internalLabel;
  }

  get acceptAttr() {
    return this.args.accept?.join(',');
  }

  get classes() {
    const size = this.args.size ?? 'md';
    const classes = ['cds--btn', `cds--btn--${this.args.buttonKind ?? 'primary'}`];
    if (this.args.disabled) classes.push('cds--btn--disabled');
    if (size === 'field' || size === 'md') classes.push('cds--btn--md');
    if (size === 'small' || size === 'sm') classes.push('cds--btn--sm');
    classes.push(`cds--layout--size-${size}`);
    return classes.join(' ');
  }

  @action
  setInputElement(element: HTMLElement) {
    this.inputElement = element as HTMLInputElement;
  }

  @action
  handleButtonClick() {
    if (this.inputElement) {
      this.inputElement.value = '';
      this.inputElement.click();
    }
  }

  @action
  handleFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && !this.args.disableLabelChanges) {
      if (files.length > 1) {
        this.internalLabel = `${files.length} files`;
      } else if (files.length === 1) {
        this.internalLabel = files[0]!.name;
      }
    }
    this.args.onChange?.(event);
  }

  <template>
    <button
      type='button'
      disabled={{@disabled}}
      class={{this.classes}}
      {{on 'click' this.handleButtonClick}}
      ...attributes
    >{{this.label}}</button>
    <label class='cds--visually-hidden' for={{this.inputId}}>
      <span>{{this.label}}</span>
    </label>
    <input
      class='cds--visually-hidden'
      id={{this.inputId}}
      type='file'
      tabindex='-1'
      disabled={{@disabled}}
      multiple={{@multiple}}
      accept={{this.acceptAttr}}
      name={{@name}}
      {{captureElement onInsert=this.setInputElement}}
      {{on 'change' this.handleFileChange}}
    />
  </template>
}
