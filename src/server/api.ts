import { newUuid } from '../uuid';
import { newDb } from './db';
import { ERRORS } from '../constants';
import { nowStr } from '../date';
import { randSecret, randString } from '../rand';
import { newConfig } from './serverConfig';
import { passwordHash, tokenCreate, passwordVerify } from './security';
import { newGithub } from './auth/github';
import { newLinkedIn } from './auth/linkedin';

export function newApi(env: any) {
  const config = newConfig(env);
  const db = newDb(config.dbConfig);

  async function health() {
    return Promise.resolve({ data: nowStr() });
  }

  /*
  function makeResource(dbRepo) {
    // TODO: get user context, check permissions
    return {
      GET: async({ offset, limit }) => {
        // TODO dynamic filters
        return dbRepo.retrieve({ offset, limit });
      },
      GET_one: async({ id }) => {
        return dbRepo.retrieveOne({ where: 'id = ?', params: [id] });
      },
      POST: async({ data }) => {
        return dbRepo.create(data);
      },
      PUT: async({ id, data }) => {
        return dbRepo.update({ where: 'id = ?', params: [id] });
      },
      PATCH: async({ id, data }) => {
        return dbRepo.update(data, { where: 'id = ?', params: [id] });
      },
      DELETE: async({ id }) => {
        return dbRepo.delete({ where: 'id = ?', params: [ id ] });
      },
    }
  }
  */

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

  const github   = newGithub(config.security.authProviders.github);
  const linkedin = newLinkedIn(config.security.authProviders.linkedin);

  const authProviders = {
    github,
    linkedin,
  };

  const auth = {
    authProviders,
    getAuthUrl: async (providerId: string) => {
      const providerConfig = config.security.authProviders[providerId];
      const provider = authProviders[providerId];
      const state = newUuid();
      const scope = providerConfig.scope;
      const response_type = 'code';
      const result = await db.authConsentRepo.create({
        id: state,
        scope,
        provider_id: providerId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      console.log('Api.getAuthUrl authConsentRepo.create', result);
      const url = provider.getAuthorizeUrl({ state, scope, response_type });
      return url;
    },
    createAccessToken: async(providerId: string, { state, code }) => {
      const options = { where: 'id = ?', params: [state] };
      const modifications = {
        updated_at: new Date().toISOString(),
        auth_code: code,
      };
      const result = await db.authConsentRepo.update(modifications, options);
      console.log('Api.createAccessToken db.authConsentRepo.update', result);
      const providerConfig = config.security.authProviders[providerId];
      const provider = authProviders[providerId];
      const { access_token, token_type } = provider.createAccessToken({ state, code });

      const modifications2 = {
        updated_at: new Date().toISOString(),
        token_type,
        access_token,
      };
      const result2 = await db.authConsentRepo.update(modifications2, options);
      console.log('Api.createAccessToken db.authConsentRepo.update', result2);

      return { access_token, token_type };
    }
  }

  return {
    auth,
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
