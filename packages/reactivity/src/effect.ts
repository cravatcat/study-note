let activedEffect = null;

export function effect(fn) {
  let wrapperFn = () => {
    try {
      activedEffect = wrapperFn;
      return fn();
    } catch(err) {
      console.log(err);
    } finally {
      activedEffect = null;
    }
  }
  wrapperFn();
  return wrapperFn;
}

const targetMap = new WeakMap();
export function track(raw, key) {
  if(!activedEffect) return;
  let depsMap = targetMap.get(raw);
  if(!depsMap) {
    depsMap = new Map();
    targetMap.set(raw, depsMap);
  }
  let deps = depsMap.get(key);
  if(!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }
  deps.add(activedEffect);
};

export function triggle(raw, key) {
  let depsMap = targetMap.get(raw);
  if(!depsMap) return;
  let deps = depsMap.get(key);
  if(!deps) return;
  deps.forEach(fn => {
    fn();
  });
};