import { trackedObject } from '@ember/reactive/collections';
import type { Decorator } from 'ember-storybook';
import { RenderStory } from 'ember-storybook';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Layer from './layer.gts';
import Slider from './slider.gts';
import SliderSkeleton from './slider-skeleton.gts';

import type { Args } from './slider.gts';

// Carbon React parity gaps (Components/Slider):
// - Slider is always controlled (`@value`/`@valueUpper` + `@onChange`);
//   there's no uncontrolled mode, so every story keeps the values in
//   story-local tracked state.
// - No `light` or `noValidate`. React's `unstable_valueUpper` and
//   `unstable_ariaLabelInputUpper` are the stable `@valueUpper` and
//   `@ariaLabelInputUpper` here.

// Renders the story on the background and on two nested layers, like
// Carbon React's `WithLayer` story template.
const withLayer: Decorator = (Story, context) => <template>
  <div style="padding: 1rem">
    <RenderStory @story={{Story}} @args={{context.args}} />
  </div>
  <Layer @withBackground={{true}} style="padding: 1rem" as |NextLayer|>
    <RenderStory @story={{Story}} @args={{context.args}} />
    <NextLayer @withBackground={{true}} style="padding: 1rem; margin-top: 1rem">
      <RenderStory @story={{Story}} @args={{context.args}} />
    </NextLayer>
  </Layer>
</template>;

const meta = preview.meta({
  title: 'Components/Slider',
  component: Slider,
  subcomponents: { SliderSkeleton },
  parameters: {
    docs: {
      description: {
        component:
          'Sliders provide a visual indication of adjustable content, where the user can increase or decrease the value by moving the handle along a horizontal track.\n\nSlider is controlled: pass `@value` (and `@valueUpper` for a second handle) and update them from `@onChange`, which receives `{ value, valueUpper }`. The handles move with the pointer or the arrow keys (Shift multiplies the step by `@stepMultiplier`), and the text input(s) next to the track accept typed values.',
      },
    },
  },
  args: {
    labelText: 'Slider label',
    min: 0,
    max: 100,
    step: 1,
    stepMultiplier: 10,
    value: 50,
    onChange: fn(),
  },
  render: (args: Args) => {
    const state = trackedObject({
      value: args.value,
      valueUpper: args.valueUpper,
    });
    const onChange = (data: { value: number; valueUpper?: number }) => {
      state.value = data.value;
      state.valueUpper = data.valueUpper;
      args.onChange?.(data);
    };

    return <template>
      <Slider
        @labelText={{args.labelText}}
        @ariaLabelInput={{args.ariaLabelInput}}
        @ariaLabelInputUpper={{args.ariaLabelInputUpper}}
        @min={{args.min}}
        @max={{args.max}}
        @minLabel={{args.minLabel}}
        @maxLabel={{args.maxLabel}}
        @step={{args.step}}
        @stepMultiplier={{args.stepMultiplier}}
        @hideLabel={{args.hideLabel}}
        @hideTextInput={{args.hideTextInput}}
        @formatLabel={{args.formatLabel}}
        @disabled={{args.disabled}}
        @readOnly={{args.readOnly}}
        @required={{args.required}}
        @invalid={{args.invalid}}
        @invalidText={{args.invalidText}}
        @warn={{args.warn}}
        @warnText={{args.warnText}}
        @value={{state.value}}
        @valueUpper={{state.valueUpper}}
        @onChange={{onChange}}
        @onRelease={{args.onRelease}}
        @onBlur={{args.onBlur}}
      />
    </template>;
  },
});

export const Default = meta.story({
  args: {
    labelText: 'Slider (must be an increment of 5)',
    step: 5,
  },
});

Default.test(
  'moves with the arrow keys',
  async ({ canvas, userEvent, args }) => {
    const slider = canvas.getByRole('slider');
    await expect(slider).toHaveAttribute('aria-valuenow', '50');

    slider.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(slider).toHaveAttribute('aria-valuenow', '55');
    await expect(args.onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ value: 55 }),
    );

    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    await expect(slider).toHaveAttribute('aria-valuenow', '45');
  },
);

