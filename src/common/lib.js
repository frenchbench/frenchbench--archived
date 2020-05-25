function nowStr() {
  return (new Date()).toISOString();
}

async function asyncForEach(arr, fn) {
  for (let i = 0; i < arr.length; i++) {
    await fn(arr[i], i, arr);
  }
}

function forEachPromise(items, fn) {
  return items.reduce((promise, item) => {
    return promise.then(() => {
      return fn(item);
    });
  }, Promise.resolve());
}

function randIdx(max, min = 0) {
  return min + Math.floor(Math.random() * max);
}

const CHAR_LIST  = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // removed 'I', and 'O'
const CHAR_COUNT = 24; // CHAR_LIST.length;
const NUM_LIST   = '123456789'; // removed '0'
const NUM_COUNT  = 9; // NUM_LIST.length;

function randChars(size = 20) {
  let result = '';
  for (let i = 0; i < size; i++) {
    const r = Math.floor(Math.random() * CHAR_COUNT);
    result += CHAR_LIST.charAt(r);
  }
  return result;
}

function randNums(size = 20) {
  let result = '';
  for (let i = 0; i < size; i++) {
    const r = Math.floor(Math.random() * NUM_COUNT);
    result += NUM_LIST.charAt(r);
  }
  return result;
}

function randSecret(pattern = 'AB12CD'){
  let result = '';
  const L = pattern.length;
  for (let i = 0; i < L; i++) {
    const c = pattern.charAt(i);
    if (parseInt(c) > 0) {
      result += randNums(1);
    } else {
      result += randChars(1);
    }
  }
  //return randChars(2) + randNums(2) + randChars(2);
  return result;
}

module.exports = {
  nowStr,
  asyncForEach,
  forEachPromise,
  randIdx,
  randChars,
  randNums,
  randSecret,
};
