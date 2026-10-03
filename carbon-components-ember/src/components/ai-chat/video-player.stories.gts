import { trackedObject } from '@ember/reactive/collections';
import { expect, fn, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from '../button.gts';
import AiChatCard from './card.gts';
import VideoPlayer from './video-player.gts';

import type { Args as VideoPlayerArgs } from './video-player.gts';

// Mirrors `@carbon/ai-chat-components`' `video-player.stories.js`
// (`Components/Video player`): Default, Standalone, WithMetadata, ErrorState
// (with the same `useCard`/`title`/`description` story args, the card being
// this addon's `AiChatCard`).
//
// docs-app's demos: the native clip is `Native`, "Aspect ratio" is
// `AspectRatio`, "Subtitle tracks" is `SubtitleTracks`, the YouTube and
// Vimeo embeds are `YouTube` and `Vimeo`, "Controlling playback" is
// `ControllingPlayback`, and "Unsupported source" is covered by
// `ErrorState`.
//
// Media sources: docs-app served its sample clip and captions from its own
// `public/demo-support/` folder. Stories can't ship extra files, so the same
// clip (docs-app's `sample-video.mp4`, ~18KB) is inlined below as a `data:`
// URI and the WebVTT captions as a `data:text/vtt` URI. The trailing `#.mp4`
// fragment is only there so `VideoPlayer`'s URL detection (which keys off the
// file extension) picks the native provider; browsers ignore a `data:` URI's
// fragment. This keeps the native stories and their tests free of network
// access.
//
// Stories that embed YouTube/Vimeo load third-party SDKs and iframes over the
// network, so they're tagged `!vitest` to keep the test run deterministic;
// tests only cover native-provider (and error-state) stories.
//
// Parity gaps:
// - Upstream's `ErrorState` points at an unreachable host
//   (`https://invalid-url-that-will-cause-error.com/video.mp4`) and errors
//   once the network request fails. Here it uses an unrecognized URL, which
//   errors synchronously - same rendered error state, no network dependency.
// - Upstream's `carbonTheme` arg isn't ported: the Storybook toolbar's
//   theme switcher applies Carbon's theme classes instead.

const sampleVideoSource =
  'data:video/mp4;base64,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#.mp4';

const sampleCaptionsSource = `data:text/vtt;charset=utf-8,${encodeURIComponent(`WEBVTT

00:00:00.000 --> 00:00:02.000
This is a sample caption track.

00:00:02.000 --> 00:00:05.000
It demonstrates VideoPlayer's @subtitleTracks support.
`)}`;

const youTubeSource = 'https://www.youtube.com/watch?v=eZ1NizUx9U4';
const vimeoSource = 'https://vimeo.com/22439234';

type StoryArgs = VideoPlayerArgs & {
  /** Story-only: wrap the player in an `AiChatCard` with a title/description. */
  useCard: boolean;
  /** Story-only: card title (when `useCard`). */
  title: string;
  /** Story-only: card description (when `useCard`). */
  description: string;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/Video player',
  component: VideoPlayer,
  parameters: {
    docs: {
      description: {
        component:
          "`VideoPlayer` plays video for [Carbon AI Chat](https://github.com/carbon-design-system/carbon-ai-chat). It supports native `<video>` files (mp4, webm, HLS, DASH, ...) plus YouTube, Vimeo, and Kaltura URLs, auto-detected from `@source`. A source it doesn't recognize surfaces `@errorMessage` through the error state and `@onError` rather than failing silently.",
      },
    },
  },
  argTypes: {
    source: {
      control: 'select',
      options: [youTubeSource, vimeoSource, sampleVideoSource],
      labels: {
        [youTubeSource]: 'YouTube',
        [vimeoSource]: 'Vimeo',
        [sampleVideoSource]: 'Native (inlined sample clip)',
      },
    },
  },
  args: {
    source: youTubeSource,
    title: 'Sample Video Title',
    description:
      'This is a sample video description that provides context about the video content.',
    playing: false,
    aspectRatioPercentage: 56.25,
    ariaLabel: 'Video player',
    useCard: true,
    onReady: fn(),
    onPlay: fn(),
    onPause: fn(),
    onError: fn(),
  },
  // Annotated: otherwise `render` is typed with the component's inferred
  // args instead of the story-only ones declared via `preview.type()`.
  render: (args: StoryArgs) => <template>
    {{#if args.useCard}}
      <AiChatCard @isFlush={{true}}>
        <:media>
          <VideoPlayer
            @source={{args.source}}
            @playing={{args.playing}}
            @aspectRatioPercentage={{args.aspectRatioPercentage}}
            @ariaLabel={{args.ariaLabel}}
            @subtitleTracks={{args.subtitleTracks}}
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
      <VideoPlayer
        @source={{args.source}}
        @playing={{args.playing}}
        @aspectRatioPercentage={{args.aspectRatioPercentage}}
        @ariaLabel={{args.ariaLabel}}
        @subtitleTracks={{args.subtitleTracks}}
        @errorMessage={{args.errorMessage}}
        @onReady={{args.onReady}}
        @onPlay={{args.onPlay}}
        @onPause={{args.onPause}}
        @onError={{args.onError}}
      />
    {{/if}}
  </template>,
});

// Network embed (YouTube): excluded from the test run.
export const Default = meta.story({
  tags: ['!vitest'],
});

// Network embed (YouTube): excluded from the test run.
export const Standalone = meta.story({
  tags: ['!vitest'],
  args: {
    useCard: false,
  },
});

// Network embed (YouTube): excluded from the test run.
export const WithMetadata = meta.story({
  tags: ['!vitest'],
  args: {
    title: 'Understanding AI and Machine Learning',
    description:
      'An in-depth exploration of artificial intelligence and machine learning concepts, covering neural networks, deep learning, and practical applications in modern technology.',
  },
});

export const ErrorState = meta.story({
  args: {
    source: 'https://example.com/not-actually-a-video',
    errorMessage: "This video source isn't supported.",
    title: 'Error State Example',
    description:
      'This demonstrates the error state when a video fails to load.',
  },
  parameters: {
    docs: {
      description: {
        story:
          "A URL `VideoPlayer` can't classify surfaces `@errorMessage` instead of rendering nothing.",
      },
    },
  },
});

ErrorState.test(
  'reports an unrecognized source through onError',
  async ({ canvas, args }) => {
    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      "This video source isn't supported.",
    );
    await expect(args.onError).toHaveBeenCalledWith({
      message: "This video source isn't supported.",
    });
    await expect(args.onReady).not.toHaveBeenCalled();
  },
);

// docs-app's native-file demo.
export const Native = meta.story({
  args: {
    source: sampleVideoSource,
    ariaLabel: 'Sample video clip',
    useCard: false,
  },
});

Native.test(
  'renders a native video element for a file source',
  async ({ canvas, canvasElement, args }) => {
    await expect(
      canvas.getByRole('region', { name: 'Sample video clip' }),
    ).toBeVisible();
    const video = canvasElement.querySelector('video');
    await expect(video).not.toBeNull();
    await expect(video?.getAttribute('src')).toBe(sampleVideoSource);
    await expect(video).toHaveAttribute('controls');
    await waitFor(() => expect(args.onReady).toHaveBeenCalled());
    await expect(args.onError).not.toHaveBeenCalled();
  },
);

export const AspectRatio = meta.story({
  args: {
    source: sampleVideoSource,
    aspectRatioPercentage: 100,
    useCard: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "`@aspectRatioPercentage` sizes the player's box before the video itself loads (defaults to `56.25`, 16:9) - upstream writes this through a CSP-safe constructable stylesheet; this port binds it directly into a `style` attribute instead, since Glimmer (unlike Lit) can bind a computed value straight into a template.",
      },
    },
  },
});

