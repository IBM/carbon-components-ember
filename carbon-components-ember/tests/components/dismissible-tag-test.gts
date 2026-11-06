import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, find, render, waitUntil } from '@ember/test-helpers';
import DismissibleTag from '#src/components/dismissible-tag.gts';
import { Add } from '#src/icons.ts';

module('Integration | Component | DismissibleTag', (hooks) => {
  setupRenderingTest(hooks);

  test('renders its text in a filter tag with a dismiss button', async function (assert) {
    await render(
      <template><DismissibleTag @text="Tag content" @type="red" /></template>,
    );

    assert
      .dom('.cds--tag')
      .hasClass('cds--tag--filter')
      .hasClass('cds--tag--red')
      .hasAttribute('id', /^tag-/);
    assert.strictEqual(
      find('.cds--tag__label')?.textContent,
      'Tag content',
      'no whitespace around the text',
    );
    assert.dom('.cds--tag__label').hasAttribute('title', 'Tag content');
    assert
      .dom('.cds--tag__close-icon')
      .hasAttribute('type', 'button')
      .hasAria('label', 'Dismiss');
  });

  test('@title labels the dismiss button and @tagTitle titles the text', async function (assert) {
    await render(
      <template>
        <DismissibleTag
          @tagTitle="A custom title"
          @text="Tag content"
          @title="Remove filter"
          @type="gray"
        />
      </template>,
    );

    assert.dom('.cds--tag__label').hasAttribute('title', 'A custom title');
    assert.dom('.cds--tag__close-icon').hasAria('label', 'Remove filter');
  });

  test('the dismiss button calls @onClose, and the click stops there', async function (assert) {
    const closes: MouseEvent[] = [];
    const onClose = (event: MouseEvent) => closes.push(event);
    let bubbled = 0;
    const parentClick = () => bubbled++;

    await render(
      <template>
        {{! eslint-disable-next-line ember/template-no-invalid-interactive -- only listens for the click bubbling up }}
        <div {{on "click" parentClick}}>
          <DismissibleTag
            @onClose={{onClose}}
            @text="Tag content"
            @type="gray"
          />
        </div>
      </template>,
    );
    await click('.cds--tag__close-icon');

    assert.strictEqual(closes.length, 1);
    assert.ok(closes[0] instanceof MouseEvent);
    assert.strictEqual(bubbled, 0, 'as Carbon React, it stops propagation');
  });

  test('without @onClose, the click goes on up', async function (assert) {
    let bubbled = 0;
    const parentClick = () => bubbled++;

    await render(
      <template>
        {{! eslint-disable-next-line ember/template-no-invalid-interactive -- only listens for the click bubbling up }}
        <div {{on "click" parentClick}}>
          <DismissibleTag @text="Tag content" @type="gray" />
        </div>
      </template>,
    );
    await click('.cds--tag__close-icon');

    assert.strictEqual(bubbled, 1);
  });

  test('@disabled disables the tag and its button', async function (assert) {
    await render(
      <template>
        <DismissibleTag @disabled={{true}} @text="Tag content" @type="gray" />
      </template>,
    );

    assert.dom('.cds--tag').hasClass('cds--tag--disabled');
    assert.dom('.cds--tag__close-icon').isDisabled();
  });

  test('a cut-off text changes the button label to @dismissTooltipLabel', async function (assert) {
    const text = 'Tag content with a long text description that goes on';
    await render(
      <template>
        <DismissibleTag
          @dismissTooltipLabel="Dismiss this tag"
          @text={{text}}
          @type="red"
        />
      </template>,
    );
    await waitUntil(
      () =>
        find('.cds--tag__close-icon')?.getAttribute('aria-label') ===
        'Dismiss this tag',
    );

    assert.dom('.cds--tag__close-icon').hasAria('label', 'Dismiss this tag');
    assert.dom('.cds--tooltip-content').hasText('Dismiss this tag');
  });

  test('its icon shows, except at the small size', async function (assert) {
    await render(
      <template>
        <DismissibleTag @renderIcon={{Add}} @text="Tag content" @type="blue" />
      </template>,
    );
    assert.dom('.cds--tag__custom-icon svg').exists();

    await render(
      <template>
        <DismissibleTag
          @renderIcon={{Add}}
          @size="sm"
          @text="Tag content"
          @type="blue"
        />
      </template>,
    );
    assert.dom('.cds--tag__custom-icon').doesNotExist();
    assert.dom('.cds--tag').hasClass('cds--tag--sm');
  });

  test('its decorator block yields a small inline AI label', async function (assert) {
    await render(
      <template>
        <DismissibleTag @text="Tag content" @type="gray">
          <:decorator as |AILabel|><AILabel /></:decorator>
        </DismissibleTag>
      </template>,
    );

    assert
      .dom(
        '.cds--interactive--tag-children .cds--tag__decorator .cds--ai-label',
      )
      .exists();
    assert
      .dom('.cds--tag__decorator .cds--ai-label__button')
      .hasClass('cds--ai-label__button--sm')
      .hasClass('cds--ai-label__button--inline');
  });

  test('attributes go on the tag', async function (assert) {
    await render(
      <template>
        <DismissibleTag
          @id="my-tag"
          @text="Tag content"
          @type="gray"
          class="extra"
          data-test-tag
        />
      </template>,
    );

    assert.dom('[data-test-tag]').hasClass('cds--tag').hasClass('extra');
    assert.dom('[data-test-tag]').hasAttribute('id', 'my-tag');
  });
});
