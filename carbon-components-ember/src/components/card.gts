/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { ComponentLike, WithBoundArgs } from '@glint/template';
import RouterLink from './-private/router-link.gts';
import type { RouteArgs } from './-private/router-link.gts';
import ArrowRight from './icons/arrow-right.ts';
import CardAction from './card/card-action.gts';
import CardActions from './card/card-actions.gts';
import CardBody from './card/card-body.gts';
import CardContent from './card/-card-content.gts';
import CardFooter from './card/card-footer.gts';
import CardHeader from './card/card-header.gts';
import CardHeaderMedia from './card/card-header-media.gts';
import CardMedia from './card/card-media.gts';
import CardTitle from './card/card-title.gts';
import CardTitleMedia from './card/card-title-media.gts';

export interface CardSignature {
  Element: HTMLDivElement | HTMLAnchorElement;
  Args: RouteArgs & {
    /**
     * Makes the whole card clickable: a `{{on "click"}}` on it runs on
     * click, Enter and Space, and a footer icon shows it can be clicked.
     * Name the card with `aria-label` or `aria-labelledby`.
     */
    clickable?: boolean;
    /** Disables the card. Disable the controls inside it too. */
    disabled?: boolean;
    /**
     * The title's type style: `productive` (the default) for
     * `heading-compact-02`, `expressive` for `heading-03`.
     */
    density?: 'productive' | 'expressive';
    /**
     * Lays the card out in a row: media beside its header, body and footer,
     * which go in the yielded `Content`.
     */
    horizontal?: boolean;
    /** The icon in a clickable card's footer. Defaults to an arrow. */
    renderFooterIcon?: ComponentLike;
    /**
     * Makes the card a clickable link to this URL, as Carbon React's
     * `as="a"` with `href`. `@route` links it to one of the app's routes.
     */
    href?: string;
  };
  Blocks: {
    default: [
      {
        Header: WithBoundArgs<typeof CardHeader, 'card'>;
        Body: typeof CardBody;
        Footer: WithBoundArgs<typeof CardFooter, 'clickable'>;
        HeaderMedia: typeof CardHeaderMedia;
        Media: WithBoundArgs<typeof CardMedia, 'horizontal'>;
        Title: typeof CardTitle;
        TitleMedia: typeof CardTitleMedia;
        Actions: typeof CardActions;
        Action: typeof CardAction;
        /**
         * The header, body and footer of a horizontal card, beside its
         * media. It renders only its block in a vertical card.
         */
        Content: WithBoundArgs<typeof CardContent, 'horizontal'>;
      },
    ];
  };
}

/**
 * A container for content and actions about one subject, built from the
 * parts it yields. Carbon React's `Card`.
 */
export default class Card extends Component<CardSignature> {
  // How many headers render a decorator, which `CardHeader` counts.
  @tracked decorators = 0;

  get isLink() {
    const { href, route, disabled } = this.args;
    return Boolean(href || route) && !disabled;
  }

  get isClickable() {
    return Boolean(this.args.clickable || this.args.href || this.args.route);
  }

  get footerIcon() {
    return this.args.renderFooterIcon ?? ArrowRight;
  }

  get classes() {
    const { disabled, horizontal } = this.args;
    return [
      'cds--card',
      this.isClickable && !disabled && 'cds--card--clickable',
      disabled && 'cds--card--disabled',
      `cds--card--${this.args.density ?? 'productive'}`,
      this.decorators > 0 && 'cds--card--has-ai-label',
      horizontal && 'cds--card--horizontal',
    ]
      .filter(Boolean)
      .join(' ');
  }

  // A disabled link card stays a link, without its URL, as Link does.
  get role() {
    if (this.args.href || this.args.route) return 'link';
    return this.args.clickable ? 'button' : undefined;
  }

  get tabIndex(): '0' | '-1' | undefined {
    if (!this.isClickable) return undefined;
    return this.args.disabled ? '-1' : '0';
  }

  get ariaDisabled() {
    if (this.isClickable) return String(Boolean(this.args.disabled));
    return this.args.disabled ? 'true' : undefined;
  }

  // Carbon's styles take pointer events from a disabled card; this stops
  // the clicks left on a clickable one, such as `click()`.
  stopDisabledClick = (event: MouseEvent) => {
    if (!this.args.disabled || !this.isClickable) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  };

  // As Carbon React's: a clickable card clicks on Enter and Space.
  clickOnKey = (event: KeyboardEvent) => {
    if (!this.args.clickable || this.args.disabled) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    (event.currentTarget as HTMLElement).click();
  };

  <template>
    {{#let
      (hash
        Header=(component CardHeader card=this)
        Body=CardBody
        Footer=(component CardFooter clickable=this.isClickable)
        HeaderMedia=CardHeaderMedia
        Media=(component CardMedia horizontal=@horizontal)
        Title=CardTitle
        TitleMedia=CardTitleMedia
        Actions=CardActions
        Action=CardAction
        Content=(component CardContent horizontal=@horizontal)
      )
      as |parts|
    }}
      {{#if this.isLink}}
        <RouterLink
          @href={{@href}}
          @route={{@route}}
          @models={{@models}}
          @query={{@query}}
          class={{this.classes}}
          ...attributes
        >
          {{yield parts}}
          <div class="cds--card__clickable-footer" aria-hidden="true">
            <this.footerIcon />
          </div>
        </RouterLink>
      {{else}}
        <div
          class={{this.classes}}
          ...attributes
          role={{this.role}}
          {{! eslint-disable-next-line ember/template-no-positive-tabindex -- the getter returns 0 or -1 }}
          tabindex={{this.tabIndex}}
          aria-disabled={{this.ariaDisabled}}
          {{on "click" this.stopDisabledClick capture=true}}
          {{on "keydown" this.clickOnKey}}
        >
          {{yield parts}}
          {{#if this.isClickable}}
            <div class="cds--card__clickable-footer" aria-hidden="true">
              <this.footerIcon />
            </div>
          {{/if}}
        </div>
      {{/if}}
    {{/let}}
  </template>
}
