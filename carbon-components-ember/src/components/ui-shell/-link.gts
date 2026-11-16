/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import RouterLink from '../-private/router-link.gts';
import type { RouteArgs } from '../-private/router-link.gts';
import type { TOC } from '@ember/component/template-only';

export interface LinkSignature {
  Element: HTMLAnchorElement | HTMLButtonElement;
  Args: RouteArgs & {
    /**
     * The element to render in place of the link, such as `button`. It
     * takes `@href`, but not `@route`.
     */
    as?: keyof HTMLElementTagNameMap;
    /**
     * The URL it links to. `@route` links it to one of the app's routes, and
     * makes it the current link while that route is current.
     */
    href?: string;
  };
  Blocks: {
    default: [];
  };
}

// Typed as the elements it usually renders, as ButtonBase does.
const tagOf = (as: keyof HTMLElementTagNameMap) => as as 'a' | 'button';

// Carbon React's UI Shell `Link`. The parts mark the current link
// themselves, so it never takes LinkTo's `active` class.
const Link: TOC<LinkSignature> = <template>
  {{#if @as}}
    {{#let (element (tagOf @as)) as |Tag|}}
      <Tag href={{@href}} ...attributes>{{yield}}</Tag>
    {{/let}}
  {{else}}
    <RouterLink
      @href={{@href}}
      @route={{@route}}
      @externalRoute={{@externalRoute}}
      @models={{@models}}
      @query={{@query}}
      @activeClass=""
      ...attributes
    >{{yield}}</RouterLink>
  {{/if}}
</template>;

export default Link;
