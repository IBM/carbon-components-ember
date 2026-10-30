/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import Breadcrumb from '../breadcrumb.gts';
import PageHeaderOverflowBreadcrumbItem from './-page-header-overflow-breadcrumb-item.gts';
import PageHeaderTitleBreadcrumb from './page-header-title-breadcrumb.gts';
import { createOverflowHandler } from './-overflow-handler.ts';
import type PageHeader from './page-header.gts';
import type { BreadcrumbSignature } from '../breadcrumb.gts';
import type { ComponentLike, WithBoundArgs } from '@glint/template';

export interface PageHeaderBreadcrumbOverflowSignature {
  Element: BreadcrumbSignature['Element'];
  Args: BreadcrumbSignature['Args'] & {
    /** The page header it's in: `PageHeader` yields this part bound to itself. */
    pageHeader: PageHeader;
    /**
     * Renders the breadcrumb that holds the ones that don't fit, such as a
     * `BreadcrumbItem` with an `OverflowMenu`, before the last breadcrumb.
     * Put `...attributes` on its `BreadcrumbItem`: it needs `data-fixed` and
     * Carbon's classes.
     */
    renderOverflowBreadcrumb?: ComponentLike<{
      Element: HTMLLIElement;
      Args: { hiddenBreadcrumbs: HTMLElement[] };
    }>;
  };
  Blocks: {
    /**
     * The breadcrumbs: use the yielded `BreadcrumbItem` and
     * `TitleBreadcrumb`, which know where the overflow breadcrumb goes.
     */
    default: [
      BreadcrumbItem: WithBoundArgs<
        typeof PageHeaderOverflowBreadcrumbItem,
        'overflow'
      >,
      TitleBreadcrumb: WithBoundArgs<
        typeof PageHeaderTitleBreadcrumb,
        'pageHeader' | 'overflow'
      >,
    ];
  };
}

/** A part of the trail the overflow breadcrumb can come before. */
export interface OverflowBreadcrumbPart {
  element?: HTMLElement;
}

/**
 * A Breadcrumb that moves the breadcrumbs that don't fit into an overflow
 * breadcrumb, before the last one.
 */
export default class PageHeaderBreadcrumbOverflow extends Component<PageHeaderBreadcrumbOverflowSignature> {
  @tracked hiddenBreadcrumbs: HTMLElement[] = [];
  @tracked parts: OverflowBreadcrumbPart[] = [];

  // The breadcrumbs register with the trail, which then knows which is last.
  register(part: OverflowBreadcrumbPart) {
    if (this.isDestroying || this.isDestroyed) return;
    this.parts = [...this.parts, part];
  }

  unregister(part: OverflowBreadcrumbPart) {
    if (this.isDestroying || this.isDestroyed) return;
    this.parts = this.parts.filter((registered) => registered !== part);
  }

  // The part whose <li> no other part's follows, wherever the parts were
  // registered from.
  get last() {
    const placed = this.parts.filter((part) => part.element);
    return placed.find((part) =>
      placed.every(
        (other) =>
          other === part ||
          !(
            part.element!.compareDocumentPosition(other.element!) &
            Node.DOCUMENT_POSITION_FOLLOWING
          ),
      ),
    );
  }

  isLast(part: OverflowBreadcrumbPart) {
    return this.last === part;
  }

  // Starts over when the overflow breadcrumb arrives or moves, so it's measured.
  manage = modifier(
    (element: HTMLElement, [last]: [OverflowBreadcrumbPart | undefined]) => {
      void last;
      const list = element.querySelector<HTMLElement>('.cds--breadcrumb');
      if (!list) return;
      return createOverflowHandler({
        container: list,
        onChange: (_visible, hidden) => {
          this.hiddenBreadcrumbs = hidden;
        },
      });
    },
  );

  <template>
    <Breadcrumb
      class="c4p--page-header-breadcrumb-overflow"
      @noTrailingSlash={{@noTrailingSlash}}
      @size={{@size}}
      {{this.manage this.last}}
      ...attributes
    >
      {{yield
        (component PageHeaderOverflowBreadcrumbItem overflow=this)
        (component
          PageHeaderTitleBreadcrumb pageHeader=@pageHeader overflow=this
        )
      }}
    </Breadcrumb>
  </template>
}
