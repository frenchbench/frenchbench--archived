import { newDb } from './db';
import * as util from './util';

export function newApi(config) {

  const db = newDb(config.dbConfig);

  async function health() {
    return Promise.resolve({ data: util.nowStr() });
  }

  async function sendSecret({ email }) {
    const secretRow = {
      email, // TODO: validate
      secret: util.randSecret(config.registration.secretPattern),
    };
    const result = await db.secretRepo.create(secretRow);
    console.log('db.secretRepo.create', result);
    return Promise.resolve({
      data: result,
    });
  }

  async function userList(params){
    return db.userRepo.retrieve(params);
  }

  async function userCreate({ data, id, secret }){
    // TODO: validate secret
    const { email, password, password_confirm } = data;

    if (password !== password_confirm) {
      return { error: 'passwords do not match' };
    }

    // TODO: password pattern validation: [a-z],[A-Z],[0-9],specials,length

    const secretRow = await db.secretRepo.retrieveOne({
      where: 'id = ? AND secret = ? AND email = ?',
      params: [ id, email, secret ],
    });

    if (!secretRow) {
      return{ error: 'bad request' };
    }

    const password_hash = util.makePasswordHash(password);
    const userRow = {
      email,
      password_hash,
    }
    const userResult = await db.userRepo.create(userRow, entityRow => {
      return Object.assign({}, entityRow, {
        created_by: entityRow.id,
        updated_by: entityRow.id,
      });
    });
    return { data: userResult };
  }

  async function tokenCreate({ email, password }) {
    // TODO use JWT
    return util.nowStr();
  }

  async function login(input) {
    // TODO
    const data = await tokenCreate(input);
    return Promise.resolve({ data });
  }

  async function logout({ email, password }) {
    // TODO
    return Promise.resolve({ data: util.nowStr() });
  }

  return {
    db,
    health,
    sendSecret,
    userList,
    userCreate,
    login,
    logout,
  }
}
