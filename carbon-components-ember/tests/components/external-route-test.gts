import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { click, currentURL, visit } from '@ember/test-helpers';
import Engine from '@ember/engine';
import EngineInstance from '@ember/engine/instance';
import Breadcrumb from '#src/components/breadcrumb.gts';
import Button from '#src/components/button.gts';
import Link from '#src/components/link.gts';
import Tag from '#src/components/tag.gts';
import Tile from '#src/components/tile.gts';
import RouterLink from '#src/components/-private/router-link.gts';
import { setupRoutes } from '../helpers';
import type { TestContext } from '@ember/test-helpers';

interface Registry {
  register(name: string, factory: unknown, options?: object): void;
}

// What ember-engines gives an engine instance: its external routes, mapped
// to the app's. Core Ember mounts the engine; this is the one method the
// links rely on.
const EXTERNAL_ROUTES: Record<string, string> = {
  home: 'settings',
  profile: 'user',
  team: 'team',
  here: 'shop.cart',
};

class ShopEngineInstance extends EngineInstance {
  _getExternalRoute(name: string) {
    return EXTERNAL_ROUTES[name];
  }
}

const profileModels = ['42'];
const loadingModels = [null];
const tab = { tab: 'profile' };

const ShopTemplate = <template>
  <Link @externalRoute="home" id="home">Home</Link>
  <Link @externalRoute="profile" @models={{profileModels}} id="profile">
    Profile
  </Link>
  <Link
    @externalRoute="profile"
    @models={{profileModels}}
    @query={{tab}}
    id="profile-tab"
  >Profile tab</Link>
  <Link @externalRoute="profile" @models={{loadingModels}} id="loading">
    Loading
  </Link>
  <Link @externalRoute="here" id="here">Here</Link>
  <RouterLink
    @route="cart"
    @activeClass="current"
    @ariaCurrent="page"
    id="cart"
  >
    Cart
  </RouterLink>
  <RouterLink @route="application" @activeClass="current" id="engine-root">
    Shop
  </RouterLink>
  <RouterLink
    @route="application"
    @activeClass="current"
    @exact={{true}}
    id="engine-root-exact"
  >Shop only</RouterLink>
  <RouterLink @route="index" @activeClass="current" id="engine-index">
    Shop index
  </RouterLink>
  {{outlet}}
</template>;

// Mounted under a route with a dynamic segment.
const TeamShopTemplate = <template>
  <Link @externalRoute="team" id="team">Team</Link>
  {{outlet}}
</template>;

class ShopEngine extends Engine {
  // Nothing to resolve: the test registers what the engine needs.
  Resolver = { create: () => ({ resolve: () => undefined }) } as never;

  buildInstance(options = {}) {
    const instance = ShopEngineInstance.create({ ...options, base: this });
    instance.register('template:application', ShopTemplate);
    return instance;
  }
}

class TeamShopEngine extends ShopEngine {
  buildInstance(options = {}) {
    const instance = super.buildInstance(options);
    instance.unregister('template:application');
    instance.register('template:application', TeamShopTemplate);
    return instance;
  }
}

function setupShop(hooks: NestedHooks) {
  setupRoutes(hooks, function () {
    this.mount('shop');
    this.route('team', { path: '/teams/:team_id' }, function () {
      this.mount('team-shop', { as: 'shop' });
    });
  });
  hooks.beforeEach(function (this: TestContext) {
    const owner = this.owner as unknown as Registry;
    owner.register(
      'route-map:shop',
      function (this: { route(name: string): void }) {
        this.route('cart');
      },
      { instantiate: false },
    );
    owner.register('route-map:team-shop', function () {}, {
      instantiate: false,
    });
    owner.register('engine:shop', ShopEngine);
    owner.register('engine:team-shop', TeamShopEngine);
  });
}

