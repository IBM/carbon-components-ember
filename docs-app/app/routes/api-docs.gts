import {
  APIDocs as KolayAPIDocs,
  ComponentSignature as KolayComponentSignature,
  ModifierSignature as KolayModifierSignature,
} from 'kolay';

import type { TOC } from '@ember/component/template-only';

export const APIDocs: TOC<{
  Args: { declaration: string; name: string };
}> = <template>
  <KolayAPIDocs
    @package="carbon-components-ember"
    @module="declarations/{{@declaration}}"
    @name={{@name}}
  />
</template>;

export const ComponentSignature: TOC<{
  Args: { declaration: string; name: string };
}> = <template>
  <KolayComponentSignature
    @package="carbon-components-ember"
    @module="declarations/{{@declaration}}"
    @name={{@name}}
  />
</template>;

export const ModifierSignature: TOC<{
  Args: { declaration: string; name: string };
}> = <template>
  <KolayModifierSignature
    @package="carbon-components-ember"
    @module="declarations/{{@declaration}}"
    @name={{@name}}
  />
</template>;
