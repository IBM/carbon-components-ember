/**
 * Copyright IBM Corp. 2025, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { afterRender } from '../../utils/after-render.ts';
import { observeResize } from '../../utils/resize-observer.ts';
import PageHeaderBreadcrumbBar from './page-header-breadcrumb-bar.gts';
import PageHeaderBreadcrumbOverflow from './page-header-breadcrumb-overflow.gts';
import PageHeaderBreadcrumbPageActions from './page-header-breadcrumb-page-actions.gts';
import PageHeaderContent from './page-header-content.gts';
import PageHeaderContentPageActions from './page-header-content-page-actions.gts';
import PageHeaderContentText from './page-header-content-text.gts';
import PageHeaderHeroImage from './page-header-hero-image.gts';
import PageHeaderScrollButton from './page-header-scroll-button.gts';
import PageHeaderTabBar from './page-header-tab-bar.gts';
import PageHeaderTagOverflow from './page-header-tag-overflow.gts';
import PageHeaderTitleBreadcrumb from './page-header-title-breadcrumb.gts';
import { getHeaderOffset } from './-page-header-utils.ts';
import './page-header.scss';

import type { WithBoundArgs } from '@glint/template';
import type { PageHeaderObserverState } from './-page-header-utils.ts';

export type { PageHeaderObserverState };

/** The elements of its parts a PageHeader keeps track of. */
export type PageHeaderPart =
  'content' | 'title' | 'contentActions' | 'breadcrumbActions';

export interface PageHeaderSignature {
  Element: HTMLDivElement;
  Args: {
    /**
     * Applies Carbon's full-width grid mode to all internal sub-component
     * grids. Pass `true` for full width or `'xl'` for full width with the xl
     * padding override (matching the deprecated PageHeader `fullWidthGrid`
     * behavior).
     */
    fullWidthGrid?: boolean | 'xl';
    /** Applies Carbon's narrow grid mode to all internal sub-component grids. */
    narrowGrid?: boolean;
    /** Called when the content actions become clipped, or no longer are. */
    onContentActionsClipped?: (clipped: boolean) => void;
    /** Called when the content area becomes fully collapsed, or no longer is. */
    onContentFullyCollapsed?: (collapsed: boolean) => void;
    /** Called when the title becomes clipped, or no longer is. */
    onTitleClipped?: (clipped: boolean) => void;
  };
  Blocks: {
    /** Its parts, bound to this header. */
    default: [
      {
        BreadcrumbBar: WithBoundArgs<
          typeof PageHeaderBreadcrumbBar,
          'pageHeader'
        >;
        BreadcrumbOverflow: WithBoundArgs<
          typeof PageHeaderBreadcrumbOverflow,
          'pageHeader'
        >;
        BreadcrumbPageActions: typeof PageHeaderBreadcrumbPageActions;
        Content: WithBoundArgs<typeof PageHeaderContent, 'pageHeader'>;
        ContentPageActions: WithBoundArgs<
          typeof PageHeaderContentPageActions,
          'pageHeader'
        >;
        ContentText: typeof PageHeaderContentText;
        HeroImage: typeof PageHeaderHeroImage;
        ScrollButton: WithBoundArgs<
          typeof PageHeaderScrollButton,
          'pageHeader'
        >;
        TabBar: WithBoundArgs<typeof PageHeaderTabBar, 'pageHeader'>;
        TagOverflow: typeof PageHeaderTagOverflow;
        TitleBreadcrumb: WithBoundArgs<
          typeof PageHeaderTitleBreadcrumb,
          'pageHeader'
        >;
      },
    ];
  };
}

// The space around the content that counts as still being in view.
const CONTENT_PADDING = 24;

/**
 * A page's heading: breadcrumbs, title, actions and tabs that collapse and
 * stick as the page scrolls, as Carbon for IBM Products' `preview__PageHeader`.
 * It yields its parts, bound to it.
 */
export default class PageHeader extends Component<PageHeaderSignature> {
  @tracked fullyCollapsed = false;
  @tracked titleClipped = false;
  @tracked contentActionsClipped = false;
  @tracked disableStickyTabBar = false;
  @tracked hasPageActions = false;
  // The header's own element, for parts that set custom properties on it.
  rootElement?: HTMLElement;
  @tracked contentElement?: HTMLElement;
  @tracked titleElement?: HTMLElement;
  @tracked contentActionsElement?: HTMLElement;
  @tracked breadcrumbActionsElement?: HTMLElement;

