/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { LinkTo } from '@ember/routing';
import type { TOC } from '@ember/component/template-only';

export interface RouterLinkSignature {
  Element: HTMLAnchorElement;
  Args: {
    href?: string;
    route?: string;
    models?: unknown[];
    query?: Record<string, unknown>;
  };
  Blocks: {
    default: [];
  };
}

// LinkTo asserts that @models is an array whenever it's passed.
const NO_MODELS: unknown[] = [];

// LinkTo navigates even when a click handler called preventDefault(); as in
// React Router, that cancels it. The caller's handlers run before this one.
const stopIfPrevented = (event: MouseEvent) => {
  if (event.defaultPrevented) event.stopImmediatePropagation();
};

/**
 * The `<a>` of a link-like component: Ember's `LinkTo` given `@route`, which
 * navigates with the router and marks a link to the current route `active`,
 * else a plain link to `@href`.
 */
const RouterLink: TOC<RouterLinkSignature> = <template>
  {{#if @route}}
    <LinkTo
      @route={{@route}}
      @models={{if @models @models NO_MODELS}}
      @query={{@query}}
      ...attributes
      {{on "click" stopIfPrevented}}
    >{{yield}}</LinkTo>
  {{else}}
    <a href={{@href}} ...attributes>{{yield}}</a>
  {{/if}}
</template>;

export default RouterLink;
