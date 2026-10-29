/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { getOwner } from '@ember/owner';
import { getEngineParent } from '@ember/engine';
import { LinkTo } from '@ember/routing';
import type EngineInstance from '@ember/engine/instance';
import type RouterService from '@ember/routing/router-service';

/** The arguments that link a component to one of the app's routes. */
export interface RouteArgs {
  /**
   * Links to this route through the Ember router, in place of `@href`, as
   * Ember's `LinkTo`: the link navigates without reloading the page.
   */
  route?: string;
  /**
   * Links out of an ember-engines engine to one of its `externalRoutes`, by
   * the name the engine gives it, as ember-engines' `LinkToExternal`.
   * Outside an engine it's a route of the app.
   */
  externalRoute?: string;
  /** The models for the route's dynamic segments, in order. */
  models?: unknown[];
  /** Query params for the route. */
  query?: Record<string, unknown>;
}

export interface RouterLinkSignature {
  Element: HTMLAnchorElement;
  Args: RouteArgs & {
    href?: string;
    /**
     * The class of the current link, in place of LinkTo's `active`: a link
     * to the current route, or one given `@isActive`.
     */
    activeClass?: string;
    /** The `aria-current` of the current link. */
    ariaCurrent?: string;
    /** Makes it the current link, whatever the route. */
    isActive?: boolean;
    /**
     * Only the route itself is current, not while one of its child routes
     * is.
     */
    exact?: boolean;
  };
  Blocks: {
    default: [];
  };
}

// What ember-engines adds to an engine instance, which we don't depend on.
interface EngineOwner {
  mountPoint?: string;
  _getExternalRoute?: (name: string) => string;
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
 * navigates with the router and marks a link to the current route `active`;
 * a link through the app's router given `@externalRoute`; else a plain link
 * to `@href`. Given `@activeClass` or `@ariaCurrent`, it marks the current
 * link with them instead.
 */
export default class RouterLink extends Component<RouterLinkSignature> {
  get engine(): EngineOwner {
    return getOwner(this) as EngineOwner;
  }

  // The application's router, which takes full route names, also from an
  // engine, where `service:router` may not exist or may name its routes
  // relative to the engine.
  get router(): RouterService {
    let owner = getOwner(this) as EngineInstance;
    for (let parent = getEngineParent(owner); parent;) {
      owner = parent;
      parent = getEngineParent(owner);
    }
    return owner.lookup('service:router');
  }

  // The full name of the route linked to: an engine's own routes sit under
  // its mount point, as LinkTo names them, and its external ones map to the
  // app's.
  get routeName() {
    const { route, externalRoute } = this.args;
    const { mountPoint, _getExternalRoute } = this.engine;
    if (externalRoute) {
      return mountPoint && _getExternalRoute
        ? _getExternalRoute.call(this.engine, externalRoute)
        : externalRoute;
    }
    if (!route || !mountPoint) return route;
    return route === 'application' ? mountPoint : `${mountPoint}.${route}`;
  }

  get routeParams(): unknown[] {
    const { models = NO_MODELS, query } = this.args;
    return [...models, { queryParams: query ?? {} }];
  }

  // As LinkTo, a link whose models haven't loaded yet goes nowhere.
  get isLoading() {
    return (this.args.models ?? NO_MODELS).some((model) => model == null);
  }

  get externalHref() {
    if (this.isLoading) return '#';
    // Reading the URL recomputes the href on navigation, as LinkTo's does: a
    // dynamic segment without a model takes the current route's.
    void this.router.currentURL;
    return this.router.urlFor(this.routeName!, ...this.routeParams);
  }

  get isCurrent() {
    const name = this.routeName;
    if (!name || this.isLoading) return false;
    const { currentRouteName } = this.router;
    if (
      this.args.exact &&
      currentRouteName !== name &&
      currentRouteName !== `${name}.index`
    ) {
      return false;
    }
    return this.router.isActive(name, ...this.routeParams);
  }

  get isActive() {
    if (this.args.isActive) return true;
    if (!(this.args.activeClass || this.args.ariaCurrent)) return false;
    return this.isCurrent;
  }

  // As LinkTo, an external link is `active` unless given `@activeClass`, and
  // `loading` while its models load.
  get externalClass() {
    if (this.isLoading) return 'loading';
    if (!(this.args.isActive || this.isCurrent)) return undefined;
    return this.args.activeClass ?? 'active';
  }

  // As LinkTo: a plain left click navigates; one with a modifier key, or on
  // a link that opens elsewhere, is the browser's.
  navigate = (event: MouseEvent) => {
    if (event.defaultPrevented) return;
    if (this.isLoading) {
      event.preventDefault();
      return;
    }
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const target = (event.currentTarget as HTMLAnchorElement).target;
    if (target && target !== '_self') return;
    event.preventDefault();
    void this.router.transitionTo(this.routeName!, ...this.routeParams);
  };

  <template>
    {{#if @externalRoute}}
      <a
        href={{this.externalHref}}
        class={{this.externalClass}}
        aria-current={{if this.isActive @ariaCurrent}}
        ...attributes
        {{on "click" this.navigate}}
      >{{yield}}</a>
    {{else if @route}}
      <LinkTo
        @route={{@route}}
        @models={{if @models @models NO_MODELS}}
        @query={{@query}}
        @activeClass={{if (eq @activeClass undefined) undefined ""}}
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