Default.test('accepts a typed value', async ({ canvas, userEvent }) => {
  const input = canvas.getByRole('spinbutton');
  await userEvent.clear(input);
  await userEvent.type(input, '80');
  await userEvent.tab();
  await expect(canvas.getByRole('slider')).toHaveAttribute(
    'aria-valuenow',
    '80',
  );
});

export const SliderWithHiddenInputs = meta.story({
  args: {
    hideTextInput: true,
    invalidText: 'Invalid message goes here',
  },
});

const formatLabel = (value: number) => {
  if (value < 25) return 'Low';
  if (value > 75) return 'High';
  return 'Medium';
};

export const SliderWithCustomValueLabel = meta.story({
  args: {
    labelText: 'Slider label with low/medium/high',
    stepMultiplier: 50,
    hideTextInput: true,
    formatLabel,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`@formatLabel` formats the value shown next to the track (and the min/max labels).',
      },
    },
  },
});

SliderWithCustomValueLabel.test(
  'formats the value label',
  async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('slider')).toHaveAttribute(
      'aria-valuetext',
      'Medium',
    );
    canvas.getByRole('slider').focus();
    await userEvent.keyboard('{Shift>}{ArrowRight}{/Shift}');
    await expect(canvas.getByRole('slider')).toHaveAttribute(
      'aria-valuetext',
      'High',
    );
  },
);

const random = () => Math.round(Math.random() * 100);

export const ControlledSlider = meta.story({
  args: {
    value: 87,
  },
  parameters: {
    docs: {
      description: {
        story: 'The value can be changed from outside the slider.',
      },
    },
  },
  render: (args: Args) => {
    const state = trackedObject({ value: args.value });
    const onChange = (data: { value: number }) => {
      state.value = data.value;
      args.onChange?.(data);
    };
    const randomize = () => {
      state.value = random();
    };

    return <template>
      <button type="button" {{on "click" randomize}}>randomize value</button>
      <Slider
        @labelText={{args.labelText}}
        @min={{args.min}}
        @max={{args.max}}
        @value={{state.value}}
        @onChange={{onChange}}
      />
      <h1>{{state.value}}</h1>
    </template>;
  },
});

ControlledSlider.test(
  'follows the value from outside',
  async ({ canvas, userEvent }) => {
    const slider = canvas.getByRole('slider');
    await userEvent.click(
      canvas.getByRole('button', { name: 'randomize value' }),
    );
    const shown = canvas.getByRole('heading').textContent.trim();
    await expect(slider).toHaveAttribute('aria-valuenow', shown);
  },
);

export const WithLayer = meta.story({
  decorators: [withLayer],
});

export const ControlledSliderWithLayer = ControlledSlider.extend({
  decorators: [withLayer],
});

export const TwoHandleSlider = meta.story({
  args: {
    ariaLabelInput: 'Lower bound',
    ariaLabelInputUpper: 'Upper bound',
    value: 10,
    valueUpper: 90,
    invalidText: 'Invalid message goes here',
  },
});

TwoHandleSlider.test(
  'keeps the handles in order',
  async ({ canvas, userEvent, args }) => {
    const [lower, upper] = canvas.getAllByRole('slider');
    lower!.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(args.onChange).toHaveBeenLastCalledWith({
      value: 11,
      valueUpper: 90,
    });
    upper!.focus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(args.onChange).toHaveBeenLastCalledWith({
      value: 11,
      valueUpper: 89,
    });
  },
);

export const TwoHandleSliderWithHiddenInputs = TwoHandleSlider.extend({
  args: {
    hideTextInput: true,
  },
});

export const Disabled = meta.story({
  args: {
    labelText: 'Disabled',
    disabled: true,
  },
  parameters: {
    a11y: {
      config: {
        // WCAG 1.4.3 exempts inactive components from contrast minimums;
        // axe can't tell the disabled slider's labels are inactive.
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
});

export const Invalid = meta.story({
  args: {
    labelText: 'Invalid',
    invalid: true,
    invalidText: 'Invalid message goes here',
  },
});

export const Warning = meta.story({
  args: {
    labelText: 'Warning',
    warn: true,
    warnText: 'Warning message goes here',
  },
});

export const Skeleton = meta.story({
  render: () => <template><SliderSkeleton /></template>,
});

export const TwoHandleSkeleton = meta.story({
  render: () => <template><SliderSkeleton @twoHandles={{true}} /></template>,
});
