import { v4 } from 'uuid';
import bcrypt from 'bcrypt';

export function newUuid() {
  return v4();
}

export function nowStr() {
  return (new Date()).toISOString();
}

const CHAR_LIST  = 'ABCDEFGHJKLMNOPQRSTUVWXYZ';
const CHAR_COUNT = CHAR_LIST.length;
const NUM_LIST   = '123456789';
const NUM_COUNT  = 9;

export function randChars(size = 20) {
  let result = '';
  for (let i = 0; i < size; i++) {
    const r = Math.floor(Math.random() * CHAR_COUNT);
    result += CHAR_LIST.charAt(r);
  }
  return result;
}

export function randNums(size = 20) {
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

export async function makePasswordHash(password, saltRounds = 10) {
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

