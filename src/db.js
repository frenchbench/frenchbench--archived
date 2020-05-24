import knex from 'knex';
import * as util from './util';

const tables = {
  entity: { name: 'entity', pkey: 'id' },
  asset: { name: 'asset', pkey: 'id' },
  secret: { name: 'secret', pkey: 'id' },
  user: { name: 'user', pkey: 'id', sensitive: ['password_hash'], },
  user_achievement: { name: 'user_achievement', pkey: 'id' },
  user_language: { name: 'user_language', pkey: 'id' },
  user_post: { name: 'user_post', pkey: 'id' },
  user_profile: { name: 'user_profile', pkey: 'id' },
  user_project: { name: 'user_project', pkey: 'id' },
  user_skill: { name: 'user_skill', pkey: 'id' },
  sys_lookup: { name: 'sys_lookup', pkey: ['', 'id' ]},
};

export function newDb(dbConfig) {
  const _db = knex(dbConfig);

  function makeBasicSelector({ name }) {
    return async ({ where = '1 = 1', params = [], limit = 100, offset = 0, orderByField = '1', orderByDir = 'asc' }) => {
      const result = await _db.select().table(name)
        .whereRaw(where, params)
        .orderBy(orderByField, orderByDir)
        .offset(offset)
        .limit(limit);
      return {
        data: result.rows,
        meta: { count: result.rowCount }, // TODO: total count is needed
      };
    }
  }

  function makeBasicSelectorOne({ name }) {
    return async ({ where = '1 = 0', params = [] }) => {
      const result = await _db.select().table(name)
        .whereRaw(where, params)
        .limit(1);
      return result.rows[0] ? result.rows[0] : null;
    }
  }

  function makeBasicInserter({ name }) {
    return async (row) => {
      const result = await _db.insert(row).into(name).returning('*');
      return {
        data: result,
      }
    }
  }

  function makeBasicUpdater({ name }) {
    return async (row, where, params) => {
      const result = await _db.update(row).table(name).whereRaw(where, params);
      return {
        data: result,
      }
    }
  }

  function makeBasicDeleter({ name }) {
    return async (row, where, params) => {
      const result = await _db.delete(row).from(name).whereRaw(where, params);
      return {
        data: result,
      }
    }
  }

  function makeBasicRepo(tableDefn) {
    return {
      create:      makeBasicInserter(tableDefn),
      retrieve:    makeBasicSelector(tableDefn),
      retrieveOne: makeBasicSelectorOne(tableDefn),
      update:      makeBasicUpdater(tableDefn),
      delete:      makeBasicDeleter(tableDefn),
    }
  }

  const entityRepo = makeBasicRepo(tables.entity);
  const secretRepo = makeBasicRepo(tables.secret);
  const lookupRepo = makeBasicRepo(tables.sys_lookup);

  function makeEntityBasedRepo(tableDefn, kind) {

    const basicRepo = makeBasicRepo(tableDefn);

    return {
      create: async (row, beforeCreate = (r) => r) => {
        const entityData = {
          kind,
          id:         util.newUuid(),
          created_at: util.nowStr(),
          updated_at: util.nowStr(),
          created_by: null,
          updated_by: null,
        };
        const entityRow = beforeCreate(entityData);
        // TODO: start transaction
        const entity = await entityRepo.create(entityRow);
        const result = await basicRepo.create(row);
        // TODO: commit transaction
        return {
          entity,
          result,
        }
      },
      retrieve: makeBasicSelector(tableDefn), // TODO: also retrieve entity
      update:   makeBasicUpdater(tableDefn),  // TODO: also update entity
      delete:   makeBasicDeleter(tableDefn),  // TODO: just delete entity
    }
  }

  return {
    _db,
    tables,
    entityRepo,
    secretRepo,
    lookupRepo,
    assetRepo:           makeEntityBasedRepo(tables.asset),
    userRepo:            makeEntityBasedRepo(tables.user),
    userAchievementRepo: makeEntityBasedRepo(tables.user_achievement),
    userLanguageRepo:    makeEntityBasedRepo(tables.user_language),
    userPostRepo:        makeEntityBasedRepo(tables.user_post),
    userProfileRepo:     makeEntityBasedRepo(tables.user_profile),
    userProjectRepo:     makeEntityBasedRepo(tables.user_project),
    userSkillRepo:       makeEntityBasedRepo(tables.user_skill),
  };
}
