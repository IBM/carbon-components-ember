/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  AiChatCard,
  AiChatCardFooter,
  AiChatCodeSnippet,
  AudioPlayer,
  Table,
  VideoPlayer,
} from 'carbon-components-ember/components/index';
import { eq } from 'ember-truth-helpers';

import {
  sampleAudioSource,
  sampleCardFooterActions,
  sampleCode,
  sampleTableHeaders,
  sampleTableRows,
  sampleVideoSource,
} from './sample-data.ts';

import type { TOC } from '@ember/component/template-only';

/**
 * A "custom response type" for this demo - `ChatSession` only stores plain
 * `text` per message (see AGENTS.md, `services/ai-chat-session.ts`'s own
 * class doc), so structured responses are kept entirely in the host
 * application, keyed by the message id `receive()` returns, rather than
 * inventing a wire format inside `ChatMessage.text` itself. This is the
 * same boundary upstream draws with its own `message_options.response_type`
 * - the host decides how to render a given response, the session only
 * carries the conversational text.
 */
export type RichResponseKind = 'card' | 'table' | 'code' | 'audio' | 'video';

export interface RichResponse {
  kind: RichResponseKind;
}

export const RichResponseWidget: TOC<{ Args: { response: RichResponse } }> = <template>
  {{#if (eq @response.kind "card")}}
    <AiChatCard>
      <:header>Carbon AI Chat components</:header>
      <:body>A Glimmer-native port of the @carbon/ai-chat-components widget library, assembled into
        this demo app.</:body>
      <:footer>
        <AiChatCardFooter @actions={{sampleCardFooterActions}} />
      </:footer>
    </AiChatCard>
  {{else if (eq @response.kind "table")}}
    <Table
      @tableTitle="Ported components"
      @headers={{sampleTableHeaders}}
      @rows={{sampleTableRows}}
    />
  {{else if (eq @response.kind "code")}}
    <AiChatCodeSnippet @code={{sampleCode}} @language="javascript" @highlight={{true}} />
  {{else if (eq @response.kind "audio")}}
    <AudioPlayer @source={{sampleAudioSource}} @ariaLabel="Sample audio clip" />
  {{else if (eq @response.kind "video")}}
    <VideoPlayer @source={{sampleVideoSource}} @ariaLabel="Sample video clip" />
  {{/if}}
</template>;

export default RichResponseWidget;
