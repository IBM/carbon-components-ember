import type ChatSessionService from '../src/services/ai-chat-session.ts';
import type DialogManagerService from '../src/services/dialog-manager.ts';
import type NotificationService from '../src/services/notifications.ts';

// The addon's services are re-exported into the app tree under `carbon/`,
// so they're injected as e.g. `@service('carbon.dialog-manager')`.
declare module '@ember/service' {
  interface Registry {
    'carbon.ai-chat-session': ChatSessionService;
    'carbon.dialog-manager': DialogManagerService;
    'carbon.notifications': NotificationService;
  }
}
