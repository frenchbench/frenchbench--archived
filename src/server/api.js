import { newDb } from './db';
import { ERRORS } from './constants';
import { nowStr, randSecret } from '../common/lib';
import { newConfig } from './serverConfig';
import { passwordHash, newUuid, tokenCreate, passwordVerify } from './utils';

export function newApi(env) {
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

  async function sendSecret({ email }) {
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

  async function entityList(params){
    return db.entityRepo.retrieve(params);
  }

  async function userList(params){
    return db.userRepo.retrieve(params);
  }

  async function userRetrieve(id){
    return db.userRepo.retrieveOne({ where: 'id = ?', params: [id] });
  }

  async function userSkillsRetrieve(params){
    return db.userSkillRepo.retrieve(params);
  }

  // registration
  async function userCreate({ id, secret, email, username, password, password_confirm }){
    if (password !== password_confirm) {
      return { error: ERRORS.PASSWORDS_NOT_SAME };
    }

    // TODO: password pattern validation: [a-z],[A-Z],[0-9],specials,length

    // TODO: validate secret, within 24h
    const secretRow = await db.secretRepo.retrieveOne({
      where: 'id = ? AND secret = ? AND email = ?',
      params: [ id, secret, email ],
    });

    if (!secretRow) {
      return{ error: ERRORS.EMAIL_VERIFICATION };
    }

    const password_hash = await passwordHash(password);
    const userRow = {
      email,
      username,
      password_hash,
    }

    // TODO: check email is unique
    // TODO: check username is unique

    const userResult = await db.userRepo.create(userRow, entityRow => {
      userRow.id = entityRow.id;
      return Object.assign({}, entityRow, {
        created_by: entityRow.id,
        updated_by: entityRow.id,
      });
    });

    const { data: user_id, error } = userResult;
    if (error) {
      return { error };
    }

    // TODO: delete secret?

    const payload = { user_id };
    const token = await tokenCreate(payload, config.security.tokens);

    return {
      data: userResult ? token : null,
    };
  }

  async function login({ username, password }) {

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

  async function logout(token) {
    // TODO
    return Promise.resolve({ data: nowStr() });
  }

  return {
    db,
    health,
    sendSecret,
    entityList,
    userList,
    userCreate,
    userRetrieve,
    userSkillsRetrieve,
    login,
    logout,
  }
}
