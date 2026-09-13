/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Extension } from '@tiptap/core';
import { carbonAutocomplete, type ExcludedTrigger } from './carbon-autocomplete.ts';
import { carbonCommand, carbonMention } from './carbon-mention.ts';
import { carbonStarterTrigger } from './carbon-starter-trigger.ts';
import type { AutocompleteConfig, StartersConfig, TriggerSuggestionConfig } from './types.ts';

/**
 * Ported from `@carbon/ai-chat-components`' `tiptap/build-extensions.ts`.
 * Pure convenience helper: translates the four suggestion configs into a
 * `PromptLine`-compatible `@extensions` array. Cut from upstream: the
 * `tagExtensionSource`/equivalence-check tagging (`extension-equivalence.ts`,
 * not ported — this port's existing `@extensions` contract is already
 * "compared by reference, memoize it," so there's nothing extra to
 * reconcile). Enter-to-send is **not** included here — `PromptLine` bakes
 * `carbonChatEnter` into its own base bundle already.
 *
 * Leave a field out of `configs` to leave its extension out. Reached only
 * through a dynamic `import()` — see `carbon-mention.ts`'s class doc for why
 * this must never be statically imported from `PromptLine.gts` or the
 * components barrel.
 */
export interface BuildCarbonExtensionsConfig {
  /** Config for the `@`-style mention picker. */
  mention?: TriggerSuggestionConfig;
  /** Config for the `/`-style command picker. */
  command?: TriggerSuggestionConfig;
  /** Config for live autocomplete — stands down for whichever `mention`/`command` triggers are also passed. */
  autocomplete?: AutocompleteConfig;
  /** Config for starter prompts shown while the editor is empty and focused. */
  starters?: StartersConfig;
}

export function buildCarbonExtensions(configs: BuildCarbonExtensionsConfig): Extension[] {
  const out: Extension[] = [];
  if (configs.mention) {
    out.push(carbonMention(configs.mention) as unknown as Extension);
  }
  if (configs.command) {
    out.push(carbonCommand(configs.command) as unknown as Extension);
  }
  if (configs.autocomplete) {
    const excludeTriggers: ExcludedTrigger[] = [];
    if (configs.mention) {
      excludeTriggers.push({
        char: configs.mention.trigger,
        position: configs.mention.triggerPosition === 'start' ? 'start' : 'anywhere',
      });
    }
    if (configs.command) {
      excludeTriggers.push({
        char: configs.command.trigger,
        position: configs.command.triggerPosition === 'start' ? 'start' : 'anywhere',
      });
    }
    out.push(carbonAutocomplete(configs.autocomplete, excludeTriggers));
  }
  if (configs.starters) {
    out.push(carbonStarterTrigger(configs.starters.items, configs.starters.isOn));
  }
  return out;
}
