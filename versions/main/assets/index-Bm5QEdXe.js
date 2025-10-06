import { S as Selected, D as DocsService, k as Compiler, l as DocsService$1 } from './main-yGHYX9Wd.js';
export { A as APIDocs, m as CommentQuery, v as Compiled, n as ComponentSignature, p as HelperSignature, M as ModifierSignature, q as addRoutes, w as getIndexPage, x as isCollection, y as isIndex } from './main-yGHYX9Wd.js';

function registry(prefix) {
  return {
    [`${prefix}/services/kolay/api-docs`]: DocsService$1,
    [`${prefix}/services/kolay/compiler`]: Compiler,
    [`${prefix}/services/kolay/docs`]: DocsService,
    [`${prefix}/services/kolay/selected`]: Selected
  };
}

export { registry };
