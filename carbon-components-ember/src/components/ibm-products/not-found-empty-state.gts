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

export interface NotFoundEmptyStateSignature {
  Element: HTMLDivElement;
  Args: Omit<EmptyStateSignature['Args'], 'illustration'> & {
    /** Defaults to `light`. */
    illustrationTheme?: EmptyStateIllustrationSignature['Args']['theme'];
  };
  Blocks: EmptyStateSignature['Blocks'];
}

/**
 * An `EmptyState` with Carbon for IBM Products' not-found illustration,
 * for a search or filter that found nothing.
 */
const NotFoundEmptyState: TOC<NotFoundEmptyStateSignature> = <template>
  <div
    class="c4p--empty-state c4p--empty-state-position--{{or
        @illustrationPosition
        'top'
      }}
      c4p--empty-state-type--notFound"
    ...attributes
  >
    <EmptyStateIllustration
      @kind="notFound"
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

export default NotFoundEmptyState;
