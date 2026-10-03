import { on } from '@ember/modifier';
import { trackedObject } from '@ember/reactive/collections';
import { modifier } from 'ember-modifier';
import { RenderStory } from 'ember-storybook';
import {
  expect,
  fn,
  userEvent as globalUserEvent,
  mocked,
  waitFor,
} from 'storybook/test';

import preview from '#storybook/preview.ts';
import Checkbox from './checkbox.gts';
import Popover, { PopoverContent } from './popover.gts';
import RadioButtonGroup from './radio-button/group.gts';
import CheckboxIcon from './icons/checkbox.ts';
import Settings from './icons/settings.ts';

import type { PopoverArgs } from './popover.gts';

// Parity notes on Carbon React's Popover stories:
// - `@autoAlign` is a lighter approximation of React's floating-ui based
//   `autoAlign`: it re-checks the alignment once, when the popover opens,
//   rather than continuously while scrolling. The ExperimentalAutoAlign*
//   stories therefore only flip on open.
// - React's ExperimentalAutoAlign stories forward a ref to the Popover to
//   scroll it into view; here a modifier on the trigger does that.

const ALIGNMENTS = [
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-end',
  'left-start',
  'right',
  'right-end',
  'right-start',
];

// Popover is controlled: each story keeps `open` in local state, toggles it
// from the trigger, and closes it (reporting to the `onRequestClose` action)
// when Popover asks to.
function openState(args: Partial<PopoverArgs>, initial = args.open ?? true) {
  const state = trackedObject({ open: initial });
  const toggle = () => {
    state.open = !state.open;
  };
  const close = () => {
    state.open = false;
    args.onRequestClose?.();
  };
  return { state, toggle, close };
}

const scrollIntoView = modifier((element: HTMLElement) => {
  element.scrollIntoView({ block: 'center', inline: 'center' });
});

const meta = preview.meta({
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    docs: {
      description: {
        component:
          "`Popover` is used for triggering a pop-up next to a trigger element, typically a button, in a given direction. It is a controlled component: the consumer owns the `@open` argument and toggles it (usually from the trigger's click handler), while `Popover` calls `@onRequestClose` whenever the user clicks outside of the popover or presses <kbd>Escape</kbd> while focus is inside the popover content.\n\nThe trigger element and `PopoverContent` are both yielded as plain children of `Popover`.",
      },
    },
  },
  args: {
    open: true,
    caret: true,
    dropShadow: true,
    highContrast: false,
    border: false,
    onRequestClose: fn(),
  },
  argTypes: {
    align: { control: 'select', options: ALIGNMENTS },
    backgroundToken: { control: 'select', options: ['layer', 'background'] },
  },
});

// `@align` controls which side and edge of the trigger the popover renders
// against; `@caret`, `@dropShadow`, `@border`, `@highContrast` and
// `@backgroundToken` its appearance.
export const Default = meta.story({
  decorators: [
    (Story, context) => <template>
      <div style="display: flex; justify-content: center; margin-top: 2.5rem">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
  render: (args: PopoverArgs) => {
    const { state, toggle, close } = openState(args);

    return <template>
      <Popover
        @open={{state.open}}
        @align={{args.align}}
        @caret={{args.caret}}
        @dropShadow={{args.dropShadow}}
        @border={{args.border}}
        @highContrast={{args.highContrast}}
        @backgroundToken={{args.backgroundToken}}
        @onRequestClose={{close}}
      >
        <button
          type="button"
          aria-label="Checkbox"
          aria-expanded={{if state.open "true" "false"}}
          {{on "click" toggle}}
        >
          <CheckboxIcon />
        </button>
        <PopoverContent style="padding: 1rem;">
          <h2 class="cds--popover-title">Available storage</h2>
          <p>This server has 150 GB of block storage remaining.</p>
          <button type="button">Details</button>
        </PopoverContent>
      </Popover>
    </template>;
  },
});

Default.test(
  'toggles from the trigger and closes on Escape and outside clicks',
  async ({ canvas, canvasElement, userEvent, args }) => {
    const trigger = canvas.getByRole('button', { name: 'Checkbox' });
    const popover = canvasElement.querySelector('.cds--popover-container')!;
    await expect(popover).toHaveClass('cds--popover--open');

    await userEvent.click(trigger);
    await expect(popover).not.toHaveClass('cds--popover--open');
    await userEvent.click(trigger);
    await expect(popover).toHaveClass('cds--popover--open');

    // Escape only closes it while focus is inside the content. (Clear the
    // spy first: it is shared with earlier renders of this story.)
    mocked(args.onRequestClose).mockClear();
    canvas.getByRole('button', { name: 'Details' }).focus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(popover).not.toHaveClass('cds--popover--open'));
    await expect(args.onRequestClose).toHaveBeenCalledOnce();

    await userEvent.click(trigger);
    await expect(popover).toHaveClass('cds--popover--open');
    await globalUserEvent.click(document.body);
    await waitFor(() => expect(popover).not.toHaveClass('cds--popover--open'));
  },
);

