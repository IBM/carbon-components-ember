import { aX as isArray$1, aY as truthConvert } from './main-BA2Ia_4O.js';
export { aZ as and, a_ as eq, a$ as isEmpty, b0 as isEqual, ao as not, b1 as notEq, b2 as or } from './main-BA2Ia_4O.js';

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
