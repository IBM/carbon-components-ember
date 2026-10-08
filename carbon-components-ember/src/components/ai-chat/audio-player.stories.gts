import { trackedObject } from '@ember/reactive/collections';
import { expect, fn, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from '../button.gts';
import AudioPlayer from './audio-player.gts';
import AiChatCard from './card.gts';

import type { AudioPlayerSignature } from './audio-player.gts';

// Mirrors `@carbon/ai-chat-components`' `Components/Audio player` stories
// (audio-player/__stories__/audio-player.stories.js).
//
// Parity gaps:
// - Upstream's `aspectRatioPercentage` arg has no Ember equivalent
//   (AudioPlayer has no dynamic aspect ratio to set).
// - Upstream's `WithTranscript` story renders a sibling
//   `cds-aichat-transcript` element, which isn't ported. The story below
//   shows the same card without the transcript.
// - Upstream sets `data-rounded="top"` on the player inside a card; the
//   rounded-modifiers mixins aren't ported (see AudioPlayer's class doc).
//
// The native-audio stories play a real sample, `demo-support/sample-audio.mp3`,
// served from `.storybook/public/` (relative to the preview, so it works under
// any deploy path, and keeps the tests offline).
//
// SoundCloud stories load the SoundCloud Widget API from the network, so
// they are excluded from the test run (`!test` tag) to keep it deterministic.

const NATIVE_AUDIO_SOURCE = 'demo-support/sample-audio.mp3';

const SOUNDCLOUD_SOURCE =
  'https://soundcloud.com/ibmthinkleaders/leveraging-ai-to-tackle-large-problems-being-an-optimistic-futurist-feat-kate-oneill';

type StoryArgs = AudioPlayerSignature['Args'] & {
  /** Story-only: wrap the player in an `AiChatCard` with a title/description. */
  useCard?: boolean;
  /** Story-only: card title. */
  title?: string;
  /** Story-only: card description. */
  description?: string;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/Audio player',
  component: AudioPlayer,
  parameters: {
    docs: {
      description: {
        component: `\`AudioPlayer\` plays audio for
[Carbon AI Chat](https://github.com/carbon-design-system/carbon-ai-chat).
It supports native \`<audio>\` files (mp3, wav, m4a, aac, ...) and SoundCloud
track URLs, auto-detected from \`@source\`. A source it doesn't recognize
surfaces \`@errorMessage\` through the error state and \`@onError\` rather than
failing silently.`,
      },
    },
  },
  args: {
    source: SOUNDCLOUD_SOURCE,
    title: 'Leveraging AI to Tackle Large Problems',
    description:
      "A conversation about being an optimistic futurist featuring Kate O'Neill from IBM Think Leaders.",
    playing: false,
    ariaLabel: 'Audio player',
    useCard: true,
    onReady: fn(),
    onPlay: fn(),
    onPause: fn(),
    onError: fn(),
  },
  render: (args: StoryArgs) => <template>
    {{#if args.useCard}}
      <AiChatCard @isFlush={{true}}>
        <:media>
          <AudioPlayer
            @source={{args.source}}
            @playing={{args.playing}}
            @ariaLabel={{args.ariaLabel}}
            @errorMessage={{args.errorMessage}}
            @onReady={{args.onReady}}
            @onPlay={{args.onPlay}}
            @onPause={{args.onPause}}
            @onError={{args.onError}}
          />
        </:media>
        <:body>
          <div style="padding: 1rem;">
            <h4 style="margin: 0 0 0.5rem 0;">{{args.title}}</h4>
            <p style="margin: 0; color: var(--cds-text-secondary);">
              {{args.description}}
            </p>
          </div>
        </:body>
      </AiChatCard>
    {{else}}
      <AudioPlayer
        @source={{args.source}}
        @playing={{args.playing}}
        @ariaLabel={{args.ariaLabel}}
        @errorMessage={{args.errorMessage}}
        @onReady={{args.onReady}}
        @onPlay={{args.onPlay}}
        @onPause={{args.onPause}}
        @onError={{args.onError}}
      />
    {{/if}}
  </template>,
});

export const Default = meta.story({
  tags: ['!test'],
});

export const Standalone = meta.story({
  tags: ['!test'],
  args: {
    useCard: false,
  },
});

export const WithMetadata = meta.story({
  tags: ['!test'],
  args: {
    description:
      "Join us for an insightful conversation about being an optimistic futurist featuring Kate O'Neill from IBM Think Leaders. Explore how AI can be leveraged to solve complex challenges facing our world today.",
  },
});

export const WithTranscript = meta.story({
  args: {
    source: NATIVE_AUDIO_SOURCE,
    title: 'Your own mp3 file with transcript',
    description:
      'This example includes a transcript for accessibility. (The transcript element itself is not ported yet.)',
  },
});

export const ErrorState = meta.story({
  // A real (failing) network request decides when the error shows.
  tags: ['!test'],
  args: {
    source: 'https://invalid-url-that-will-cause-error.com/audio.mp3',
    title: 'Error State Example',
    description:
      'This demonstrates the error state when an audio file fails to load.',
  },
});

export const NativeAudio = meta.story({
  args: {
    source: NATIVE_AUDIO_SOURCE,
    ariaLabel: 'Sample audio clip',
    useCard: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'A native audio file (here a tiny WAV data URI) renders a native `<audio>` element.',
      },
    },
  },
});

