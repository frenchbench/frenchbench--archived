import { newUuid, randSecret, nowStr } from 'frenchbench-common';
import { Db } from './db';
import { ERRORS } from './constants';
import { IServerConfig } from './serverConfig';
import { passwordHash, tokenCreate, passwordVerify } from './lib/security';
import loadAuth from './auth';

export class Api {

  constructor(public config: IServerConfig, public db: Db) {

  }

  async health() {
    return Promise.resolve({ data: nowStr() });
  }

  async sendSecret({ email }: { email: string }) {
    const { secretPattern } = this.config.security;
    // TODO: validate email address
    const row = {
      email,
      id: newUuid(),
      secret: randSecret(secretPattern),
      created_at: nowStr(),
    };
    const result = await this.db.secretRepo().create(row);

    // TODO: send secret in an email

    return {
      data: result ? row.id : null,
    };
  }

  async userList(args: any){
    return this.db.userRepo().retrieve(args);
  }

  async userRetrieve(id: string){
    return this.db.userRepo().retrieveOne({ where: 'id = ?', params: [id] });
  }

  async userRetrieveByUsername(username: string){
    return this.db.userRepo().retrieveOne({ where: 'username = ?', params: [username] });
  }

  async userSkillsRetrieve(args: any){
    return this.db.userSkillRepo().retrieve(args);
  }

  // registration
  async userCreate(args: any){
    const { secretId, secret, email, username, password, password_confirm } = args;
    if (password !== password_confirm) {
      return { error: ERRORS.PASSWORDS_NOT_SAME };
    }

    // TODO: password pattern validation: [a-z],[A-Z],[0-9],specials,length

    // TODO: validate secret, within 24h
    const secretRow = await this.db.secretRepo().retrieveOne({
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

    const userResult = await this.db.userRepo().create(userRow);

    // TODO: delete secret?

    const payload = { user_id: userId };
    const token = await tokenCreate(payload, this.config.security.tokens);

    return {
      data: userResult ? token : null,
    };
  }

  async login(args: any) {
    const { username, password } = args;
    const user = await this.db.userRepo().retrieveOne({ where: 'username = ?', params: [username] });
    if (!user) {
      return Promise.resolve({ error: ERRORS.INVALID_CREDENTIALS });
    }

    const verified = await passwordVerify(password, user.password_hash);
    if (!verified) {
      return Promise.resolve({ error: ERRORS.INVALID_CREDENTIALS });
    }

    const payload = { user_id: user.id };
    const token = await tokenCreate(payload, this.config.security.tokens);

    return Promise.resolve({ data: token });
  }

  async me() {

  }

  async logout(token: string) {
    // TODO
    return Promise.resolve({ data: nowStr() });
  }

  async postRetrieveByUserIdAndPageRef(user_id: string, page_ref: string){
    return this.db.userRepo().retrieveOne({
      where: 'user_id = ? AND page_ref = ?',
      params: [user_id, page_ref],
    });
  }

  async assetList(args: any){
    return this.db.assetRepo().retrieve(args);
  }

  async entityAssetList(args: any){
    return this.db.entityAssetRepo().retrieve(args);
  }

  auth() {
    return loadAuth(this.db, this.config);
  }
}
