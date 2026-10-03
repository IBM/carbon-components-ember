import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import FormInput from './form-input.gts';

// FormInput is an addon-only convenience control with no Carbon React
// counterpart (React's equivalent is `TextInput`, see Components/TextInput),
// so there's nothing to mirror. The docs-app page rendered the helper-text
// and error examples without `@label`; they get a label here because an
// unlabelled input is an axe `label` violation, and the examples are about
// `@help`/`@errors`, not about leaving the label off.
const meta = preview.meta({
  title: 'Components/FormInput',
  component: FormInput,
  args: {
    label: 'Label',
    onChange: fn(),
  },
});

export const Default = meta.story();

Default.test(
  'reports the committed value through onChange',
  async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole('textbox', { name: 'Label' });
    await userEvent.type(input, 'Hello');
    await userEvent.tab();
    await expect(args.onChange).toHaveBeenLastCalledWith('Hello');
  },
);

export const WithHelpText = meta.story({
  args: {
    help: 'some help',
  },
});

export const WithErrors = meta.story({
  args: {
    help: 'some help',
    errors: 'some error',
  },
});

WithErrors.test('marks the input invalid', async ({ canvas }) => {
  const input = canvas.getByRole('textbox', { name: 'Label' });
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(canvas.getByText('some error')).toBeVisible();
});
