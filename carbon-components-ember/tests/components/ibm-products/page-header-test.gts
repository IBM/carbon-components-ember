import { module, test } from 'qunit';
import { trackedObject } from '@ember/reactive/collections';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, settled, waitUntil } from '@ember/test-helpers';
import PageHeader from '#src/components/ibm-products/page-header.gts';
import BreadcrumbItem from '#src/components/breadcrumb/breadcrumb-item.gts';
import Tag from '#src/components/tag.gts';
import Add from '#src/components/icons/add.ts';
import { nonce } from '../../helpers';

import type { TOC } from '@ember/component/template-only';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';

const Overflow: TOC<{
  Element: HTMLLIElement;
  Args: { hiddenBreadcrumbs: HTMLElement[] };
}> = <template>
  <BreadcrumbItem class="overflow" ...attributes>
    <span class="hidden-count">{{@hiddenBreadcrumbs.length}}</span>
  </BreadcrumbItem>
</template>;

const Icon: TOC<{ Element: SVGSVGElement }> = <template>
  <svg class="icon" ...attributes></svg>
</template>;

// Stands in for the browser's, which reports on scrolling: the test says what
// each target does.
class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  static disconnected = 0;
  targets = new Set<Element>();
  constructor(readonly callback: IntersectionObserverCallback) {
    FakeIntersectionObserver.instances.push(this);
  }
  observe(target: Element) {
    this.targets.add(target);
  }
  unobserve(target: Element) {
    this.targets.delete(target);
  }
  disconnect() {
    FakeIntersectionObserver.disconnected++;
    this.targets.clear();
  }
  takeRecords() {
    return [];
  }
  static report(selector: string, isIntersecting: boolean) {
    for (const observer of this.instances) {
      for (const target of observer.targets) {
        if (target.matches(selector)) {
          observer.callback(
            [{ target, isIntersecting } as IntersectionObserverEntry],
            observer as unknown as IntersectionObserver,
          );
        }
      }
    }
  }
}

