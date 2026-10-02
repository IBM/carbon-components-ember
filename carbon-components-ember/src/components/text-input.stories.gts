import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import TextInput from './text-input.gts';

// No `render`: TextInput takes no blocks, so every arg is passed straight
// through as a named argument (`@labelText`, `@placeholder`, ...).
const meta = preview.meta({
  title: 'Components/TextInput',
  component: TextInput,
  args: {
    labelText: 'Label',
    placeholder: 'Placeholder text',
    onChange: fn(),
  },
});

export const Default = meta.story();

Default.test(
  'reports typed text through onChange',
  async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole('textbox', { name: 'Label' });
    await userEvent.type(input, 'Hello');
    await expect(input).toHaveValue('Hello');
    await expect(args.onChange).toHaveBeenLastCalledWith(
      'Hello',
      expect.anything(),
    );
  },
);

export const WithHelperText = meta.story({
  args: {
    helperText: 'Optional helper text',
  },
});

export const Counter = meta.story({
  args: {
    defaultValue: 'Hi',
    enableCounter: true,
    maxCount: 20,
  },
});

export const Invalid = meta.story({
  args: {
    invalid: true,
    invalidText: 'Error message goes here',
  },
});

export const Warning = meta.story({
  args: {
    warn: true,
    warnText: 'Warning message goes here',
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});
