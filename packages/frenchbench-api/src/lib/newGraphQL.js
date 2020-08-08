import { readFileSync } from 'fs';
import { buildSchema } from 'graphql';
import * as constants from '../constants';
import { copyProps } from './utils';

export class User {
  id = null;
  username = null;
  constructor(row = {}, dbAdapterFb = {}) {
    copyProps(this, row);
    this._db = dbAdapterFb;
  }
}

export class UserProfile {
  id = null;
  user_id = null;
  first_name = null;
  middle_name = null;
  last_name = null;
  job_title = null;
  organisation = null;
  industry = null;
  city = null;
  country = null;
  dob_year = null;
  min_salary = null;
  summary = null;
  created_at = null; //GQLDateTime!
  updated_at = null; //GQLDateTime!
  created_by = null;
  updated_by = null;
  constructor(row = {}, dbAdapterFb = {}) {
    copyProps(this, row);
    this._db = dbAdapterFb;
  }
}

export class Reader {
  constructor(args = {}, dbAdapterFb) {
    console.debug('Reader.constructor', args);
    this.args = args;
    this._db = dbAdapterFb;
  }
  async user(args = {}) {
    console.debug('Reader.user', args);
    const { username } = args;
    const row = await this._db.users().findOne('username', username);
    return new User(row, this._db);
  }
  async userProfile(args = {}) {
    console.debug('Reader.userProfile', args);
    const { username } = args;
    const user = await this.user({ username });
    const row = this._db.usersProfiles().findOne('user_id', user.id);
    return new UserProfile(row, this._db);
  }
}

export class UserProfileInput {
  first_name = null;
  constructor(args = {}) {
    copyProps(this, args);
  }
}

export class Writer {
  constructor(args, dbAdapterFb) {
    console.debug('Writer.constructor', args);
    this._db = dbAdapterFb;
  }
  async login(args = {}) {

  }
  async updateUserProfile(args = {}) {
    const { id, data } = args;
    const input = new UserProfileInput(data);
    return this._db.update(
      constants.TBL_USER_PROFILE,
      { field: 'id', value: id },
      input,
    );
  }
}

export function newGraphQL({ config, logger, dbAdapterFb }) {
  const schemaText = readFileSync(config.gql.schemaFile, { encoding: 'utf8' });
  const schema = buildSchema(`${schemaText}`);

  function reader(args = {}) {
    console.log('reader', args);
    return new Reader(args, dbAdapterFb);
  }

  function writer(args = {}) {
    console.log('writer', args);
    return new Writer(args, dbAdapterFb);
  }

  const rootValue = { reader, writer };

  return {
    schema,
    rootValue,
    graphiql: true, // TODO: use an env setting
  };
}
