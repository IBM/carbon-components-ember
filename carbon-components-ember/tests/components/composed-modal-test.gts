import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, find, focus, render, settled } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import ComposedModal from '#src/components/composed-modal.gts';

const DIALOG = 'dialog.cds--modal';

function spy<T = Event>() {
  const calls: T[] = [];
  return { calls, call: (value: T) => void calls.push(value) };
}

const dialog = () => find(DIALOG) as HTMLDialogElement;

// A click on the overlay, around the modal's box.
function clickOverlay() {
  dialog().dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
  dialog().dispatchEvent(
    new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }),
  );
  return settled();
}

// What the browser fires on Escape: no synthetic keydown triggers it.
function cancel() {
  const event = new Event('cancel', { cancelable: true });
  dialog().dispatchEvent(event);
  return settled();
}

// As on a second Escape, the browser closes it without a `cancel` it lets us
// prevent.
async function closeAnyway() {
  dialog().dispatchEvent(new Event('cancel', { cancelable: false }));
  const closed = new Promise((resolve) =>
    dialog().addEventListener('close', resolve, { once: true }),
  );
  dialog().close();
  await closed;
  await settled();
}

module('Integration | Component | ComposedModal', function (hooks) {
  setupRenderingTest(hooks);

  module('renders as expected', function () {
    test('puts class and other attributes on the dialog, and @containerClassName on the container', async function (assert) {
      await render(
        <template>
          <ComposedModal
            @open={{true}}
            @containerClassName="custom-container"
            class="custom-class"
            data-test-modal
            as |ModalHeader ModalBody|
          >
            <ModalHeader @title="Title" />
            <ModalBody class="custom-body">Content</ModalBody>
          </ComposedModal>
        </template>,
      );

      assert
        .dom(DIALOG)
        .hasClass('custom-class')
        .hasClass('is-visible')
        .hasAttribute('data-test-modal');
      assert.dom('.cds--modal-container').hasClass('custom-container');
      assert.dom('.cds--modal-content').hasClass('custom-body');
    });

    test("is named after its header's label", async function (assert) {
      await render(
        <template>
          <ComposedModal @open={{true}} as |ModalHeader|>
            <ModalHeader
              @label="Account resources"
              @title="Add a custom domain"
            />
          </ComposedModal>
        </template>,
      );

      assert.dom(DIALOG).hasAttribute('aria-label', 'Account resources');
      assert
        .dom('.cds--modal-header__label')
        .hasClass('cds--type-delta')
        .hasText('Account resources');
      assert
        .dom('.cds--modal-header__heading')
        .hasClass('cds--type-beta')
        .hasText('Add a custom domain');
    });

    test('its own aria-label wins', async function (assert) {
      await render(
        <template>
          <ComposedModal
            @open={{true}}
            aria-label="Composed Modal"
            as |ModalHeader|
          >
            <ModalHeader @label="Account resources" />
          </ComposedModal>
        </template>,
      );

      assert.dom(DIALOG).hasAttribute('aria-label', 'Composed Modal');
    });

    test('passes aria-labelledby and aria-describedby to the dialog', async function (assert) {
      await render(
        <template>
          <ComposedModal
            @open={{true}}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            as |ModalHeader ModalBody|
          >
            <ModalHeader />
            <ModalBody>
              <h2 id="modal-title">Title</h2>
              <p id="modal-description">Description</p>
            </ModalBody>
          </ComposedModal>
        </template>,
      );

      assert
        .dom(DIALOG)
        .hasAttribute('aria-labelledby', 'modal-title')
        .hasAttribute('aria-describedby', 'modal-description');
    });

    test('@danger makes the primary button a danger button', async function (assert) {
      await render(
        <template>
          <ComposedModal
            @open={{true}}
            @danger={{true}}
            as |ModalHeader ModalBody ModalFooter|
          >
            <ModalHeader />
            <ModalBody />
            <ModalFooter
              @primaryButtonText="Delete"
              @secondaryButtonText="Cancel"
            />
          </ComposedModal>
        </template>,
      );

      assert.dom(DIALOG).hasClass('cds--modal--danger');
      assert.dom('.cds--modal-footer .cds--btn--danger').hasText('Delete');
    });

    test('@size and @isFullWidth style the container', async function (assert) {
      await render(
        <template>
          <ComposedModal @open={{true}} @size="sm" @isFullWidth={{true}} />
        </template>,
      );

      assert
        .dom('.cds--modal-container')
        .hasClass('cds--modal-container--sm')
        .hasClass('cds--modal-container--full-width');
    });

    test('an active @loadingStatus disables the buttons and shows the status', async function (assert) {
      await render(
        <template>
          <ComposedModal @open={{true}} as |ModalHeader ModalBody ModalFooter|>
            <ModalHeader />
            <ModalBody />
            <ModalFooter
              @primaryButtonText="Add"
              @secondaryButtonText="Cancel"
              @loadingStatus="active"
              @loadingDescription="Adding"
            />
          </ComposedModal>
        </template>,
      );

      assert.dom('.cds--btn--secondary').isDisabled();
      assert.dom('.cds--btn--loading').isDisabled();
      assert.dom('.cds--modal-footer').hasAttribute('aria-busy', 'true');
      assert.dom('.cds--inline-loading__text').hasText('Adding');
    });

    test('renders the decorator block, with an AILabel already set up', async function (assert) {
      await render(
        <template>
          <ComposedModal @open={{true}}>
            <:decorator as |AILabel|><AILabel /></:decorator>
          </ComposedModal>
        </template>,
      );

      assert.dom(DIALOG).hasClass('cds--modal--decorator');
      assert
        .dom(
          '.cds--modal-container-body > .cds--modal--inner__decorator .cds--ai-label',
        )
        .exists();
    });

    test('two secondary buttons make a three-button footer', async function (assert) {
      const secondaryButtons = [
        { buttonText: 'Keep both' },
        { buttonText: 'Cancel' },
      ];
      await render(
        <template>
          <ComposedModal @open={{true}} as |ModalHeader ModalBody ModalFooter|>
            <ModalHeader />
            <ModalBody />
            <ModalFooter
              @primaryButtonText="Replace"
              @secondaryButtons={{secondaryButtons}}
            />
          </ComposedModal>
        </template>,
      );

      assert
        .dom('.cds--modal-footer')
        .hasClass('cds--modal-footer--three-button');
      assert.dom('.cds--btn--secondary').exists({ count: 2 });
    });
  });

  module('parts coming and going', function () {
    test('once its footer is gone, it is passive', async function (assert) {
      const footer = tracked(true);
      await render(
        <template>
          <ComposedModal @open={{true}} as |ModalHeader ModalBody ModalFooter|>
            <ModalHeader />
            <ModalBody />
            {{#if footer.value}}
              <ModalFooter @primaryButtonText="Add" />
            {{/if}}
          </ComposedModal>
        </template>,
      );

      await clickOverlay();
      assert.true(dialog().open, 'a modal with a footer stays open');

      footer.value = false;
      await settled();
      await clickOverlay();
      assert.false(dialog().open);
    });

    test("its name follows its header's label, else its title", async function (assert) {
      const label = tracked<string | undefined>('Account resources');
      await render(
        <template>
          <ComposedModal @open={{true}} as |ModalHeader|>
            <ModalHeader @label={{label.value}} @title="Add a custom domain" />
          </ComposedModal>
        </template>,
      );

      assert.dom(DIALOG).hasAttribute('aria-label', 'Account resources');
      label.value = undefined;
      await settled();
      assert.dom(DIALOG).hasAttribute('aria-label', 'Add a custom domain');
    });

    test('an empty @secondaryButtons renders no secondary button', async function (assert) {
      const secondaryButtons: [] = [];
      await render(
        <template>
          <ComposedModal @open={{true}} as |ModalHeader ModalBody ModalFooter|>
            <ModalHeader />
            <ModalBody />
            <ModalFooter
              @primaryButtonText="Add"
              @secondaryButtonText="Cancel"
              @secondaryButtons={{secondaryButtons}}
            />
          </ComposedModal>
        </template>,
      );

      assert.dom('.cds--btn--secondary').doesNotExist();
    });
  });

  module('ModalBody', function () {
    test('focus moving to a field in it brings the field into view', async function (assert) {
      await render(
        <template>
          <ComposedModal @open={{true}} as |ModalHeader ModalBody|>
            <ModalHeader />
            <ModalBody @hasScrollingContent={{true}}>
              <input id="first" aria-label="First" />
              <input id="second" aria-label="Second" />
            </ModalBody>
          </ComposedModal>
        </template>,
      );

      const calls: unknown[] = [];
      (find('#second') as HTMLElement).scrollIntoView = (options) =>
        void calls.push(options);
      await focus('#first');
      await focus('#second');
      assert.deepEqual(calls, [{ block: 'center' }]);
    });

    test("scrolling content is a region named after the header's label", async function (assert) {
      await render(
        <template>
          <ComposedModal @open={{true}} as |ModalHeader ModalBody|>
            <ModalHeader
              @label="Account resources"
              @title="Add a custom domain"
            />
            <ModalBody @hasScrollingContent={{true}}>Content</ModalBody>
          </ComposedModal>
        </template>,
      );

      const labelId = find('.cds--modal-header__label')!.id;
      assert
        .dom('.cds--modal-content')
        .hasClass('cds--modal-scroll-content')
        .hasAttribute('role', 'region')
        .hasAttribute('tabindex', '0')
        .hasAttribute('aria-labelledby', labelId);
    });

    test('without a label, it is named after the title', async function (assert) {
      await render(
        <template>
          <ComposedModal @open={{true}} as |ModalHeader ModalBody|>
            <ModalHeader @title="Add a custom domain" />
            <ModalBody @hasScrollingContent={{true}}>Content</ModalBody>
          </ComposedModal>
        </template>,
      );

      const titleId = find('.cds--modal-header__heading')!.id;
      assert
        .dom('.cds--modal-content')
        .hasAttribute('aria-labelledby', titleId);
    });

    test('its own aria-labelledby wins', async function (assert) {
      await render(
        <template>
          <ComposedModal @open={{true}} as |ModalHeader ModalBody|>
            <ModalHeader @label="Account resources" />
            <ModalBody
              @hasScrollingContent={{true}}
              aria-labelledby="custom-label"
            >Content</ModalBody>
          </ComposedModal>
        </template>,
      );

      assert
        .dom('.cds--modal-content')
        .hasAttribute('aria-labelledby', 'custom-label');
    });

    test('content that does not scroll is not a region', async function (assert) {
      await render(
        <template>
          <ComposedModal @open={{true}} as |ModalHeader ModalBody|>
            <ModalHeader @label="Account resources" />
            <ModalBody @hasForm={{true}}>Content</ModalBody>
          </ComposedModal>
        </template>,
      );

      assert
        .dom('.cds--modal-content')
        .hasClass('cds--modal-content--with-form')
        .doesNotHaveClass('cds--modal-scroll-content')
        .doesNotHaveAttribute('role')
        .doesNotHaveAttribute('tabindex')
        .doesNotHaveAttribute('aria-labelledby');
    });
  });

  module('focus', function () {
    test('a danger modal ignores @selectorPrimaryFocus', async function (assert) {
      await render(
        <template>
          <ComposedModal
            @open={{true}}
            @danger={{true}}
            @selectorPrimaryFocus="#domain"
            as |ModalHeader ModalBody ModalFooter|
          >
            <ModalHeader />
            <ModalBody><input id="domain" aria-label="Domain" /></ModalBody>
            <ModalFooter
              @primaryButtonText="Delete"
              @secondaryButtonText="Cancel"
            />
          </ComposedModal>
        </template>,
      );

      assert.dom('.cds--btn--secondary').isFocused();
    });

    test('a danger modal with no secondary button focuses its primary button', async function (assert) {
      await render(
        <template>
          <ComposedModal
            @open={{true}}
            @danger={{true}}
            as |ModalHeader ModalBody ModalFooter|
          >
            <ModalHeader />
            <ModalBody />
            <ModalFooter @primaryButtonText="Delete" />
          </ComposedModal>
        </template>,
      );

      assert.dom('.cds--btn--danger').isFocused();
    });

    test('once its primary button is gone, it focuses the close button', async function (assert) {
      const open = tracked(true);
      const text = tracked<string | undefined>('Add');
      await render(
        <template>
          <ComposedModal
            @open={{open.value}}
            as |ModalHeader ModalBody ModalFooter|
          >
            <ModalHeader />
            <ModalBody />
            <ModalFooter @primaryButtonText={{text.value}} />
          </ComposedModal>
        </template>,
      );

      text.value = undefined;
      open.value = false;
      await settled();
      open.value = true;
      await settled();
      assert.dom('.cds--modal-close').isFocused();
    });

    test('focuses [data-modal-primary-focus] when it opens', async function (assert) {
      await render(
        <template>
          <ComposedModal @open={{true}} as |ModalHeader ModalBody ModalFooter|>
            <ModalHeader />
            <ModalBody><input data-modal-primary-focus /></ModalBody>
            <ModalFooter @primaryButtonText="Add" />
          </ComposedModal>
        </template>,
      );

      assert.dom('[data-modal-primary-focus]').isFocused();
    });

    test('focuses @selectorPrimaryFocus when it opens', async function (assert) {
      await render(
        <template>
          <ComposedModal
            @open={{true}}
            @selectorPrimaryFocus="#domain"
            as |ModalHeader ModalBody ModalFooter|
          >
            <ModalHeader />
            <ModalBody><input id="domain" /></ModalBody>
            <ModalFooter @primaryButtonText="Add" />
          </ComposedModal>
        </template>,
      );

      assert.dom('#domain').isFocused();
    });

    test('focuses the primary button otherwise', async function (assert) {
      await render(
        <template>
          <ComposedModal @open={{true}} as |ModalHeader ModalBody ModalFooter|>
            <ModalHeader />
            <ModalBody />
            <ModalFooter
              @primaryButtonText="Add"
              @secondaryButtonText="Cancel"
            />
          </ComposedModal>
        </template>,
      );

      assert.dom('.cds--btn--primary:not(.cds--modal-close)').isFocused();
    });

    test('a danger modal focuses its secondary button', async function (assert) {
      await render(
        <template>
          <ComposedModal
            @open={{true}}
            @danger={{true}}
            as |ModalHeader ModalBody ModalFooter|
          >
            <ModalHeader />
            <ModalBody><input data-modal-primary-focus /></ModalBody>
            <ModalFooter
              @primaryButtonText="Delete"
              @secondaryButtonText="Cancel"
            />
          </ComposedModal>
        </template>,
      );

      assert.dom('.cds--btn--secondary').isFocused();
    });

    test('with nothing else to focus, it focuses the close button', async function (assert) {
      await render(
        <template>
          <ComposedModal @open={{true}} as |ModalHeader ModalBody|>
            <ModalHeader @title="Signed out" />
            <ModalBody>Content</ModalBody>
          </ComposedModal>
        </template>,
      );

      assert.dom('.cds--modal-close').isFocused();
    });
  });

  module('closing', function () {
    test('Escape leaves it open when @onClose returns false', async function (assert) {
      const onClose = () => false;
      await render(
        <template>
          <ComposedModal @open={{true}} @onClose={{onClose}} as |ModalHeader|>
            <ModalHeader />
          </ComposedModal>
        </template>,
      );

      await cancel();
      assert.true(dialog().open);
    });

    test('when the browser closes it anyway, it calls @onClose and stays closed', async function (assert) {
      const onClose = spy();
      await render(
        <template>
          <ComposedModal
            @open={{true}}
            @onClose={{onClose.call}}
            as |ModalHeader|
          >
            <ModalHeader />
          </ComposedModal>
        </template>,
      );

      await closeAnyway();
      assert.strictEqual(onClose.calls.length, 1);
      assert.false(dialog().open);
    });

    test('when the browser closes it anyway and @onClose returns false, it opens again', async function (assert) {
      const onClose = () => false;
      await render(
        <template>
          <ComposedModal @open={{true}} @onClose={{onClose}} as |ModalHeader|>
            <ModalHeader />
          </ComposedModal>
        </template>,
      );

      await closeAnyway();
      assert.true(dialog().open);
    });

    test('the close button calls @onClose and @buttonOnClick, and closes it', async function (assert) {
      const onClose = spy();
      const buttonOnClick = spy<MouseEvent>();
      await render(
        <template>
          <ComposedModal
            @open={{true}}
            @onClose={{onClose.call}}
            as |ModalHeader|
          >
            <ModalHeader @buttonOnClick={{buttonOnClick.call}} />
          </ComposedModal>
        </template>,
      );

      await click('.cds--modal-close');
      assert.strictEqual(onClose.calls.length, 1);
      assert.strictEqual(buttonOnClick.calls.length, 1);
      assert.false(dialog().open);
      assert.dom(DIALOG).doesNotHaveClass('is-visible');
    });

    test('it stays open when @onClose returns false', async function (assert) {
      const onClose = () => false;
      await render(
        <template>
          <ComposedModal @open={{true}} @onClose={{onClose}} as |ModalHeader|>
            <ModalHeader />
          </ComposedModal>
        </template>,
      );

      await click('.cds--modal-close');
      assert.true(dialog().open);
    });

    test('Escape closes it', async function (assert) {
      const onClose = spy();
      await render(
        <template>
          <ComposedModal
            @open={{true}}
            @onClose={{onClose.call}}
            as |ModalHeader|
          >
            <ModalHeader />
          </ComposedModal>
        </template>,
      );

      await cancel();
      assert.strictEqual(onClose.calls.length, 1);
      assert.false(dialog().open);
    });

    test('it opens again when @open does', async function (assert) {
      const open = tracked(true);
      await render(
        <template>
          <ComposedModal @open={{open.value}} as |ModalHeader|>
            <ModalHeader />
          </ComposedModal>
        </template>,
      );

      await click('.cds--modal-close');
      assert.false(dialog().open, 'it closed itself');

      open.value = false;
      await settled();
      open.value = true;
      await settled();
      assert.true(dialog().open, 'it opened again');
    });

    test('the secondary button calls @onRequestClose and closes it; the primary one submits', async function (assert) {
      const onClose = spy();
      const onRequestClose = spy<MouseEvent>();
      const onRequestSubmit = spy<MouseEvent>();
      await render(
        <template>
          <ComposedModal
            @open={{true}}
            @onClose={{onClose.call}}
            as |ModalHeader ModalBody ModalFooter|
          >
            <ModalHeader />
            <ModalBody />
            <ModalFooter
              @primaryButtonText="Add"
              @secondaryButtonText="Cancel"
              @onRequestClose={{onRequestClose.call}}
              @onRequestSubmit={{onRequestSubmit.call}}
            />
          </ComposedModal>
        </template>,
      );

      await click('.cds--btn--primary:not(.cds--modal-close)');
      assert.strictEqual(onRequestSubmit.calls.length, 1);
      assert.true(dialog().open, 'submitting leaves it open');

      await click('.cds--btn--secondary');
      assert.strictEqual(onRequestClose.calls.length, 1);
      assert.strictEqual(onClose.calls.length, 1);
      assert.false(dialog().open);
    });

    test('a secondary button without its own onClick closes it', async function (assert) {
      const kept = spy<MouseEvent>();
      const secondaryButtons = [
        { buttonText: 'Keep both', onClick: kept.call },
        { buttonText: 'Cancel' },
      ];
      await render(
        <template>
          <ComposedModal @open={{true}} as |ModalHeader ModalBody ModalFooter|>
            <ModalHeader />
            <ModalBody />
            <ModalFooter
              @primaryButtonText="Replace"
              @secondaryButtons={{secondaryButtons}}
            />
          </ComposedModal>
        </template>,
      );

      await click('.cds--btn--secondary:first-child');
      assert.strictEqual(kept.calls.length, 1);
      assert.true(dialog().open);

      await click('.cds--btn--secondary:nth-child(2)');
      assert.false(dialog().open);
    });
  });

  module('a click outside it', function () {
    test('closes a passive modal by default', async function (assert) {
      await render(
        <template>
          <ComposedModal @open={{true}} as |ModalHeader ModalBody|>
            <ModalHeader />
            <ModalBody />
          </ComposedModal>
        </template>,
      );

      await clickOverlay();
      assert.false(dialog().open);
    });

    test('does not close a passive modal with @preventCloseOnClickOutside', async function (assert) {
      await render(
        <template>
          <ComposedModal
            @open={{true}}
            @preventCloseOnClickOutside={{true}}
            as |ModalHeader ModalBody|
          >
            <ModalHeader />
            <ModalBody />
          </ComposedModal>
        </template>,
      );

      await clickOverlay();
      assert.true(dialog().open);
    });

    test('does not close a modal with a footer by default', async function (assert) {
      await render(
        <template>
          <ComposedModal @open={{true}} as |ModalHeader ModalBody ModalFooter|>
            <ModalHeader />
            <ModalBody />
            <ModalFooter @primaryButtonText="Add" />
          </ComposedModal>
        </template>,
      );

      await clickOverlay();
      assert.true(dialog().open);
    });

    test('closes a modal with a footer when @preventCloseOnClickOutside is false', async function (assert) {
      await render(
        <template>
          <ComposedModal
            @open={{true}}
            @preventCloseOnClickOutside={{false}}
            as |ModalHeader ModalBody ModalFooter|
          >
            <ModalHeader />
            <ModalBody />
            <ModalFooter @primaryButtonText="Add" />
          </ComposedModal>
        </template>,
      );

      await clickOverlay();
      assert.false(dialog().open);
    });
  });
});
