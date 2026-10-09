import { trackedObject } from '@ember/reactive/collections';
import { modifier } from 'ember-modifier';
import { expect } from 'storybook/test';

import { withLayer } from '#storybook/decorators.gts';
import preview from '#storybook/preview.ts';
import ProgressBar from './progress-bar.gts';

// Parity gaps with Carbon React's ProgressBar stories:
// - `hideLabel` isn't supported by the Ember component.

const meta = preview.meta({
  title: 'Components/ProgressBar',
  component: ProgressBar,
  args: {
    helperText: '75 MB of 100 MB',
    label: 'Uploading files',
    max: 100,
    size: 'big',
    status: 'active',
    type: 'default',
    value: 75,
  },
  argTypes: {
    size: { control: 'select', options: ['small', 'big'] },
    status: {
      control: 'select',
      options: ['active', 'finished', 'error', 'indeterminate'],
    },
    type: { control: 'select', options: ['default', 'inline', 'indented'] },
  },
});

export const Default = meta.story();

Default.test('exposes its value as a progressbar', async ({ canvas }) => {
  const bar = canvas.getByRole('progressbar', { name: 'Uploading files' });
  await expect(bar).toHaveAttribute('aria-valuenow', '75');
  await expect(bar).toHaveAttribute('aria-valuemax', '100');
});

export const Indeterminate = meta.story({
  args: {
    helperText: 'Preparing files...',
    label: 'Preparing upload',
    status: 'indeterminate',
    value: undefined,
  },
});

const SIZE = 728;

// Simulates a download: waits a moment, then advances in random steps until
// it reaches `max`, and stops when the story is torn down.
export const Determinate = meta.story({
  args: {
    label: 'Exporting data',
    max: SIZE,
  },
  render: (args) => {
    const state = trackedObject({ progress: 0 });
    const simulate = modifier(() => {
      let interval: ReturnType<typeof setInterval> | undefined;
      const start = setTimeout(() => {
        interval = setInterval(() => {
          state.progress = Math.min(SIZE, state.progress + Math.random() * 8);
          if (state.progress >= SIZE) clearInterval(interval);
        }, 50);
      }, 3000);
      return () => {
        clearTimeout(start);
        clearInterval(interval);
      };
    });
    const value = () => (state.progress > 0 ? state.progress : undefined);
    const status = () => (state.progress >= SIZE ? 'finished' : 'active');
    const helperText = () => {
      if (state.progress >= SIZE) return 'Done';
      if (state.progress > 0) {
        return `${state.progress.toFixed(1)}MB of ${SIZE}MB`;
      }
      return 'Fetching assets...';
    };

    return <template>
      <div {{simulate}}>
        <ProgressBar
          @value={{(value)}}
          @max={{SIZE}}
          @status={{(status)}}
          @label={{args.label}}
          @helperText={{(helperText)}}
          @size={{args.size}}
          @type={{args.type}}
        />
      </div>
    </template>;
  },
});

export const ErrorStatus = meta.story({
  args: {
    status: 'error',
    helperText: 'Upload failed',
  },
});

export const FinishedStatus = meta.story({
  args: {
    status: 'finished',
    size: 'small',
    value: 100,
    helperText: 'Done',
  },
});

export const Inline = meta.story({
  args: {
    label: 'inline',
    type: 'inline',
    value: 50,
    helperText: undefined,
  },
});

export const Indented = meta.story({
  args: {
    label: 'indented',
    type: 'indented',
    value: 50,
  },
});

export const WithLayer = Default.extend({ decorators: [withLayer] });
