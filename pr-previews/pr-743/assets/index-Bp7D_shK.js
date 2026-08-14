import { aA as isArray$1, aB as truthConvert } from './main-Dx0IVUHb.js';
export { aC as and, aD as eq, aE as isEmpty, aF as isEqual, al as not, aG as notEq, aH as or } from './main-Dx0IVUHb.js';

function gt(left, right, options) {
  if (options?.forceNumber) {
    if (typeof left !== 'number') {
      left = Number(left);
    }
    if (typeof right !== 'number') {
      right = Number(right);
    }
  }
  return left > right;
}

function gte(left, right, options) {
  if (options?.forceNumber) {
    if (typeof left !== 'number') {
      left = Number(left);
    }
    if (typeof right !== 'number') {
      right = Number(right);
    }
  }
  return left >= right;
}

function isArray(...params) {
  return params.every(isArray$1);
}

function lt(left, right, options) {
  if (options?.forceNumber) {
    if (typeof left !== 'number') {
      left = Number(left);
    }
    if (typeof right !== 'number') {
      right = Number(right);
    }
  }
  return left < right;
}

function lte(left, right, options) {
  if (options?.forceNumber) {
    if (typeof left !== 'number') {
      left = Number(left);
    }
    if (typeof right !== 'number') {
      right = Number(right);
    }
  }
  return left <= right;
}

function xor(left, right) {
  return truthConvert(left) !== truthConvert(right);
}

export { gt, gte, isArray, lt, lte, xor };
