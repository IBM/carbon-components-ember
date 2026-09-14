/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Ember port of `@carbon/ai-chat-components`' `video-player/src/utils/
 * url-detector.ts`. Only `detectVideoSource` itself is ported - upstream's
 * `isYouTubeUrl`/`isVimeoUrl`/`isKalturaUrl`/`isNativeVideoUrl` convenience
 * wrappers are never used by `video-player.ts` (or anything else this port
 * needs), so they're left out rather than carried along unused.
 */
export enum VideoSource {
  YOUTUBE = 'youtube',
  VIMEO = 'vimeo',
  KALTURA = 'kaltura',
  NATIVE = 'native',
  UNKNOWN = 'unknown',
}

const MATCH_URL_YOUTUBE =
  /(?:youtu\.be\/|youtube(?:-nocookie|education)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//;

const MATCH_URL_VIMEO = /vimeo\.com\/(?!progressive_redirect).+/;

const MATCH_URL_KALTURA =
  /^https?:\/\/[a-zA-Z]+\.kaltura.(com|org)\/p\/([0-9]+)\/sp\/([0-9]+)00\/embedIframeJs\/uiconf_id\/([0-9]+)\/partner_id\/([0-9]+)(.*)entry_id.([a-zA-Z0-9-_].*)$/;

const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i;
const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i;
const DASH_EXTENSIONS = /\.(mpd)($|\?)/i;

export function detectVideoSource(url: string): VideoSource {
  if (!url || typeof url !== 'string') {
    return VideoSource.UNKNOWN;
  }

  if (MATCH_URL_YOUTUBE.test(url)) {
    return VideoSource.YOUTUBE;
  }

  if (
    MATCH_URL_VIMEO.test(url) &&
    !VIDEO_EXTENSIONS.test(url) &&
    !HLS_EXTENSIONS.test(url)
  ) {
    return VideoSource.VIMEO;
  }

  if (MATCH_URL_KALTURA.test(url)) {
    return VideoSource.KALTURA;
  }

  if (
    VIDEO_EXTENSIONS.test(url) ||
    HLS_EXTENSIONS.test(url) ||
    DASH_EXTENSIONS.test(url)
  ) {
    return VideoSource.NATIVE;
  }

  return VideoSource.UNKNOWN;
}
