import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { cached, tracked } from '@glimmer/tracking';
import { concat } from '@ember/helper';
import { registerDestructor } from '@ember/destroyable';
import type Owner from '@ember/owner';
import { modifier } from 'ember-modifier';
import Close from './icons/close.ts';
import SearchIcon from './icons/search.ts';

export interface SearchSignature {
  Args: {
    /**
     * Classes for the wrapper, as Carbon React's `className`. `class` and the
     * other attributes go on the `<input>`.
     */
    className?: string;
    /**
     * Called with the `input` event on each change, as Carbon React's
     * `onChange`, and once more when the field is cleared; the value is
     * `event.target.value`.
     */
    onChange?: (event: Event & { target: HTMLInputElement }) => void;
    /** Called once the field is cleared, with its close button or Escape. */
    onClear?: () => void;
    labelText?: string;
    /** The field's value. A new one replaces what was typed. */
    value?: string;
    /** The field's initial value, when it isn't controlled by `@value`. */
    defaultValue?: string;
    placeholder?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    expandable?: boolean;
    light?: boolean;
    disabled?: boolean;
    id?: string;
    closeButtonLabelText?: string;
    autoComplete?: string;
    type?: string;
  };
  Element: HTMLInputElement;
}

export default class Search extends Component<SearchSignature> {
  // What was typed, and the `@value` it replaced: as in Carbon React, it shows
  // until `@value` changes.
  @tracked typed?: { value: string; over: string | undefined };
  @tracked isActive: boolean = false;
  #input?: HTMLInputElement;
  #stopListening?: () => void;

  constructor(owner: Owner, args: SearchSignature['Args']) {
    super(owner, args);
    registerDestructor(this, () => this.#stopListening?.());
  }

  get value() {
    if (this.typed && this.typed.over === this.args.value) {
      return this.typed.value;
    }
    return this.args.value ?? this.args.defaultValue ?? '';
  }

  // An empty initial value renders no `value` attribute, as in Carbon React.
  get boundValue() {
    return this.value === '' ? undefined : this.value;
  }

  get hasInput() {
    return this.value !== '';
  }

  @cached
  // An explicit empty `@placeholder` means no placeholder, as in Carbon
  // React, so only fall back to the default when it's undefined.
  get placeholder() {
    return this.args.placeholder ?? 'Search';
  }

  get guid() {
    return guidFor(this);
  }

  get inputId() {
    return this.args.id ?? `search__input-${this.guid}`;
  }

  registerInput = modifier((input: HTMLInputElement) => {
    this.#input = input;
  });

  handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this.typed = { value: input.value, over: this.args.value };
    this.args.onChange?.(event as Event & { target: HTMLInputElement });
  };

  // As in Carbon React: the empty value goes through `@onChange`, then
  // `@onClear` is called, and focus stays in the field.
  clear = () => {
    const input = this.#input;
    if (!input) return;
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    this.args.onClear?.();
    input.focus();
  };

  handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !this.#input?.value) return;
    // Clearing the field is all Escape does, so a Modal around it stays open.
    event.stopPropagation();
    this.clear();
  };

  activate = (mouseEvent: Event) => {
    if (this.isActive) {
      return;
    }
    const element = mouseEvent.target as HTMLDivElement;
    this.isActive = true;
    // The press that activated the search reaches this listener too, from
    // inside `element`, so it's ignored.
    const listener = (event: MouseEvent) => {
      let target = event.target as Element | null;
      if (target?.shadowRoot) {
        target = target.shadowRoot.elementFromPoint(event.x, event.y);
      }
      if (element.contains(target)) return;
      if (this.value) return;
      this.isActive = false;
      this.#stopListening?.();
    };
    document.addEventListener('mousedown', listener);
    this.#stopListening = () => {
      document.removeEventListener('mousedown', listener);
      this.#stopListening = undefined;
    };
  };

  <template>
    <div
      data-search
      role="search"
      aria-labelledby="search-input-label-{{this.guid}}"
      class="cds--search
        {{if @size (concat 'cds--search--' @size)}}
        {{if @size (concat 'cds--layout--size-' @size)}}
        {{if @light 'cds--search--light'}}
        {{if @isLoading 'cds--skeleton'}}
        {{if @disabled 'cds--search--disabled'}}
        {{if
          @expandable
          'cds--toolbar-search-container-expandable'
          'cds--toolbar-search-container-persistent'
        }}
        {{if this.isActive 'cds--toolbar-search-container-active'}}
        {{@className}}"
    >
      <div class="cds--search-magnifier">
        <SearchIcon @size="16" @svgClass="cds--search-magnifier-icon" />
      </div>
      <label
        id="search-input-label-{{this.guid}}"
        for={{this.inputId}}
        class="cds--label"
      >
        {{@labelText}}
      </label>
      <input
        ...attributes
        class="cds--search-input"
        type={{or @type "search"}}
        id={{this.inputId}}
        placeholder={{this.placeholder}}
        autocomplete={{or @autoComplete "off"}}
        value={{this.boundValue}}
        disabled={{@disabled}}
        {{this.registerInput}}
        {{on "input" this.handleInput}}
        {{on "keydown" this.handleKeyDown}}
        {{! eslint-disable-next-line ember/template-no-pointer-down-event-binding }}
        {{on "mousedown" this.activate}}
      />
      {{#if this.hasInput}}
        <button
          class="cds--search-close"
          title={{or @closeButtonLabelText "Clear search input"}}
          aria-label={{or @closeButtonLabelText "Clear search input"}}
          type="button"
          disabled={{@disabled}}
          {{on "click" this.clear}}
        >
          <Close @size="16" />
        </button>
      {{/if}}
    </div>
  </template>
}
