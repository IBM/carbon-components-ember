import AiChatDemo from 'docs-app/components/ai-chat-demo/index.gts';
import pageTitle from 'ember-page-title/helpers/page-title';
import Route from 'ember-route-template';

export default Route(
  <template>
    {{pageTitle "Carbon AI Chat demo"}}
    <AiChatDemo />
  </template>
);