  /** Whether the grids of its parts are full width, for any `@fullWidthGrid`. */
  get isFullWidthGrid() {
    return Boolean(this.args.fullWidthGrid);
  }

  get isNarrowGrid() {
    return this.args.narrowGrid;
  }

  get observerState(): PageHeaderObserverState {
    return {
      fullyCollapsed: this.fullyCollapsed,
      titleClipped: this.titleClipped,
      contentActionsClipped: this.contentActionsClipped,
    };
  }

  /**
   * Keeps `element` as the header's `part` until the returned teardown. A
   * part registers once the render that read it is done.
   */
  register(part: PageHeaderPart, element: HTMLElement): () => void {
    const key = `${part}Element` as const;
    const cancel = afterRender(this, () => {
      this[key] = element;
    });
    return () => {
      cancel();
      afterRender(this, () => {
        if (this[key] === element) this[key] = undefined;
      });
    };
  }

  /** Sets one of the header's flags until the returned teardown. */
  setFlag(
    flag: 'disableStickyTabBar' | 'hasPageActions',
    value: boolean,
  ): () => void {
    const cancel = afterRender(this, () => {
      this[flag] = value;
    });
    return () => {
      cancel();
      afterRender(this, () => {
        this[flag] = false;
      });
    };
  }

  // Sets the CSS custom properties the parts stick to the top of the page by.
  trackSize = modifier((root: HTMLElement) => {
    this.rootElement = root;
    return observeResize(root, () => {
      const contentHeight = this.contentElement?.offsetHeight ?? 0;
      const totalHeaderOffset = getHeaderOffset(root);
      root.style.setProperty(
        '--c4p-page-header-header-top',
        `${(Math.round(contentHeight) - totalHeaderOffset) * -1}px`,
      );
      root.style.setProperty(
        '--c4p-page-header-breadcrumb-top',
        `${totalHeaderOffset}px`,
      );
    });
  });

  // Tracks whether the content, its title and its actions have scrolled out
  // of view, so the scroll button knows whether to expand or collapse, the
  // title shows in the breadcrumbs and the actions in the breadcrumb bar.
  observeVisibility = modifier((root: HTMLElement) => {
    const totalHeaderOffset = getHeaderOffset(root);
    const observers: IntersectionObserver[] = [];

    const observe = (
      target: HTMLElement | undefined,
      onChange: (clipped: boolean) => void,
    ) => {
      if (!target) return;
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.target === target) onChange(!entry.isIntersecting);
          }
        },
        {
          root: null,
          rootMargin: `${(CONTENT_PADDING + (target.offsetHeight || 0) + totalHeaderOffset + 24) * -1}px 0px 0px 0px`,
          threshold: 0.1,
        },
      );
      observer.observe(target);
      observers.push(observer);
    };

    observe(this.contentElement, (collapsed) => {
      this.fullyCollapsed = collapsed;
      this.args.onContentFullyCollapsed?.(collapsed);
    });
    observe(this.titleElement, (clipped) => {
      this.titleClipped = clipped;
      this.args.onTitleClipped?.(clipped);
    });
    observe(this.contentActionsElement, (clipped) => {
      this.contentActionsClipped = clipped;
      this.args.onContentActionsClipped?.(clipped);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  });

  <template>
    <div
      class="c4p--page-header c4p--page-header__next
        {{if
          this.disableStickyTabBar
          'c4p--page-header--disable-sticky-tab-bar'
        }}
        {{if (eq @fullWidthGrid 'xl') 'c4p--page-header--width--xl'}}"
      {{this.trackSize}}
      {{this.observeVisibility}}
      ...attributes
    >
      {{yield
        (hash
          BreadcrumbBar=(component PageHeaderBreadcrumbBar pageHeader=this)
          BreadcrumbOverflow=(component
            PageHeaderBreadcrumbOverflow pageHeader=this
          )
          BreadcrumbPageActions=PageHeaderBreadcrumbPageActions
          Content=(component PageHeaderContent pageHeader=this)
          ContentPageActions=(component
            PageHeaderContentPageActions pageHeader=this
          )
          ContentText=PageHeaderContentText
          HeroImage=PageHeaderHeroImage
          ScrollButton=(component PageHeaderScrollButton pageHeader=this)
          TabBar=(component PageHeaderTabBar pageHeader=this)
          TagOverflow=PageHeaderTagOverflow
          TitleBreadcrumb=(component PageHeaderTitleBreadcrumb pageHeader=this)
        )
      }}
    </div>
  </template>
}
