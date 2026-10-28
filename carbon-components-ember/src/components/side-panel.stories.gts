import { expect, fn, waitFor } from 'storybook/test';

import { AIExplanation } from '#storybook/fixtures/ai-label.gts';
import {
  Body,
  Step,
  captureLauncher,
  panelState,
  toolbarWithHandlers,
  withHandlers,
  withPageFrame,
} from '#storybook/fixtures/side-panel.gts';
import preview from '#storybook/preview.ts';
import Button from './button.gts';
import SidePanel from './side-panel.gts';

import type { SidePanelSignature } from './side-panel.gts';
import '#storybook/styles/side-panel.css';

// Parity gaps with Carbon React's SidePanel stories (Components/SidePanel):
// - No `aiLabel` or `slug` controls: both are deprecated props, replaced by
//   the `decorator` block (`WithAILabel`).
// - The body leaves out the Notes character counter.
// - `actions` and `actionToolbarButtons` are not index controls: set
//   `actions` to a list of `{ label, kind }` objects. The toolbar's icons are
//   components, so only `WithActionToolbar` has a toolbar.

type StoryArgs = Omit<SidePanelSignature['Args'], 'open'> & {
  /** Logs a click on an action or toolbar button. */
  onAction: (label: string) => void;
};

const SUBTITLE =
  'This is some text that would talk about how you could investigate incident management within this side panel.';

const TITLE =
  'Incident management for your application, testing a very long title to see how this behaves with a longer title';

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/SidePanel',
  component: SidePanel,
  decorators: [withPageFrame],
  parameters: {
    layout: 'fullscreen',
    docs: {
      // The panel is fixed to the viewport, so each story gets its own.
      story: { inline: false, iframeHeight: '640px' },
      description: {
        component:
          "Side panels keep users in context of a page while performing tasks like navigating, editing, viewing details, or configuring something new. This is the SidePanel of Carbon core, which `@carbon/react` v12 exports.\n\n`@open` shows it; closing is up to you: the close button, Escape and a click on the overlay (`@includeOverlay`) call `@onRequestClose`. A panel covers the page, or with `@slideIn` pushes the page's content (`@selectorPageContent`) aside. `@actions` and `@actionToolbarButtons` describe buttons as objects, `@currentStep` and `@onNavigationBack` make a multi-step panel, and the `decorator` block takes an AI label.",
      },
    },
    controls: {
      exclude: [
        'actionToolbarButtons',
        'launcherButtonRef',
        'onNavigationBack',
        'onRequestClose',
        'onUnmount',
        'open',
        'currentStep',
        'onAction',
      ],
    },
  },
  argTypes: {
    placement: { control: 'select', options: ['left', 'right'] },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
  },
  args: {
    title: TITLE,
    subtitle: SUBTITLE,
    size: 'md',
    placement: 'right',
    actions: [{ label: 'Submit' }],
    onRequestClose: fn(),
    onNavigationBack: fn(),
    onAction: fn(),
  },
});

export const SlideOver = meta.story({
  name: 'Slide over',
  args: { includeOverlay: true },
  render: (args: StoryArgs) => {
    const demo = panelState(args.onRequestClose);
    return <template>
      <Button {{captureLauncher demo.state}} {{on "click" demo.toggle}}>
        {{if demo.state.open "Close panel" "Open panel"}}
      </Button>
      <SidePanel
        @open={{demo.state.open}}
        @onRequestClose={{demo.close}}
        @launcherButtonRef={{demo.state.launcher}}
        @title={{args.title}}
        @subtitle={{args.subtitle}}
        @labelText={{args.labelText}}
        @size={{args.size}}
        @placement={{args.placement}}
        @includeOverlay={{args.includeOverlay}}
        @preventCloseOnClickOutside={{args.preventCloseOnClickOutside}}
        @animateTitle={{args.animateTitle}}
        @condensedActions={{args.condensedActions}}
        @hideCloseButton={{args.hideCloseButton}}
        @resizable={{args.resizable}}
        @selectorPrimaryFocus={{args.selectorPrimaryFocus}}
        @actions={{withHandlers args.actions args.onAction}}
      >
        <Body />
      </SidePanel>
    </template>;
  },
});

