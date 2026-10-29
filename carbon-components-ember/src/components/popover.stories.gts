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
import Popover, { NewPopoverAlignments } from './popover.gts';
import RadioButtonGroup from './radio-button/radio-button-group.gts';
import CheckboxIcon from './icons/checkbox.ts';
import Settings from './icons/settings.ts';

import type { PopoverSignature } from './popover.gts';
import '#storybook/styles/popover.css';

// Parity note on Carbon React's Popover stories: React's ExperimentalAutoAlign
// stories forward a ref to the Popover to scroll it into view; here a modifier
// on the trigger does that.

// Popover is controlled: each story keeps `open` in local state, toggles it
// from the trigger, and closes it (reporting to the `onRequestClose` action)
// when Popover asks to.
function openState(
  args: Partial<PopoverSignature['Args']>,
  initial = args.open ?? true,
) {
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
          "`Popover` is used for triggering a pop-up next to a trigger element, typically a button, in a given direction. It is a controlled component: the consumer owns the `@open` argument and toggles it (usually from the trigger's click handler), while `Popover` calls `@onRequestClose` whenever the user clicks outside of the popover or presses <kbd>Escape</kbd> while focus is inside the popover content.\n\nRender the trigger element, then the `PopoverContent` that `Popover` yields, bound to it: `<Popover @open={{this.open}} as |PopoverContent|>`.",
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
    align: { control: 'select', options: NewPopoverAlignments },
    backgroundToken: { control: 'select', options: ['layer', 'background'] },
  },
});

// `@align` controls which side and edge of the trigger the popover renders
// against; `@caret`, `@dropShadow`, `@border`, `@highContrast` and
// `@backgroundToken` its appearance.
export const Default = meta.story({
  decorators: [
    (Story, context) => <template>
      <div class="popover-story__centered-row">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
  render: (args: PopoverSignature['Args']) => {
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
        as |PopoverContent|
      >
        <button
          type="button"
          aria-label="Checkbox"
          aria-expanded={{if state.open "true" "false"}}
          {{on "click" toggle}}
        >
          <CheckboxIcon />
        </button>
        <PopoverContent class="popover-story__content">
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
  render: (args: PopoverSignature['Args']) => {
    const one = openState(args, true);
    const two = openState(args, false);

    return <template>
      <div class="popover-story__row">
        <Popover
          @open={{one.state.open}}
          @align="bottom-start"
          @isTabTip={{true}}
          @onRequestClose={{one.close}}
          as |PopoverContent|
        >
          <button
            type="button"
            aria-label="Settings"
            aria-expanded={{if one.state.open "true" "false"}}
            {{on "click" one.toggle}}
          >
            <Settings />
          </button>
          <PopoverContent class="popover-story__content">
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
          as |PopoverContent|
        >
          <button
            type="button"
            aria-label="Settings"
            aria-expanded={{if two.state.open "true" "false"}}
            {{on "click" two.toggle}}
          >
            <Settings />
          </button>
          <PopoverContent class="popover-story__content">
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

// Requested to align on top; `@autoAlign` moves it to a side that fits in the
// viewport, and keeps doing so as the page scrolls.
export const ExperimentalAutoAlign = meta.story({
  parameters: {
    docs: { story: { inline: false, iframeHeight: '400px' } },
  },
  render: (args: PopoverSignature['Args']) => {
    const { state, toggle, close } = openState(args);

    return <template>
      <div class="popover-story__auto-align-container">
        <Popover
          @open={{state.open}}
          @align={{if args.align args.align "top"}}
          @caret={{args.caret}}
          @autoAlign={{true}}
          @onRequestClose={{close}}
          as |PopoverContent|
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
          <PopoverContent class="popover-story__content">
            <p class="cds--popover-title">This popover uses autoAlign</p>
            <p>
              Scroll the trigger towards an edge of the viewport to see it pick
              a side that fits.
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
  render: (args: PopoverSignature['Args']) => {
    const { state, toggle, close } = openState(args);
    const boundary = trackedObject<{ element?: HTMLElement }>({});
    const setBoundary = modifier((element: HTMLElement) => {
      boundary.element = element;
    });

    return <template>
      <div class="popover-story__scroller" {{setBoundary}}>
        <div class="popover-story__wide-spacer"></div>
        <div class="popover-story__anchor">
          {{#if boundary.element}}
            <Popover
              @open={{state.open}}
              @align={{if args.align args.align "top"}}
              @caret={{args.caret}}
              @autoAlign={{true}}
              @autoAlignBoundary={{boundary.element}}
              @onRequestClose={{close}}
              as |PopoverContent|
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
              <PopoverContent class="popover-story__content">
                <p class="cds--popover-title">This popover uses autoAlign</p>
                <p>
                  It stays within the dashed boundary while you scroll it.
                </p>
              </PopoverContent>
            </Popover>
          {{/if}}
          <div class="popover-story__tall-spacer"></div>
        </div>
      </div>
    </template>;
  },
});

export const TabTipExperimentalAutoAlign = meta.story({
  parameters: {
    docs: { story: { inline: false, iframeHeight: '400px' } },
  },
  render: (args: PopoverSignature['Args']) => {
    const { state, toggle, close } = openState(args);

    return <template>
      <div class="popover-story__auto-align-container">
        <Popover
          @open={{state.open}}
          @align="bottom-end"
          @autoAlign={{true}}
          @isTabTip={{true}}
          @onRequestClose={{close}}
          as |PopoverContent|
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
          <PopoverContent class="popover-story__content">
            <p class="cds--popover-title">
              This popover uses autoAlign with isTabTip
            </p>
            <p>It picks a side that fits in the viewport.</p>
          </PopoverContent>
        </Popover>
      </div>
    </template>;
  },
});

export const AutoAlignAtTopOfPage = meta.story({
  name: 'Auto align (at the top of the page)',
  parameters: {
    docs: {
      description: {
        story:
          "**Experimental:** `@autoAlign` positions the content with Floating UI, in the top layer, and moves it to another side when it would render outside of the viewport (or `@autoAlignBoundary`). Requested to align `top` right at the top of the page, there isn't enough room above the trigger, so it takes the first side in Carbon's fallback order that fits.",
      },
    },
  },
  render: (args: PopoverSignature['Args']) => {
    const { state, toggle, close } = openState(args);

    return <template>
      <Popover
        @open={{state.open}}
        @align="top"
        @autoAlign={{true}}
        @onRequestClose={{close}}
        as |PopoverContent|
      >
        <button
          type="button"
          aria-label="Available storage"
          aria-expanded={{if state.open "true" "false"}}
          {{on "click" toggle}}
        >
          <CheckboxIcon />
        </button>
        <PopoverContent class="popover-story__content">
          <p class="cds--popover-title">This popover uses autoAlign</p>
          <p>
            It was requested to align on top, but moves to another side when
            there isn't enough room above it in the viewport.
          </p>
        </PopoverContent>
      </Popover>
    </template>;
  },
});

AutoAlignAtTopOfPage.test(
  'moves off the top side, into the top layer',
  async ({ canvasElement }) => {
    const popover = canvasElement.querySelector('.cds--popover-container')!;
    const content = popover.querySelector('.cds--popover-content')!;
    await expect(popover).toHaveClass('cds--popover--auto-align');
    await expect(content.matches(':popover-open')).toBe(true);
    await waitFor(() => expect(popover).not.toHaveClass('cds--popover--top'));
  },
);
