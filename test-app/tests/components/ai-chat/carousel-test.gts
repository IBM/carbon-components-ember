import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitUntil, find, findAll } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import Carousel from 'carbon-components-ember/components/ai-chat/carousel';
import type { CarouselResponse } from '@carbon/utilities/carousel';

async function waitForInit() {
  await waitUntil(() => find('.carousel__view'));
}

module('Integration | Component | ai-chat/Carousel', (hooks) => {
  setupRenderingTest(hooks);

  let originalMatchMedia: typeof window.matchMedia;

  // `initCarousel` gates most of its transition-completion callback on a
  // real CSS `transitionend` event, which only fires once this addon's real
  // carousel SCSS is loaded - not reliable in test-app's dev build (see the
  // documented "test-app dev-mode build doesn't reliably load a new
  // component's real SCSS" gotcha). Mocking `prefers-reduced-motion: reduce`
  // pushes `initCarousel` onto its other, fully synchronous code path (see
  // `transitionToViewIndex` in `@carbon/utilities`'s carousel source),
  // making `@onChange`/the indicator's update deterministic without
  // depending on any CSS at all - a real browser behavior upstream itself
  // relies on for users with that OS preference, not a test-only shortcut.
  hooks.beforeEach(function () {
    originalMatchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;
  });

  hooks.afterEach(function () {
    window.matchMedia = originalMatchMedia;
  });

  test('it renders each yielded child as a view inside the items wrapper', async function (assert) {
    await render(
      <template>
        <Carousel>
          <div>View 1</div>
          <div>View 2</div>
          <div>View 3</div>
        </Carousel>
      </template>,
    );

    await waitForInit();

    assert.dom('.carousel__itemsWrapper > .carousel__view').exists({ count: 3 });
    assert.dom('.cds-aichat-carousel__indicator').hasText('1 / 3');
  });

  test('it navigates forward and back, updating the indicator and the active view class', async function (assert) {
    await render(
      <template>
        <Carousel @previousBtnText='Previous' @nextBtnText='Next'>
          <div>View 1</div>
          <div>View 2</div>
          <div>View 3</div>
        </Carousel>
      </template>,
    );

    await waitForInit();

    await click('.cds-aichat-carousel__next-btn');
    assert.dom('.cds-aichat-carousel__indicator').hasText('2 / 3');
    assert.dom(findAll('.carousel__view')[1]).hasClass('carousel__view-active');

    await click('.cds-aichat-carousel__previous-btn');
    assert.dom('.cds-aichat-carousel__indicator').hasText('1 / 3');
    assert.dom(findAll('.carousel__view')[0]).hasClass('carousel__view-active');
  });

  test('clicking next past the last view is a no-op, matching upstream (no disabled state)', async function (assert) {
    await render(
      <template>
        <Carousel>
          <div>Only view</div>
        </Carousel>
      </template>,
    );

    await waitForInit();

    assert.dom('.cds-aichat-carousel__indicator').hasText('1 / 1');
    assert.dom('.cds-aichat-carousel__next-btn').isNotDisabled();

    await click('.cds-aichat-carousel__next-btn');
    assert.dom('.cds-aichat-carousel__indicator').hasText('1 / 1');
  });

  test('it calls @onChange with the carousel response on navigation', async function (assert) {
    const calls: CarouselResponse[] = [];
    const onChange = (data: CarouselResponse) => calls.push(data);

    await render(
      <template>
        <Carousel @onChange={{onChange}}>
          <div>View 1</div>
          <div>View 2</div>
        </Carousel>
      </template>,
    );

    await waitForInit();
    assert.strictEqual(calls.length, 1, 'fires once on initial mount');
    assert.strictEqual(calls[0]?.currentIndex, 0);

    await click('.cds-aichat-carousel__next-btn');
    assert.strictEqual(calls.length, 2);
    assert.strictEqual(calls[1]?.currentIndex, 1);
    assert.strictEqual(calls[1]?.totalViews, 2);
  });

  test('adding a view after init does not throw and the new view is picked up', async function (assert) {
    class ViewsState {
      @tracked list = ['View 1', 'View 2'];
    }
    const state = new ViewsState();

    class Host extends Component {
      state = state;
      addView = () => {
        this.state.list = [...this.state.list, 'View 3'];
      };
      <template>
        <Carousel>
          {{#each this.state.list as |label|}}
            <div>{{label}}</div>
          {{/each}}
        </Carousel>
        <button
          type='button'
          class='add-view-button'
          {{on 'click' this.addView}}
        >Add view</button>
      </template>
    }

    await render(<template><Host /></template>);
    await waitForInit();

    assert.dom('.carousel__itemsWrapper > div').exists({ count: 2 });

    await click('.add-view-button');

    assert.dom('.carousel__itemsWrapper > div').exists({ count: 3 });
  });
});
