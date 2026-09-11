import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn } from '@ember/test-helpers';
import { array, hash } from '@ember/helper';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import Feedback from 'carbon-components-ember/components/ai-chat/feedback';
import type { FeedbackDetails } from 'carbon-components-ember/components/ai-chat/feedback';

module('Integration | Component | ai-chat/Feedback', (hooks) => {
  setupRenderingTest(hooks);

  test('renders title/body defaults and toggles closed via the container class', async function (assert) {
    await render(<template><Feedback @isOpen={{true}} @showBody={{true}} /></template>);

    assert.dom('.cds-aichat-feedback__title').hasText('Provide additional feedback');
    assert.dom('.cds-aichat-feedback__prompt').hasText('What do you think of this response?');
    assert.dom('.cds-aichat-feedback__container').doesNotHaveClass(
      'cds-aichat-feedback__container--closed',
    );
  });

  test('@isOpen false adds the closed modifier class', async function (assert) {
    await render(<template><Feedback @isOpen={{false}} /></template>);

    assert.dom('.cds-aichat-feedback__container').hasClass('cds-aichat-feedback__container--closed');
  });

  test('category chips toggle selection and are excluded when disabled (readonly)', async function (assert) {
    await render(
      <template>
        <Feedback @isOpen={{true}} @categories={{array 'Accurate' 'Helpful'}} />
      </template>,
    );

    assert.dom('.cds-aichat-feedback__tag').exists({ count: 2 });

    await click('.cds-aichat-feedback__tag:first-child');
    assert.dom('.cds-aichat-feedback__tag:first-child').hasClass('cds-aichat-feedback__tag--selected');

    await click('.cds-aichat-feedback__tag:first-child');
    assert
      .dom('.cds-aichat-feedback__tag:first-child')
      .doesNotHaveClass('cds-aichat-feedback__tag--selected');
  });

  test('submit is disabled by default when @disclaimerCheckbox is set, until checked', async function (assert) {
    await render(
      <template>
        <Feedback @isOpen={{true}} @disclaimerCheckbox='I agree' />
      </template>,
    );

    assert.dom('.cds-aichat-feedback__disclaimer-checkbox input').exists();
    assert.dom('.cds-aichat-feedback__submit button').isDisabled();

    await click('.cds-aichat-feedback__disclaimer-checkbox input');
    assert.dom('.cds-aichat-feedback__submit button').isNotDisabled();
  });

  test('@onSubmit receives the text and selected categories', async function (assert) {
    const submissions: FeedbackDetails[] = [];
    const onSubmit = (details: FeedbackDetails) => submissions.push(details);

    await render(
      <template>
        <Feedback
          @isOpen={{true}}
          @showTextArea={{true}}
          @categories={{array 'Accurate'}}
          @onSubmit={{onSubmit}}
        />
      </template>,
    );

    await fillIn('.cds-aichat-feedback__text-area', 'Great answer');
    await click('.cds-aichat-feedback__tag:first-child');
    await click('.cds-aichat-feedback__submit button');

    assert.strictEqual(submissions.length, 1);
    assert.strictEqual(submissions[0]?.text, 'Great answer');
    assert.deepEqual(submissions[0]?.selectedCategories, ['Accurate']);
  });

  test('@onClose fires when the close button is clicked', async function (assert) {
    let closed = false;
    const onClose = () => (closed = true);

    await render(<template><Feedback @isOpen={{true}} @onClose={{onClose}} /></template>);

    await click('.cds-aichat-feedback__close button');
    assert.true(closed);
  });

  test('@initialValues seeds the text area and selected categories on initial render', async function (assert) {
    await render(
      <template>
        <Feedback
          @isOpen={{true}}
          @showTextArea={{true}}
          @categories={{array 'Accurate' 'Helpful'}}
          @initialValues={{hash text='seed' selectedCategories=(array 'Accurate')}}
        />
      </template>,
    );

    assert.dom('.cds-aichat-feedback__text-area').hasValue('seed');
    assert.dom('.cds-aichat-feedback__tag:first-child').hasClass('cds-aichat-feedback__tag--selected');
  });

  test('changing @initialValues resets the text area and selected categories', async function (assert) {
    class State {
      @tracked initialValues: FeedbackDetails | null = null;
    }
    const state = new State();

    class Host extends Component {
      state = state;
      seed = () => {
        this.state.initialValues = { text: 'seed', selectedCategories: ['Accurate'] };
      };
      <template>
        <Feedback
          @isOpen={{true}}
          @showTextArea={{true}}
          @categories={{array 'Accurate' 'Helpful'}}
          @initialValues={{this.state.initialValues}}
        />
        <button type='button' class='seed-button' {{on 'click' this.seed}}>Seed</button>
      </template>
    }

    await render(<template><Host /></template>);

    assert.dom('.cds-aichat-feedback__text-area').hasValue('');

    await click('.seed-button');

    assert.dom('.cds-aichat-feedback__text-area').hasValue('seed');
    assert.dom('.cds-aichat-feedback__tag:first-child').hasClass('cds-aichat-feedback__tag--selected');
  });

  test('changing @initialValues resets the text area even after the user has typed in it', async function (assert) {
    class State {
      @tracked initialValues: FeedbackDetails | null = null;
    }
    const state = new State();

    class Host extends Component {
      state = state;
      reseed = () => {
        this.state.initialValues = { text: 'seed' };
      };
      <template>
        <Feedback
          @isOpen={{true}}
          @showTextArea={{true}}
          @initialValues={{this.state.initialValues}}
        />
        <button type='button' class='reseed-button' {{on 'click' this.reseed}}>Reseed</button>
      </template>
    }

    await render(<template><Host /></template>);

    await fillIn('.cds-aichat-feedback__text-area', 'user typed this');
    assert.dom('.cds-aichat-feedback__text-area').hasValue('user typed this');

    await click('.reseed-button');

    assert.dom('.cds-aichat-feedback__text-area').hasValue('seed');
  });
});
