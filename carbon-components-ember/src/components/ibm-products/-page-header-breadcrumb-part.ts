/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';
import { afterRender } from '../../utils/after-render.ts';
import type Owner from '@ember/owner';
import type PageHeaderBreadcrumbOverflow from './page-header-breadcrumb-overflow.gts';

/**
 * Base class for the breadcrumbs of a `PageHeaderBreadcrumbOverflow`: each
 * registers with it, so the one that's last renders the overflow breadcrumb
 * before itself.
 */
export default class PageHeaderBreadcrumbPart<
  S extends { Args: { overflow?: PageHeaderBreadcrumbOverflow } },
> extends Component<S> {
  constructor(owner: Owner, args: S['Args']) {
    super(owner, args);
    // The trail has already read its parts while rendering.
    afterRender(this, () => {
      const overflow = args.overflow;
      if (!overflow) return;
      overflow.register(this);
      registerDestructor(this, () => overflow.unregister(this));
    });
  }

  // Its <li>: the trail orders its parts by where these are in the page.
  @tracked element?: HTMLElement;

  captureElement = modifier((element: HTMLElement) => {
    const cancel = afterRender(this, () => {
      this.element = element;
    });
    return () => {
      cancel();
      afterRender(this, () => {
        if (this.element === element) this.element = undefined;
      });
    };
  });

  get showsOverflowBreadcrumb() {
    return Boolean(this.args.overflow?.isLast(this));
  }
}
