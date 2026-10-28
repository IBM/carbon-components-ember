/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';
import Button from '../button.gts';
import Link from '../link.gts';
import type { EmptyStateSignature } from './empty-state.gts';

interface EmptyStateContentSignature {
  Element: HTMLElement;
  Args: EmptyStateSignature['Args'] & {
    /** Whether the parent was given a `subtitle` block to pass on. */
    hasSubtitleBlock?: boolean;
  };
  Blocks: {
    subtitle: [];
  };
}

const noop = () => {};

// Carbon for IBM Products' EmptyStateContent: Carbon React's Section and
// Heading render a <section> and, outside other sections, an <h2>.
const EmptyStateContent: TOC<EmptyStateContentSignature> = <template>
  <section class="c4p--empty-state__content" ...attributes>
    {{#let (element (or @headingAs "h2")) as |Heading|}}
      <Heading
        class="c4p--empty-state__header
          {{if (eq @size 'sm') 'c4p--empty-state__header--small'}}"
      >{{@title}}</Heading>
    {{/let}}
    {{#if (or @subtitle @hasSubtitleBlock)}}
      <div
        class="c4p--empty-state__subtitle
          {{if (eq @size 'sm') 'c4p--empty-state__subtitle--small'}}"
      >
        {{#if @hasSubtitleBlock}}
          {{yield to="subtitle"}}
        {{else}}
          {{@subtitle}}
        {{/if}}
      </div>
    {{/if}}
    {{#if (and @action.text (or @action.onClick @action.href @action.route))}}
      <Button
        class="c4p--empty-state__action-button"
        @kind={{or @action.kind "tertiary"}}
        @renderIcon={{@action.renderIcon}}
        @iconDescription={{@action.iconDescription}}
        @size="sm"
        @disabled={{@action.disabled}}
        @href={{@action.href}}
        @route={{@action.route}}
        @models={{@action.models}}
        @query={{@action.query}}
        {{on "click" (or @action.onClick noop)}}
      >{{@action.text}}</Button>
    {{/if}}
    {{#if (and @link.text (or @link.href @link.route))}}
      <Link
        class="c4p--empty-state__link"
        @href={{@link.href}}
        @route={{@link.route}}
        @models={{@link.models}}
        @query={{@link.query}}
        @target={{@link.target}}
      >{{@link.text}}</Link>
    {{/if}}
  </section>
</template>;

export default EmptyStateContent;
