import { trackedObject } from '@ember/reactive/collections';
import { expect, fn, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from '../button.gts';
import AiChatCard from './card.gts';
import VideoPlayer from './video-player.gts';

import type { VideoPlayerSignature } from './video-player.gts';

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
// Media sources: the sample clip and WebVTT captions are served from
// `.storybook/public/demo-support/`, relative to the preview, so they work
// under any deploy path and keep the native stories' tests offline.
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

const sampleVideoSource = 'demo-support/sample-video.mp4';

const sampleCaptionsSource = 'demo-support/sample-captions.vtt';

const youTubeSource = 'https://www.youtube.com/watch?v=eZ1NizUx9U4';
const vimeoSource = 'https://vimeo.com/22439234';

type StoryArgs = VideoPlayerSignature['Args'] & {
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
        [sampleVideoSource]: 'Native (sample clip)',
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
  render: (args: StoryArgs) => {
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