SlideOver.test(
  'opens focused on the panel, and the close button asks to close',
  async ({ canvas, userEvent, args }) => {
    const panel = await canvas.findByRole('complementary');
    await waitFor(() =>
      expect(panel.contains(document.activeElement)).toBe(true),
    );

    await userEvent.click(canvas.getByRole('button', { name: 'Close' }));

    await expect(args.onRequestClose).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(canvas.queryByRole('complementary')).not.toBeInTheDocument(),
    );
    await expect(
      canvas.getByRole('button', { name: 'Open panel' }),
    ).toHaveFocus();
  },
);

export const SlideIn = meta.story({
  name: 'Slide in',
  args: {
    slideIn: true,
    selectorPageContent: '#side-panel-story-page',
    labelText: 'Incident management',
  },
  render: (args: StoryArgs) => {
    const demo = panelState(args.onRequestClose);
    return <template>
      <div id="side-panel-story-page">
        <Button {{captureLauncher demo.state}} {{on "click" demo.toggle}}>
          {{if demo.state.open "Close panel" "Open panel"}}
        </Button>
      </div>
      <SidePanel
        @open={{demo.state.open}}
        @onRequestClose={{demo.close}}
        @launcherButtonRef={{demo.state.launcher}}
        @title={{args.title}}
        @subtitle={{args.subtitle}}
        @labelText={{args.labelText}}
        @size={{args.size}}
        @placement={{args.placement}}
        @slideIn={{args.slideIn}}
        @selectorPageContent={{args.selectorPageContent}}
        @animateTitle={{args.animateTitle}}
        @actions={{withHandlers args.actions args.onAction}}
      >
        <Body />
      </SidePanel>
    </template>;
  },
});

SlideIn.test('pushes the page content aside', async ({ canvasElement }) => {
  const page = canvasElement.querySelector<HTMLElement>(
    '#side-panel-story-page',
  )!;
  await waitFor(() => expect(page.style.marginInlineEnd).toBe('30rem'));
});

export const WithActionToolbar = meta.story({
  name: 'With action toolbar',
  render: (args: StoryArgs) => {
    const demo = panelState(args.onRequestClose);
    return <template>
      <Button {{captureLauncher demo.state}} {{on "click" demo.toggle}}>
        {{if demo.state.open "Close panel" "Open panel"}}
      </Button>
      <SidePanel
        @open={{demo.state.open}}
        @onRequestClose={{demo.close}}
        @launcherButtonRef={{demo.state.launcher}}
        @title={{args.title}}
        @subtitle={{args.subtitle}}
        @size={{args.size}}
        @placement={{args.placement}}
        @actionToolbarButtons={{toolbarWithHandlers args.onAction}}
        @actions={{withHandlers args.actions args.onAction}}
      >
        <Body />
      </SidePanel>
    </template>;
  },
});

WithActionToolbar.test(
  'a toolbar button calls its handler',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'Copy' }));
    await expect(args.onAction).toHaveBeenCalledWith('Copy');
  },
);

export const PanelWithSecondStep = meta.story({
  name: 'Multi-step panel',
  args: { includeOverlay: true },
  render: (args: StoryArgs) => {
    const demo = panelState(args.onRequestClose);
    return <template>
      <Button {{captureLauncher demo.state}} {{on "click" demo.toggle}}>
        {{if demo.state.open "Close panel" "Open panel"}}
      </Button>
      <SidePanel
        @open={{demo.state.open}}
        @onRequestClose={{demo.close}}
        @launcherButtonRef={{demo.state.launcher}}
        @currentStep={{demo.state.step}}
        @onNavigationBack={{demo.back}}
        @title={{args.title}}
        @subtitle={{args.subtitle}}
        @size={{args.size}}
        @placement={{args.placement}}
        @includeOverlay={{args.includeOverlay}}
        @actions={{withHandlers args.actions args.onAction}}
      >
        <Step @step={{demo.state.step}} @onNext={{demo.next}} />
      </SidePanel>
    </template>;
  },
});

