import { module, test } from 'qunit';
import { destroy } from '@ember/destroyable';
import { settled } from '@ember/test-helpers';
import { mediaQuery, minWidth } from '#src/utils/media-query.ts';
import { setupMatchMedia } from '../helpers/index.ts';

module('Unit | Utility | media-query', function (hooks) {
  const media = setupMatchMedia(hooks);

  test("minWidth takes the width from @carbon/layout's breakpoints", function (assert) {
    assert.strictEqual(minWidth('md'), '(min-width: 42rem)');
    assert.strictEqual(minWidth('lg'), '(min-width: 66rem)');
  });

  test('matches follows the media query until its owner is destroyed', async function (assert) {
    const owner = {};
    const changes: boolean[] = [];
    const lg = mediaQuery(owner, minWidth('lg'), {
      onChange: (matches) => changes.push(matches),
    });
    assert.strictEqual(media().media, '(min-width: 66rem)');
    assert.false(lg.matches);

    media().change(true);
    assert.true(lg.matches);
    assert.deepEqual(changes, [true], 'onChange hears the change');

    destroy(owner);
    await settled();
    media().change(false);
    assert.true(lg.matches, 'no longer listening');
    assert.deepEqual(changes, [true]);
  });
});
