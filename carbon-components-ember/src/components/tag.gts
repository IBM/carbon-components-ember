import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { modifier } from 'ember-modifier';
import type Icon from './icon.gts';
import AILabel from './ai-label.gts';
import DefinitionTooltip from './-private/definition-tooltip.gts';
import { observeTruncation } from '../utils/truncation.ts';
import type { WithBoundArgs } from '@glint/template';

export interface TagSignature {
  Args: {
    /**
     * Specify the id for the tag.
     */
    id?: string;
    /**
     * Provide a custom title for the tag. If not provided, the title will be
     * derived from the text content.
     */
    title?: string;
    /**
     * Specify if the `Tag` is disabled.
     */
    disabled?: boolean;
    /**
     * A component used to render an icon.
     */
    renderIcon?: typeof Icon;
    /**
     * Specify the size of the Tag. Currently supports either `sm`, `md`
     * (default) or `lg` sizes.
     */
    size?: 'sm' | 'md' | 'lg';
    type:
      | 'red'
      | 'magenta'
      | 'purple'
      | 'blue'
      | 'cyan'
      | 'teal'
      | 'green'
      | 'gray'
      | 'cool-gray'
      | 'warm-gray'
      | 'high-contrast'
      | 'outline';
  };
  Element: HTMLDivElement;
  Blocks: {
    default: [];
    /**
     * **Experimental:** an AI label, or any other decorator, shown after the tag's text.
     * Yields an `AILabel` already set up for it.
     */
    decorator: [AILabel: WithBoundArgs<typeof AILabel, 'size' | 'kind'>];
  };
}

const textOf = (element: HTMLElement) =>
  (element.textContent ?? '').replace(/\s+/g, ' ').trim();

export default class Tag extends Component<TagSignature> {
  guid = guidFor(this);

  // While the label is cut off, it shows in a tooltip, as in Carbon React.
  @tracked truncated = false;

  get id() {
    return this.args.id ?? `tag-${this.guid}`;
  }

  get type() {
    const types =
      'red magenta purple blue cyan teal green gray cool-gray warm-gray high-contrast outline'.split(
        ' ',
      );
    if (!types.includes(this.args.type)) {
      console.error(
        `${
          this.args.type
        } not supported type for Tag, supported are:${types.join(',')}`,
      );
    }
    return this.args.type;
  }

  get classes() {
    const classes = ['cds--tag', `cds--tag--${this.type}`];
    if (this.args.disabled) classes.push('cds--tag--disabled');
    if (this.args.size) {
      classes.push(`cds--tag--${this.args.size}`);
      classes.push(`cds--layout--size-${this.args.size}`);
    }
    return classes.join(' ');
  }

  get showIcon() {
    return !!this.args.renderIcon && this.args.size !== 'sm';
  }

  // @carbon/react's Tag derives the label's `title` (the browser's own
  // tooltip) from its `children` prop or explicit `title` prop. In Ember, we set
  // the title attribute from `@title` or fallback to the element's text content.
  syncLabelTitle = modifier(
    (element: HTMLElement, [title]: [string | undefined]) => {
      if (title !== undefined) {
        element.title = title;
      } else {
        const text = textOf(element);
        if (text) {
          element.title = text;
        }
      }

      return () => {
        element.removeAttribute('title');
      };
    },
  );

  watchTruncation = modifier((label: HTMLElement) =>
    observeTruncation(label, (truncated) => {
      if (this.truncated !== truncated) this.truncated = truncated;
    }),
  );

  <template>
    <div
      class={{this.classes}}
      id={{this.id}}
      {{! @glint-expect-error: matches @carbon/react, which renders disabled on the tag's div }}
      disabled={{if @disabled true}}
      ...attributes
    >
      {{#if this.showIcon}}
        <div class="cds--tag__custom-icon">
          <@renderIcon @size="16" />
        </div>
      {{/if}}
      {{#if this.truncated}}
        {{! As in Carbon React, the tooltip shows the block again. }}
        <DefinitionTooltip
          @openOnHover={{false}}
          class="cds--definition--tooltip--tag"
        >
          <:default>
            <span
              class="cds--tag__label"
              dir="auto"
              {{this.syncLabelTitle @title}}
              {{this.watchTruncation}}
            >
              {{yield}}
            </span>
          </:default>
          <:definition>{{yield}}</:definition>
        </DefinitionTooltip>
      {{else}}
        <span
          class="cds--tag__label"
          dir="auto"
          {{this.syncLabelTitle @title}}
          {{this.watchTruncation}}
        >
          {{yield}}
        </span>
      {{/if}}
      {{#if (has-block "decorator")}}
        <div class="cds--tag__decorator">
          {{yield (component AILabel size="sm" kind="inline") to="decorator"}}
        </div>
      {{/if}}
    </div>
  </template>
}