NativeAudio.test(
  'renders a native audio element and reports ready',
  async ({ canvas, canvasElement, args }) => {
    await expect(
      canvas.getByRole('region', { name: 'Sample audio clip' }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(canvasElement.querySelector('audio')).not.toBeNull(),
    );
    await waitFor(() => expect(args.onReady).toHaveBeenCalled());
    await expect(args.onError).not.toHaveBeenCalled();
  },
);

export const SoundCloud = meta.story({
  tags: ['!test'],
  args: {
    source: 'https://soundcloud.com/forss/flickermood',
    ariaLabel: 'SoundCloud track',
    useCard: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Passing a SoundCloud track URL loads the SoundCloud Widget API and renders it in an iframe instead.',
      },
    },
  },
});

export const ControllingPlayback = meta.story({
  args: {
    source: NATIVE_AUDIO_SOURCE,
    useCard: false,
  },
  parameters: {
    docs: {
      description: {
        story: `\`@playing\` is only reacted to on a *change* after mount (the initial value is
applied via the provider's own autoplay) - \`@onPlay\`/\`@onPause\` reflect the
real native play/pause state, including user interaction with the player's
own controls.`,
      },
    },
  },
  render: (args) => {
    const state = trackedObject({ playing: false, status: 'paused' });
    const toggle = () => {
      state.playing = !state.playing;
    };
    const onPlay = () => {
      state.status = 'playing';
      args.onPlay?.();
    };
    const onPause = () => {
      state.status = 'paused';
      args.onPause?.();
    };

    return <template>
      <p>Status: {{state.status}}</p>
      <Button @onClick={{toggle}}>{{if state.playing "Pause" "Play"}}</Button>
      <AudioPlayer
        @source={{args.source}}
        @playing={{state.playing}}
        @onReady={{args.onReady}}
        @onPlay={{onPlay}}
        @onPause={{onPause}}
        @onError={{args.onError}}
      />
    </template>;
  },
});

ControllingPlayback.test(
  'toggling @playing starts native playback',
  async ({ canvas, canvasElement, userEvent, args }) => {
    await waitFor(() => expect(args.onReady).toHaveBeenCalled());
    const audio = canvasElement.querySelector('audio')!;
    const play = audio.play.bind(audio);
    const playSpy = fn(() => play());
    audio.play = playSpy;

    await userEvent.click(canvas.getByRole('button', { name: 'Play' }));
    await expect(canvas.getByRole('button', { name: 'Pause' })).toBeVisible();
    await expect(playSpy).toHaveBeenCalledTimes(1);
  },
);

export const UnsupportedSource = meta.story({
  args: {
    source: 'https://example.com/not-actually-audio',
    errorMessage: "This audio source isn't supported.",
    useCard: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A URL `AudioPlayer` can't classify (SoundCloud or a native audio file) surfaces `@errorMessage` instead of rendering nothing.",
      },
    },
  },
});

UnsupportedSource.test(
  'surfaces @errorMessage and @onError',
  async ({ canvas, args }) => {
    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      "This audio source isn't supported.",
    );
    await expect(args.onError).toHaveBeenCalledWith({
      message: "This audio source isn't supported.",
    });
  },
);
