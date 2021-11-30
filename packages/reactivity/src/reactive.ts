import { isObject } from '@wp/shared';
import { track, triggle } from './effect';

let proxyMap = new WeakMap();

export function reactive(target) {
  if(!isObject(target) || isReactive(target)) {
    return target;
  }
  if(proxyMap.has(target)) {
    return proxyMap.get(target);
  }

  const handler = {
    get(raw, key, receiver) {
      if(key ==='__isReactive') {
        return true;
      }
      const res = Reflect.get(raw, key, receiver);
      track(raw, key);
      return isObject(res) ? reactive(res) : res;
    },
    set(raw, key, value, receiver) {
      const oldValue = Reflect.get(raw, key, receiver);
      const oldLength = Reflect.get(raw, 'length', receiver);
      const res = Reflect.set(raw, key, value, receiver);
      if(oldValue !== value && !Number.isNaN(oldValue) && !Number.isNaN(value)) {
        triggle(raw, key);
        if(Array.isArray(raw) && oldLength !== raw.length) {
          triggle(raw, 'length');
        }
      }
      return res;
    }
  };

  let p = new Proxy(target, handler);

  proxyMap.set(target, p);

  return p;
};

function isReactive(raw) {
  return !!(raw && raw.__isReactive);
}