PanelWithSecondStep.test(
  'View all goes to the second step, and Back returns',
  async ({ canvas, userEvent }) => {
    await userEvent.click(
      await canvas.findByRole('button', { name: 'View all' }),
    );
    await expect(canvas.getByText('Detail view')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Back' }));
    await expect(canvas.getByText('Main view')).toBeInTheDocument();
  },
);

export const WithAILabel = meta.story({
  name: 'With AI Label',
  args: { includeOverlay: true },
  render: (args: StoryArgs) => {
    const demo = panelState(args.onRequestClose);
    return <template>
      <Button {{captureLauncher demo.state}} {{on "click" demo.toggle}}>
        {{if demo.state.open "Close panel" "Open panel"}}
      </Button>
      <SidePanel
        @open={{demo.state.open}}
        @onRequestClose={{demo.close}}
        @launcherButtonRef={{demo.state.launcher}}
        @title={{args.title}}
        @subtitle={{args.subtitle}}
        @size={{args.size}}
        @placement={{args.placement}}
        @includeOverlay={{args.includeOverlay}}
        @actions={{withHandlers args.actions args.onAction}}
      >
        <:decorator as |AILabel|>
          <AILabel @align="bottom" as |label|>
            <label.Content><AIExplanation /></label.Content>
          </AILabel>
        </:decorator>
        <:default><Body /></:default>
      </SidePanel>
    </template>;
  },
});

export const SpecifyElementToHaveInitialFocus = meta.story({
  name: 'Specify element to have initial focus',
  args: { selectorPrimaryFocus: '#side-panel-story-text-input-a' },
  render: (args: StoryArgs) => {
    const demo = panelState(args.onRequestClose);
    return <template>
      <Button {{captureLauncher demo.state}} {{on "click" demo.toggle}}>
        {{if demo.state.open "Close panel" "Open panel"}}
      </Button>
      <SidePanel
        @open={{demo.state.open}}
        @onRequestClose={{demo.close}}
        @launcherButtonRef={{demo.state.launcher}}
        @title={{args.title}}
        @subtitle={{args.subtitle}}
        @size={{args.size}}
        @placement={{args.placement}}
        @selectorPrimaryFocus={{args.selectorPrimaryFocus}}
        @actions={{withHandlers args.actions args.onAction}}
      >
        <Body />
      </SidePanel>
    </template>;
  },
});

SpecifyElementToHaveInitialFocus.test(
  'focuses the element the selector matches',
  async ({ canvas }) => {
    await waitFor(() => expect(canvas.getByLabelText('Input A')).toHaveFocus());
  },
);

export const WithStaticTitle = meta.story({
  name: 'With static title',
  args: { animateTitle: false, includeOverlay: true },
  render: (args: StoryArgs) => {
    const demo = panelState(args.onRequestClose);
    return <template>
      <Button {{captureLauncher demo.state}} {{on "click" demo.toggle}}>
        {{if demo.state.open "Close panel" "Open panel"}}
      </Button>
      <SidePanel
        @open={{demo.state.open}}
        @onRequestClose={{demo.close}}
        @launcherButtonRef={{demo.state.launcher}}
        @title={{args.title}}
        @subtitle={{args.subtitle}}
        @size={{args.size}}
        @placement={{args.placement}}
        @animateTitle={{args.animateTitle}}
        @includeOverlay={{args.includeOverlay}}
        @actions={{withHandlers args.actions args.onAction}}
      >
        <Body />
      </SidePanel>
    </template>;
  },
});

export const WithoutTitle = meta.story({
  name: 'Without title',
  args: {
    title: undefined,
    subtitle: undefined,
    includeOverlay: true,
  },
  render: (args: StoryArgs) => {
    const demo = panelState(args.onRequestClose);
    return <template>
      <Button {{captureLauncher demo.state}} {{on "click" demo.toggle}}>
        {{if demo.state.open "Close panel" "Open panel"}}
      </Button>
      <SidePanel
        @open={{demo.state.open}}
        @onRequestClose={{demo.close}}
        @launcherButtonRef={{demo.state.launcher}}
        @size={{args.size}}
        @placement={{args.placement}}
        @includeOverlay={{args.includeOverlay}}
        @actions={{withHandlers args.actions args.onAction}}
        aria-label="SidePanel without title"
      >
        <Body />
      </SidePanel>
    </template>;
  },
});
