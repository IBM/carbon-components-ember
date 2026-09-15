import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, rerender, waitUntil, find, settled } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { array, hash } from '@ember/helper';
import VideoPlayer from 'carbon-components-ember/components/ai-chat/video-player';
import { ScriptLoader } from 'carbon-components-ember/components/ai-chat/-media/script-loader';

// A real, tiny (32x32, 1-frame) H.264 mp4, served by test-app's own dev
// server from `public/test-fixtures/` - a same-origin static asset, so
// `crossOrigin='anonymous'` (set unconditionally by `NativeVideoProvider`,
// ported faithfully from upstream) needs no CORS headers to succeed.
// Native video detection (unlike audio's) has no `data:` URI pattern
// upstream, so a real fetchable URL is required here, not a data URI.
const NATIVE_VIDEO_SOURCE = '/test-fixtures/tiny.mp4';

const YOUTUBE_SOURCE = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const VIMEO_SOURCE = 'https://vimeo.com/76979871';
const KALTURA_SOURCE =
  'https://cdnapisec.kaltura.com/p/123/sp/12300/embedIframeJs/uiconf_id/456/partner_id/123?entry_id=0_abc123';

type FakeYTPlayerOptions = {
  events: { onReady: () => void };
};

function stubYouTubeSDK() {
  class FakePlayer {
    constructor(container: HTMLElement, options: FakeYTPlayerOptions) {
      const iframe = document.createElement('iframe');
      container.appendChild(iframe);
      queueMicrotask(() => options.events.onReady());
    }
    playVideo() {}
    pauseVideo() {}
    loadVideoById() {}
    destroy() {}
  }
  window.YT = {
    Player: FakePlayer,
    PlayerState: { PLAYING: 1, PAUSED: 2, ENDED: 0 },
  };
}

function stubVimeoSDK() {
  class FakePlayer {
    private listeners = new Map<string, Array<(...args: unknown[]) => void>>();
    container: HTMLElement;
    constructor(container: HTMLElement) {
      this.container = container;
      const iframe = document.createElement('iframe');
      container.appendChild(iframe);
    }
    ready() {
      return Promise.resolve();
    }
    on(event: string, callback: (...args: unknown[]) => void) {
      const existing = this.listeners.get(event) ?? [];
      existing.push(callback);
      this.listeners.set(event, existing);
      if (event === 'loaded') {
        queueMicrotask(() => callback());
      }
    }
    play() {
      this.listeners.get('play')?.forEach((cb) => cb());
      return Promise.resolve();
    }
    pause() {
      this.listeners.get('pause')?.forEach((cb) => cb());
      return Promise.resolve();
    }
    destroy() {
      return Promise.resolve();
    }
  }
  window.Vimeo = { Player: FakePlayer };
}

function stubKalturaSDK() {
  class FakePlayer {
    private listeners = new Map<string, Array<() => void>>();
    constructor(_iframe: HTMLIFrameElement) {}
    on(event: string, callback: () => void) {
      const existing = this.listeners.get(event) ?? [];
      existing.push(callback);
      this.listeners.set(event, existing);
      if (event === 'ready') {
        queueMicrotask(() => callback());
      }
    }
    play() {
      this.listeners.get('play')?.forEach((cb) => cb());
    }
    pause() {
      this.listeners.get('pause')?.forEach((cb) => cb());
    }
  }
  window.playerjs = { Player: FakePlayer };
}

async function waitForReady(selector = '.cds-aichat-video-player__provider--ready') {
  await waitUntil(() => find(selector), { timeout: 3000 });
}

