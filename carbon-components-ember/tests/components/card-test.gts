import { module, test } from 'qunit';
import { setupApplicationTest, setupRenderingTest } from 'ember-qunit';
import {
  click,
  find,
  render,
  rerender,
  triggerKeyEvent,
} from '@ember/test-helpers';
import { trackedObject } from '@ember/reactive/collections';
import Card from '#src/components/card.gts';
import Share from '#src/components/icons/share.ts';
import { setupRoutes, visitWith } from '../helpers';

module('Integration | Component | Card', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders its parts with Carbon React markup', async function (assert) {
    await render(
      <template>
        <Card as |card|>
          <card.Media @ratio="16x9"><img alt="" /></card.Media>
          <card.Header>
            <card.TitleMedia>Logo</card.TitleMedia>
            <card.Title @label="Label" @description="Description">
              Title
            </card.Title>
            <card.Actions>
              <card.Action><button type="button">Edit</button></card.Action>
            </card.Actions>
          </card.Header>
          <card.Body>Body</card.Body>
          <card.Footer>Footer</card.Footer>
        </Card>
      </template>,
    );

    assert
      .dom('div.cds--card')
      .hasClass('cds--card--productive')
      .doesNotHaveClass('cds--card--clickable')
      .doesNotHaveAttribute('role')
      .doesNotHaveAttribute('tabindex')
      .doesNotHaveAttribute('aria-disabled');
    assert
      .dom('.cds--card > .cds--card__media')
      .hasClass('cds--aspect-ratio')
      .hasClass('cds--aspect-ratio--16x9');
    assert.dom('.cds--card__header > .cds--card__title-media').hasText('Logo');
    assert.dom('.cds--card__title > .cds--card__label').hasText('Label');
    assert
      .dom('.cds--card__title > .cds--card__title-text-row')
      .hasText('Title');
    assert
      .dom('.cds--card__title > .cds--card__description')
      .hasText('Description');
    assert
      .dom('.cds--card__header > .cds--card__actions > .cds--card__action')
      .exists();
    assert.dom('.cds--card__body').hasText('Body');
    assert.dom('.cds--card__footer').hasText('Footer');
    assert.dom('.cds--card__clickable-footer').doesNotExist();
  });

  test('@density, @horizontal and @isFlush', async function (assert) {
    await render(
      <template>
        <Card @density="expressive" @horizontal={{true}} as |card|>
          <card.Media @mediaWidth="40%">Media</card.Media>
          <card.Content>
            <card.Body @isFlush={{true}}>Body</card.Body>
          </card.Content>
        </Card>
      </template>,
    );

    assert
      .dom('.cds--card')
      .hasClass('cds--card--expressive')
      .hasClass('cds--card--horizontal');
    const media = find('.cds--card > .cds--card__media--horizontal');
    assert.dom(media).hasClass('cds--card__media');
    assert.strictEqual(
      (media as HTMLElement).style.getPropertyValue('--cds--card--media-width'),
      '40%',
    );
    assert
      .dom('.cds--card > .cds--card__content > .cds--card__body')
      .hasClass('cds--card__body--flush');
  });

  test('a clickable card clicks on Enter and Space, with a footer icon', async function (assert) {
    let clicks = 0;
    const onClick = () => clicks++;
    await render(
      <template>
        <Card
          @clickable={{true}}
          @renderFooterIcon={{Share}}
          aria-label="Report"
          {{on "click" onClick}}
          as |card|
        >
          <card.Body>Body</card.Body>
          <card.Footer>Own footer</card.Footer>
        </Card>
      </template>,
    );

    assert
      .dom('.cds--card')
      .hasClass('cds--card--clickable')
      .hasAttribute('role', 'button')
      .hasAttribute('tabindex', '0')
      .hasAttribute('aria-disabled', 'false');
    assert
      .dom('.cds--card > .cds--card__clickable-footer')
      .hasAttribute('aria-hidden', 'true');
    assert.dom('.cds--card__clickable-footer svg').exists();
    assert
      .dom('.cds--card__footer')
      .doesNotExist('a clickable card has its own footer');

    await click('.cds--card');
    await triggerKeyEvent('.cds--card', 'keydown', 'Enter');
    await triggerKeyEvent('.cds--card', 'keydown', ' ');
    assert.strictEqual(clicks, 3);
  });

  test('a disabled card is not clickable', async function (assert) {
    let clicks = 0;
    const onClick = () => clicks++;
    await render(
      <template>
        <Card
          @clickable={{true}}
          @disabled={{true}}
          id="clickable"
          {{on "click" onClick}}
        />
        <Card @disabled={{true}} id="plain" />
      </template>,
    );

    assert
      .dom('#clickable')
      .hasClass('cds--card--disabled')
      .doesNotHaveClass('cds--card--clickable')
      .hasAttribute('tabindex', '-1')
      .hasAttribute('aria-disabled', 'true');
    assert
      .dom('#clickable .cds--card__clickable-footer')
      .exists('the muted footer stays');
    assert
      .dom('#plain')
      .hasAttribute('aria-disabled', 'true')
      .doesNotHaveAttribute('role');

    (find('#clickable') as HTMLElement).click();
    await triggerKeyEvent('#clickable', 'keydown', 'Enter');
    assert.strictEqual(clicks, 0);
  });

  test("a header's decorator gives the card its AI styles, and keeps its clicks", async function (assert) {
    let clicks = 0;
    const onClick = () => clicks++;
    await render(
      <template>
        <Card @clickable={{true}} {{on "click" onClick}} as |card|>
          <card.Header>
            <:default><card.Title>Title</card.Title></:default>
            <:decorator as |AILabel|><AILabel /></:decorator>
          </card.Header>
        </Card>
      </template>,
    );

    assert.dom('.cds--card').hasClass('cds--card--has-ai-label');
    assert
      .dom('.cds--card__header > .cds--card__decorator')
      .hasAttribute('role', 'presentation');
    await click('.cds--card__decorator button');
    assert.strictEqual(
      clicks,
      0,
      "the decorator's click doesn't reach the card",
    );
  });

  test('the title truncates, with icons around it', async function (assert) {
    await render(
      <template>
        <Card as |card|>
          <card.Title
            @titleTruncate={{2}}
            @maxWidth="10rem"
            @label="Label"
            @labelTruncate={{true}}
            @description="Description"
            @descriptionTruncate={{3}}
          >
            <:default>Title</:default>
            <:titleStart>Start</:titleStart>
            <:titleEnd>End</:titleEnd>
          </card.Title>
        </Card>
      </template>,
    );

    const row = find('.cds--card__title-text-row') as HTMLElement;
    assert
      .dom(row)
      .hasClass('cds--card__title-text-row--truncate-multi')
      .hasClass('cds--card__title-text-row--with-start-icon')
      .hasClass('cds--card__title-text-row--with-end-icon');
    assert.strictEqual(
      row.style.getPropertyValue('--cds--card--title-max-width'),
      '10rem',
    );
    assert.strictEqual(
      row.style.getPropertyValue('--cds--card--title-line-clamp'),
      '2',
    );
    assert.dom('.cds--card__title-start-icon').hasText('Start');
    assert.dom('.cds--card__title-end-icon').hasText('End');
    assert.dom('.cds--card__label').hasClass('cds--card__label--truncate');
    const description = find('.cds--card__description') as HTMLElement;
    assert.dom(description).hasClass('cds--card__description--truncate-multi');
    assert.strictEqual(
      description.style.getPropertyValue('--cds--card--description-line-clamp'),
      '3',
    );
  });

  test('@href makes the card a clickable link, unless it is disabled', async function (assert) {
    await render(
      <template>
        <Card @href="/reports" @clickable={{true}} id="link" as |card|>
          <card.Body>Reports</card.Body>
          <card.Footer>Own footer</card.Footer>
        </Card>
        <Card @href="/reports" @disabled={{true}} id="disabled" />
      </template>,
    );

    assert
      .dom('a#link')
      .hasClass('cds--card')
      .hasClass('cds--card--clickable')
      .hasAttribute('href', '/reports')
      .doesNotHaveAttribute('role')
      .doesNotHaveAttribute('tabindex');
    assert.dom('#link > .cds--card__clickable-footer').exists();
    assert
      .dom('#link .cds--card__footer')
      .doesNotExist('a link card has its own footer');
    assert
      .dom('div#disabled')
      .hasClass('cds--card--disabled')
      .hasAttribute('role', 'link')
      .hasAttribute('tabindex', '-1')
      .hasAttribute('aria-disabled', 'true');
  });

  test('Content wraps only in a horizontal card', async function (assert) {
    await render(
      <template>
        <Card id="vertical" as |card|>
          <card.Content><card.Body>Body</card.Body></card.Content>
        </Card>
      </template>,
    );

    assert.dom('#vertical > .cds--card__body').exists();
    assert.dom('.cds--card__content').doesNotExist();
  });

  test('the card loses its AI styles with its decorator', async function (assert) {
    const state = trackedObject({ decorated: true });
    await render(
      <template>
        <Card as |card|>
          {{#if state.decorated}}
            <card.Header>
              <:default>Title</:default>
              <:decorator as |AILabel|><AILabel /></:decorator>
            </card.Header>
          {{/if}}
        </Card>
      </template>,
    );
    assert.dom('.cds--card').hasClass('cds--card--has-ai-label');

    state.decorated = false;
    await rerender();
    assert.dom('.cds--card').doesNotHaveClass('cds--card--has-ai-label');
  });
});

module('Integration | Component | Card > with @route', function (hooks) {
  setupApplicationTest(hooks);
  setupRoutes(hooks);

  test('the card links to its route', async function (assert) {
    await visitWith(
      this,
      <template>
        <Card @route="user" @models={{array 7}} as |card|>
          <card.Body>User</card.Body>
        </Card>
      </template>,
    );

    assert.dom('a.cds--card').hasAttribute('href', '/users/7');
    await click('a.cds--card');
    const router = this.owner.lookup('service:router');
    assert.strictEqual(router.currentURL, '/users/7');
  });
});
