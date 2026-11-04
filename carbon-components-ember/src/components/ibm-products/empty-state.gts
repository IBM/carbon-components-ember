/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';
import { concat } from '@ember/helper';
import EmptyStateContent from './-empty-state-content.gts';
import type { ButtonSignature } from '../button.gts';
import type { RouteArgs } from '../-private/router-link.gts';
import './empty-state.scss';

/** The button an empty state offers, as Carbon for IBM Products' `action`. */
export interface EmptyStateAction extends RouteArgs {
  text: string;
  /** Defaults to `tertiary`. */
  kind?: 'primary' | 'secondary' | 'tertiary';
  renderIcon?: ButtonSignature['Args']['renderIcon'];
  iconDescription?: string;
  href?: string;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
}

/** The link an empty state offers, as Carbon for IBM Products' `link`. */
export interface EmptyStateLink extends RouteArgs {
  text: string;
  href?: string;
  target?: string;
}

export interface EmptyStateSignature {
  Element: HTMLDivElement;
  Args: {
    /**
     * A button, shown when it has `text` and `onClick`, `href`, `route` or
     * `externalRoute`.
     */
    action?: EmptyStateAction;
    /** The `src` of an image to show. */
    illustration?: string;
    /** The image's alt text. */
    illustrationDescription?: string;
    /** Where the image sits next to the text. Defaults to `top`. */
    illustrationPosition?: 'top' | 'right' | 'bottom' | 'left';
    /** A link, shown when it has `text` and `href`, `route` or `externalRoute`. */
    link?: EmptyStateLink;
    /** The heading's element. Defaults to `h2`; use `h1` on a page of its own. */
    headingAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    /** Defaults to `lg`. */
    size?: 'lg' | 'sm';
    subtitle?: string;
    title: string;
  };
  Blocks: {
    /** Rich content in place of `@subtitle`, such as a link or a tooltip. */
    subtitle: [];
  };
}

/**
 * Tells people why a page or panel has nothing to show and what they can do
 * about it, as Carbon for IBM Products' `EmptyState`. For a ready-made
 * illustration, use one of its variants, such as `NoDataEmptyState`.
 */
const EmptyState: TOC<EmptyStateSignature> = <template>
  <div
    class="c4p--empty-state c4p--empty-state-type--default
      {{if
        @illustration
        (concat 'c4p--empty-state-position--' (or @illustrationPosition 'top'))
      }}"
    ...attributes
  >
    {{#if @illustration}}
      <img
        src={{@illustration}}
        alt={{@illustrationDescription}}
        class="c4p--empty-state__illustration c4p--empty-state__illustration--{{or
            @size
            'lg'
          }}"
        aria-hidden="true"
      />
    {{/if}}
    <EmptyStateContent
      @action={{@action}}
      @link={{@link}}
      @size={{@size}}
      @headingAs={{@headingAs}}
      @subtitle={{@subtitle}}
      @title={{@title}}
      @hasSubtitleBlock={{has-block "subtitle"}}
    >
      <:subtitle>{{yield to="subtitle"}}</:subtitle>
    </EmptyStateContent>
  </div>
</template>;

export default EmptyState;
