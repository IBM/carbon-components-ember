import preview from '#storybook/preview.ts';
import DatePickerSkeleton from './date-picker-skeleton.gts';

// Carbon React has no stories of its own for DatePickerSkeleton: it's the
// `Skeleton` story of Components/DatePicker.

const meta = preview.meta({
  title: 'Components/DatePicker/DatePickerSkeleton',
  component: DatePickerSkeleton,
  parameters: {
    docs: {
      description: {
        component:
          'A loading placeholder for a `DatePicker`; `@range` shows two inputs.',
      },
    },
  },
  args: {
    range: false,
    hideLabel: false,
  },
});

export const Default = meta.story();
