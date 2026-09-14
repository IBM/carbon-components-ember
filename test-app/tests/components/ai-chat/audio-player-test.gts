import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, rerender, waitUntil, find, settled } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import AudioPlayer from 'carbon-components-ember/components/ai-chat/audio-player';
import { ScriptLoader } from 'carbon-components-ember/components/ai-chat/-media/script-loader';

// A real, tiny (10-sample, 8kHz mono) WAV encoded as a data URI - loads
// instantly with no network request and reliably fires a real
// `loadedmetadata` event in Chromium, unlike a network URL (which would
// either need a live external host or trip the native `error` event).
const NATIVE_AUDIO_SOURCE =
  'data:audio/wav;base64,UklGRjgAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YRQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';

const SOUNDCLOUD_SOURCE = 'https://soundcloud.com/example/example-track';
const SOUNDCLOUD_SDK_URL = 'https://w.soundcloud.com/player/api.js';

function stubSoundCloudSDK() {
  const script = document.createElement('script');
  script.src = SOUNDCLOUD_SDK_URL;
  document.head.appendChild(script);

  const listeners = new Map<string, Array<() => void>>();
  const widget = {
    bind(event: string, callback: () => void) {
      const existing = listeners.get(event) ?? [];
      existing.push(callback);
      listeners.set(event, existing);
    },
    unbind() {},
    load(_url: string, options: { callback: () => void }) {
      options.callback();
    },
    getDuration(callback: (duration: number) => void) {
      callback(1000);
    },
    play() {
      listeners.get('play')?.forEach((cb) => cb());
    },
    pause() {
      listeners.get('pause')?.forEach((cb) => cb());
    },
  };

  window.SC = {
    Widget: Object.assign(() => widget, {
      Events: {
        PLAY: 'play',
        PLAY_PROGRESS: 'playProgress',
        PAUSE: 'pause',
        FINISH: 'finish',
        ERROR: 'error',
      },
    }),
  };

  return { script, widget };
}

async function waitForReady(selector = '.cds-aichat-audio-player__provider--ready') {
  await waitUntil(() => find(selector));
}

module('Integration | Component | ai-chat/AudioPlayer', (hooks) => {
  setupRenderingTest(hooks);

  hooks.afterEach(function () {
    ScriptLoader.clearCache();
    delete (window as unknown as { SC?: unknown }).SC;
    document
      .querySelectorAll(`script[src="${SOUNDCLOUD_SDK_URL}"]`)
      .forEach((el) => el.remove());
  });

  test('an unsupported source surfaces the error state and @onError, not a silent no-op', async function (assert) {
    const errors: Array<{ message: string }> = [];
    const onError = (detail: { message: string }) => errors.push(detail);

    await render(
      <template>
        <AudioPlayer
          @source='https://example.com/not-audio'
          @errorMessage='Could not play this audio'
          @onError={{onError}}
        />
      </template>,
    );

    await waitUntil(() => find('.cds-aichat-audio-player__error'));

    assert
      .dom('.cds-aichat-audio-player__error-message')
      .hasText('Could not play this audio');
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0]?.message, 'Could not play this audio');
    assert.dom('.cds-aichat-audio-player__provider').hasClass('cds-aichat-audio-player__provider--hidden');
  });

  test('a native source renders a real <audio> element and fires @onReady', async function (assert) {
    let readyCount = 0;
    const onReady = () => (readyCount += 1);

    await render(
      <template>
        <AudioPlayer @source={{NATIVE_AUDIO_SOURCE}} @onReady={{onReady}} />
      </template>,
    );

    await waitForReady();

    assert.dom('.cds-aichat-audio-player__provider audio').exists();
    assert.dom('.cds-aichat-audio-player__provider audio').hasAttribute('controls');
    assert
      .dom('.cds-aichat-audio-player__provider audio')
      .hasAttribute('crossorigin', 'anonymous');
    assert.strictEqual(readyCount, 1);
  });

  test('native play/pause events forward through @onPlay/@onPause', async function (assert) {
    const plays: string[] = [];
    const onPlay = () => plays.push('play');
    const onPause = () => plays.push('pause');

    await render(
      <template>
        <AudioPlayer @source={{NATIVE_AUDIO_SOURCE}} @onPlay={{onPlay}} @onPause={{onPause}} />
      </template>,
    );

    await waitForReady();

    const audioElement = find('.cds-aichat-audio-player__provider audio') as HTMLAudioElement;
    audioElement.dispatchEvent(new Event('play'));
    audioElement.dispatchEvent(new Event('pause'));
    await settled();

    assert.deepEqual(plays, ['play', 'pause']);
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
          <AudioPlayer @source={{NATIVE_AUDIO_SOURCE}} @playing={{this.state.playing}} />
        </template>
      }

      await render(<template><Host /></template>);
      await waitForReady();

      const callsBeforeToggle = playCalls;
      state.playing = true;
      await rerender();
      assert.strictEqual(playCalls, callsBeforeToggle + 1, 'toggling @playing to true calls provider.play()');

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
        <AudioPlayer
          @source={{NATIVE_AUDIO_SOURCE}}
          @playing={{this.state.playing}}
          @onReady={{onReady}}
        />
      </template>
    }

    await render(<template><Host /></template>);
    await waitForReady();
    assert.strictEqual(readyCount, 1);

    const audioElementBefore = find('.cds-aichat-audio-player__provider audio');

    state.playing = true;
    await rerender();
    state.playing = false;
    await rerender();

    assert.strictEqual(readyCount, 1, 'the provider was not torn down and reloaded, so @onReady never fires a second time');
    assert.strictEqual(
      find('.cds-aichat-audio-player__provider audio'),
      audioElementBefore,
      'the same <audio> element instance is still in the DOM, not replaced',
    );
  });

  test('changing @source from native to SoundCloud tears down the old provider and swaps the rendered element', async function (assert) {
    stubSoundCloudSDK();

    class State {
      @tracked source = NATIVE_AUDIO_SOURCE;
    }
    const state = new State();

    class Host extends Component {
      state = state;
      <template>
        <AudioPlayer @source={{this.state.source}} />
      </template>
    }

    await render(<template><Host /></template>);
    await waitForReady();
    assert.dom('.cds-aichat-audio-player__provider audio').exists();
    assert.dom('.cds-aichat-audio-player__provider iframe').doesNotExist();

    state.source = SOUNDCLOUD_SOURCE;
    await waitUntil(() => find('.cds-aichat-audio-player__provider iframe'));

    assert.dom('.cds-aichat-audio-player__provider audio').doesNotExist();
    assert
      .dom('.cds-aichat-audio-player__provider iframe')
      .hasAttribute('src', `https://w.soundcloud.com/player/?url=${encodeURIComponent(SOUNDCLOUD_SOURCE)}`);
    await waitForReady();
  });
});
