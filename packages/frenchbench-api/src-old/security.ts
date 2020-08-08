import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function passwordHash(password: string, saltRounds = 10): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

export async function passwordVerify(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export interface ITokenCreateOptions {
  signKey: string;
  expiry: string;
}

export interface IPayload {
  user_id: string;
}

export async function tokenCreate(payload: IPayload, options: ITokenCreateOptions): Promise<string> {
  const { signKey, expiry } = options;
  const token = await jwt.sign(payload, signKey, { expiresIn: expiry });
  console.log('tokenCreate', token);
  return token;
}

export interface ITokenVerifyOptions {
  signKey: string;
}

export async function tokenVerify(token: string, options: ITokenVerifyOptions): Promise<IPayload> {
  const { signKey } = options;
  const decoded = await jwt.verify(token, signKey);
  console.log('tokenVerify', decoded);
  return decoded as IPayload;
}
