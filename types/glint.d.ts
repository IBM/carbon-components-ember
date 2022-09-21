import { ComponentLike } from '@glint/template';
import '@glint/environment-ember-loose/registry';
import DidInsertModifier from '@gavant/glint-template-types/types/ember-render-modifiers/did-insert';
import DidUpdateModifier from '@gavant/glint-template-types/types/ember-render-modifiers/did-update';


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ember-cli-addon-docs/components/docs-demo': ComponentLike<{}>;
    EmberTooltip: ComponentLike<{}>;
    'did-insert': typeof DidInsertModifier;
    'did-update': typeof DidUpdateModifier;
  }
}
