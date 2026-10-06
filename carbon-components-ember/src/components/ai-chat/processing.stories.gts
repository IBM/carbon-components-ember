import preview from '#storybook/preview.ts';
import Processing from './processing.gts';

// Mirrors `@carbon/ai-chat-components`' `processing.stories.js`. Upstream's
// `carbonTheme` arg isn't ported: the Storybook toolbar's theme switcher
// applies Carbon's theme classes instead.
const meta = preview.meta({
  title: 'AI Chat/Processing',
  component: Processing,
  parameters: {
    docs: {
      description: {
        component:
          '`Processing` renders a three-dot "processing"/"thinking" animation, used to indicate an in-progress assistant response.',
      },
    },
  },
});

export const QuickLoad = meta.story({
  args: {
    quickLoad: true,
    loop: true,
  },
});

export const LinearLoop = meta.story({
  args: {
    loop: true,
  },
});

export const LinearNoLoop = meta.story({
  args: {
    loop: false,
  },
});

// docs-app's demo rendered the three variants side by side.
export const AllVariants = meta.story({
  render: () => <template>
    <div style="display: flex; gap: 2rem;">
      <Processing />
      <Processing @loop={{true}} />
      <Processing @quickLoad={{true}} />
    </div>
  </template>,
});
