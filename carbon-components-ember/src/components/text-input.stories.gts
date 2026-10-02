import { expect, fn } from 'storybook/test';

import TextInput from './text-input.gts';

import type { Meta, StoryObj } from 'ember-storybook';

// No `render`: TextInput takes no blocks, so every arg is passed straight
// through as a named argument (`@labelText`, `@placeholder`, ...).
export default {
  title: 'Components/TextInput',
  component: TextInput,
  args: {
    labelText: 'Label',
    placeholder: 'Placeholder text',
    onChange: fn(),
  },
} satisfies Meta;

export const Default: StoryObj = {
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole('textbox', { name: 'Label' });
    await userEvent.type(input, 'Hello');
    await expect(input).toHaveValue('Hello');
    await expect(args.onChange).toHaveBeenLastCalledWith(
      'Hello',
      expect.anything(),
    );
  },
};

export const WithHelperText: StoryObj = {
  args: {
    helperText: 'Optional helper text',
  },
};

export const Counter: StoryObj = {
  args: {
    defaultValue: 'Hi',
    enableCounter: true,
    maxCount: 20,
  },
};

export const Invalid: StoryObj = {
  args: {
    invalid: true,
    invalidText: 'Error message goes here',
  },
};

export const Warning: StoryObj = {
  args: {
    warn: true,
    warnText: 'Warning message goes here',
  },
};

export const Disabled: StoryObj = {
  args: {
    disabled: true,
  },
};
