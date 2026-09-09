import { b0 as isArray$1, b1 as truthConvert } from './main-DYrhWXed.js';
export { b2 as and, b3 as eq, b4 as isEmpty, b5 as isEqual, ap as not, b6 as notEq, b7 as or } from './main-DYrhWXed.js';

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
