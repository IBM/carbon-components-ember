import { bb as isArray$1, bc as truthConvert } from './main-Bd_wyRpd.js';
export { bd as and, be as eq, bf as isEmpty, bg as isEqual, ap as not, bh as notEq, bi as or } from './main-Bd_wyRpd.js';

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