module('Integration | Component | IBM Products | PageHeader', function (hooks) {
  setupRenderingTest(hooks);

  let original: typeof IntersectionObserver;
  hooks.beforeEach(function () {
    original = window.IntersectionObserver;
    FakeIntersectionObserver.instances = [];
    FakeIntersectionObserver.disconnected = 0;
    window.IntersectionObserver =
      FakeIntersectionObserver as unknown as typeof IntersectionObserver;
  });
  hooks.afterEach(function () {
    window.IntersectionObserver = original;
  });

  test('it sets the offsets the parts stick by, and its classes', async function (assert) {
    await render(
      <template>
        <PageHeader class="extra" @fullWidthGrid="xl" as |PageHeader|>
          <PageHeader.Content @title="Title" />
        </PageHeader>
      </template>,
    );

    assert
      .dom('.c4p--page-header')
      .hasClass('extra')
      .hasClass('c4p--page-header__next')
      .hasClass('c4p--page-header--width--xl');
    await waitUntil(() =>
      document
        .querySelector<HTMLElement>('.c4p--page-header')
        ?.style.getPropertyValue('--c4p-page-header-header-top'),
    );
    const header = document.querySelector<HTMLElement>('.c4p--page-header')!;
    assert.ok(
      header.style
        .getPropertyValue('--c4p-page-header-header-top')
        .endsWith('px'),
    );
    assert.ok(
      header.style
        .getPropertyValue('--c4p-page-header-breadcrumb-top')
        .endsWith('px'),
    );
  });

  test('fullWidthGrid and narrowGrid reach the grids of its parts', async function (assert) {
    await render(
      <template>
        <PageHeader
          @fullWidthGrid={{true}}
          @narrowGrid={{true}}
          as |PageHeader|
        >
          <PageHeader.BreadcrumbBar />
          <PageHeader.Content @title="Title" />
          <PageHeader.TabBar>Tabs</PageHeader.TabBar>
        </PageHeader>
      </template>,
    );

    for (const part of ['breadcrumb-bar', 'content', 'tab-bar']) {
      assert
        .dom(`.c4p--page-header__${part} .cds--css-grid`)
        .hasClass('cds--css-grid--full-width')
        .hasClass('cds--css-grid--narrow');
    }
    assert
      .dom('.c4p--page-header')
      .doesNotHaveClass('c4p--page-header--width--xl');
  });

  test('Content truncates a text title and lets a block replace it', async function (assert) {
    await render(
      <template>
        <PageHeader as |PageHeader|>
          <PageHeader.Content @title="Plain" @titleAs="h3" />
          <PageHeader.Content @title="Narrow" @titleTruncate={{4}}>
            <:contextualActions><Tag @type="blue">Tag</Tag></:contextualActions>
          </PageHeader.Content>
          <PageHeader.Content>
            <:title><em>Rich</em></:title>
          </PageHeader.Content>
        </PageHeader>
      </template>,
    );

    const titles = document.querySelectorAll(
      '.c4p--page-header__content__title',
    );
    assert.strictEqual(titles[0]?.tagName, 'H3');
    assert
      .dom('.c4p--truncated-text__text-content', titles[0])
      .hasText('Plain');
    assert.strictEqual(
      titles[0]
        ?.querySelector<HTMLElement>('.c4p--truncated-text__text-content')
        ?.style.getPropertyValue('-webkit-line-clamp'),
      '2',
      'two lines without contextual actions',
    );
    assert.strictEqual(
      titles[1]
        ?.querySelector<HTMLElement>('.c4p--truncated-text__text-content')
        ?.style.getPropertyValue('-webkit-line-clamp'),
      '4',
      'titleTruncate wins',
    );
    assert
      .dom('.c4p--page-header__content__contextual-actions .cds--tag')
      .exists();
    assert.dom('em', titles[2]).hasText('Rich');
    assert.dom('.c4p--truncated-text', titles[2]).doesNotExist();
  });

  test('Content shows an icon before the title', async function (assert) {
    await render(
      <template>
        <PageHeader as |PageHeader|>
          <PageHeader.Content @title="Title" @renderIcon={{Icon}} />
          <PageHeader.BreadcrumbBar @renderIcon={{Icon}} />
        </PageHeader>
      </template>,
    );

    assert
      .dom('.c4p--page-header__content__icon')
      .hasAttribute('aria-hidden', 'true');
    assert.dom('.c4p--page-header__content__icon .icon').exists();
    assert.dom('.c4p--page-header__breadcrumb__icon .icon').exists();
  });

  test('the observers tell the callbacks, the parts and the scroll button what scrolled out of view', async function (assert) {
    const calls: string[] = [];
    const onTitleClipped = (clipped: boolean) => calls.push(`title ${clipped}`);
    const onContentFullyCollapsed = (collapsed: boolean) =>
      calls.push(`collapsed ${collapsed}`);
    const onContentActionsClipped = (clipped: boolean) =>
      calls.push(`actions ${clipped}`);

    await render(
      <template>
        <PageHeader
          @onTitleClipped={{onTitleClipped}}
          @onContentFullyCollapsed={{onContentFullyCollapsed}}
          @onContentActionsClipped={{onContentActionsClipped}}
          as |PageHeader|
        >
          <PageHeader.BreadcrumbBar>
            <:default>
              <PageHeader.BreadcrumbOverflow
                as |BreadcrumbItem TitleBreadcrumb|
              >
                <BreadcrumbItem @href="/">Home</BreadcrumbItem>
                <TitleBreadcrumb>Title</TitleBreadcrumb>
              </PageHeader.BreadcrumbOverflow>
            </:default>
            <:contentActions as |_state ContentPageActions|>
              <ContentPageActions />
            </:contentActions>
          </PageHeader.BreadcrumbBar>
          <PageHeader.Content @title="Title">
            <:pageActions>
              <PageHeader.ContentPageActions />
            </:pageActions>
          </PageHeader.Content>
          <PageHeader.TabBar>
            <:default>Tabs</:default>
            <:scroller><PageHeader.ScrollButton /></:scroller>
          </PageHeader.TabBar>
        </PageHeader>
      </template>,
    );

    assert
      .dom('.c4p--page-header-title-breadcrumb')
      .hasAttribute('aria-hidden', 'true', 'hidden while the title shows')
      .hasAttribute('tabindex', '-1')
      .hasClass('c4p--page-header-title-breadcrumb-show__with-content-element')
      .doesNotHaveClass('c4p--page-header-title-breadcrumb-show');
    assert
      .dom('.c4p--page-header__breadcrumb__content-actions-with-global-actions')
      .exists('with page actions in the content')
      .doesNotHaveClass(
        'c4p--page-header__breadcrumb__content-actions-with-global-actions--show',
      );
    assert
      .dom(
        '.c4p--page-header__breadcrumb .c4p--page-header__content__page-actions',
      )
      .doesNotExist();
    assert
      .dom(
        '.c4p--page-header__breadcrumb__content-actions .c4p--page-header__content__page-actions',
      )
      .hasClass('c4p--page-header__content__page-actions--clipped');
    assert
      .dom('.c4p--page-header--scroller-button')
      .hasAttribute('aria-labelledby');

    FakeIntersectionObserver.report('.c4p--page-header__content__title', true);
    FakeIntersectionObserver.report('.c4p--page-header__content', true);
    FakeIntersectionObserver.report(
      '.c4p--page-header__content__page-actions',
      true,
    );
    await settled();
    assert
      .dom('.c4p--page-header-title-breadcrumb')
      .hasAttribute('aria-hidden', 'true');

    FakeIntersectionObserver.report('.c4p--page-header__content__title', false);
    await settled();
    assert
      .dom('.c4p--page-header-title-breadcrumb')
      .doesNotHaveAttribute('aria-hidden')
      .doesNotHaveAttribute('tabindex')
      .hasClass('c4p--page-header-title-breadcrumb-show');

    FakeIntersectionObserver.report('.c4p--page-header__content', false);
    await settled();
    assert
      .dom('.c4p--page-header--scroller-button-icon')
      .hasClass('c4p--page-header--scroller-button-icon-collapsed');
    assert.dom('.cds--popover-content').hasText('Expand');

    assert.true(calls.includes('title true'));
    assert.true(calls.includes('title false'));
    assert.true(calls.includes('collapsed false'));
    assert.true(calls.includes('collapsed true'));
    assert.true(calls.includes('actions false'));
  });

  test('the breadcrumb bar shows content actions once the content ones are clipped', async function (assert) {
    await render(
      <template>
        <PageHeader as |PageHeader|>
          <PageHeader.BreadcrumbBar>
            <:contentActions as |_state ContentPageActions|>
              <ContentPageActions />
            </:contentActions>
          </PageHeader.BreadcrumbBar>
          <PageHeader.Content @title="Title">
            <:pageActions>
              <PageHeader.ContentPageActions />
            </:pageActions>
          </PageHeader.Content>
        </PageHeader>
      </template>,
    );

    const inBar =
      '.c4p--page-header__breadcrumb__content-actions-with-global-actions';
    assert.dom(inBar).doesNotHaveClass(`${inBar.slice(1)}--show`);

    FakeIntersectionObserver.report(
      '.c4p--page-header__content__page-actions',
      false,
    );
    await settled();
    assert.dom(inBar).hasClass(`${inBar.slice(1)}--show`);
    assert
      .dom(
        '.c4p--page-header__breadcrumb-bar .c4p--page-header__content__page-actions',
      )
      .doesNotHaveClass('c4p--page-header__content__page-actions--clipped');
  });

  test("the contentActions block gets the state and the bar's ContentPageActions", async function (assert) {
    await render(
      <template>
        <PageHeader as |PageHeader|>
          <PageHeader.BreadcrumbBar>
            <:contentActions as |state ContentPageActions|>
              <span class="state">{{state.contentActionsClipped}}</span>
              <ContentPageActions />
            </:contentActions>
          </PageHeader.BreadcrumbBar>
        </PageHeader>
      </template>,
    );

    assert
      .dom('.c4p--page-header__breadcrumb__content-actions')
      .doesNotHaveClass(
        'c4p--page-header__breadcrumb__content-actions-with-global-actions--show',
      )
      .doesNotHaveClass(
        'c4p--page-header__breadcrumb__content-actions-with-global-actions',
        'no page actions in the content',
      );
    assert.dom('.state').hasText('false');
    assert
      .dom('.c4p--page-header__content__page-actions')
      .hasClass(
        'c4p--page-header__content__page-actions--clipped',
        'hidden until the content actions scroll away',
      );
    assert
      .dom('.c4p--page-header__breadcrumb__actions')
      .hasAttribute('role', 'toolbar')
      .hasAttribute('aria-label', 'Page header actions');
  });

  test('the breadcrumb bar leaves out its actions without any, and takes flush options', async function (assert) {
    await render(
      <template>
        <PageHeader as |PageHeader|>
          <PageHeader.BreadcrumbBar
            @border={{false}}
            @pageActionsFlush={{true}}
            @contentActionsFlush={{true}}
            @actionsAriaLabel="Actions"
          >
            <:pageActions>Page actions</:pageActions>
          </PageHeader.BreadcrumbBar>
        </PageHeader>
      </template>,
    );

    assert
      .dom('.c4p--page-header__breadcrumb-bar')
      .doesNotHaveClass('c4p--page-header__breadcrumb-bar-border')
      .hasClass('c4p--page-header__breadcrumb__actions-flush');
    assert
      .dom('.c4p--page-header__breadcrumb__actions')
      .hasAttribute('aria-label', 'Actions');
    assert
      .dom('.c4p--page-header__breadcrumb__content-actions')
      .doesNotExist('flush');

    await render(
      <template>
        <PageHeader as |PageHeader|><PageHeader.BreadcrumbBar /></PageHeader>
      </template>,
    );
    assert
      .dom('.c4p--page-header__breadcrumb-bar')
      .hasClass('c4p--page-header__breadcrumb-bar-border');
    assert.dom('.c4p--page-header__breadcrumb__actions').doesNotExist();
  });

  test('TitleBreadcrumb shows without content, as in compact mode', async function (assert) {
    await render(
      <template>
        <PageHeader as |PageHeader|>
          <PageHeader.BreadcrumbBar>
            <PageHeader.BreadcrumbOverflow as |BreadcrumbItem TitleBreadcrumb|>
              <BreadcrumbItem @href="/">Home</BreadcrumbItem>
              <TitleBreadcrumb>Title</TitleBreadcrumb>
            </PageHeader.BreadcrumbOverflow>
          </PageHeader.BreadcrumbBar>
        </PageHeader>
      </template>,
    );

    assert
      .dom('.c4p--page-header-title-breadcrumb')
      .hasClass('c4p--page-header-title-breadcrumb-show')
      .hasClass(
        'c4p--page-header-title-breadcrumb-show__without-content-element',
      )
      .doesNotHaveAttribute('aria-hidden')
      .hasClass('cds--breadcrumb-item--current');
  });

  test('BreadcrumbOverflow renders the overflow breadcrumb before the last one, and hides what does not fit', async function (assert) {
    await render(
      <template>
        <style nonce={{nonce}}>
          .narrow {
            width: 260px;
          }
        </style>
        <div class="narrow">
          <PageHeader as |PageHeader|>
            <PageHeader.BreadcrumbBar>
              <PageHeader.BreadcrumbOverflow
                class="bc"
                @noTrailingSlash={{true}}
                @renderOverflowBreadcrumb={{Overflow}}
                as |BreadcrumbItem TitleBreadcrumb|
              >
                <BreadcrumbItem @href="/1">Breadcrumb one</BreadcrumbItem>
                <BreadcrumbItem @href="/2">Breadcrumb two</BreadcrumbItem>
                <BreadcrumbItem @href="/3">Breadcrumb three</BreadcrumbItem>
                <TitleBreadcrumb data-fixed="true">Title</TitleBreadcrumb>
              </PageHeader.BreadcrumbOverflow>
            </PageHeader.BreadcrumbBar>
          </PageHeader>
        </div>
      </template>,
    );
    await waitUntil(() =>
      document.querySelector(
        '.c4p--page-header-overflow-breadcrumb-item-with-items',
      ),
    );

    const items = [...document.querySelectorAll('.bc .cds--breadcrumb > li')];
    assert.strictEqual(items.length, 5);
    assert.dom('.c4p--page-header-breadcrumb-overflow').hasClass('bc');
    assert.true(
      items[3]?.classList.contains('c4p--page-header-breadcrumb-overflow-item'),
      'second to last',
    );
    assert.true(
      items[4]?.classList.contains('c4p--page-header-title-breadcrumb'),
      'before the title',
    );
    assert.dom(items[3]).hasAttribute('data-fixed', 'true');
    const hidden = items.filter((item) => item.hasAttribute('data-hidden'));
    assert.true(hidden.length > 0, 'some are hidden');
    assert.dom('.hidden-count').hasText(String(hidden.length));
    assert.false(items[3]!.hasAttribute('data-hidden'));
    assert.false(items[4]!.hasAttribute('data-hidden'));
  });

  test('BreadcrumbOverflow without enough breadcrumbs to hide leaves the overflow breadcrumb with none', async function (assert) {
    await render(
      <template>
        <PageHeader as |PageHeader|>
          <PageHeader.BreadcrumbBar>
            <PageHeader.BreadcrumbOverflow
              @renderOverflowBreadcrumb={{Overflow}}
              as |BreadcrumbItem|
            >
              <BreadcrumbItem @href="/1">One</BreadcrumbItem>
              <BreadcrumbItem @href="/2">Two</BreadcrumbItem>
            </PageHeader.BreadcrumbOverflow>
          </PageHeader.BreadcrumbBar>
        </PageHeader>
      </template>,
    );

    assert.dom('.hidden-count').hasText('0');
    assert
      .dom('.c4p--page-header-breadcrumb-overflow-item')
      .doesNotHaveClass('c4p--page-header-overflow-breadcrumb-item-with-items');
    assert
      .dom('.cds--breadcrumb > li:nth-child(2)')
      .hasClass('c4p--page-header-breadcrumb-overflow-item', 'before the last');
  });

  test('ContentPageActions moves the actions that do not fit into a menu', async function (assert) {
    const clicks: string[] = [];
    const Action = (id: string) =>
      ({
        id,
        onClick: () => clicks.push(id),
        body: <template>
          <button type="button" class="act" ...attributes>{{id}}</button>
        </template> as TOC<{ Element: HTMLButtonElement }>,
        menuItem: { label: `Menu ${id}` },
      }) as const;
    const actions = ['one', 'two', 'three', 'four'].map(Action);

    await render(
      <template>
        <style nonce={{nonce}}>
          .narrow {
            width: 300px;
          }
          .narrow .act {
            inline-size: 100px;
          }
        </style>
        <div class="narrow">
          <PageHeader as |PageHeader|>
            <PageHeader.Content @title="Title">
              <:pageActions>
                <PageHeader.ContentPageActions
                  @menuButtonLabel="More"
                  @actions={{actions}}
                />
              </:pageActions>
            </PageHeader.Content>
          </PageHeader>
        </div>
      </template>,
    );
    await waitUntil(() =>
      document.querySelector(
        '.c4p--page-header__content__page-actions [data-hidden]:not([data-offset])',
      ),
    );

    assert.dom('.act').exists({ count: 4 });
    assert
      .dom('.c4p--page-header__content__page-actions li[data-offset]')
      .doesNotHaveAttribute('data-hidden', 'the menu button shows')
      .hasText('More');
    await click('.cds--menu-button__trigger');

    assert
      .dom('.cds--menu-button__trigger')
      .hasAttribute('aria-expanded', 'true');
    const items = [...document.querySelectorAll('.cds--menu-item')].map(
      (item) => item.textContent?.trim(),
    );
    assert.true(items.length > 0, 'the hidden actions are menu items');
    assert.true(
      items.every((text) => text?.startsWith('Menu ')),
      items.join(', '),
    );
    await click(document.querySelector('.cds--menu-item')!);
    assert.strictEqual(clicks.length, 1, 'a menu item runs its action');
    assert.dom('.act').exists({ count: 4 });
  });

  test('ContentPageActions runs an action from its button', async function (assert) {
    let clicked = 0;
    const actions = [
      {
        id: 'one',
        onClick: () => clicked++,
        body: <template>
          <button type="button" class="act" ...attributes>One</button>
        </template> as TOC<{ Element: HTMLButtonElement }>,
        menuItem: { label: 'One' },
      },
    ];

    await render(
      <template>
        <PageHeader as |PageHeader|>
          <PageHeader.Content @title="Title">
            <:pageActions>
              <PageHeader.ContentPageActions @actions={{actions}} />
            </:pageActions>
          </PageHeader.Content>
        </PageHeader>
      </template>,
    );
    await click('.act');

    assert.strictEqual(clicked, 1);
    assert
      .dom('.c4p--page-header__content__page-actions li[data-offset]')
      .hasAttribute('data-hidden', 'true', 'no menu while everything fits');
  });

  test('BreadcrumbPageActions moves the buttons that do not fit into an overflow menu', async function (assert) {
    const clicks: string[] = [];
    const actions = ['a', 'b', 'c', 'd', 'e'].map((id) => ({
      id,
      label: `Action ${id}`,
      renderIcon: Add,
      onClick: () => clicks.push(id),
    }));

    await render(
      <template>
        <style nonce={{nonce}}>
          .narrow {
            width: 140px;
          }
          .narrow .c4p--page-header__breadcrumb-page-actions {
            /* The rendering root is zoomed to 50%, which clientWidth ignores. */
            inline-size: 40px;
          }
        </style>
        <div class="narrow">
          <PageHeader as |PageHeader|>
            <PageHeader.BreadcrumbBar>
              <:pageActions>
                <PageHeader.BreadcrumbPageActions
                  @actions={{actions}}
                  @buttonSize="sm"
                  @overflowMenuLabel="More"
                />
              </:pageActions>
            </PageHeader.BreadcrumbBar>
          </PageHeader>
        </div>
      </template>,
    );
    await waitUntil(() =>
      document.querySelector(
        '.c4p--page-header__breadcrumb-page-actions li[data-id][data-hidden]',
      ),
    );

    assert
      .dom('.c4p--page-header__breadcrumb-page-actions__overflow-item')
      .doesNotHaveAttribute('data-hidden');
    await click(
      '.c4p--page-header__breadcrumb-page-actions__overflow-item button',
    );
    assert.dom('.cds--overflow-menu-options__option').exists();
    await click('.cds--overflow-menu-options__btn');
    assert.strictEqual(clicks.length, 1);
  });

  test('TagOverflow hides the tags that do not fit and lists them in a popover', async function (assert) {
    const tags = ['one', 'two', 'three', 'four', 'five'];

    await render(
      <template>
        <style nonce={{nonce}}>
          .narrow {
            width: 220px;
          }
        </style>
        <div class="narrow">
          <PageHeader as |PageHeader|>
            <PageHeader.TabBar>
              <:default>Tabs</:default>
              <:tags>
                <PageHeader.TagOverflow>
                  <:default>
                    {{#each tags as |tag|}}
                      <Tag @id={{tag}} @type="blue">{{tag}} tag</Tag>
                    {{/each}}
                  </:default>
                  <:renderOverflowTag as |hidden toggle open triggerId|>
                    <button
                      id={{triggerId}}
                      class="trigger"
                      type="button"
                      aria-expanded={{if open "true" "false"}}
                      {{on "click" toggle}}
                    >+{{hidden.length}}</button>
                  </:renderOverflowTag>
                  <:renderPopoverContent as |hidden|>
                    {{#each hidden as |element|}}
                      <li class="listed">{{element.id}}</li>
                    {{/each}}
                  </:renderPopoverContent>
                </PageHeader.TagOverflow>
              </:tags>
            </PageHeader.TabBar>
          </PageHeader>
        </div>
      </template>,
    );
    await waitUntil(
      () =>
        !document.querySelector(
          '.c4p--page-header--tag-overflow-container__has-no-hidden-items',
        ),
    );

    assert
      .dom('.c4p--page-header--tag-overflow-popover')
      .doesNotHaveClass('c4p--page-header--tag-overflow-popover__hidden')
      .hasAttribute('aria-labelledby', document.querySelector('.trigger')!.id)
      .doesNotHaveClass('cds--popover--open');
    assert
      .dom('.trigger')
      .hasAttribute('id', /^c4p--page-header--tag-overflow-btn-/);
    assert
      .dom('.c4p--page-header__tags-popover-list')
      .hasAttribute('aria-label', 'Hidden tags');
    assert.dom('.listed').exists();

    await click('.trigger');
    assert
      .dom('.c4p--page-header--tag-overflow-popover')
      .hasClass('cds--popover--open');
    assert.dom('.trigger').hasAttribute('aria-expanded', 'true');

    await click('.trigger');
    assert
      .dom('.c4p--page-header--tag-overflow-popover')
      .doesNotHaveClass('cds--popover--open');
  });

  test('TabBar takes tags and a scroller, and can disable the sticky tab bar', async function (assert) {
    const state = { disable: true };
    await render(
      <template>
        <PageHeader as |PageHeader|>
          <PageHeader.TabBar @disableStickyTabBar={{state.disable}}>
            <:default>Tabs</:default>
            <:tags><i class="tags">tags</i></:tags>
            <:scroller><i class="scroller">scroller</i></:scroller>
          </PageHeader.TabBar>
        </PageHeader>
      </template>,
    );

    assert
      .dom('.c4p--page-header')
      .hasClass('c4p--page-header--disable-sticky-tab-bar');
    assert
      .dom('.c4p--page-header__tab-bar--tablist')
      .hasClass('c4p--page-header__tab-bar--with-scroller');
    assert.dom('.c4p--page-header__tab-bar--tablist .tags').exists();
    assert
      .dom('.c4p--page-header--scroller-button-container .scroller')
      .exists();
  });

  test('the tab bar sticks again once its disableStickyTabBar goes', async function (assert) {
    const state = trackedObject({ disable: true, shown: true });
    await render(
      <template>
        <PageHeader as |PageHeader|>
          {{#if state.shown}}
            <PageHeader.TabBar @disableStickyTabBar={{state.disable}}>
              Tabs
            </PageHeader.TabBar>
          {{/if}}
        </PageHeader>
      </template>,
    );

    const sticky = 'c4p--page-header--disable-sticky-tab-bar';
    assert.dom('.c4p--page-header').hasClass(sticky);

    state.disable = false;
    await settled();
    assert.dom('.c4p--page-header').doesNotHaveClass(sticky);

    state.disable = true;
    await settled();
    assert.dom('.c4p--page-header').hasClass(sticky);
    state.shown = false;
    await settled();
    assert.dom('.c4p--page-header').doesNotHaveClass(sticky);
  });

  test('its observers disconnect when the header goes', async function (assert) {
    const state = trackedObject({ shown: true });
    await render(
      <template>
        {{#if state.shown}}
          <PageHeader as |PageHeader|>
            <PageHeader.Content @title="Title">
              <:pageActions><PageHeader.ContentPageActions /></:pageActions>
            </PageHeader.Content>
          </PageHeader>
        {{/if}}
      </template>,
    );
    const observers = FakeIntersectionObserver.instances.filter(
      (observer) => observer.targets.size > 0,
    );
    assert.true(observers.length >= 2, 'observing the content and its parts');

    state.shown = false;
    await settled();
    assert.true(
      observers.every((observer) => observer.targets.size === 0),
      'no longer observing',
    );
    assert.true(FakeIntersectionObserver.disconnected >= observers.length);
  });

  test('the overflow breadcrumb stays before the last breadcrumb as breadcrumbs come and go', async function (assert) {
    const state = trackedObject({ middle: false, last: false });
    await render(
      <template>
        <PageHeader as |PageHeader|>
          <PageHeader.BreadcrumbBar>
            <PageHeader.BreadcrumbOverflow
              @renderOverflowBreadcrumb={{Overflow}}
              as |BreadcrumbItem TitleBreadcrumb|
            >
              <BreadcrumbItem @href="/1">One</BreadcrumbItem>
              {{#if state.middle}}
                <BreadcrumbItem @href="/mid" class="mid">Mid</BreadcrumbItem>
              {{/if}}
              <BreadcrumbItem @href="/2" class="two">Two</BreadcrumbItem>
              {{#if state.last}}
                <TitleBreadcrumb class="title">Title</TitleBreadcrumb>
              {{/if}}
            </PageHeader.BreadcrumbOverflow>
          </PageHeader.BreadcrumbBar>
        </PageHeader>
      </template>,
    );
    const order = () =>
      [...document.querySelectorAll('.cds--breadcrumb > li')].map((li) =>
        li.classList.contains('c4p--page-header-breadcrumb-overflow-item')
          ? 'overflow'
          : li.textContent?.trim(),
      );
    assert.deepEqual(order(), ['One', 'overflow', 'Two']);

    state.middle = true;
    await settled();
    assert.deepEqual(
      order(),
      ['One', 'Mid', 'overflow', 'Two'],
      'after a middle one',
    );

    state.last = true;
    await settled();
    assert.deepEqual(
      order(),
      ['One', 'Mid', 'Two', 'overflow', 'Title'],
      'a later one takes it',
    );

    state.last = false;
    await settled();
    assert.deepEqual(order(), ['One', 'Mid', 'overflow', 'Two']);
    assert
      .dom('.c4p--page-header-breadcrumb-overflow-item')
      .exists({ count: 1 });
  });

  test("TitleBreadcrumb keeps its aria-hidden over a caller's, and takes @isCurrentPage", async function (assert) {
    await render(
      <template>
        <PageHeader as |PageHeader|>
          <PageHeader.Content @title="Title" />
          <PageHeader.BreadcrumbBar>
            <PageHeader.BreadcrumbOverflow as |BreadcrumbItem TitleBreadcrumb|>
              <TitleBreadcrumb
                aria-hidden="false"
                tabindex="0"
                @isCurrentPage={{false}}
              >Title</TitleBreadcrumb>
            </PageHeader.BreadcrumbOverflow>
          </PageHeader.BreadcrumbBar>
        </PageHeader>
      </template>,
    );
    assert
      .dom('.c4p--page-header-title-breadcrumb')
      .hasAttribute('aria-hidden', 'true')
      .hasAttribute('tabindex', '-1')
      .doesNotHaveClass('cds--breadcrumb-item--current');
  });

  test('two headers on a page get their own ids', async function (assert) {
    await render(
      <template>
        <PageHeader as |PageHeader|>
          <PageHeader.Content @title="One" />
        </PageHeader>
        <PageHeader as |PageHeader|>
          <PageHeader.Content @title="Two" />
        </PageHeader>
      </template>,
    );
    const ids = [
      ...document.querySelectorAll('.c4p--truncated-text__text-content'),
    ].map((element) => element.id);
    assert.strictEqual(ids.length, 2);
    assert.notStrictEqual(ids[0], ids[1]);
  });

  test('ContentPageActions follows a change of its actions', async function (assert) {
    const make = (ids: string[]) =>
      ids.map((id) => ({
        id,
        body: <template>
          <button type="button" class="act" ...attributes>{{id}}</button>
        </template> as TOC<{ Element: HTMLButtonElement }>,
        menuItem: { label: `Menu ${id}` },
      }));
    const state = trackedObject({ actions: make(['a', 'b', 'c', 'd']) });
    await render(
      <template>
        <style nonce={{nonce}}>
          .narrow {
            width: 300px;
          }
          .narrow .act {
            inline-size: 100px;
          }
        </style>
        <div class="narrow">
          <PageHeader as |PageHeader|>
            <PageHeader.Content @title="Title">
              <:pageActions>
                <PageHeader.ContentPageActions @actions={{state.actions}} />
              </:pageActions>
            </PageHeader.Content>
          </PageHeader>
        </div>
      </template>,
    );
    const offset = '.c4p--page-header__content__page-actions li[data-offset]';
    await waitUntil(
      () => !document.querySelector(offset)?.hasAttribute('data-hidden'),
    );

    state.actions = make(['a']);
    await waitUntil(() =>
      document.querySelector(offset)?.hasAttribute('data-hidden'),
    );
    assert.dom('.act').exists({ count: 1 });
    assert
      .dom(
        '.c4p--page-header__content__page-actions li[data-hidden]:not([data-offset])',
      )
      .doesNotExist();
  });

  test('BreadcrumbPageActions follows a change of its actions', async function (assert) {
    const make = (ids: string[]) =>
      ids.map((id) => ({ id, label: `Action ${id}`, renderIcon: Add }));
    const state = trackedObject({ actions: make(['a', 'b', 'c', 'd', 'e']) });
    await render(
      <template>
        <style nonce={{nonce}}>
          .narrow {
            width: 140px;
          }
          .narrow .c4p--page-header__breadcrumb-page-actions {
            /* The rendering root is zoomed to 50%, which clientWidth ignores. */
            inline-size: 40px;
          }
        </style>
        <div class="narrow">
          <PageHeader as |PageHeader|>
            <PageHeader.BreadcrumbBar>
              <:pageActions>
                <PageHeader.BreadcrumbPageActions @actions={{state.actions}} />
              </:pageActions>
            </PageHeader.BreadcrumbBar>
          </PageHeader>
        </div>
      </template>,
    );
    const offset = '.c4p--page-header__breadcrumb-page-actions__overflow-item';
    await waitUntil(
      () => !document.querySelector(offset)?.hasAttribute('data-hidden'),
    );

    state.actions = make(['a']);
    await waitUntil(() =>
      document.querySelector(offset)?.hasAttribute('data-hidden'),
    );
    assert.dom('li[data-id]').exists({ count: 1 });
    assert.dom('li[data-id][data-hidden]').doesNotExist();
  });

  test('ScrollButton scrolls the page to collapse the content, and back', async function (this: RenderingTestContext, assert) {
    await render(
      <template>
        <style nonce={{nonce}}>
          .scroller {
            block-size: 300px;
            overflow: auto;
          }
          .tall {
            block-size: 2000px;
          }
        </style>
        <div class="scroller">
          <PageHeader as |PageHeader|>
            <PageHeader.Content @title="Title" />
            <PageHeader.TabBar>
              <:default>Tabs</:default>
              <:scroller>
                <PageHeader.ScrollButton
                  @collapseText="Shrink"
                  @expandText="Grow"
                />
              </:scroller>
            </PageHeader.TabBar>
          </PageHeader>
          <div class="tall"></div>
        </div>
      </template>,
    );

    const scroller = document.querySelector<HTMLElement>('.scroller')!;
    const content = document.querySelector<HTMLElement>(
      '.c4p--page-header__content',
    )!;

    assert.dom('.cds--popover-content').hasText('Shrink');
    await click('.c4p--page-header--scroller-button');
    await waitUntil(() => scroller.scrollTop > 0, { timeout: 3000 });
    assert.true(scroller.scrollTop > 0, 'scrolled past the content');
    assert.true(scroller.scrollTop <= content.offsetHeight + 1);

    FakeIntersectionObserver.report('.c4p--page-header__content', false);
    await settled();
    assert.dom('.cds--popover-content').hasText('Grow');
    await click('.c4p--page-header--scroller-button');
    await waitUntil(() => scroller.scrollTop === 0, { timeout: 3000 });
    assert.strictEqual(scroller.scrollTop, 0);
  });

  test('an overflow menu in the overflow breadcrumb has the icon Carbon React gives a breadcrumb', async function (assert) {
    await render(
      <template>
        <BreadcrumbItem as |item|>
          <item.OverflowMenu @ariaLabel="More" />
        </BreadcrumbItem>
      </template>,
    );

    assert.dom('svg.cds--overflow-menu__icon').exists();
    assert
      .dom('svg.cds--overflow-menu__icon')
      .doesNotHaveClass('cds--btn__icon', 'which would offset it in the line');
  });

  test('ContentText and HeroImage render their markup', async function (assert) {
    await render(
      <template>
        <PageHeader as |PageHeader|>
          <PageHeader.ContentText @subtitle="Sub" @subtitleAs="h4" class="x">
            Body
          </PageHeader.ContentText>
          <PageHeader.HeroImage @objectFit="fill"><img
              alt=""
              src="x.png"
            /></PageHeader.HeroImage>
        </PageHeader>
      </template>,
    );

    assert.dom('.c4p--page-header__content__body.x').includesText('Body');
    assert.dom('h4.c4p--page-header__content__subtitle').hasText('Sub');
    assert
      .dom('.c4p--page-header__hero-image')
      .hasClass('cds--aspect-ratio')
      .hasClass('c4p--page-header__hero-image--object-fit-fill')
      .hasClass(
        window.matchMedia('(min-width: 66rem)').matches
          ? 'cds--aspect-ratio--2x1'
          : 'cds--aspect-ratio--3x2',
      );
  });
});
