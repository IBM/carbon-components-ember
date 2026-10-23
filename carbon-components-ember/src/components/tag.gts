import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { modifier } from 'ember-modifier';
import type Icon from './icon.gts';
import AILabel from './ai-label.gts';
import RouterLink from './-private/router-link.gts';
import './tag.scss';
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
    /** Makes the tag's icon and label a link to this URL. */
    href?: string;
    /**
     * Makes the tag's icon and label a link to this route through the Ember
     * router, in place of `@href`, as Ember's `LinkTo`.
     */
    route?: string;
    /** The models for `@route`'s dynamic segments, in order. */
    models?: unknown[];
    /** Query params for `@route`. */
    query?: Record<string, unknown>;
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

export default class Tag extends Component<TagSignature> {
  guid = guidFor(this);

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

  // A disabled one is no link.
  get isLink() {
    return Boolean(this.args.href || this.args.route) && !this.args.disabled;
  }

  get showIcon() {
    return !!this.args.renderIcon && this.args.size !== 'sm';
  }

  // @carbon/react's Tag derives the label's `title` (used for a truncation
  // tooltip) from its `children` prop or explicit `title` prop. In Ember, we set
  // the title attribute from `@title` or fallback to the element's text content.
  syncLabelTitle = modifier(
    (element: HTMLElement, [title]: [string | undefined]) => {
      if (title !== undefined) {
        element.title = title;
      } else {
        const text = (element.textContent ?? '').replace(/\s+/g, ' ').trim();
        if (text) {
          element.title = text;
        }
      }

      return () => {
        element.removeAttribute('title');
      };
    },
  );

  <template>
    <div
      class={{this.classes}}
      id={{this.id}}
      {{! @glint-expect-error: matches @carbon/react, which renders disabled on the tag's div }}
      disabled={{if @disabled true}}
      ...attributes
    >
      {{! The link holds the icon and label, so the decorator's button isn't inside it. }}
      {{#if this.isLink}}
        <RouterLink
          @href={{@href}}
          @route={{@route}}
          @models={{@models}}
          @query={{@query}}
          class="cds--ember-tag__link"
        >
          {{#if this.showIcon}}
            <div class="cds--tag__custom-icon">
              <@renderIcon @size="16" />
            </div>
          {{/if}}
          <span
            class="cds--tag__label"
            dir="auto"
            {{this.syncLabelTitle @title}}
          >
            {{yield}}
          </span>
        </RouterLink>
      {{else}}
        {{#if this.showIcon}}
          <div class="cds--tag__custom-icon">
            <@renderIcon @size="16" />
          </div>
        {{/if}}
        <span class="cds--tag__label" dir="auto" {{this.syncLabelTitle @title}}>
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
