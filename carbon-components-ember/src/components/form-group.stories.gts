import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from './button.gts';
import FormGroup from './form-group.gts';
import RadioButtonGroup from './radio-button/group.gts';
import Stack from './stack.gts';
import TextInput from './text-input.gts';

// Mirrors Carbon React's `Components/FormGroup` stories (`Default`), plus the
// disabled and invalid examples from the docs-app page. No parity gaps:
// every FormGroup prop React exposes (`disabled`, `invalid`, `legendId`,
// `legendText`, `message`, `messageText`) is an arg here too.
const meta = preview.meta({
  title: 'Components/FormGroup',
  component: FormGroup,
  parameters: {
    docs: {
      description: {
        component:
          '`FormGroup` renders a `<fieldset>` with a `<legend>`, used to group related form controls together under a shared heading.',
      },
    },
  },
  args: {
    legendId: 'form-group-1',
    legendText: 'FormGroup Legend',
    disabled: false,
    invalid: false,
    message: false,
    messageText: 'Form group message',
  },
  render: (args) => <template>
    <FormGroup
      @legendId={{args.legendId}}
      @legendText={{args.legendText}}
      @disabled={{args.disabled}}
      @invalid={{args.invalid}}
      @message={{args.message}}
      @messageText={{args.messageText}}
      style="max-width: 400px"
    >
      <Stack @gap={{7}}>
        <TextInput @id="one" @labelText="First Name" />
        <TextInput @id="two" @labelText="Last Name" />
        <RadioButtonGroup
          @legendText="Radio button heading"
          @name="formgroup-default-radio-button-group"
          @defaultSelected="radio-1"
          as |Radio|
        >
          <Radio @labelText="Option 1" @value="radio-1" @id="radio-1" />
          <Radio @labelText="Option 2" @value="radio-2" @id="radio-2" />
          <Radio @labelText="Option 3" @value="radio-3" @id="radio-3" />
        </RadioButtonGroup>
        <Button>Submit</Button>
      </Stack>
    </FormGroup>
  </template>,
});

export const Default = meta.story();

Default.test('labels the group with its legend', async ({ canvas }) => {
  const group = canvas.getByRole('group', { name: 'FormGroup Legend' });
  await expect(group).toBeEnabled();
  await expect(canvas.getByRole('radio', { name: 'Option 1' })).toBeChecked();
});

export const Disabled = meta.story({
  args: {
    legendText: 'Disabled FormGroup',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Passing `@disabled={{true}}` disables the `<fieldset>`, which disables every form control nested inside of it.',
      },
    },
    a11y: {
      config: {
        // WCAG 1.4.3 exempts inactive (disabled) controls from contrast
        // minimums.
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
});

Disabled.test('disables every nested control', async ({ canvas }) => {
  await expect(
    canvas.getByRole('textbox', { name: 'First Name' }),
  ).toBeDisabled();
  await expect(canvas.getByRole('radio', { name: 'Option 2' })).toBeDisabled();
});

export const Invalid = meta.story({
  args: {
    legendText: 'Invalid FormGroup',
    invalid: true,
    message: true,
    messageText: 'A valid value is required',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Passing `@invalid={{true}}` marks the `<fieldset>` as invalid via `data-invalid`. `@message={{true}}` renders `@messageText` below the group’s contents, commonly used to surface a validation message.',
      },
    },
  },
});

Invalid.test('shows the message', async ({ canvas }) => {
  await expect(canvas.getByText('A valid value is required')).toBeVisible();
});
