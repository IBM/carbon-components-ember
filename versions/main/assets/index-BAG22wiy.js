import { bc as isArray$1, bd as truthConvert } from './main-CnbC7KAG.js';
export { be as and, bf as eq, bg as isEmpty, bh as isEqual, ap as not, bi as notEq, bj as or } from './main-CnbC7KAG.js';

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
