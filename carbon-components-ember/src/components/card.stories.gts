import { trackedObject } from '@ember/reactive/collections';
import { RenderStory } from 'ember-storybook';
import { expect, fn as spy } from 'storybook/test';

import { AIExplanation } from '#storybook/fixtures/ai-label.gts';
import preview from '#storybook/preview.ts';
import Button from './button.gts';
import Card from './card.gts';
import Grid from './grid.gts';
import IconIndicator from './icon-indicator.gts';
import Tag from './tag.gts';
import Analytics from './icons/analytics.ts';
import ArrowRight from './icons/arrow-right.ts';
import Bee from './icons/bee.ts';
import Copy from './icons/copy.ts';
import DirectionFork from './icons/direction-fork.ts';
import Download from './icons/download.ts';
import Edit from './icons/edit.ts';
import Favorite from './icons/favorite.ts';
import Notification from './icons/notification.ts';
import Settings from './icons/settings.ts';
import Share from './icons/share.ts';
import Time from './icons/time.ts';
import TrashCan from './icons/trash-can.ts';
import View from './icons/view.ts';

import type { ButtonSignature } from './button.gts';
import type { CardSignature } from './card.gts';
import '#storybook/styles/card.css';

// Parity gaps with Carbon React's Card stories:
// - `CardActions` has no overflow menu yet: React collapses the actions into
//   one menu past half the header's width, so `Default` with `actionCount`
//   and the ten actions in `WithHeaderActions` all stay in the header.
// - `WithVideo`: the first card plays a local sample clip, since React's
//   YouTube watch URL isn't a video file. The iframe cards load YouTube, so
//   the story is excluded from the test run and from screenshots.

type StoryArgs = CardSignature['Args'] & {
  label: string;
  title: string;
  description: string;
  bodyText: string;
  titleTruncate: boolean;
  actionCount: number;
  /** Story-only: called on a card click, through `{{on "click"}}`. */
  onClick: () => void;
  /** Story-only: called when a header or footer action is clicked. */
  onActionClick: () => void;
};

type IconComponent = NonNullable<ButtonSignature['Args']['renderIcon']>;

const ACTION_ICONS: { icon: IconComponent; label: string }[] = [
  { icon: Edit, label: 'Edit' },
  { icon: Download, label: 'Download' },
  { icon: Settings, label: 'Settings' },
  { icon: TrashCan, label: 'Delete' },
  { icon: Share, label: 'Share' },
  { icon: Favorite, label: 'Favorite' },
  { icon: Copy, label: 'Copy' },
  { icon: View, label: 'View' },
];

const actionsFor = (count: number) => ACTION_ICONS.slice(0, count);

// As Carbon React's actions do, so a click on one doesn't reach a clickable
// card.
const stopPropagation = (event: Event) => event.stopPropagation();

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Preview/preview__Card',
  component: Card,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "A card holds content and actions about one subject. `Card` yields its parts: `Header` (with `Title`, `HeaderMedia`, `TitleMedia`, `Actions` and an AI label in its `<:decorator>` block), `Media`, `Body` and `Footer`, each action in an `Action`. `@density` picks the `productive` or `expressive` title, `@clickable` (or `@href`) makes the whole card clickable, and `@horizontal` puts the media beside a `Content` holding the header, body and footer. Don't put controls in a clickable card.",
      },
    },
  },
  decorators: [
    (Story, context) => <template>
      <div class="card-story__viewport">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
  argTypes: {
    density: { control: 'select', options: ['productive', 'expressive'] },
    renderFooterIcon: { table: { disable: true } },
    label: { control: 'text', description: 'The label above the title.' },
    title: { control: 'text', description: 'The title text.' },
    description: {
      control: 'text',
      description: 'The description below the title.',
    },
    bodyText: { control: 'text', description: 'The body copy.' },
    titleTruncate: {
      control: 'boolean',
      description: 'Cuts the title off with an ellipsis when it overflows.',
    },
    actionCount: {
      control: { type: 'number', min: 0, max: 8 },
      description: 'How many icon actions to show in the header (0 to 8).',
    },
    onClick: { table: { disable: true } },
    onActionClick: { table: { disable: true } },
  },
  args: {
    density: 'productive',
    clickable: false,
    disabled: false,
    horizontal: false,
    label: 'Example',
    title: 'Card title',
    description: '',
    bodyText: 'Use the controls panel to customise this card.',
    titleTruncate: false,
    actionCount: 0,
    onClick: spy(),
    onActionClick: spy(),
  },
});

const noControls = { controls: { disable: true } };

