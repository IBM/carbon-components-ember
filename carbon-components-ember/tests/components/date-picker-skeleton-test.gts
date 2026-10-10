import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import DatePickerSkeleton from '#src/components/date-picker-skeleton.gts';

module('Integration | Component | DatePickerSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render one input with a label', async function (assert) {
    await render(
      <template><DatePickerSkeleton data-test-skeleton /></template>,
    );

    assert
      .dom('[data-test-skeleton]')
      .hasClass('cds--date-picker')
      .hasClass('cds--date-picker--simple');
    assert.dom('.cds--date-picker__input').exists({ count: 1 });
    assert.dom('.cds--label').exists({ count: 1 });
  });

  test('should render two inputs for a range', async function (assert) {
    await render(
      <template>
        <DatePickerSkeleton @range={{true}} @hideLabel={{true}} />
      </template>,
    );

    assert.dom('.cds--date-picker').hasClass('cds--date-picker--range');
    assert.dom('.cds--date-picker__input').exists({ count: 2 });
    assert.dom('.cds--label').doesNotExist();
  });
});
