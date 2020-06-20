import { newUuid, randSecret, nowStr } from 'frenchbench-common';
import { newDb } from './db';
import { ERRORS } from './constants';
import { newConfig } from './serverConfig';
import { passwordHash, tokenCreate, passwordVerify } from './security';
import loadAuth from './auth';

export function newApi(env: any) {
  const config = newConfig(env);
  const db = newDb(config.dbConfig);

  async function health() {
    return Promise.resolve({ data: nowStr() });
  }

  async function sendSecret({ email }: { email: string }) {
    const { secretPattern } = config.security;
    // TODO: validate email address
    const row = {
      email,
      id: newUuid(),
      secret: randSecret(secretPattern),
      created_at: nowStr(),
    };
    const result = await db.secretRepo.create(row);

    // TODO: send secret in an email

    return {
      data: result ? row.id : null,
    };
  }

  async function userList(args: any){
    return db.userRepo.retrieve(args);
  }

  async function userRetrieve(id: string){
    return db.userRepo.retrieveOne({ where: 'id = ?', params: [id] });
  }

  async function userRetrieveByUsername(username: string){
    return db.userRepo.retrieveOne({ where: 'username = ?', params: [username] });
  }

  async function userSkillsRetrieve(args: any){
    return db.userSkillRepo.retrieve(args);
  }

  // registration
  async function userCreate(args: any){
    const { secretId, secret, email, username, password, password_confirm } = args;
    if (password !== password_confirm) {
      return { error: ERRORS.PASSWORDS_NOT_SAME };
    }

    // TODO: password pattern validation: [a-z],[A-Z],[0-9],specials,length

    // TODO: validate secret, within 24h
    const secretRow = await db.secretRepo.retrieveOne({
      where: 'id = ? AND secret = ? AND email = ?',
      params: [ secretId, secret, email ],
    });

    if (!secretRow) {
      return{ error: ERRORS.EMAIL_VERIFICATION };
    }

    const password_hash = await passwordHash(password);
    const userId = newUuid();
    const userRow = {
      id: userId,
      email,
      username,
      password_hash,
      created_by: userId,
      updated_by: userId,
    };

    // TODO: check email is unique
    // TODO: check username is unique

    const userResult = await db.userRepo.create(userRow);

    // TODO: delete secret?

    const payload = { user_id: userId };
    const token = await tokenCreate(payload, config.security.tokens);

    return {
      data: userResult ? token : null,
    };
  }

  async function login(args: any) {
    const { username, password } = args;
    const user = await db.userRepo.retrieveOne({ where: 'username = ?', params: [username] });
    if (!user) {
      return Promise.resolve({ error: ERRORS.INVALID_CREDENTIALS });
    }

    const verified = await passwordVerify(password, user.password_hash);
    if (!verified) {
      return Promise.resolve({ error: ERRORS.INVALID_CREDENTIALS });
    }

    const payload = { user_id: user.id };
    const token = await tokenCreate(payload, config.security.tokens);

    return Promise.resolve({ data: token });
  }

  async function logout(token: string) {
    // TODO
    return Promise.resolve({ data: nowStr() });
  }

  async function postRetrieveByUserIdAndPageRef(user_id: string, page_ref: string){
    return db.userRepo.retrieveOne({
      where: 'user_id = ? AND page_ref = ?',
      params: [user_id, page_ref],
    });
  }

  async function assetList(args: any){
    return db.assetRepo.retrieve(args);
  }

  async function entityAssetList(args: any){
    return db.entityAssetRepo.retrieve(args);
  }

  return {
    auth: loadAuth(db, config),
    db,
    health,
    sendSecret,
    userList,
    userCreate,
    userRetrieve,
    userRetrieveByUsername,
    userSkillsRetrieve,
    login,
    logout,
    postRetrieveByUserIdAndPageRef,
    assetList,
    entityAssetList,
  }
}