// `@isTabTip` renders the "tab tip" variant used by e.g. DataTable's column
// customization menu: it defaults `@align` to `bottom-start`, disables the
// caret and adds `cds--popover--tab-tip__button` to the trigger.
export const TabTip = meta.story({
  render: (args: PopoverArgs) => {
    const one = openState(args, true);
    const two = openState(args, false);

    return <template>
      <div style="display: flex">
        <Popover
          @open={{one.state.open}}
          @align="bottom-start"
          @isTabTip={{true}}
          @onRequestClose={{one.close}}
        >
          <button
            type="button"
            aria-label="Settings"
            aria-expanded={{if one.state.open "true" "false"}}
            {{on "click" one.toggle}}
          >
            <Settings />
          </button>
          <PopoverContent style="padding: 1rem;">
            <RadioButtonGroup
              @name="radio-button-group"
              @defaultSelected="small"
              @orientation="vertical"
            >
              <:heading>Row height 1</:heading>
              <:default as |Radio|>
                <Radio @value="small">Small</Radio>
                <Radio @value="large">Large</Radio>
              </:default>
            </RadioButtonGroup>
            <hr />
            <fieldset class="cds--fieldset">
              <legend class="cds--label">Edit columns</legend>
              <Checkbox @label="Name" @checked={{true}} />
              <Checkbox @label="Type" @checked={{true}} />
              <Checkbox @label="Location" @checked={{true}} />
            </fieldset>
          </PopoverContent>
        </Popover>
        <Popover
          @open={{two.state.open}}
          @align="bottom-end"
          @isTabTip={{true}}
          @onRequestClose={{two.close}}
        >
          <button
            type="button"
            aria-label="Settings"
            aria-expanded={{if two.state.open "true" "false"}}
            {{on "click" two.toggle}}
          >
            <Settings />
          </button>
          <PopoverContent style="padding: 1rem;">
            <RadioButtonGroup
              @name="radio-button-group-2"
              @defaultSelected="small-2"
              @orientation="vertical"
            >
              <:heading>Row height 2</:heading>
              <:default as |Radio|>
                <Radio @value="small-2">Small</Radio>
                <Radio @value="large-2">Large</Radio>
              </:default>
            </RadioButtonGroup>
            <hr />
            <fieldset class="cds--fieldset">
              <legend class="cds--label">Testing</legend>
              <Checkbox @label="Name" @checked={{true}} />
              <Checkbox @label="Type" @checked={{true}} />
              <Checkbox @label="Location" @checked={{true}} />
            </fieldset>
          </PopoverContent>
        </Popover>
      </div>
    </template>;
  },
});

const AUTO_ALIGN_CONTAINER =
  'display: grid; place-items: center; width: 200vw; min-width: 1200px; height: 200vh; min-height: 1200px;';

// Requested to align on top; when there isn't enough room above the trigger
// in the viewport as it opens, `@autoAlign` flips it to the bottom.
export const ExperimentalAutoAlign = meta.story({
  parameters: {
    docs: { story: { inline: false, iframeHeight: '400px' } },
  },
  render: (args: PopoverArgs) => {
    const { state, toggle, close } = openState(args);

    return <template>
      <div style={{AUTO_ALIGN_CONTAINER}}>
        <Popover
          @open={{state.open}}
          @align={{if args.align args.align "top"}}
          @caret={{args.caret}}
          @autoAlign={{true}}
          @onRequestClose={{close}}
        >
          <button
            type="button"
            aria-label="Checkbox"
            aria-expanded={{if state.open "true" "false"}}
            {{scrollIntoView}}
            {{on "click" toggle}}
          >
            <CheckboxIcon />
          </button>
          <PopoverContent style="padding: 1rem;">
            <p class="cds--popover-title">This popover uses autoAlign</p>
            <p>
              Close and reopen it after scrolling the trigger towards an edge of
              the viewport to see it pick a side that fits.
            </p>
          </PopoverContent>
        </Popover>
      </div>
    </template>;
  },
});

