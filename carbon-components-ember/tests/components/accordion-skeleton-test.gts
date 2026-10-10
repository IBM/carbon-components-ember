import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import AccordionSkeleton from '#src/components/accordion-skeleton.gts';

module('Integration | Component | AccordionSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render four items with the first open', async function (assert) {
    await render(<template><AccordionSkeleton data-test-skeleton /></template>);

    assert
      .dom('ul[data-test-skeleton]')
      .hasClass('cds--accordion')
      .hasClass('cds--skeleton')
      .hasClass('cds--accordion--end');
    assert.dom('.cds--accordion__item').exists({ count: 4 });
    assert.dom('.cds--accordion__item--active').exists({ count: 1 });
    assert
      .dom('.cds--accordion__content .cds--skeleton__text')
      .exists({ count: 3 });
  });

  test('should take a count, alignment and closed state', async function (assert) {
    await render(
      <template>
        <AccordionSkeleton
          @count={{2}}
          @open={{false}}
          @align="start"
          @isFlush={{true}}
          @ordered={{true}}
        />
      </template>,
    );

    assert
      .dom('ol.cds--accordion')
      .hasClass('cds--accordion--start')
      .doesNotHaveClass('cds--accordion--flush');
    assert.dom('.cds--accordion__item').exists({ count: 2 });
    assert.dom('.cds--accordion__item--active').doesNotExist();
  });

  test('should be flush when aligned to the end', async function (assert) {
    await render(<template><AccordionSkeleton @isFlush={{true}} /></template>);

    assert.dom('.cds--accordion').hasClass('cds--accordion--flush');
  });
});
