const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

export async function passwordHash(password: string, saltRounds = 10) {
  return bcrypt.hash(password, saltRounds);
}

export async function passwordVerify(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export interface ITokenCreateOptions {
  signKey: string;
  expiry: string;
}

export async function tokenCreate(payload: any, options: ITokenCreateOptions) {
  const { signKey, expiry } = options;
  const token = jwt.sign(payload, signKey, { expiresIn: expiry });
  console.log('tokenCreate', token);
  return token;
}

export interface ITokenVerifyOptions {
  signKey: string;
}

export async function tokenVerify(token: string, options: ITokenVerifyOptions) {
  const { signKey } = options;
  const decoded = await jwt.verify(token, signKey);
  console.log('tokenVerify', decoded);
  return decoded;
}