export const Default = meta.story({
  render: (args: StoryArgs) => <template>
    <Grid @mode="css-grid" as |g|>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card
          @density={{args.density}}
          @clickable={{args.clickable}}
          @disabled={{args.disabled}}
          @horizontal={{args.horizontal}}
          as |card|
        >
          <card.Media @ratio="16x9">
            <img src="card/placeholder-16x9.svg" alt="" width="100%" />
          </card.Media>
          <card.Header>
            <card.Title
              @label={{if args.label args.label}}
              @description={{if args.description args.description}}
              @titleTruncate={{args.titleTruncate}}
            >{{args.title}}</card.Title>
            {{#if args.actionCount}}
              <card.Actions>
                {{#each (actionsFor args.actionCount) as |item|}}
                  <card.Action>
                    <Button
                      @kind="ghost"
                      @hasIconOnly={{true}}
                      @iconDescription={{item.label}}
                      @renderIcon={{item.icon}}
                      @size="sm"
                    />
                  </card.Action>
                {{/each}}
              </card.Actions>
            {{/if}}
          </card.Header>
          <card.Body>{{args.bodyText}}</card.Body>
        </Card>
      </g.Column>
    </Grid>
  </template>,
});

Default.test('renders the title, body and media', async ({ canvas }) => {
  await expect(canvas.getByText('Card title')).toBeVisible();
  await expect(canvas.getByText('Example')).toBeVisible();
});

export const Clickable = meta.story({
  parameters: noControls,
  render: (args: StoryArgs) => <template>
    <Grid @mode="css-grid" @withRowGap={{true}} as |g|>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card
          @clickable={{true}}
          aria-labelledby="clickable-title-usage"
          {{on "click" args.onClick}}
          as |card|
        >
          <card.Media @ratio="16x9">
            <img src="card/placeholder-16x9.svg" alt="" width="100%" />
          </card.Media>
          <card.Header>
            <card.Title id="clickable-title-usage" @label="Analytics">Usage
              report</card.Title>
          </card.Header>
          <card.Body>Click anywhere on this card to trigger the action.</card.Body>
        </Card>
      </g.Column>

      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card
          @href="https://carbondesignsystem.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-labelledby="clickable-title-carbon"
          as |card|
        >
          <card.Media @ratio="16x9">
            <img src="card/placeholder-16x9.svg" alt="" width="100%" />
          </card.Media>
          <card.Header>
            <card.Title
              id="clickable-title-carbon"
              @label="External link"
            >Carbon Design System</card.Title>
          </card.Header>
          <card.Body>
            This card renders as an
            <code>&lt;a&gt;</code>
            element for true navigation semantics. Right-click or Cmd+click to
            open in a new tab.
          </card.Body>
        </Card>
      </g.Column>

      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card
          @clickable={{true}}
          @renderFooterIcon={{Share}}
          aria-labelledby="clickable-title-share"
          {{on "click" args.onClick}}
          as |card|
        >
          <card.Header>
            <card.Title id="clickable-title-share" @label="Share">Share report</card.Title>
          </card.Header>
          <card.Body>
            Pass
            <code>@renderFooterIcon</code>
            to replace the default arrow with any icon.
          </card.Body>
        </Card>
      </g.Column>

      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card
          @clickable={{true}}
          @disabled={{true}}
          aria-labelledby="clickable-title-disabled"
          {{on "click" args.onClick}}
          as |card|
        >
          <card.Header>
            <card.Title id="clickable-title-disabled" @label="Status">Disabled
              card</card.Title>
          </card.Header>
          <card.Body>
            When
            <code>@disabled</code>
            is true the card is not interactive and the footer affordance is
            visually muted.
          </card.Body>
        </Card>
      </g.Column>

      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card
          @clickable={{true}}
          @density="expressive"
          aria-labelledby="clickable-title-launch"
          {{on "click" args.onClick}}
          as |card|
        >
          <card.Media @ratio="16x9">
            <img src="card/placeholder-16x9.svg" alt="" width="100%" />
          </card.Media>
          <card.Header>
            <card.Title id="clickable-title-launch" @label="Featured">Product
              launch</card.Title>
          </card.Header>
          <card.Body>Clickable card in expressive density.</card.Body>
        </Card>
      </g.Column>

      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card
          @href="#"
          @density="expressive"
          aria-labelledby="clickable-title-quarterly"
          as |card|
        >
          <card.Header>
            <card.Title id="clickable-title-quarterly" @label="Report">Quarterly
              review</card.Title>
          </card.Header>
          <card.Body>
            Use
            <code>@href</code>
            with
            <code>@density="expressive"</code>
            for navigation cards in an editorial layout.
          </card.Body>
        </Card>
      </g.Column>
    </Grid>
  </template>,
});

Clickable.test(
  'a clickable card calls its click handler',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Usage report/ }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
);

export const Disabled = meta.story({
  parameters: noControls,
  render: () => {
    const state = trackedObject({ disabled: true });
    const toggle = () => {
      state.disabled = !state.disabled;
    };

    return <template>
      <Grid @mode="css-grid" @withRowGap={{true}} as |g|>
        <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
          <Card @disabled={{state.disabled}} as |card|>
            <card.Header>
              <card.Title>Card Title</card.Title>
            </card.Header>
            <card.Body>
              When the card is disabled, pass the same state to all interactive
              elements inside — buttons, inputs, toggles, etc.
            </card.Body>
            <card.Footer>
              <card.Action>
                <Button @kind="ghost" @size="md" @disabled={{state.disabled}}>
                  Action
                </Button>
              </card.Action>
              <card.Action>
                <Button
                  @kind="ghost"
                  @hasIconOnly={{true}}
                  @iconDescription="Download"
                  @renderIcon={{Download}}
                  @size="md"
                  @disabled={{state.disabled}}
                />
              </card.Action>
            </card.Footer>
          </Card>
        </g.Column>
        <g.Column
          @sm={{4}}
          @md={{4}}
          @lg={{4}}
          class="card-story__disabled-toggle"
        >
          <Button @kind="tertiary" @size="sm" {{on "click" toggle}}>{{if
              state.disabled
              "Enable Card"
              "Disable Card"
            }}</Button>
        </g.Column>
      </Grid>
    </template>;
  },
});

export const Minimal = meta.story({
  parameters: noControls,
  render: () => <template>
    <Grid @mode="css-grid" @withRowGap={{true}} as |g|>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Body>A minimal card with just body content.</card.Body>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.Title>Card Title</card.Title>
          </card.Header>
          <card.Body>
            This is the card body content. It can contain any custom content you
            need.
          </card.Body>
          <card.Footer>
            <Button @kind="tertiary" @size="md">Action</Button>
          </card.Footer>
        </Card>
      </g.Column>
    </Grid>
  </template>,
});

export const ProductiveAndExpressive = meta.story({
  parameters: noControls,
  render: () => <template>
    <Grid @mode="css-grid" @withRowGap={{true}} as |g|>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.Title
              @label="Category"
              @description="Uses heading-compact-02"
            >Productive Card</card.Title>
          </card.Header>
          <card.Body>
            Productive density uses compact headings (heading-compact-02) for a
            more condensed layout.
          </card.Body>
          <card.Footer>
            <card.Action>
              <Button @kind="ghost" @size="md">View details</Button>
            </card.Action>
          </card.Footer>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card @density="expressive" as |card|>
          <card.Header>
            <card.Title
              @label="Category"
              @description="Uses heading-03"
            >Expressive Card</card.Title>
          </card.Header>
          <card.Body>
            Expressive density uses larger headings (heading-03) for a more
            spacious layout.
          </card.Body>
          <card.Footer>
            <IconIndicator @kind="succeeded" @size={{16}} @label="Succeeded" />
          </card.Footer>
        </Card>
      </g.Column>
    </Grid>
  </template>,
});

// **Experimental:** `card.Header`'s `<:decorator>` block yields an `AILabel`;
// the header's own content then goes in `<:default>`.
export const WithAILabel = meta.story({
  parameters: noControls,
  render: (args: StoryArgs) => <template>
    <Grid @mode="css-grid" @withRowGap={{true}} as |g|>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <:default>
              <card.Title
                @label="AI-powered"
                @description="Generated by AI"
              >Usage Analytics</card.Title>
            </:default>
            <:decorator as |AILabel|>
              <AILabel @align="bottom" @size="xs" as |label|>
                <label.Content><AIExplanation /></label.Content>
              </AILabel>
            </:decorator>
          </card.Header>
          <card.Body>
            This card demonstrates the AI label feature with a blue gradient
            border indicating AI-generated content.
          </card.Body>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <:default>
              <card.HeaderMedia><Analytics /></card.HeaderMedia>
              <card.Title @description="AI-generated summary">Performance
                Insights</card.Title>
            </:default>
            <:decorator as |AILabel|>
              <AILabel @align="bottom" @size="xs" as |label|>
                <label.Content><AIExplanation /></label.Content>
              </AILabel>
            </:decorator>
          </card.Header>
          <card.Body>Card with AI label and header media slot (icon).</card.Body>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <:default>
              <card.Title>Smart Recommendations Long title</card.Title>
              <card.Actions>
                <card.Action>
                  <Button
                    @kind="ghost"
                    @hasIconOnly={{true}}
                    @iconDescription="Edit"
                    @renderIcon={{Edit}}
                    @size="sm"
                    {{on "click" stopPropagation}}
                    {{on "click" args.onActionClick}}
                  />
                </card.Action>
                <card.Action>
                  <Button
                    @kind="ghost"
                    @hasIconOnly={{true}}
                    @iconDescription="Delete"
                    @renderIcon={{TrashCan}}
                    @size="sm"
                    {{on "click" stopPropagation}}
                    {{on "click" args.onActionClick}}
                  />
                </card.Action>
              </card.Actions>
            </:default>
            <:decorator as |AILabel|>
              <AILabel @align="bottom" @size="xs" as |label|>
                <label.Content><AIExplanation /></label.Content>
              </AILabel>
            </:decorator>
          </card.Header>
          <card.Body>
            Card with AI label and actions. Note how the actions are positioned
            to the left of the AI label with proper spacing.
          </card.Body>
          <card.Footer>
            <Button @size="sm" @kind="tertiary">View Details</Button>
          </card.Footer>
        </Card>
      </g.Column>
    </Grid>
  </template>,
});

export const WithFlushBody = meta.story({
  parameters: noControls,
  render: () => <template>
    <Grid @mode="css-grid" @withRowGap={{true}} as |g|>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.Title>Default body</card.Title>
          </card.Header>
          <card.Body>
            <div class="card-story__flush-box">Content with 16px body padding</div>
          </card.Body>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.Title>Flush body</card.Title>
          </card.Header>
          <card.Body @isFlush={{true}}>
            <div class="card-story__flush-box">Content fills edge-to-edge</div>
          </card.Body>
        </Card>
      </g.Column>
    </Grid>
  </template>,
});

export const WithHeaderActions = meta.story({
  parameters: noControls,
  render: (args: StoryArgs) => <template>
    <Grid @mode="css-grid" @withRowGap={{true}} as |g|>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card {{on "click" args.onClick}} as |card|>
          <card.Header>
            <card.Title @label="Project" @description="Due in 3 days">Website
              Redesign</card.Title>
            <card.Actions>
              <card.Action>
                <Button
                  @kind="ghost"
                  @hasIconOnly={{true}}
                  @iconDescription="Edit"
                  @renderIcon={{Edit}}
                  @size="sm"
                  {{on "click" stopPropagation}}
                  {{on "click" args.onActionClick}}
                />
              </card.Action>
              <card.Action>
                <Button
                  @kind="ghost"
                  @hasIconOnly={{true}}
                  @iconDescription="Delete"
                  @renderIcon={{TrashCan}}
                  @size="sm"
                  {{on "click" stopPropagation}}
                  {{on "click" args.onActionClick}}
                />
              </card.Action>
            </card.Actions>
          </card.Header>
          <card.Body>
            This clickable card has action buttons in the header that prevent
            click propagation.
          </card.Body>
          <card.Footer>
            <card.Action>
              <Button @kind="ghost" @size="md">View report</Button>
            </card.Action>
            <card.Action>
              <Button
                @kind="ghost"
                @hasIconOnly={{true}}
                @iconDescription="Share"
                @renderIcon={{Share}}
                @size="md"
              />
            </card.Action>
            <card.Action>
              <Button
                @kind="ghost"
                @hasIconOnly={{true}}
                @iconDescription="Download"
                @renderIcon={{Download}}
                @size="md"
              />
            </card.Action>
          </card.Footer>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.Title
              @label="Category"
              @description="Last updated 2 hours ago"
            >Project dashboard</card.Title>
            <card.Actions>
              {{#each (actionsFor 8) as |item|}}
                <card.Action>
                  <Button
                    @kind="ghost"
                    @hasIconOnly={{true}}
                    @iconDescription={{item.label}}
                    @renderIcon={{item.icon}}
                    @size="sm"
                  />
                </card.Action>
              {{/each}}
              <card.Action>
                <Button
                  @kind="ghost"
                  @hasIconOnly={{true}}
                  @iconDescription="Notification"
                  @renderIcon={{Notification}}
                  @size="sm"
                />
              </card.Action>
              <card.Action>
                <Button
                  @kind="ghost"
                  @hasIconOnly={{true}}
                  @iconDescription="Analytics"
                  @renderIcon={{Analytics}}
                  @size="sm"
                />
              </card.Action>
            </card.Actions>
          </card.Header>
          <card.Body>
            Multiple action buttons can be placed in the header alongside label,
            title, and description. Actions are right-aligned and maintain
            proper spacing.
          </card.Body>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.Title>Usage metrics</card.Title>
            <card.Actions>
              <card.Action>
                <Button @kind="tertiary" @size="sm">Action</Button>
              </card.Action>
            </card.Actions>
          </card.Header>
          <card.Body>
            Text actions use Carbon's small ghost button for actions that
            require text labels instead of icons.
          </card.Body>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.Title>Usage metrics</card.Title>
            <card.Actions>
              <card.Action>
                <Button @kind="tertiary" @size="sm">Export</Button>
              </card.Action>
              <card.Action>
                <Button @kind="tertiary" @size="sm">Share</Button>
              </card.Action>
              <card.Action>
                <Button @kind="tertiary" @size="sm">View report</Button>
              </card.Action>
            </card.Actions>
          </card.Header>
          <card.Body>Multiple text actions in the header.</card.Body>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.Title
              @label="Category"
              @labelTruncate={{true}}
              @description="This is a lengthy description that will be clamped to exactly two lines using multi-line truncation so you can see how it interacts with the action buttons above"
              @descriptionTruncate={{true}}
              @titleTruncate={{2}}
            >This is a very long card title that wraps across multiple lines in
              a narrow container</card.Title>
            <card.Actions>
              <card.Action>
                <Button
                  @kind="ghost"
                  @hasIconOnly={{true}}
                  @iconDescription="Edit"
                  @renderIcon={{Edit}}
                  @size="sm"
                />
              </card.Action>
              <card.Action>
                <Button
                  @kind="ghost"
                  @hasIconOnly={{true}}
                  @iconDescription="Favorite"
                  @renderIcon={{Favorite}}
                  @size="sm"
                />
              </card.Action>
              <card.Action>
                <Button
                  @kind="ghost"
                  @hasIconOnly={{true}}
                  @iconDescription="Share"
                  @renderIcon={{Share}}
                  @size="sm"
                />
              </card.Action>
            </card.Actions>
          </card.Header>
          <card.Body>
            Truncated label (single line ellipsis), long wrapping title, and
            description clamped to 2 lines — all alongside header actions.
          </card.Body>
        </Card>
      </g.Column>
    </Grid>
  </template>,
});

export const WithHeaderMedia = meta.story({
  parameters: noControls,
  render: (args: StoryArgs) => <template>
    <Grid @mode="css-grid" @withRowGap={{true}} as |g|>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.HeaderMedia><Analytics /></card.HeaderMedia>
            <card.Actions>
              <card.Action>
                <Button
                  @kind="ghost"
                  @hasIconOnly={{true}}
                  @iconDescription="Edit"
                  @renderIcon={{Edit}}
                  @size="sm"
                  {{on "click" stopPropagation}}
                  {{on "click" args.onActionClick}}
                />
              </card.Action>
              <card.Action>
                <Button
                  @kind="ghost"
                  @hasIconOnly={{true}}
                  @iconDescription="Delete"
                  @renderIcon={{TrashCan}}
                  @size="sm"
                  {{on "click" stopPropagation}}
                  {{on "click" args.onActionClick}}
                />
              </card.Action>
            </card.Actions>
            <card.Title @description="Real-time metrics">Analytics Dashboard</card.Title>
          </card.Header>
          <card.Body>
            This card demonstrates the icon slot (first child) with action
            buttons on the right.
          </card.Body>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.HeaderMedia>
              <img
                class="card-story__header-image"
                src="card/illustration-img-1.png"
                alt="A sample illustration"
              />
            </card.HeaderMedia>
            <card.Title>Card with Image</card.Title>
          </card.Header>
          <card.Body>The icon slot can contain an image element.</card.Body>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.HeaderMedia><Tag @type="blue">New</Tag></card.HeaderMedia>
            <card.Title>Card with Tag</card.Title>
          </card.Header>
          <card.Body>The icon slot can contain a Tag component.</card.Body>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.HeaderMedia>
              <IconIndicator
                @kind="succeeded"
                @size={{16}}
                @label="Succeeded"
              />
            </card.HeaderMedia>
            <card.Title>Card with Status</card.Title>
          </card.Header>
          <card.Body>
            The icon slot can contain an IconIndicator component.
          </card.Body>
        </Card>
      </g.Column>
    </Grid>
  </template>,
});

export const WithHorizontalMedia = meta.story({
  parameters: noControls,
  render: () => <template>
    <Grid @mode="css-grid" @withRowGap={{true}} as |g|>
      <g.Column @sm={{4}} @md={{4}} @lg={{8}}>
        <Card @horizontal={{true}} as |card|>
          <card.Media>
            <img
              class="card-story__fill"
              src="card/placeholder-1x1.svg"
              alt="Placeholder"
            />
          </card.Media>
          <card.Content>
            <card.Header>
              <card.Title @label="Get started">Generate synthetic tabular data</card.Title>
            </card.Header>
            <card.Body>
              Prepare your data and generate synthetic tabular data using
              AI-assisted tooling.
            </card.Body>
            <card.Footer>
              <Button @kind="tertiary" @size="md" @renderIcon={{ArrowRight}}>
                Start
              </Button>
            </card.Footer>
          </card.Content>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{8}}>
        <Card @horizontal={{true}} as |card|>
          <card.Media @mediaWidth="50%">
            <img
              class="card-story__fill"
              src="card/placeholder-16x9.svg"
              alt="Placeholder"
            />
          </card.Media>
          <card.Content>
            <card.Header>
              <card.Title>Custom media width</card.Title>
            </card.Header>
            <card.Body>
              Pass @mediaWidth="50%" to control the media column width. Accepts
              any valid CSS value.
            </card.Body>
            <card.Footer>
              <card.Action>
                <Button @kind="ghost" @size="md" @renderIcon={{ArrowRight}}>
                  Learn more
                </Button>
              </card.Action>
            </card.Footer>
          </card.Content>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{8}}>
        <Card @horizontal={{true}} as |card|>
          <card.Content>
            <card.Header>
              <card.Title>Content before media</card.Title>
            </card.Header>
            <card.Body>
              When card.Media comes after card.Content in the template, it is
              rendered on the right.
            </card.Body>
            <card.Footer>
              <card.Action>
                <Button @kind="ghost" @size="md" @renderIcon={{ArrowRight}}>
                  Learn more
                </Button>
              </card.Action>
            </card.Footer>
          </card.Content>
          <card.Media>
            <img
              class="card-story__fill"
              src="card/placeholder-1x1.svg"
              alt="Placeholder"
            />
          </card.Media>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{8}}>
        <Card @horizontal={{true}} @density="expressive" as |card|>
          <card.Content>
            <card.Header>
              <card.HeaderMedia><DirectionFork
                  @size={{32}}
                /></card.HeaderMedia>
              <card.Title @label="Prepare your data">Generate synthetic tabular
                data</card.Title>
            </card.Header>
            <card.Footer>
              <div class="card-story__time"><Time /> 12:00 PM</div>
              <card.Action>
                <Button
                  @kind="ghost"
                  @hasIconOnly={{true}}
                  @iconDescription="Next"
                  @renderIcon={{ArrowRight}}
                  @size="md"
                />
              </card.Action>
            </card.Footer>
          </card.Content>
          <card.Media>
            <img
              class="card-story__fill"
              src="card/placeholder-1x1.svg"
              alt="Placeholder"
            />
          </card.Media>
        </Card>
      </g.Column>
    </Grid>
  </template>,
});

export const WithIcon = meta.story({
  parameters: noControls,
  render: (args: StoryArgs) => <template>
    <Grid @mode="css-grid" @withRowGap={{true}} as |g|>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.HeaderMedia><Analytics /></card.HeaderMedia>
            <card.Title @description="Real-time metrics">Analytics Dashboard</card.Title>
          </card.Header>
          <card.Body>
            This card includes a small icon (16px) alongside the title.
          </card.Body>
          <card.Footer>
            <card.Action>
              <Button @kind="ghost" @size="md">View report</Button>
            </card.Action>
            <card.Action>
              <Button
                @kind="ghost"
                @hasIconOnly={{true}}
                @iconDescription="View report"
                @renderIcon={{Share}}
                @size="md"
              />
            </card.Action>
            <card.Action>
              <Button
                @kind="ghost"
                @hasIconOnly={{true}}
                @iconDescription="View"
                @renderIcon={{View}}
                @size="md"
                {{on "click" stopPropagation}}
                {{on "click" args.onActionClick}}
              />
            </card.Action>
            <card.Action>
              <Button
                @kind="ghost"
                @hasIconOnly={{true}}
                @iconDescription="Download"
                @renderIcon={{Download}}
                @size="md"
                {{on "click" stopPropagation}}
                {{on "click" args.onActionClick}}
              />
            </card.Action>
          </card.Footer>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.HeaderMedia><Favorite @size={{32}} /></card.HeaderMedia>
            <card.Title @description="Your saved content">Favorite Items</card.Title>
          </card.Header>
          <card.Body>
            This card includes a larger icon (32px) for more prominence.
          </card.Body>
          <card.Footer>
            <Button @kind="tertiary" @size="md">Learn more</Button>
          </card.Footer>
        </Card>
      </g.Column>
    </Grid>
  </template>,
});

export const WithMedia = meta.story({
  parameters: noControls,
  render: () => <template>
    <Grid @mode="css-grid" @withRowGap={{true}} as |g|>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Media @ratio="16x9">
            <img
              src="card/placeholder-16x9.svg"
              alt="Placeholder 16:9 ratio"
              width="100%"
            />
          </card.Media>
          <card.Header>
            <card.Title
              @label="Featured"
              @description="Join us for the big reveal"
            >Product Launch Event</card.Title>
          </card.Header>
          <card.Body>
            This card features a 16:9 aspect ratio media slot at the top.
          </card.Body>
          <card.Footer>
            <div class="card-story__status">
              <IconIndicator
                @kind="in-progress"
                @size={{16}}
                @label="In progress"
              />
            </div>
            <card.Action>
              <Button
                @kind="ghost"
                @hasIconOnly={{true}}
                @iconDescription="View report"
                @renderIcon={{Share}}
                @size="md"
              />
            </card.Action>
          </card.Footer>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Media @ratio="1x1">
            <img
              src="card/placeholder-1x1.svg"
              alt="Placeholder 1:1 ratio"
              width="100%"
            />
          </card.Media>
          <card.Header>
            <card.Title @description="Perfect for profile images">Square Format</card.Title>
          </card.Header>
          <card.Body>
            This card uses a 1:1 (square) aspect ratio for the media.
          </card.Body>
          <card.Footer>
            <card.Action>
              <Button @kind="ghost" @size="md">Cancel</Button>
            </card.Action>
            <card.Action>
              <Button @kind="secondary" @size="md" @renderIcon={{ArrowRight}}>
                Confirm
              </Button>
            </card.Action>
          </card.Footer>
        </Card>
      </g.Column>
    </Grid>
  </template>,
});

export const WithTitleLeadingIcon = meta.story({
  parameters: noControls,
  render: () => <template>
    <Grid @mode="css-grid" @withRowGap={{true}} as |g|>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.Title>
              <:titleStart><Bee @size={{16}} /></:titleStart>
              <:default>Analytics dashboard</:default>
            </card.Title>
          </card.Header>
          <card.Body>
            The leading icon adapts to the title size. In productive density,
            use 16px icons.
          </card.Body>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card @density="expressive" as |card|>
          <card.Header>
            <card.Title>
              <:titleStart><Bee @size={{24}} /></:titleStart>
              <:default>Analytics dashboard</:default>
            </card.Title>
          </card.Header>
          <card.Body>
            The leading icon adapts to the title size. In expressive density,
            use 24px icons.
          </card.Body>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.Title @titleTruncate={{2}}>
              <:titleStart><Bee @size={{16}} /></:titleStart>
              <:default>Example of long title text that wraps onto two lines</:default>
            </card.Title>
          </card.Header>
          <card.Body>
            When the title wraps to multiple lines, the icon stays top-aligned
            with 2px padding to center with the first line.
          </card.Body>
        </Card>
      </g.Column>
    </Grid>
  </template>,
});

export const WithTitleMedia = meta.story({
  parameters: noControls,
  render: (args: StoryArgs) => <template>
    <Grid @mode="css-grid" @withRowGap={{true}} as |g|>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.TitleMedia>
              <img
                src="card/classic-rebus.png"
                alt="IBM Classic Rebus"
                width="48"
                height="48"
              />
            </card.TitleMedia>
            <card.Title
              @label="Label"
              @description="The title media slot positions an icon to the left of the title text"
            >Card with title icon</card.Title>
          </card.Header>
          <card.Body>
            CardTitleMedia provides a media slot positioned to the left of the
            card title. The media adapts to the heading area height (min 48px,
            max 64px).
          </card.Body>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.TitleMedia>
              <img
                src="card/classic-rebus.png"
                alt="IBM Classic Rebus"
                width="64"
                height="64"
              />
            </card.TitleMedia>
            <card.Title
              @label="Label"
              @description="The title media slot positions an icon to the left of the title text"
            >Card with title icon</card.Title>
          </card.Header>
          <card.Body>
            CardTitleMedia provides a media slot positioned to the left of the
            card title. The media adapts to the heading area height (min 48px,
            max 64px).
          </card.Body>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.TitleMedia>
              <img
                src="card/classic-rebus.png"
                alt="IBM Classic Rebus"
                width="48"
                height="48"
              />
            </card.TitleMedia>
            <card.Title
              @label="Label"
              @description="The title media slot positions an icon to the left of the title text"
            >Card with title icon</card.Title>
            <card.Actions>
              <card.Action>
                <Button
                  @kind="ghost"
                  @hasIconOnly={{true}}
                  @iconDescription="Edit"
                  @renderIcon={{Edit}}
                  @size="sm"
                  {{on "click" stopPropagation}}
                  {{on "click" args.onActionClick}}
                />
              </card.Action>
              <card.Action>
                <Button
                  @kind="ghost"
                  @hasIconOnly={{true}}
                  @iconDescription="Delete"
                  @renderIcon={{TrashCan}}
                  @size="sm"
                  {{on "click" stopPropagation}}
                  {{on "click" args.onActionClick}}
                />
              </card.Action>
            </card.Actions>
          </card.Header>
          <card.Body>
            CardTitleMedia provides a media slot positioned to the left of the
            card title. The media adapts to the heading area height (min 48px,
            max 64px).
          </card.Body>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Media @ratio="16x9">
            <img
              src="card/placeholder-16x9.svg"
              alt="Placeholder 16:9 ratio"
              width="100%"
            />
          </card.Media>
          <card.Header>
            <card.HeaderMedia>
              <IconIndicator
                @kind="succeeded"
                @size={{16}}
                @label="Succeeded"
              />
            </card.HeaderMedia>
            <card.TitleMedia>
              <img
                src="card/classic-rebus.png"
                alt="IBM Classic Rebus"
                width="48"
                height="48"
              />
            </card.TitleMedia>
            <card.Title
              @label="Label"
              @description="The title media slot positions an icon to the left of the title text"
            >Card with title icon</card.Title>
            <card.Actions>
              <card.Action>
                <Button
                  @kind="ghost"
                  @hasIconOnly={{true}}
                  @iconDescription="Edit"
                  @renderIcon={{Edit}}
                  @size="sm"
                  {{on "click" stopPropagation}}
                  {{on "click" args.onActionClick}}
                />
              </card.Action>
              <card.Action>
                <Button
                  @kind="ghost"
                  @hasIconOnly={{true}}
                  @iconDescription="Delete"
                  @renderIcon={{TrashCan}}
                  @size="sm"
                  {{on "click" stopPropagation}}
                  {{on "click" args.onActionClick}}
                />
              </card.Action>
            </card.Actions>
          </card.Header>
          <card.Body>
            CardTitleMedia provides a media slot positioned to the left of the
            card title. The media adapts to the heading area height (min 48px,
            max 64px).
          </card.Body>
        </Card>
      </g.Column>
    </Grid>
  </template>,
});

export const WithTitleTrailingIcon = meta.story({
  parameters: noControls,
  render: () => <template>
    <Grid @mode="css-grid" @withRowGap={{true}} as |g|>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.Title>
              <:default>Analytics dashboard</:default>
              <:titleEnd><Bee @size={{16}} /></:titleEnd>
            </card.Title>
          </card.Header>
          <card.Body>
            The trailing icon adapts to the title size. In productive density,
            use 16px icons.
          </card.Body>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card @density="expressive" as |card|>
          <card.Header>
            <card.Title>
              <:default>Analytics dashboard</:default>
              <:titleEnd><Bee @size={{24}} /></:titleEnd>
            </card.Title>
          </card.Header>
          <card.Body>
            The trailing icon adapts to the title size. In expressive density,
            use 24px icons.
          </card.Body>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.Title @titleTruncate={{2}}>
              <:default>Example of long title text that wraps into three lines
                with icon</:default>
              <:titleEnd><Bee @size={{16}} /></:titleEnd>
            </card.Title>
          </card.Header>
          <card.Body>
            When the title wraps to multiple lines, the icon stays inline with
            the text on the last line with 8px gap.
          </card.Body>
        </Card>
      </g.Column>
    </Grid>
  </template>,
});

export const WithTruncatedTitle = meta.story({
  parameters: noControls,
  render: () => <template>
    <Grid @mode="css-grid" @withRowGap={{true}} as |g|>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.Title
              @titleTruncate={{true}}
              @description="Single-line truncation example"
            >This is a very long title that will be truncated with an ellipsis
              when it exceeds the maximum width</card.Title>
          </card.Header>
          <card.Body>
            The title is truncated to a single line with an ellipsis.
          </card.Body>
          <card.Footer>
            <card.Action>
              <Button
                @kind="ghost"
                @hasIconOnly={{true}}
                @iconDescription="Share"
                @renderIcon={{Share}}
                @size="md"
              />
            </card.Action>
            <card.Action>
              <Button
                @kind="ghost"
                @hasIconOnly={{true}}
                @iconDescription="Download"
                @renderIcon={{Download}}
                @size="md"
              />
            </card.Action>
          </card.Footer>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.Title
              @titleTruncate={{3}}
              @description="Multi-line truncation example"
            >This is a very long title that will be truncated after three lines.
              It demonstrates the multi-line truncation feature using WebKit
              line clamp. Any content beyond three lines will be hidden with an
              ellipsis.</card.Title>
          </card.Header>
          <card.Body>
            The title is truncated to three lines with an ellipsis.
          </card.Body>
          <card.Footer>
            <div class="card-story__status">
              <IconIndicator @kind="failed" @size={{16}} @label="Failed" />
            </div>
            <card.Action>
              <Button
                @kind="ghost"
                @hasIconOnly={{true}}
                @iconDescription="Retry"
                @renderIcon={{View}}
                @size="md"
              />
            </card.Action>
          </card.Footer>
        </Card>
      </g.Column>
    </Grid>
  </template>,
});

// Loads YouTube in iframes, so it stays out of the test run and screenshots.
export const WithVideo = meta.story({
  tags: ['!test'],
  parameters: {
    ...noControls,
    // The iframes load from the network and never settle the same way twice.
    screenshot: { disable: true },
  },
  render: () => <template>
    <Grid @mode="css-grid" @withRowGap={{true}} as |g|>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Header>
            <card.Title
              @description="Watch our latest feature walkthrough"
            >Product demo video</card.Title>
          </card.Header>
          <card.Media @ratio="16x9">
            <video class="card-story__video" controls>
              <source src="demo-support/sample-video.mp4" type="video/mp4" />
              <track
                kind="captions"
                src="demo-support/sample-captions.vtt"
                srclang="en"
                label="English"
              />
              Your browser does not support the video tag.
            </video>
          </card.Media>
          <card.Body>
            Video content fills the AspectRatio container and maintains the 16:9
            aspect ratio.
          </card.Body>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Media @ratio="16x9">
            <iframe
              class="card-story__video"
              src="https://www.youtube.com/embed/Veg7njIKUm4?si=B9yWeUzcFHI4ITD1&amp;controls=0"
              title="Tutorial series video"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
            ></iframe>
          </card.Media>
          <card.Header>
            <card.Title @description="Getting started guide">Tutorial series</card.Title>
          </card.Header>
          <card.Body>
            Videos can include a poster image that displays before playback
            starts.
          </card.Body>
        </Card>
      </g.Column>
      <g.Column @sm={{4}} @md={{4}} @lg={{4}}>
        <Card as |card|>
          <card.Media @ratio="16x9">
            <iframe
              class="card-story__video"
              src="https://www.youtube.com/embed/Veg7njIKUm4?si=B9yWeUzcFHI4ITD1&amp;controls=0"
              title="Featured video"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
            ></iframe>
          </card.Media>
        </Card>
      </g.Column>
    </Grid>
  </template>,
});
