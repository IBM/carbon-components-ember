import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Stack from './stack.gts';
import Toggle from './toggle.gts';
import ToggleSkeleton from './toggle-skeleton.gts';
import '#storybook/styles/toggle.css';

const meta = preview.meta({
  title: 'Components/Toggle',
  component: Toggle,
  parameters: {
    docs: {
      description: {
        component:
          'A toggle is used to quickly switch between two possible states.\n\n`@labelText` labels it, and `@labelA` and `@labelB` name its off and on states. `@defaultToggled` sets its first state, and `@onToggle` is called with the new one; pass `@toggled` to control it instead.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  args: {
    labelText: 'Label',
    labelA: 'Off',
    labelB: 'On',
    defaultToggled: true,
    onToggle: fn(),
  },
  render: (args) => <template>
    <Toggle
      @labelText={{args.labelText}}
      @labelA={{args.labelA}}
      @labelB={{args.labelB}}
      @defaultToggled={{args.defaultToggled}}
      @hideLabel={{args.hideLabel}}
      @size={{args.size}}
      @disabled={{args.disabled}}
      @readOnly={{args.readOnly}}
      @onToggle={{args.onToggle}}
    />
  </template>,
});

export const Default = meta.story();

Default.test(
  'switches state and reports it through onToggle',
  async ({ canvas, userEvent, args }) => {
    const toggle = canvas.getByRole('switch', { name: 'Label' });
    await expect(toggle).toBeChecked();

    await userEvent.click(toggle);
    await expect(toggle).not.toBeChecked();
    await expect(args.onToggle).toHaveBeenLastCalledWith(false);
    await expect(canvas.getByText('Off')).toBeInTheDocument();

    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await expect(args.onToggle).toHaveBeenLastCalledWith(true);
  },
);

export const SmallToggle = meta.story({
  args: {
    size: 'sm',
  },
});

export const WithAccessibleLabels = meta.story({
  parameters: {
    controls: { disable: true },
  },
  render: () => <template>
    <Stack @gap={{7}}>
      <Toggle @id="toggle-4" @labelText="Label" />
      <Toggle @id="toggle-5" @labelText="Label" @hideLabel={{true}} />
      <div>
        <div id="toggle-6-label" class="toggle-story__label">Internal aria-label
          toggle</div>
        <Toggle @id="toggle-6" aria-labelledby="toggle-6-label" />
      </div>
      <div>
        <label
          id="toggle-7-label"
          for="toggle-7"
          class="toggle-story__label toggle-story__label--block"
        >External toggle label</label>
        <Toggle @id="toggle-7" aria-labelledby="toggle-7-label" />
      </div>
    </Stack>
  </template>,
});

WithAccessibleLabels.test('names each switch', async ({ canvas }) => {
  await expect(canvas.getAllByRole('switch', { name: 'Label' })).toHaveLength(
    2,
  );
  await expect(
    canvas.getByRole('switch', { name: 'Internal aria-label toggle' }),
  ).toBeInTheDocument();
  await expect(
    canvas.getByRole('switch', { name: 'External toggle label' }),
  ).toBeInTheDocument();
});

export const Disabled = meta.story({
  args: {
    labelText: 'toggle is disabled',
    defaultToggled: false,
    disabled: true,
  },
});

export const ReadOnly = meta.story({
  args: {
    labelText: 'toggle is read-only',
    defaultToggled: false,
    readOnly: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A read-only toggle ignores clicks and never calls `@onToggle`.',
      },
    },
  },
});

ReadOnly.test('ignores clicks', async ({ canvas, userEvent, args }) => {
  const toggle = canvas.getByRole('switch', { name: 'toggle is read-only' });
  await userEvent.click(toggle);
  await expect(toggle).not.toBeChecked();
  await expect(args.onToggle).not.toHaveBeenCalled();
});

export const Skeleton = meta.story({
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`ToggleSkeleton` stands in for the component while its content loads.',
      },
    },
  },
  render: () => <template><ToggleSkeleton /></template>,
});
