export function randIdx(max: number, min = 0) {
  return min + Math.floor(Math.random() * max);
}

export const CHAR_LIST  = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // removed 'I', and 'O'
export const CHAR_COUNT = 24; // CHAR_LIST.length;
export const NUM_LIST   = '123456789'; // removed '0'
export const NUM_COUNT  = 9; // NUM_LIST.length;

export function randChars(size = 20) {
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

export function randSecret(pattern = 'AB12CD'){
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

export function randString(length = 20) {
  let result = '', j = 0;
  for (let i = 0; i < length; i++) {
    j = randIdx(2);
    if (j === 0) result += randNums(1);
    if (j === 1) result += randChars(1);
  }
  return result;
}
