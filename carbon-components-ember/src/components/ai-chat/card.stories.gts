import { htmlSafe } from '@ember/template';
import { fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import AiChatCard from './card.gts';
import AiChatCardFooter from './card-footer.gts';
import ArrowRight from '../icons/arrow-right.ts';
import Launch from '../icons/launch.ts';

import type { Args as CardArgs } from './card.gts';
import type { CardFooterAction } from './card-footer.gts';

// Mirrors `@carbon/ai-chat-components`' `Components/Card` stories
// (card/__stories__/card.stories.js). Upstream's `CardFooter` story lives in
// `AI Chat/Card/Card Footer` (card-footer.stories.gts), next to the
// `AiChatCardFooter` component it documents.
//
// Parity gaps:
// - `AiChatCardFooter` has no `size` arg (upstream's `footerSize`
//   `md`/`lg`), and actions carry no `payload`.
// - Upstream's media slot sets `data-rounded`; `AiChatCard` doesn't
//   implement externally-set rounding (see its class doc).
// - Upstream uses a bundled `placeholder.png`; an inline SVG data URI stands
//   in for it here.
// - `WithAudio` and `OnlyVideo` embed SoundCloud/YouTube iframes from the
//   network, so they're excluded from the test run (`!test` tag).

// upstream card/__stories__/story-data.js `cardFooterPresets`, minus the
// `payload` field `CardFooterAction` doesn't have.
const CARD_FOOTER_PRESETS: Record<string, CardFooterAction[]> = {
  'primary danger buttons': [
    { id: 'primary', label: 'Primary', kind: 'primary' },
    { id: 'danger', label: 'Danger', kind: 'danger' },
  ],
  'ghost button with icon': [
    { id: 'docs', label: 'View carbon docs', kind: 'ghost', icon: Launch },
  ],
  'secondary button': [
    { id: 'secondary', label: 'Secondary', kind: 'secondary', icon: Launch },
  ],
  '3 ghost buttons vertical': [
    { id: 'docs1', label: 'View Carbon Docs 1', kind: 'ghost', icon: Launch },
    { id: 'docs2', label: 'View Carbon Docs 2', kind: 'ghost', icon: Launch },
    { id: 'docs3', label: 'View Carbon Docs 3', kind: 'ghost', icon: Launch },
  ],
  'primary button': [{ id: 'primary', label: 'Primary', kind: 'primary' }],
  'primary button with icon': [
    { id: 'primary-icon', label: 'Primary', kind: 'primary', icon: ArrowRight },
  ],
  'danger button': [{ id: 'danger', label: 'Danger', kind: 'danger' }],
  'ghost button': [{ id: 'ghost', label: 'Ghost', kind: 'ghost' }],
  'secondary primary buttons': [
    { id: 'secondary', label: 'Secondary', kind: 'secondary' },
    { id: 'primary', label: 'Primary', kind: 'primary' },
  ],
};

// Stands in for upstream's bundled `placeholder.png`.
const PLACEHOLDER_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"><rect width="16" height="9" fill="#8d8d8d"/></svg>',
)}`;

const MAX_WIDTHS = {
  unset: 'none',
  sm: '291px',
  md: '438px',
  lg: '535px',
} as const;

type StoryArgs = CardArgs & {
  /** Story-only: max width of the story wrapper (not the card itself). */
  maxWidth?: keyof typeof MAX_WIDTHS;
  /** Story-only: preset actions shown in an `AiChatCardFooter`. */
  footerActions?: string;
  /** Story-only: called with the clicked footer action. */
  onAction?: (action: CardFooterAction) => void;
  /** Story-only: URL of the image in the media block. */
  image?: string;
  /** Story-only: URL of the audio iframe in the media block. */
  audio?: string;
  /** Story-only: URL of the video iframe in the media block. */
  video?: string;
};

const maxWidthStyle = (maxWidth: StoryArgs['maxWidth']) =>
  htmlSafe(`max-width: ${MAX_WIDTHS[maxWidth ?? 'unset']}`);

const footerActionsFor = (preset: StoryArgs['footerActions']) =>
  preset ? CARD_FOOTER_PRESETS[preset] : undefined;

const CardContent = <template>
  <div style="padding: 1rem;">
    <h4 style="margin: 0 0 0.75rem;">AI Chat Card</h4>
    <p style="margin: 0; color: var(--cds-text-secondary);">
      The Carbon Design System provides a comprehensive library of components,
      tokens, and guidelines. We need to implement the new AI Chat component
      following Carbon's design principles and accessibility standards.
    </p>
  </div>
</template>;

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/Card',
  component: AiChatCard,
  parameters: {
    docs: {
      description: {
        component: `\`AiChatCard\` is a card container for
[Carbon AI Chat](https://github.com/carbon-design-system/carbon-ai-chat),
typically rendered inside a message in \`ChatShell\`'s \`<:messages>\` block.
Content is supplied through \`<:header>\`, \`<:media>\`, \`<:body>\`, \`<:footer>\`
(commonly an \`AiChatCardFooter\`), and \`<:decorator>\` named blocks.`,
      },
    },
  },
  argTypes: {
    maxWidth: {
      control: 'radio',
      options: Object.keys(MAX_WIDTHS),
    },
    footerActions: {
      control: 'select',
      options: Object.keys(CARD_FOOTER_PRESETS),
    },
  },
  args: {
    isLayered: false,
    isFlush: true,
    maxWidth: 'sm',
    onAction: fn(),
  },
  render: (args) => <template>
    <div style={{maxWidthStyle args.maxWidth}}>
      <AiChatCard @isLayered={{args.isLayered}} @isFlush={{args.isFlush}}>
        <:body><CardContent /></:body>
      </AiChatCard>
    </div>
  </template>,
});