module('Integration | Component | ai-chat/VideoPlayer', (hooks) => {
  setupRenderingTest(hooks);

  hooks.afterEach(function () {
    ScriptLoader.clearCache();
    delete (window as unknown as { YT?: unknown }).YT;
    delete (window as unknown as { Vimeo?: unknown }).Vimeo;
    delete (window as unknown as { playerjs?: unknown }).playerjs;
  });

  test('an unsupported source surfaces the error state and @onError, not a silent no-op', async function (assert) {
    const errors: Array<{ message: string }> = [];
    const onError = (detail: { message: string }) => errors.push(detail);

    await render(
      <template>
        <VideoPlayer
          @source='https://example.com/not-a-video'
          @errorMessage='Could not play this video'
          @onError={{onError}}
        />
      </template>,
    );

    await waitUntil(() => find('.cds-aichat-video-player__error'));

    assert
      .dom('.cds-aichat-video-player__error-message')
      .hasText('Could not play this video');
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0]?.message, 'Could not play this video');
  });

  test('a native source renders a real <video> element with subtitle tracks and fires @onReady', async function (assert) {
    let readyCount = 0;
    const onReady = () => (readyCount += 1);

    await render(
      <template>
        <VideoPlayer
          @source={{NATIVE_VIDEO_SOURCE}}
          @onReady={{onReady}}
          @subtitleTracks={{array
            (hash src='/captions/en.vtt' language='en' label='English' default=true)
          }}
        />
      </template>,
    );

    await waitForReady();

    assert.dom('.cds-aichat-video-player__provider video').exists();
    assert
      .dom('.cds-aichat-video-player__provider video')
      .hasAttribute('crossorigin', 'anonymous');
    assert.dom('.cds-aichat-video-player__provider video track').exists({ count: 1 });
    assert
      .dom('.cds-aichat-video-player__provider video track')
      .hasAttribute('srclang', 'en');
    assert.strictEqual(readyCount, 1);
  });

  test('@aspectRatioPercentage renders as the container padding, sanitizing invalid values back to the 56.25 default', async function (assert) {
    class State {
      @tracked ratio: number | undefined = 75;
    }
    const state = new State();

    class Host extends Component {
      state = state;
      <template>
        <VideoPlayer @source={{NATIVE_VIDEO_SOURCE}} @aspectRatioPercentage={{this.state.ratio}} />
      </template>
    }

    await render(<template><Host /></template>);

    assert
      .dom('.cds-aichat-video-player__container')
      .hasAttribute('style', 'padding-block-start: 75%;');

    state.ratio = -10;
    await rerender();
    assert
      .dom('.cds-aichat-video-player__container')
      .hasAttribute('style', 'padding-block-start: 56.25%;');

    state.ratio = undefined;
    await rerender();
    assert
      .dom('.cds-aichat-video-player__container')
      .hasAttribute('style', 'padding-block-start: 56.25%;');
  });

  test('a YouTube source creates a real iframe and fires @onReady through the provider', async function (assert) {
    stubYouTubeSDK();
    let readyCount = 0;
    const onReady = () => (readyCount += 1);

    await render(
      <template>
        <VideoPlayer @source={{YOUTUBE_SOURCE}} @onReady={{onReady}} />
      </template>,
    );

    await waitForReady();

    assert.dom('.cds-aichat-video-player__provider iframe').exists();
    assert.strictEqual(readyCount, 1);
  });

  test('a Vimeo source creates a real iframe and fires @onReady through the provider', async function (assert) {
    stubVimeoSDK();
    let readyCount = 0;
    const onReady = () => (readyCount += 1);

    await render(
      <template>
        <VideoPlayer @source={{VIMEO_SOURCE}} @onReady={{onReady}} />
      </template>,
    );

    await waitForReady();

    assert.dom('.cds-aichat-video-player__provider iframe').exists();
    assert.strictEqual(readyCount, 1);
  });

  test('a Kaltura source fires @onReady through the provider', async function (assert) {
    stubKalturaSDK();
    let readyCount = 0;
    const onReady = () => (readyCount += 1);

    await render(
      <template>
        <VideoPlayer @source={{KALTURA_SOURCE}} @onReady={{onReady}} />
      </template>,
    );

    await waitForReady();

    assert.dom('.cds-aichat-video-player__provider iframe').exists();
    assert.strictEqual(readyCount, 1);
  });

  test('changing @source across provider types tears down the old provider each time', async function (assert) {
    stubYouTubeSDK();
    stubVimeoSDK();

    class State {
      @tracked source: string = NATIVE_VIDEO_SOURCE;
    }
    const state = new State();

    class Host extends Component {
      state = state;
      <template>
        <VideoPlayer @source={{this.state.source}} />
      </template>
    }

    await render(<template><Host /></template>);
    await waitForReady();
    assert.dom('.cds-aichat-video-player__provider video').exists();

    state.source = YOUTUBE_SOURCE;
    await waitUntil(() => find('.cds-aichat-video-player__provider iframe'));
    await waitForReady();
    assert.dom('.cds-aichat-video-player__provider video').doesNotExist();
    assert.dom('.cds-aichat-video-player__provider iframe').exists({ count: 1 });

    state.source = VIMEO_SOURCE;
    await settled();
    await waitForReady();
    assert.dom('.cds-aichat-video-player__provider iframe').exists({ count: 1 });
  });

  test('@playing toggling after ready calls the provider play/pause methods', async function (assert) {
    const originalPlay = HTMLMediaElement.prototype.play;
    const originalPause = HTMLMediaElement.prototype.pause;
    let playCalls = 0;
    let pauseCalls = 0;
    HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
      playCalls += 1;
      return originalPlay.call(this).catch(() => {});
    };
    HTMLMediaElement.prototype.pause = function (this: HTMLMediaElement) {
      pauseCalls += 1;
      return originalPause.call(this);
    };

    try {
      class State {
        @tracked playing = false;
      }
      const state = new State();

      class Host extends Component {
        state = state;
        <template>
          <VideoPlayer @source={{NATIVE_VIDEO_SOURCE}} @playing={{this.state.playing}} />
        </template>
      }

      await render(<template><Host /></template>);
      await waitForReady();

      state.playing = true;
      await rerender();
      assert.strictEqual(playCalls, 1, 'toggling @playing to true calls provider.play()');

      state.playing = false;
      await rerender();
      assert.strictEqual(pauseCalls, 1, 'toggling @playing to false calls provider.pause()');
    } finally {
      HTMLMediaElement.prototype.play = originalPlay;
      HTMLMediaElement.prototype.pause = originalPause;
    }
  });

  test('an unrelated rerender (e.g. toggling @playing) does not tear down and reload the same-source provider', async function (assert) {
    let readyCount = 0;
    const onReady = () => (readyCount += 1);

    class State {
      @tracked playing = false;
    }
    const state = new State();

    class Host extends Component {
      state = state;
      <template>
        <VideoPlayer
          @source={{NATIVE_VIDEO_SOURCE}}
          @playing={{this.state.playing}}
          @onReady={{onReady}}
        />
      </template>
    }

    await render(<template><Host /></template>);
    await waitForReady();
    assert.strictEqual(readyCount, 1);

    const videoElementBefore = find('.cds-aichat-video-player__provider video');

    state.playing = true;
    await rerender();
    state.playing = false;
    await rerender();

    assert.strictEqual(readyCount, 1, 'the provider was not torn down and reloaded, so @onReady never fires a second time');
    assert.strictEqual(
      find('.cds-aichat-video-player__provider video'),
      videoElementBefore,
      'the same <video> element instance is still in the DOM, not replaced',
    );
  });
});
