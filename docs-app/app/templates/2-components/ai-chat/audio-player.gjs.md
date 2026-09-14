<ThemeSwitcher />

# AudioPlayer

`AudioPlayer` plays audio for
[Carbon AI Chat](https://github.com/carbon-design-system/carbon-ai-chat).
It supports native `<audio>` files (mp3, wav, m4a, aac, ...) and SoundCloud
track URLs, auto-detected from `@source`. A source it doesn't recognize
surfaces `@errorMessage` through the error state and `@onError` rather than
failing silently.

```gjs live preview
import { AudioPlayer } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const sampleAudioSource = `${import.meta.env.BASE_URL}demo-support/sample-audio.mp3`;

<template>
  <ThemeSupport />
  <AudioPlayer
    @source={{sampleAudioSource}}
    @ariaLabel='Sample audio clip'
  />
</template>
```

## SoundCloud

Passing a SoundCloud track URL loads the SoundCloud Widget API and renders it
in an iframe instead.

```gjs live preview
import { AudioPlayer } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <AudioPlayer
    @source='https://soundcloud.com/forss/flickermood'
    @ariaLabel='SoundCloud track'
  />
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
import { AudioPlayer, Button } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const sampleAudioSource = `${import.meta.env.BASE_URL}demo-support/sample-audio.mp3`;

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
    <AudioPlayer
      @source={{sampleAudioSource}}
      @playing={{this.playing}}
      @onPlay={{this.onPlay}}
      @onPause={{this.onPause}}
    />
  </template>
}

<template><Demo /></template>
```

## Unsupported source

A URL `AudioPlayer` can't classify (SoundCloud or a native audio file)
surfaces `@errorMessage` instead of rendering nothing.

```gjs live preview
import { AudioPlayer } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <AudioPlayer
    @source='https://example.com/not-actually-audio'
    @errorMessage="This audio source isn't supported."
  />
</template>
```

## API Reference

<details>
<summary><h3>AudioPlayer</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/audio-player'
    @name='default'
  />
</template>
```
</details>
