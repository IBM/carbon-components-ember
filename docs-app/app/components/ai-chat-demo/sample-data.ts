/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { CardFooterAction } from 'carbon-components-ember/components/ai-chat/card-footer';
import type {
  AiChatTableCell,
  AiChatTableRow,
} from 'carbon-components-ember/components/ai-chat/table';

/**
 * Local, self-hosted sample assets (not a third-party URL) - see the
 * `ai-chat/audio-player.gjs.md`/`video-player.gjs.md` docs demos, which
 * already establish this exact `import.meta.env.BASE_URL` + `demo-support/`
 * pattern so the assets resolve correctly under docs-app's versioned
 * `rootURL` (e.g. `/carbon-components-ember/versions/main/`).
 *
 * `import.meta.env` isn't typed for `glint`'s tsconfig here (same
 * pre-existing gap as `routes/application.ts`'s `import.meta.hot` check) -
 * vite itself resolves it fine at build/runtime. Left as a direct
 * `import.meta.env.BASE_URL` reference (rather than aliasing `import.meta`
 * to a local binding) since vite's static `BASE_URL` replacement only
 * recognizes that exact member-expression shape - aliasing it broke the
 * replacement and produced `undefined` at runtime.
 */
/* eslint-disable @typescript-eslint/no-unsafe-member-access -- import.meta.env isn't typed for glint, see the comment above */
// @ts-expect-error import.meta.env isn't typed for glint - see the comment above.
export const sampleAudioSource = `${import.meta.env.BASE_URL}demo-support/sample-audio.mp3`;
// @ts-expect-error import.meta.env isn't typed for glint - see the comment above.
export const sampleVideoSource = `${import.meta.env.BASE_URL}demo-support/sample-video.mp4`;
/* eslint-enable @typescript-eslint/no-unsafe-member-access */

export const sampleCode = `function greet(name) {
  return \`Hello, \${name}! Welcome to Carbon AI Chat.\`;
}`;

export const sampleTableHeaders: AiChatTableCell[] = [
  { text: 'Component' },
  { text: 'Package' },
  { text: 'Status' },
];

export const sampleTableRows: AiChatTableRow[] = [
  { cells: [{ text: 'Launcher' }, { text: '@carbon/ai-chat-components' }, { text: 'Ported' }] },
  { cells: [{ text: 'ChatShell' }, { text: '@carbon/ai-chat-components' }, { text: 'Ported' }] },
  {
    cells: [{ text: 'WorkspaceShell' }, { text: '@carbon/ai-chat-components' }, { text: 'Ported' }],
  },
];

export const sampleCardFooterActions: CardFooterAction[] = [
  { id: 'learn-more', label: 'Learn more', kind: 'secondary' },
  { id: 'add', label: 'Add to project', kind: 'primary' },
];

/** Suggested prompts rendered as quick-reply chips - see `<:inputBefore>` in `full-window.gts`. */
export const suggestedPrompts = [
  'Show me a product card',
  'Show me a table',
  'Show me some code',
  'Play a sample audio clip',
  'Play a sample video clip',
];
