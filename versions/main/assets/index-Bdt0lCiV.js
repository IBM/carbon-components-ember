import { S as Selected, D as DocsService, k as Compiler, l as DocsService$1 } from './main-BVMVBXpL.js';
export { A as APIDocs, m as CommentQuery, n as Compiled, p as ComponentSignature, q as HelperSignature, M as ModifierSignature, v as addRoutes, w as getIndexPage, x as isCollection, y as isIndex } from './main-BVMVBXpL.js';

function registry(prefix) {
  return {
    [`${prefix}/services/kolay/api-docs`]: DocsService$1,
    [`${prefix}/services/kolay/compiler`]: Compiler,
    [`${prefix}/services/kolay/docs`]: DocsService,
    [`${prefix}/services/kolay/selected`]: Selected
  };
}

export { registry };
