<ThemeSwitcher />

# VideoPlayer

`VideoPlayer` plays video for
[Carbon AI Chat](https://github.com/carbon-design-system/carbon-ai-chat). It
supports native `<video>` files (mp4, webm, HLS, DASH, ...) plus YouTube,
Vimeo, and Kaltura URLs, auto-detected from `@source`. A source it doesn't
recognize surfaces `@errorMessage` through the error state and `@onError`
rather than failing silently.

```gjs live preview
import { VideoPlayer } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const sampleVideoSource = `${import.meta.env.BASE_URL}demo-support/sample-video.mp4`;

<template>
  <ThemeSupport />
  <VideoPlayer @source={{sampleVideoSource}} @ariaLabel='Sample video clip' />
</template>
```

## Aspect ratio

`@aspectRatioPercentage` sizes the player's box before the video itself
loads (defaults to `56.25`, 16:9) - upstream writes this through a
CSP-safe constructable stylesheet; this port binds it directly into a
`style` attribute instead, since Glimmer (unlike Lit) can bind a computed
value straight into a template. See the component's own class doc for the
full reasoning.

```gjs live preview
import { VideoPlayer } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const sampleVideoSource = `${import.meta.env.BASE_URL}demo-support/sample-video.mp4`;

<template>
  <ThemeSupport />
  <VideoPlayer
    @source={{sampleVideoSource}}
    @aspectRatioPercentage={{100}}
  />
</template>
```

## Subtitle tracks

`@subtitleTracks` adds WebVTT `<track>` elements to the native `<video>`
provider - iframe-based embed providers (YouTube/Vimeo/Kaltura) ignore it,
matching upstream.

```gjs live preview
import { array, hash } from '@ember/helper';
import { VideoPlayer } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const sampleVideoSource = `${import.meta.env.BASE_URL}demo-support/sample-video.mp4`;
const sampleCaptionsSource = `${import.meta.env.BASE_URL}demo-support/sample-captions.vtt`;

<template>
  <ThemeSupport />
  <VideoPlayer
    @source={{sampleVideoSource}}
    @subtitleTracks={{array
      (hash src=sampleCaptionsSource language='en' label='English' default=true)
    }}
  />
</template>
```

## YouTube, Vimeo, and Kaltura

```gjs live preview
import { VideoPlayer } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <VideoPlayer @source='https://www.youtube.com/watch?v=dQw4w9WgXcQ' @ariaLabel='YouTube video' />
</template>
```

```gjs live preview
import { VideoPlayer } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <VideoPlayer @source='https://vimeo.com/22439234' @ariaLabel='Vimeo video' />
</template>
```

## Controlling playback

`@playing` is only reacted to on a *change* after mount (the initial value is
applied via the provider's own autoplay) - `@onPlay`/`@onPause` reflect the
real native play/pause state, including user interaction with the player's
own controls.

```gjs live preview
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { VideoPlayer, Button } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const sampleVideoSource = `${import.meta.env.BASE_URL}demo-support/sample-video.mp4`;

class Demo extends Component {
  @tracked playing = false;
  @tracked status = 'paused';

  toggle = () => {
    this.playing = !this.playing;
  };

  onPlay = () => {
    this.status = 'playing';
  };

  onPause = () => {
    this.status = 'paused';
  };

  <template>
    <ThemeSupport />
    <p>Status: {{this.status}}</p>
    <Button @onClick={{this.toggle}}>{{if this.playing 'Pause' 'Play'}}</Button>
    <VideoPlayer
      @source={{sampleVideoSource}}
      @playing={{this.playing}}
      @onPlay={{this.onPlay}}
      @onPause={{this.onPause}}
    />
  </template>
}

<template><Demo /></template>
```

## Unsupported source

A URL `VideoPlayer` can't classify surfaces `@errorMessage` instead of
rendering nothing.

```gjs live preview
import { VideoPlayer } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <VideoPlayer
    @source='https://example.com/not-actually-a-video'
    @errorMessage="This video source isn't supported."
  />
</template>
```

## API Reference

<details>
<summary><h3>VideoPlayer</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/video-player'
    @name='default'
  />
</template>
```
</details>
