import { S as Selected, D as DocsService, k as Compiler, l as DocsService$1 } from './main-CjP_kg1C.js';
export { A as APIDocs, m as CommentQuery, n as Compiled, p as ComponentSignature, q as HelperSignature, M as ModifierSignature, v as addRoutes, w as getIndexPage, x as isCollection, y as isIndex } from './main-CjP_kg1C.js';

function registry(prefix) {
  return {
    [`${prefix}/services/kolay/api-docs`]: DocsService$1,
    [`${prefix}/services/kolay/compiler`]: Compiler,
    [`${prefix}/services/kolay/docs`]: DocsService,
    [`${prefix}/services/kolay/selected`]: Selected
  };
}

export { registry };
