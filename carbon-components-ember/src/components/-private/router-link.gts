/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { service } from '@ember/service';
import { LinkTo } from '@ember/routing';
import type RouterService from '@ember/routing/router-service';

export interface RouterLinkSignature {
  Element: HTMLAnchorElement;
  Args: {
    href?: string;
    route?: string;
    models?: unknown[];
    query?: Record<string, unknown>;
    /**
     * The class of the current link, in place of LinkTo's `active`: a link
     * to the current route, or one given `@isActive`.
     */
    activeClass?: string;
    /** The `aria-current` of the current link. */
    ariaCurrent?: string;
    /** Makes it the current link, whatever the route. */
    isActive?: boolean;
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
 * else a plain link to `@href`. Given `@activeClass` or `@ariaCurrent`, it
 * marks the current link with them instead.
 */
export default class RouterLink extends Component<RouterLinkSignature> {
  @service('router') declare router: RouterService;

  get isActive() {
    const {
      route,
      models = NO_MODELS,
      query,
      activeClass,
      ariaCurrent,
    } = this.args;
    if (this.args.isActive) return true;
    if (!route || !(activeClass || ariaCurrent)) return false;
    return this.router.isActive(route, ...models, { queryParams: query ?? {} });
  }

  <template>
    {{#if @route}}
      <LinkTo
        @route={{@route}}
        @models={{if @models @models NO_MODELS}}
        @query={{@query}}
        @activeClass={{if @activeClass ""}}
        class={{if this.isActive @activeClass}}
        aria-current={{if this.isActive @ariaCurrent}}
        ...attributes
        {{on "click" stopIfPrevented}}
      >{{yield}}</LinkTo>
    {{else}}
      <a
        href={{@href}}
        class={{if this.isActive @activeClass}}
        aria-current={{if this.isActive @ariaCurrent}}
        ...attributes
      >{{yield}}</a>
    {{/if}}
  </template>
}
