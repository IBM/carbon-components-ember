import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import FullPageError from '#src/components/ibm-products/full-page-error.gts';

module(
  'Integration | Component | IBM Products | FullPageError',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders the error, its content and the illustration for its kind', async function (assert) {
      await render(
        <template>
          <FullPageError
            @kind="404"
            class="extra"
            role="alert"
            @label="Error 404"
            @title="Page not found"
            @description="The page you requested has moved."
          >
            <a href="/" id="home">Go home</a>
          </FullPageError>
        </template>,
      );

      assert

        .dom('.c4p--full-page-error')

        .hasClass('extra')

        .hasAttribute('role', 'main', 'as in upstream, its role wins');
      assert
        .dom('h1.c4p--full-page-error__title')
        .includesText('Error 404')
        .includesText('Page not found');
      assert
        .dom('.c4p--full-page-error__description')
        .hasText('The page you requested has moved.');
      assert.dom('.c4p--full-page-error__body #home').exists();
      assert
        .dom('svg.c4p--full-page-error__svg')
        .hasClass('c4p--full-page-error__404')
        .hasAttribute('aria-hidden', 'true');
    });

    test('without @kind it shows the generic illustration', async function (assert) {
      await render(
        <template>
          <FullPageError
            @label="Error"
            @title="Something went wrong"
            @description="Try again later."
          />
        </template>,
      );

      assert.dom('svg.c4p--full-page-error__custom').exists();
    });
  },
);