AspectRatio.test('sizes the player box', async ({ canvasElement }) => {
  const container = canvasElement.querySelector<HTMLElement>(
    '.cds-aichat-video-player__container',
  );
  await expect(container?.style.paddingBlockStart).toBe('100%');
});

export const SubtitleTracks = meta.story({
  args: {
    source: sampleVideoSource,
    useCard: false,
    subtitleTracks: [
      {
        src: sampleCaptionsSource,
        language: 'en',
        label: 'English',
        default: true,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          '`@subtitleTracks` adds WebVTT `<track>` elements to the native `<video>` provider - iframe-based embed providers (YouTube/Vimeo/Kaltura) ignore it, matching upstream.',
      },
    },
  },
});

SubtitleTracks.test(
  'adds a track element per subtitle track',
  async ({ canvasElement }) => {
    const track = canvasElement.querySelector<HTMLTrackElement>('video track');
    await expect(track).not.toBeNull();
    await expect(track?.kind).toBe('subtitles');
    await expect(track?.srclang).toBe('en');
    await expect(track?.label).toBe('English');
    await expect(track?.default).toBe(true);
    await expect(track?.getAttribute('src')).toBe(sampleCaptionsSource);
  },
);

// docs-app's YouTube embed. Network embed: excluded from the test run.
export const YouTube = meta.story({
  tags: ['!vitest'],
  args: {
    source: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    ariaLabel: 'YouTube video',
    useCard: false,
  },
});

// docs-app's Vimeo embed. Network embed: excluded from the test run.
export const Vimeo = meta.story({
  tags: ['!vitest'],
  args: {
    source: vimeoSource,
    ariaLabel: 'Vimeo video',
    useCard: false,
  },
});

// docs-app's "Controlling playback" demo.
export const ControllingPlayback = meta.story({
  args: {
    source: sampleVideoSource,
    useCard: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "`@playing` is only reacted to on a *change* after mount (the initial value is applied via the provider's own autoplay) - `@onPlay`/`@onPause` reflect the real native play/pause state, including user interaction with the player's own controls.",
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
      <VideoPlayer
        @source={{args.source}}
        @playing={{state.playing}}
        @ariaLabel={{args.ariaLabel}}
        @onReady={{args.onReady}}
        @onPlay={{onPlay}}
        @onPause={{onPause}}
        @onError={{args.onError}}
      />
    </template>;
  },
});

ControllingPlayback.test(
  'plays and pauses through @playing',
  async ({ canvas, canvasElement, userEvent, args }) => {
    await waitFor(() => expect(args.onReady).toHaveBeenCalled());
    // Muted so the browser's autoplay policy can't block playback.
    const video = canvasElement.querySelector('video');
    if (video) video.muted = true;

    await userEvent.click(canvas.getByRole('button', { name: 'Play' }));
    await waitFor(() => expect(args.onPlay).toHaveBeenCalled());
    await expect(canvas.getByText('Status: playing')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    await waitFor(() => expect(args.onPause).toHaveBeenCalled());
    await expect(canvas.getByText('Status: paused')).toBeVisible();
  },
);
