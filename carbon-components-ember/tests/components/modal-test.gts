import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  click,
  fillIn,
  find,
  focus,
  render,
  rerender,
  settled,
  triggerKeyEvent,
} from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import Modal from '#src/components/modal.gts';
import ActionableNotification from '#src/components/notification/actionable-notification.gts';
import Popover from '#src/components/popover.gts';
import Portal from '#src/components/portal.gts';
import Toggletip from '#src/components/toggletip.gts';

const DIALOG = 'dialog.cds--modal';

function spy<T = Event>() {
  const calls: T[] = [];
  return { calls, call: (value: T) => void calls.push(value) };
}

const dialog = () => find(DIALOG) as HTMLDialogElement;

// A click on the overlay, around the modal's box.
function clickOverlay({ pressInside = false } = {}) {
  const target = pressInside
    ? find('.cds--modal-content')!
    : (dialog() as Element);
  target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
  dialog().dispatchEvent(
    new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }),
  );
  return settled();
}

// What the browser fires on Escape: no synthetic keydown triggers it.
function cancel({ cancelable = true } = {}) {
  const event = new Event('cancel', { cancelable });
  dialog().dispatchEvent(event);
  return event;
}

module('Integration | Component | Modal', function (hooks) {
  setupRenderingTest(hooks);

  module('renders as expected', function () {
    test('should put class and other attributes on the dialog', async function (assert) {
      await render(
        <template>
          <Modal @open={{true}} class="custom-class" data-test-modal />
        </template>,
      );

      assert
        .dom(DIALOG)
        .hasClass('custom-class')
        .hasAttribute('data-test-modal');
    });

    test('should render @modalLabel and @modalHeading', async function (assert) {
      await render(
        <template>
          <Modal
            @open={{true}}
            @modalLabel="Account resources"
            @modalHeading="Add a custom domain"
          />
        </template>,
      );

      assert.dom('.cds--modal-header__label').hasText('Account resources');
      assert.dom('.cds--modal-header__heading').hasText('Add a custom domain');
      assert.dom(DIALOG).hasAttribute('aria-label', 'Account resources');
    });

    test('should not be a passive modal by default', async function (assert) {
      await render(<template><Modal @open={{true}} /></template>);

      assert.dom('.cds--modal-footer').exists();
      assert.dom(DIALOG).hasClass('cds--modal-tall');
    });

    test('should be a passive modal with @passiveModal', async function (assert) {
      await render(
        <template><Modal @open={{true}} @passiveModal={{true}} /></template>,
      );

      assert.dom('.cds--modal-footer').doesNotExist();
      assert.dom(DIALOG).doesNotHaveClass('cds--modal-tall');
    });

    test('should set @id on the dialog', async function (assert) {
      await render(<template><Modal @open={{true}} @id="modal-1" /></template>);

      assert.dom(DIALOG).hasAttribute('id', 'modal-1');
    });

    test('should keep the close icon out of the accessibility tree', async function (assert) {
      await render(<template><Modal @open={{true}} /></template>);

      assert.dom('.cds--modal-close__icon').hasAttribute('aria-hidden', 'true');
      assert.dom('.cds--modal-close').hasAttribute('aria-label', 'Close');
    });

    test('@closeButtonLabel names the close button', async function (assert) {
      await render(
        <template>
          <Modal @open={{true}} @closeButtonLabel="Dismiss" />
        </template>,
      );

      assert.dom('.cds--modal-close').hasAttribute('aria-label', 'Dismiss');
    });

    test('enables the primary button by default, and @primaryButtonDisabled disables it', async function (assert) {
      const disabled = tracked(false);
      await render(
        <template>
          <Modal
            @open={{true}}
            @primaryButtonText="Add"
            @primaryButtonDisabled={{disabled.value}}
          />
        </template>,
      );

      assert.dom('.cds--modal-footer .cds--btn--primary').isNotDisabled();
      disabled.value = true;
      await settled();
      assert.dom('.cds--modal-footer .cds--btn--primary').isDisabled();
    });

    test('should render the button texts', async function (assert) {
      await render(
        <template>
          <Modal
            @open={{true}}
            @primaryButtonText="Add"
            @secondaryButtonText="Cancel"
          />
        </template>,
      );

      assert.dom('.cds--modal-footer .cds--btn--primary').hasText('Add');
      assert.dom('.cds--modal-footer .cds--btn--secondary').hasText('Cancel');
    });

    test('should support two secondary buttons', async function (assert) {
      const keep = spy<MouseEvent>();
      const rename = spy<MouseEvent>();
      const secondaryButtons = [
        { buttonText: 'Keep both', onClick: keep.call },
        { buttonText: 'Rename', onClick: rename.call },
      ];
      await render(
        <template>
          <Modal
            @open={{true}}
            @primaryButtonText="Replace"
            @secondaryButtons={{secondaryButtons}}
          />
        </template>,
      );

      assert
        .dom('.cds--modal-footer')
        .hasClass('cds--modal-footer--three-button');
      assert
        .dom('.cds--modal-footer .cds--btn--secondary')
        .exists({ count: 2 });
      await click('.cds--modal-footer .cds--btn--secondary:nth-child(2)');
      assert.strictEqual(rename.calls.length, 1);
      assert.strictEqual(keep.calls.length, 0);
    });

    test('@alert makes it an alertdialog described by its body', async function (assert) {
      await render(
        <template><Modal @open={{true}} @alert={{true}} /></template>,
      );

      assert.dom(DIALOG).hasAttribute('role', 'alertdialog');
      const bodyId = find('.cds--modal-content')!.id;
      assert.dom(DIALOG).hasAttribute('aria-describedby', bodyId);
    });

    test('a passive @alert marks its container as an alert', async function (assert) {
      await render(
        <template>
          <Modal @open={{true}} @alert={{true}} @passiveModal={{true}} />
        </template>,
      );

      assert.dom(DIALOG).doesNotHaveAttribute('role');
      assert.dom('.cds--modal-container').hasAttribute('role', 'alert');
    });

    test('@danger renders a danger button and class', async function (assert) {
      await render(
        <template>
          <Modal @open={{true}} @danger={{true}} @primaryButtonText="Delete" />
        </template>,
      );

      assert.dom(DIALOG).hasClass('cds--modal--danger');
      assert
        .dom('.cds--modal-footer .cds--btn:last-child')
        .hasClass('cds--btn--danger');
    });

    test('a danger modal has no danger description unless given one', async function (assert) {
      const description = tracked<string | undefined>(undefined);
      await render(
        <template>
          <Modal
            @open={{true}}
            @danger={{true}}
            @primaryButtonText="Delete"
            @dangerDescription={{description.value}}
          />
        </template>,
      );

      assert.dom('.cds--modal-footer .cds--visually-hidden').doesNotExist();
      description.value = 'danger';
      await settled();
      const primary = find('.cds--btn--danger')!;
      const hidden = find('.cds--btn--danger .cds--visually-hidden')!;
      assert.dom(hidden).hasText('danger');
      assert.dom(primary).hasAttribute('aria-describedby', hidden.id);
    });

    test('an active @loadingStatus disables the buttons and shows the status', async function (assert) {
      await render(
        <template>
          <Modal
            @open={{true}}
            @primaryButtonText="Save"
            @secondaryButtonText="Cancel"
            @loadingStatus="active"
            @loadingDescription="Saving..."
          />
        </template>,
      );

      assert.dom('.cds--modal-footer').hasAttribute('aria-busy', 'true');
      assert
        .dom('.cds--modal-footer .cds--btn--primary')
        .isDisabled()
        .hasClass('cds--btn--loading');
      assert.dom('.cds--btn--secondary').isDisabled();
      assert
        .dom('.cds--modal-footer .cds--btn--primary .cds--inline-loading')
        .includesText('Saving...');
    });

    test('should render the decorator block', async function (assert) {
      await render(
        <template>
          <Modal @open={{true}}>
            <:decorator as |AILabel|><AILabel /></:decorator>
          </Modal>
        </template>,
      );

      assert.dom(DIALOG).hasClass('cds--modal--decorator');
      assert.dom('.cds--modal--inner__decorator .cds--ai-label').exists();
    });

    test('@size and @isFullWidth style the container', async function (assert) {
      await render(
        <template>
          <Modal @open={{true}} @size="sm" @isFullWidth={{true}} />
        </template>,
      );

      assert.dom('.cds--modal-container').hasClass('cds--modal-container--sm');
      assert
        .dom('.cds--modal-container')
        .hasClass('cds--modal-container--full-width');
    });

    test('@hasScrollingContent makes the content a labelled region', async function (assert) {
      await render(
        <template>
          <Modal
            @open={{true}}
            @modalHeading="Terms"
            @hasScrollingContent={{true}}
          />
        </template>,
      );

      const heading = find('.cds--modal-header__heading')!;
      assert
        .dom('.cds--modal-content')
        .hasClass('cds--modal-scroll-content')
        .hasAttribute('role', 'region')
        .hasAttribute('tabindex', '0')
        .hasAttribute('aria-labelledby', heading.id);
    });
  });

  module('opening and closing', function () {
    test('@open shows it as a modal dialog', async function (assert) {
      const open = tracked(false);
      await render(<template><Modal @open={{open.value}} /></template>);

      assert.false(dialog().open);
      assert.dom(DIALOG).doesNotHaveClass('is-visible');

      open.value = true;
      await settled();
      assert.true(dialog().open);
      assert.true(dialog().matches(':modal'), 'it is modal');
      assert.dom(DIALOG).hasClass('is-visible');

      open.value = false;
      await settled();
      assert.false(dialog().open);
      assert.dom(DIALOG).doesNotHaveClass('is-visible');
    });

    test('the page does not scroll while it is open', async function (assert) {
      const open = tracked(true);
      await render(<template><Modal @open={{open.value}} /></template>);

      assert.strictEqual(
        getComputedStyle(document.documentElement).overflow,
        'hidden',
      );
      open.value = false;
      await settled();
      assert.notStrictEqual(
        getComputedStyle(document.documentElement).overflow,
        'hidden',
      );
    });

    test('focuses the primary button when it opens', async function (assert) {
      await render(
        <template>
          <Modal
            @open={{true}}
            @primaryButtonText="Add"
            @secondaryButtonText="Cancel"
          />
        </template>,
      );

      assert.dom('.cds--modal-footer .cds--btn--primary').isFocused();
    });

    test('focuses [data-modal-primary-focus] when there is one', async function (assert) {
      await render(
        <template>
          <Modal @open={{true}} @primaryButtonText="Add" @danger={{true}}>
            <input aria-label="Name" data-modal-primary-focus />
          </Modal>
        </template>,
      );

      assert.dom('input').isFocused();
    });

    test('a danger modal focuses its secondary button', async function (assert) {
      await render(
        <template>
          <Modal
            @open={{true}}
            @danger={{true}}
            @primaryButtonText="Delete"
            @secondaryButtonText="Cancel"
          />
        </template>,
      );

      assert.dom('.cds--btn--secondary').isFocused();
    });

    test('a passive modal focuses its close button', async function (assert) {
      await render(
        <template><Modal @open={{true}} @passiveModal={{true}} /></template>,
      );

      assert.dom('.cds--modal-close').isFocused();
    });

    test('focus goes back to the launcher when it closes', async function (assert) {
      const open = tracked(false);
      const launch = () => (open.value = true);
      await render(
        <template>
          <button type="button" data-test-launch {{on "click" launch}}>
            Launch
          </button>
          <Modal @open={{open.value}} @primaryButtonText="Add" />
        </template>,
      );

      await click('[data-test-launch]');
      assert.dom('.cds--modal-footer .cds--btn--primary').isFocused();
      open.value = false;
      await settled();
      assert.dom('[data-test-launch]').isFocused();
    });

    test('focus goes back to the launcher when it goes away open', async function (assert) {
      const shown = tracked(false);
      const launch = () => (shown.value = true);
      await render(
        <template>
          <button type="button" data-test-launch {{on "click" launch}}>
            Launch
          </button>
          {{#if shown.value}}
            <Modal @open={{true}} @primaryButtonText="Add" />
          {{/if}}
        </template>,
      );

      await click('[data-test-launch]');
      assert.dom('.cds--modal-footer .cds--btn--primary').isFocused();
      shown.value = false;
      await settled();
      assert.dom(DIALOG).doesNotExist();
      assert.dom('[data-test-launch]').isFocused();
    });
  });

  module('requests to close', function () {
    test('the close button asks to close', async function (assert) {
      const onRequestClose = spy();
      await render(
        <template>
          <Modal @open={{true}} @onRequestClose={{onRequestClose.call}} />
        </template>,
      );

      await click('.cds--modal-close');
      assert.strictEqual(onRequestClose.calls.length, 1);
    });

    test('the secondary button asks to close, unless @onSecondarySubmit is given', async function (assert) {
      const onRequestClose = spy();
      const onSecondarySubmit = spy<MouseEvent>();
      const secondary = tracked<((event: MouseEvent) => void) | undefined>(
        undefined,
      );
      await render(
        <template>
          <Modal
            @open={{true}}
            @secondaryButtonText="Cancel"
            @onRequestClose={{onRequestClose.call}}
            @onSecondarySubmit={{secondary.value}}
          />
        </template>,
      );

      await click('.cds--btn--secondary');
      assert.strictEqual(onRequestClose.calls.length, 1);

      secondary.value = onSecondarySubmit.call;
      await settled();
      await click('.cds--btn--secondary');
      assert.strictEqual(onSecondarySubmit.calls.length, 1);
      assert.strictEqual(onRequestClose.calls.length, 1);
    });

    test('the primary button submits', async function (assert) {
      const onRequestSubmit = spy();
      await render(
        <template>
          <Modal
            @open={{true}}
            @primaryButtonText="Add"
            @onRequestSubmit={{onRequestSubmit.call}}
          />
        </template>,
      );

      await click('.cds--modal-footer .cds--btn--primary');
      assert.strictEqual(onRequestSubmit.calls.length, 1);
    });

    test('Escape asks to close, and the modal stays open until @open changes', async function (assert) {
      const onRequestClose = spy();
      await render(
        <template>
          <Modal @open={{true}} @onRequestClose={{onRequestClose.call}} />
        </template>,
      );

      const event = cancel();
      assert.true(event.defaultPrevented, 'the browser does not close it');
      assert.strictEqual(onRequestClose.calls.length, 1);
      assert.true(dialog().open);
    });

    test('an Escape a component in the modal used does not ask to close', async function (assert) {
      const onRequestClose = spy();
      await render(
        <template>
          <Modal @open={{true}} @onRequestClose={{onRequestClose.call}}>
            <Toggletip @defaultOpen={{true}} as |toggletip|>
              <toggletip.Button>Info</toggletip.Button>
              <toggletip.Content>More about it</toggletip.Content>
            </Toggletip>
          </Modal>
        </template>,
      );

      // The toggletip closes on Escape and stops it there.
      await triggerKeyEvent('.cds--toggletip-button', 'keydown', 'Escape');
      cancel();
      assert.strictEqual(onRequestClose.calls.length, 0);

      // The next Escape, with nothing to close, reaches the modal.
      await triggerKeyEvent('.cds--toggletip-button', 'keydown', 'Escape');
      cancel();
      assert.strictEqual(onRequestClose.calls.length, 1);
    });

    test('an Escape a Popover in it used does not ask to close', async function (assert) {
      const onRequestClose = spy();
      const popoverOpen = tracked(true);
      const closePopover = () => (popoverOpen.value = false);
      await render(
        <template>
          <Modal @open={{true}} @onRequestClose={{onRequestClose.call}}>
            <Popover
              @open={{popoverOpen.value}}
              @onRequestClose={{closePopover}}
              as |PopoverContent|
            >
              <button type="button">Trigger</button>
              <PopoverContent>
                <button type="button" id="inner">Inner</button>
              </PopoverContent>
            </Popover>
          </Modal>
        </template>,
      );

      await triggerKeyEvent('#inner', 'keydown', 'Escape');
      cancel();
      assert.false(popoverOpen.value);
      assert.strictEqual(onRequestClose.calls.length, 0);
    });

    test('an Escape a toast in it closed on does not ask to close', async function (assert) {
      const onRequestClose = spy();
      await render(
        <template>
          <Modal @open={{true}} @onRequestClose={{onRequestClose.call}}>
            <ActionableNotification @title="Expiring" />
          </Modal>
        </template>,
      );

      await triggerKeyEvent(
        '.cds--actionable-notification',
        'keydown',
        'Escape',
      );
      cancel();
      assert.dom('.cds--actionable-notification').doesNotExist();
      assert.strictEqual(onRequestClose.calls.length, 0);
    });

    test('portals render into the topmost open modal', async function (assert) {
      const second = tracked(true);
      await render(
        <template>
          <Modal @open={{true}} id="first" />
          <Modal @open={{second.value}} id="second">
            <Portal><button type="button" id="layer">Layer</button></Portal>
          </Modal>
        </template>,
      );
      assert.strictEqual(find('#layer')?.parentElement, find('#second'));
      // Nothing outside the topmost modal dialog can take focus.
      const layer = find('#layer') as HTMLElement;
      layer.focus();
      assert.dom(layer).isFocused();

      second.value = false;
      await settled();
      assert.strictEqual(find('#layer')?.parentElement, find('#first'));
    });

    test('when the browser closes it anyway, it asks to close and reopens while @open stays true', async function (assert) {
      const onRequestClose = spy();
      await render(
        <template>
          <Modal @open={{true}} @onRequestClose={{onRequestClose.call}} />
        </template>,
      );

      // As on a second Escape, when `cancel` can't be prevented.
      cancel({ cancelable: false });
      assert.strictEqual(onRequestClose.calls.length, 0);
      const closed = new Promise((resolve) =>
        dialog().addEventListener('close', resolve, { once: true }),
      );
      dialog().close();
      await closed;
      await settled();
      assert.strictEqual(onRequestClose.calls.length, 1);
      assert.true(dialog().open, 'it opened again');
    });

    test('when the browser closes it anyway and @onRequestClose closes it, it stays closed', async function (assert) {
      const open = tracked(true);
      const onRequestClose = () => (open.value = false);
      await render(
        <template>
          <Modal @open={{open.value}} @onRequestClose={{onRequestClose}} />
        </template>,
      );

      cancel({ cancelable: false });
      const closed = new Promise((resolve) =>
        dialog().addEventListener('close', resolve, { once: true }),
      );
      dialog().close();
      await closed;
      await settled();
      assert.false(open.value);
      assert.false(dialog().open);
    });

    test('opening it again after the browser closed it puts focus back', async function (assert) {
      await render(
        <template>
          <Modal @open={{true}} @primaryButtonText="Add">
            <input aria-label="Name" />
          </Modal>
        </template>,
      );

      await focus('input');
      cancel({ cancelable: false });
      const closed = new Promise((resolve) =>
        dialog().addEventListener('close', resolve, { once: true }),
      );
      dialog().close();
      await closed;
      await settled();
      assert.true(dialog().open);
      assert.dom('input').isFocused();
    });

    test('closing it twice before the first close lands does not ask to close', async function (assert) {
      const open = tracked(true);
      const onRequestClose = spy();
      await render(
        <template>
          <Modal @open={{open.value}} @onRequestClose={{onRequestClose.call}} />
        </template>,
      );

      open.value = false;
      await rerender();
      open.value = true;
      await rerender();
      open.value = false;
      await settled();
      assert.false(dialog().open);
      assert.strictEqual(onRequestClose.calls.length, 0);
    });

    module('clicks outside the modal', function () {
      test('close a passive modal by default', async function (assert) {
        const onRequestClose = spy();
        await render(
          <template>
            <Modal
              @open={{true}}
              @passiveModal={{true}}
              @onRequestClose={{onRequestClose.call}}
            />
          </template>,
        );

        await clickOverlay();
        assert.strictEqual(onRequestClose.calls.length, 1);
      });

      test('do not close a passive modal with @preventCloseOnClickOutside', async function (assert) {
        const onRequestClose = spy();
        await render(
          <template>
            <Modal
              @open={{true}}
              @passiveModal={{true}}
              @preventCloseOnClickOutside={{true}}
              @onRequestClose={{onRequestClose.call}}
            />
          </template>,
        );

        await clickOverlay();
        assert.strictEqual(onRequestClose.calls.length, 0);
      });

      test('do not close a modal with buttons by default', async function (assert) {
        const onRequestClose = spy();
        await render(
          <template>
            <Modal @open={{true}} @onRequestClose={{onRequestClose.call}} />
          </template>,
        );

        await clickOverlay();
        assert.strictEqual(onRequestClose.calls.length, 0);
      });

      test('close a modal with buttons when @preventCloseOnClickOutside is false', async function (assert) {
        const onRequestClose = spy();
        await render(
          <template>
            <Modal
              @open={{true}}
              @preventCloseOnClickOutside={{false}}
              @onRequestClose={{onRequestClose.call}}
            />
          </template>,
        );

        await clickOverlay();
        assert.strictEqual(onRequestClose.calls.length, 1);
      });

      test('a drag that starts inside the modal is not one', async function (assert) {
        const onRequestClose = spy();
        await render(
          <template>
            <Modal
              @open={{true}}
              @passiveModal={{true}}
              @onRequestClose={{onRequestClose.call}}
            />
          </template>,
        );

        await clickOverlay({ pressInside: true });
        assert.strictEqual(onRequestClose.calls.length, 0);
      });

      test('a click in its content is not one', async function (assert) {
        const onRequestClose = spy();
        await render(
          <template>
            <Modal
              @open={{true}}
              @passiveModal={{true}}
              @onRequestClose={{onRequestClose.call}}
            >
              <p data-test-content>Content</p>
            </Modal>
          </template>,
        );

        await click('[data-test-content]');
        assert.strictEqual(onRequestClose.calls.length, 0);
      });

      test('a click in a layer rendered into it is not one', async function (assert) {
        const onRequestClose = spy();
        await render(
          <template>
            <Modal
              @open={{true}}
              @passiveModal={{true}}
              @onRequestClose={{onRequestClose.call}}
            >
              <Portal><button type="button" id="layer">Layer</button></Portal>
            </Modal>
          </template>,
        );

        await click('#layer');
        assert.strictEqual(onRequestClose.calls.length, 0);
      });
    });

    test('@shouldSubmitOnEnter submits on Enter', async function (assert) {
      const onRequestSubmit = spy();
      await render(
        <template>
          <Modal
            @open={{true}}
            @primaryButtonText="Add"
            @shouldSubmitOnEnter={{true}}
            @onRequestSubmit={{onRequestSubmit.call}}
          >
            <input aria-label="Name" />
          </Modal>
        </template>,
      );

      await fillIn('input', 'GitHub.com');
      await triggerKeyEvent('input', 'keydown', 'Enter');
      assert.strictEqual(onRequestSubmit.calls.length, 1);

      // Enter on the primary button submits once, through its click.
      await focus('.cds--modal-footer .cds--btn--primary');
      await triggerKeyEvent(
        '.cds--modal-footer .cds--btn--primary',
        'keydown',
        'Enter',
      );
      assert.strictEqual(onRequestSubmit.calls.length, 1);
    });

    test('Enter in a layer rendered into it does not submit', async function (assert) {
      const onRequestSubmit = spy();
      await render(
        <template>
          <Modal
            @open={{true}}
            @primaryButtonText="Add"
            @shouldSubmitOnEnter={{true}}
            @onRequestSubmit={{onRequestSubmit.call}}
          >
            <Portal><input aria-label="Search" id="layer" /></Portal>
          </Modal>
        </template>,
      );

      await triggerKeyEvent('#layer', 'keydown', 'Enter');
      assert.strictEqual(onRequestSubmit.calls.length, 0);
    });

    test('Enter does not submit without @shouldSubmitOnEnter', async function (assert) {
      const onRequestSubmit = spy();
      await render(
        <template>
          <Modal
            @open={{true}}
            @primaryButtonText="Add"
            @onRequestSubmit={{onRequestSubmit.call}}
          >
            <input aria-label="Name" />
          </Modal>
        </template>,
      );

      await triggerKeyEvent('input', 'keydown', 'Enter');
      assert.strictEqual(onRequestSubmit.calls.length, 0);
    });
  });
});
