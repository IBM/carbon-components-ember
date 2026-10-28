/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';
import EmptyStateContent from './-empty-state-content.gts';
import EmptyStateIllustration from './-empty-state-illustration.gts';
import type { EmptyStateIllustrationSignature } from './-empty-state-illustration.gts';
import type { EmptyStateSignature } from './empty-state.gts';
import './empty-state.scss';

export interface UnauthorizedEmptyStateSignature {
  Element: HTMLDivElement;
  Args: Omit<EmptyStateSignature['Args'], 'illustration'> & {
    /** Defaults to `light`. */
    illustrationTheme?: EmptyStateIllustrationSignature['Args']['theme'];
  };
  Blocks: EmptyStateSignature['Blocks'];
}

/**
 * An `EmptyState` with Carbon for IBM Products' unauthorized
 * illustration, for content someone isn't allowed to see.
 */
const UnauthorizedEmptyState: TOC<UnauthorizedEmptyStateSignature> = <template>
  <div
    class="c4p--empty-state c4p--empty-state-position--{{or
        @illustrationPosition
        'top'
      }}
      c4p--empty-state-type--unauthorized"
    ...attributes
  >
    <EmptyStateIllustration
      @kind="unauthorized"
      @theme={{@illustrationTheme}}
      @size={{or @size "lg"}}
      @alt={{or @illustrationDescription @title}}
    />
    <EmptyStateContent
      @action={{@action}}
      @link={{@link}}
      @size={{or @size "lg"}}
      @headingAs={{@headingAs}}
      @subtitle={{@subtitle}}
      @title={{@title}}
      @hasSubtitleBlock={{has-block "subtitle"}}
    >
      <:subtitle>{{yield to="subtitle"}}</:subtitle>
    </EmptyStateContent>
  </div>
</template>;

export default UnauthorizedEmptyState;
