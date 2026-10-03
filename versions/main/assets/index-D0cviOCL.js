const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-B3HD9W1l.js","assets/index-BZr71EI0.js","assets/index-D2CeE0KS.js","assets/index-Da_U3wY2.js","assets/index-DjmRBv4T.js","assets/index-CkCz5A90.js","assets/index-dqVyFyRL.js","assets/index-DoDyyjRT.js","assets/index-WZIPVdOk.js","assets/index-BO4Xrq47.js","assets/index-EP_M98uz.js","assets/index-BMtY9wO6.js","assets/index-Yg46vtod.js"])))=>i.map(i=>d[i]);
import { R as __vitePreload } from './main-DRxmdFlR.js';
import { m as markdown, p as parser, G as GFM, S as Subscript, a as Superscript, E as Emoji, T as Table } from './index-AIiFV6Iq.js';
import { H as Language, J as defineLanguageFacet, K as foldNodeProp, O as indentNodeProp, Q as languageDataProp, L as LanguageDescription } from './index-BZr71EI0.js';
import { l as languages } from './index-pKPJ8_hC.js';
import './index-DoDyyjRT.js';
import './index-CkCz5A90.js';
import './index-DjmRBv4T.js';
import './index-Da_U3wY2.js';
import './index-dqVyFyRL.js';
import './index-D2CeE0KS.js';

// javascriptLanguage.data.of({
//   autocomplete: completeFromList([
//     ...completionsOfObject(window),
//     ...completionsOfObject(document),
//   ]),
// }),
const data = defineLanguageFacet({
  block: [
  // { open: '<!--', close: '-->' },
  {
    open: '{{!',
    close: '}}'
  }, {
    open: '{{!--',
    close: '--}}'
  }]
});
const commonmark = parser.configure({
  props: [foldNodeProp.add(type => {
    if (!type.is('Block') || type.is('Document')) return undefined;
    return (tree, state) => ({
      from: state.doc.lineAt(tree.from).to,
      to: tree.to
    });
  }), indentNodeProp.add({
    Document: () => null
  }), languageDataProp.add({
    Document: data
  })]
});
function markdownLang(parser) {
  return new Language(data, parser);
}
// class HbsParser implements LeafBlockParser {
//   nextLine(_cx: BlockContext, _line: Line, _leaf: LeafBlock): boolean {
//     throw new Error('Method not implemented.');
//   }
//   finish(_cx: BlockContext, _leaf: LeafBlock): boolean {
//     throw new Error('Method not implemented.');
//   }
// }
// const Glimdown: MarkdownConfig = {
//   defineNodes: [{ name: 'S-Expression' }, { name: 'Block-S-Expression', block: true }],
//   parseBlock: [
//     {
//       name: 'S-Expression',
//       leaf(_, leaf): HbsParser | null {
//         return leaf.content.startsWith('{{') ? new HbsParser() : null;
//       },
//       endLeaf(_cx, _line, leaf) {
//         if (leaf.parsers.some((p) => p instanceof HbsParser)) {
//           return false;
//         }
//         return true;
//       },
//     },
//     {
//       name: 'Block-S-Expression',
//     },
//   ],
// };
const extendedMarkdown = commonmark.configure([GFM, Subscript, Superscript, Emoji, Table
// Glimdown,
]);
const codeLanguages = [...languages, LanguageDescription.of({
  name: 'glimmer',
  alias: ['hbs', 'glimmer', 'ember', 'handlebars'],
  extensions: ['hbs'],
  async load() {
    // @ts-ignore
    const {
      glimmer
    } = await __vitePreload(async () => { const {
      glimmer
    } = await import('./index-B3HD9W1l.js');return {
      glimmer
    }},true              ?__vite__mapDeps([0,1,2,3,4,5,6,7]):void 0);
    return glimmer();
  }
}), LanguageDescription.of({
  name: 'glimmer-js',
  alias: ['gjs', 'glimmer-js', 'javascript.glimmer'],
  extensions: ['gjs'],
  async load() {
    // @ts-ignore
    const {
      gjs
    } = await __vitePreload(async () => { const {
      gjs
    } = await import('./index-WZIPVdOk.js');return {
      gjs
    }},true              ?__vite__mapDeps([8,6,4,1,2,7,0,3,5]):void 0);
    return gjs();
  }
}), LanguageDescription.of({
  name: 'glimmer-ts',
  alias: ['gts', 'glimmer-ts', 'typescript.glimmer'],
  extensions: ['gts'],
  async load() {
    // @ts-ignore
    const {
      gts
    } = await __vitePreload(async () => { const {
      gts
    } = await import('./index-WZIPVdOk.js');return {
      gts
    }},true              ?__vite__mapDeps([8,6,4,1,2,7,0,3,5]):void 0);
    return gts();
  }
}), LanguageDescription.of({
  name: 'vue',
  extensions: ['vue'],
  async load() {
    // @ts-ignore
    const {
      vue
    } = await __vitePreload(async () => { const {
      vue
    } = await import('./index-BO4Xrq47.js');return {
      vue
    }},true              ?__vite__mapDeps([9,1,2,5,4,3,6,7]):void 0);
    return vue();
  }
}), LanguageDescription.of({
  name: 'svelte',
  extensions: ['svelte'],
  async load() {
    // @ts-ignore
    const {
      svelte
    } = await __vitePreload(async () => { const {
      svelte
    } = await import('./index-EP_M98uz.js');return {
      svelte
    }},true              ?__vite__mapDeps([10,4,1,2,3,6,7,5]):void 0);
    return svelte();
  }
}), LanguageDescription.of({
  name: 'javascript',
  extensions: ['javascript'],
  async load() {
    // @ts-ignore
    const {
      javascript
    } = await __vitePreload(async () => { const {
      javascript
    } = await import('./index-dqVyFyRL.js').then(n => n.i);return {
      javascript
    }},true              ?__vite__mapDeps([6,4,1,2,7]):void 0);
    return javascript();
  }
}), LanguageDescription.of({
  name: 'javascript-jsx',
  extensions: ['jsx', 'react'],
  async load() {
    // @ts-ignore
    const {
      javascript
    } = await __vitePreload(async () => { const {
      javascript
    } = await import('./index-dqVyFyRL.js').then(n => n.i);return {
      javascript
    }},true              ?__vite__mapDeps([6,4,1,2,7]):void 0);
    return javascript({
      jsx: true
    });
  }
}), LanguageDescription.of({
  name: 'mermaid',
  extensions: ['mermaid'],
  async load() {
    // @ts-ignore
    const {
      mermaid
    } = await __vitePreload(async () => { const {
      mermaid
    } = await import('./index-BMtY9wO6.js');return {
      mermaid
    }},true              ?__vite__mapDeps([11,1,2,4]):void 0);
    return mermaid();
  }
}), LanguageDescription.of({
  name: 'yaml',
  extensions: ['yaml', 'yml'],
  async load() {
    // @ts-ignore
    const {
      yaml
    } = await __vitePreload(async () => { const {
      yaml
    } = await import('./index-Yg46vtod.js');return {
      yaml
    }},true              ?__vite__mapDeps([12,4,1,2]):void 0);
    return yaml();
  }
})];
function glimdown() {
  return markdown({
    base: markdownLang(extendedMarkdown),
    codeLanguages
  });
}

export { codeLanguages, glimdown };
