export function copyProps(toObj = {}, fromObj = {}) {
  Object.entries(fromObj).forEach(([k, v]) => {
    if (v === null || v === undefined) {
      console.warn('copyProps ignoring', k, v);
    } else {
      toObj[k] = v;
    }
  });
}
