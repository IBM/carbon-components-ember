/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Ember port of `@carbon/ai-chat-components`' `audio-player/src/utils/
 * url-detector.ts`. Only `detectAudioSource` itself is ported - upstream's
 * `isSoundCloudUrl`/`isNativeAudioUrl` convenience wrappers are never used by
 * `audio-player.ts` (or anything else this port needs), so they're left out
 * rather than carried along unused.
 */
export enum AudioSource {
  SOUNDCLOUD = 'soundcloud',
  NATIVE = 'native',
  UNKNOWN = 'unknown',
}

const MATCH_URL_SOUNDCLOUD = /(?:soundcloud\.com|snd\.sc)\/[^.]+$/;
const MATCH_DATA_AUDIO_URI = /^data:audio\/[a-z0-9.+-]+(?:;[^,]*)?,/i;

const AUDIO_EXTENSIONS =
  /\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;

export function detectAudioSource(url: string): AudioSource {
  if (!url || typeof url !== 'string') {
    return AudioSource.UNKNOWN;
  }

  if (MATCH_URL_SOUNDCLOUD.test(url) && !AUDIO_EXTENSIONS.test(url)) {
    return AudioSource.SOUNDCLOUD;
  }

  if (AUDIO_EXTENSIONS.test(url) || MATCH_DATA_AUDIO_URI.test(url)) {
    return AudioSource.NATIVE;
  }

  return AudioSource.UNKNOWN;
}
