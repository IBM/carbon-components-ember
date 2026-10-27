import type ChatSessionService from '../src/services/ai-chat-session.ts';
import type LayersService from '../src/services/layers.ts';
import type NotificationService from '../src/services/notifications.ts';

// The addon's services are re-exported into the app tree under `carbon/`,
// so they're injected as e.g. `@service('carbon.notifications')`.
declare module '@ember/service' {
  interface Registry {
    'carbon.ai-chat-session': ChatSessionService;
    'carbon.layers': LayersService;
    'carbon.notifications': NotificationService;
  }
}