// Same, but the space is measured against `@autoAlignBoundary` (the dashed,
// scrollable box) rather than the viewport.
export const ExperimentalAutoAlignBoundary = meta.story({
  render: (args: PopoverArgs) => {
    const { state, toggle, close } = openState(args);
    const boundary = trackedObject<{ element?: HTMLElement }>({});
    const setBoundary = modifier((element: HTMLElement) => {
      boundary.element = element;
    });

    return <template>
      <div
        style="display: grid; place-items: center; overflow: scroll; width: 800px; height: 500px; border: 1px dashed var(--cds-border-strong, #8d8d8d); margin: 0 auto;"
        {{setBoundary}}
      >
        <div style="width: 2100px; height: 1px;"></div>
        <div style="height: 32px; width: 32px;">
          {{#if boundary.element}}
            <Popover
              @open={{state.open}}
              @align={{if args.align args.align "top"}}
              @caret={{args.caret}}
              @autoAlign={{true}}
              @autoAlignBoundary={{boundary.element}}
              @onRequestClose={{close}}
            >
              <button
                type="button"
                aria-label="Checkbox"
                aria-expanded={{if state.open "true" "false"}}
                {{scrollIntoView}}
                {{on "click" toggle}}
              >
                <CheckboxIcon />
              </button>
              <PopoverContent style="padding: 1rem;">
                <p class="cds--popover-title">This popover uses autoAlign</p>
                <p>
                  Its alignment is checked against the dashed boundary when it
                  opens.
                </p>
              </PopoverContent>
            </Popover>
          {{/if}}
          <div style="height: 1000px; width: 1px;"></div>
        </div>
      </div>
    </template>;
  },
});

export const TabTipExperimentalAutoAlign = meta.story({
  parameters: {
    docs: { story: { inline: false, iframeHeight: '400px' } },
  },
  render: (args: PopoverArgs) => {
    const { state, toggle, close } = openState(args);

    return <template>
      <div style={{AUTO_ALIGN_CONTAINER}}>
        <Popover
          @open={{state.open}}
          @align="bottom-end"
          @autoAlign={{true}}
          @isTabTip={{true}}
          @onRequestClose={{close}}
        >
          <button
            type="button"
            aria-label="Checkbox"
            aria-expanded={{if state.open "true" "false"}}
            {{scrollIntoView}}
            {{on "click" toggle}}
          >
            <CheckboxIcon />
          </button>
          <PopoverContent style="padding: 1rem;">
            <p class="cds--popover-title">
              This popover uses autoAlign with isTabTip
            </p>
            <p>It picks a side that fits in the viewport when it opens.</p>
          </PopoverContent>
        </Popover>
      </div>
    </template>;
  },
});

export const AutoAlignFlipsToBottom = meta.story({
  name: 'Auto align (flips at the top of the page)',
  parameters: {
    docs: {
      description: {
        story:
          "**Experimental:** `@autoAlign` checks, when the popover opens, whether its content would render outside of the viewport (or `@autoAlignBoundary`) and flips it to the opposite side if so. Requested to align `top` right at the top of the page, there typically isn't enough room, so it renders `bottom` instead.",
      },
    },
  },
  render: (args: PopoverArgs) => {
    const { state, toggle, close } = openState(args);

    return <template>
      <Popover
        @open={{state.open}}
        @align="top"
        @autoAlign={{true}}
        @onRequestClose={{close}}
      >
        <button
          type="button"
          aria-label="Available storage"
          aria-expanded={{if state.open "true" "false"}}
          {{on "click" toggle}}
        >
          <CheckboxIcon />
        </button>
        <PopoverContent style="padding: 1rem;">
          <p class="cds--popover-title">This popover uses autoAlign</p>
          <p>
            It was requested to align on top, but flips to bottom when there
            isn't enough room above it in the viewport.
          </p>
        </PopoverContent>
      </Popover>
    </template>;
  },
});
