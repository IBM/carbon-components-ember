import { S as Selected, D as DocsService, C as Compiler, k as DocsService$1 } from './main-CwDuIC-C.js';
export { A as APIDocs, l as CommentQuery, m as Compiled, n as ComponentSignature, p as HelperSignature, M as ModifierSignature, q as addRoutes, v as getIndexPage, w as isCollection, x as isIndex } from './main-CwDuIC-C.js';

function registry(prefix) {
  return {
    [`${prefix}/services/kolay/api-docs`]: DocsService$1,
    [`${prefix}/services/kolay/compiler`]: Compiler,
    [`${prefix}/services/kolay/docs`]: DocsService,
    [`${prefix}/services/kolay/selected`]: Selected
  };
}

export { registry };