export const Default = meta.story();

export const WithActions = meta.story({
  args: {
    footerActions: 'primary danger buttons',
  },
  render: (args) => <template>
    <div style={{maxWidthStyle args.maxWidth}}>
      <AiChatCard @isLayered={{args.isLayered}} @isFlush={{args.isFlush}}>
        <:body><CardContent /></:body>
        <:footer>
          <AiChatCardFooter
            @actions={{footerActionsFor args.footerActions}}
            @onAction={{args.onAction}}
          />
        </:footer>
      </AiChatCard>
    </div>
  </template>,
});

export const WithImage = meta.story({
  args: {
    footerActions: 'primary danger buttons',
    image: PLACEHOLDER_IMAGE,
  },
  render: (args) => <template>
    <div style={{maxWidthStyle args.maxWidth}}>
      <AiChatCard @isLayered={{args.isLayered}} @isFlush={{args.isFlush}}>
        <:media>
          <div style="display: flex;">
            <img
              src={{args.image}}
              alt="Card"
              style="aspect-ratio: 16 / 9; inline-size: 100%;"
            />
          </div>
        </:media>
        <:body><CardContent /></:body>
        <:footer>
          <AiChatCardFooter
            @actions={{footerActionsFor args.footerActions}}
            @onAction={{args.onAction}}
          />
        </:footer>
      </AiChatCard>
    </div>
  </template>,
});

export const OnlyImage = meta.story({
  args: {
    image: PLACEHOLDER_IMAGE,
  },
  render: (args) => <template>
    <div style={{maxWidthStyle args.maxWidth}}>
      <AiChatCard @isLayered={{args.isLayered}} @isFlush={{args.isFlush}}>
        <:media>
          <div style="display: flex;">
            <img
              src={{args.image}}
              alt="Card"
              style="aspect-ratio: 16 / 9; inline-size: 100%;"
            />
          </div>
        </:media>
      </AiChatCard>
    </div>
  </template>,
});

export const WithAudio = meta.story({
  tags: ['!test'],
  args: {
    audio:
      'https://w.soundcloud.com/player/?url=https://soundcloud.com/kelab-gklm/baby-shark-do-do-do&visual=true&buying=false&liking=false&download=false&sharing=false&show_comments=false&show_playcount=false&callback=true',
  },
  render: (args) => <template>
    <div style={{maxWidthStyle args.maxWidth}}>
      <AiChatCard @isLayered={{args.isLayered}} @isFlush={{args.isFlush}}>
        <:media>
          <div style="display: flex;">
            <iframe
              title="audio example"
              allow="autoplay"
              src={{args.audio}}
              style="aspect-ratio: 16 / 9; inline-size: 100%; border: 0;"
            ></iframe>
          </div>
        </:media>
        <:body>
          <div style="padding: 1rem;">
            <h4 style="margin: 0;">An audio clip from SoundCloud</h4>
            <p style="margin: 0; color: var(--cds-text-secondary);">
              This description and the title above are optional.
            </p>
          </div>
        </:body>
      </AiChatCard>
    </div>
  </template>,
});

export const OnlyVideo = meta.story({
  tags: ['!test'],
  args: {
    maxWidth: 'md',
    video: 'https://www.youtube.com/embed/QuW4_bRHbUk?si=oSsaxYKCvO_gEuzN',
  },
  render: (args) => <template>
    <div style={{maxWidthStyle args.maxWidth}}>
      <AiChatCard @isLayered={{args.isLayered}} @isFlush={{args.isFlush}}>
        <:media>
          <div style="display: flex;">
            <iframe
              src={{args.video}}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
              style="aspect-ratio: 16 / 9; inline-size: 100%; border: 0;"
            ></iframe>
          </div>
        </:media>
      </AiChatCard>
    </div>
  </template>,
});

export const Variants = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "The default card, a layered card (`@isLayered`, Carbon's layered-tile styling instead of the chat shell's default background) and a flush card (`@isFlush`, no default padding, useful when the body needs to reach the card's edges).",
      },
    },
  },
  render: () => <template>
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <AiChatCard style="max-inline-size: 18rem;">
        <:header><h5>Default card</h5></:header>
        <:body>Card content goes here.</:body>
      </AiChatCard>
      <AiChatCard @isLayered={{true}} style="max-inline-size: 18rem;">
        <:header><h5>Layered card</h5></:header>
        <:body>Uses Carbon's layered-tile styling instead of the chat shell's
          default background.</:body>
      </AiChatCard>
      <AiChatCard @isFlush={{true}} style="max-inline-size: 18rem;">
        <:header><h5>Flush card</h5></:header>
        <:body>Removes the default padding, useful when the body needs to reach
          the card's edges.</:body>
      </AiChatCard>
    </div>
  </template>,
});