module(
  'Integration | RouterLink > @externalRoute in an engine',
  function (hooks) {
    setupApplicationTest(hooks);
    setupShop(hooks);

    test('links to the app route the engine maps it to, and navigates there', async function (assert) {
      await visit('/shop');

      assert.dom('#home').hasAttribute('href', '/settings');
      assert.dom('#profile').hasAttribute('href', '/users/42');
      assert.dom('#profile-tab').hasAttribute('href', '/users/42?tab=profile');
      assert.dom('#home').doesNotHaveClass('active');

      await click('#home');
      assert.strictEqual(currentURL(), '/settings');
    });

    test('marks the current link across the engine boundary', async function (assert) {
      await visit('/shop/cart');

      assert
        .dom('#here')
        .hasClass('active', "an external link to the app's current route");
      assert
        .dom('#cart')
        .hasClass('current', "a link to the engine's own current route")
        .hasAttribute('aria-current', 'page');
      assert.dom('#home').doesNotHaveClass('active');
      assert.dom('#engine-root').hasClass('current', "the engine's root");
      assert.dom('#engine-root-exact').doesNotHaveClass('current');
      assert.dom('#engine-index').doesNotHaveClass('current');

      await visit('/shop');
      assert.dom('#engine-root-exact').hasClass('current');
      assert.dom('#engine-index').hasClass('current');
    });

    test('its href follows the current route, as LinkTo does', async function (assert) {
      await visit('/teams/1/shop');
      assert.dom('#team').hasAttribute('href', '/teams/1');

      await visit('/teams/2/shop');
      assert.dom('#team').hasAttribute('href', '/teams/2');
    });

    test('a link whose models are loading goes nowhere', async function (assert) {
      await visit('/shop');

      assert.dom('#loading').hasAttribute('href', '#').hasClass('loading');
      await click('#loading');
      assert.strictEqual(currentURL(), '/shop');
    });

    test('leaves a modified click to the browser', async function (assert) {
      await visit('/shop');
      // Past the link, the click is the browser's to follow; the test stops
      // it there, or the page itself would navigate away.
      let leftToBrowser = false;
      const stop = (event: Event) => {
        leftToBrowser = !event.defaultPrevented;
        event.preventDefault();
      };
      document.addEventListener('click', stop);
      try {
        await click('#home', { metaKey: true });
      } finally {
        document.removeEventListener('click', stop);
      }

      assert.true(leftToBrowser);
      assert.strictEqual(currentURL(), '/shop');
    });
  },
);

module(
  'Integration | RouterLink > @externalRoute outside an engine',
  function (hooks) {
    setupApplicationTest(hooks);
    setupShop(hooks);

    test("names one of the app's routes", async function (assert) {
      (this.owner as unknown as Registry).register(
        'template:application',
        <template>
          <Link @externalRoute="settings" id="settings">Settings</Link>
          {{outlet}}
        </template>,
      );
      await visit('/');

      assert.dom('#settings').hasAttribute('href', '/settings');
      await click('#settings');
      assert.strictEqual(currentURL(), '/settings');
      assert.dom('#settings').hasClass('active');
    });

    test('an empty @activeClass marks no class, on either kind of link', async function (assert) {
      (this.owner as unknown as Registry).register(
        'template:application',
        <template>
          <RouterLink @route="settings" @activeClass="" id="route">
            Settings
          </RouterLink>
          <RouterLink @externalRoute="settings" @activeClass="" id="external">
            Settings
          </RouterLink>
          {{outlet}}
        </template>,
      );
      await visit('/settings');

      assert.dom('#route').doesNotHaveClass('active');
      assert.dom('#external').doesNotHaveClass('active');
    });

    test('the link-like components take it', async function (assert) {
      (this.owner as unknown as Registry).register(
        'template:application',
        <template>
          <Button @externalRoute="settings" id="button">Settings</Button>
          <Breadcrumb as |BreadcrumbItem|>
            <BreadcrumbItem @externalRoute="settings" id="crumb">
              Settings
            </BreadcrumbItem>
          </Breadcrumb>
          <Tile @clickable={{true}} @externalRoute="settings" id="tile">
            Settings
          </Tile>
          <Tag @type="gray" @externalRoute="settings" id="tag">Settings</Tag>
          {{outlet}}
        </template>,
      );
      await visit('/');

      assert.dom('a#button').hasAttribute('href', '/settings');
      assert.dom('#crumb a').hasAttribute('href', '/settings');
      assert.dom('a#tile').hasAttribute('href', '/settings');
      assert.dom('#tag a, a#tag').hasAttribute('href', '/settings');
    });
  },
);
