export async function asyncForEach(arr: Array<any>, fn: Function) {
  for (let i = 0; i < arr.length; i++) {
    await fn(arr[i], i, arr);
  }
}

export function chainPromises(items: Array<any>, fn: Function) {
  return items.reduce((promise, item) => {
    return promise.then(() => {
      return fn(item);
    });
  }, Promise.resolve());
}
