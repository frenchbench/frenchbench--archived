import knex from 'knex';
import * as util from './utils';
import { ERRORS, tables } from './constants';
import { nowStr } from '../common/lib';

export function newDb(dbConfig) {
  const _db = knex(dbConfig);

  function makeBasicSelector({ name }, txn = null) {
    return async ({ where = '1 = 1', params = [], limit = 100, offset = 0, orderByField = null, orderByDir = 'asc' }) => {
      const tbl = (txn ? txn(name) : _db(name));
      let qry = tbl.select().whereRaw(where, params);

      const counter = await qry.clone().clearSelect().count('*', { as: 'c' });
      console.log('select counter', counter);

      if (orderByField) qry.orderBy(orderByField, orderByDir)

      const rows = await qry.offset(offset).limit(limit);
      console.log('select', rows);

      return {
        data: rows,
        meta: {
          count: rows.length,
          total: counter[0].c,
        },
      };
    }
  }

  function makeBasicSelectorOne({ name }, txn = null) {
    return async ({ where = '1 = 0', params = [] }) => {
      const tbl = (txn ? txn(name) : _db(name));
      const rows = await tbl.select('*').whereRaw(where, params).limit(1);
      console.log('select one', name, where, params, 'result', rows);
      return rows[0] ? rows[0] : null;
    }
  }

  function makeBasicInserter({ name }, txn = null) {
    return async (row) => {
      const tbl = (txn ? txn(name) : _db(name));
      const result = await tbl.insert(row); // do not return data: SQLite3 does not support it
      console.log('insert', name, row, 'result', result);
      return {
        data: result,
      }
    }
  }

  function makeBasicUpdater({ name }, txn = null) {
    return async (row, { where, params }) => {
      const tbl = (txn ? txn(name) : _db(name));
      const result = await tbl.update(row).whereRaw(where, params);
      console.log('update', name, row, 'result', result);
      return {
        data: result[0] > 0,
      }
    }
  }

  function makeBasicDeleter({ name }, txn = null) {
    return async ({ where, params }) => {
      const tbl = (txn ? txn(name) : _db(name));
      const result = await tbl.whereRaw(where, params).del();
      console.log('delete', name, where, params, 'result', result);
      return {
        data: result[0] > 0,
      }
    }
  }

  function makeBasicRepo(tableDefn, txn = null) {
    return {
      create:      makeBasicInserter(tableDefn, txn),
      retrieve:    makeBasicSelector(tableDefn, txn),
      retrieveOne: makeBasicSelectorOne(tableDefn, txn),
      update:      makeBasicUpdater(tableDefn, txn),
      delete:      makeBasicDeleter(tableDefn, txn),
    }
  }

  function makeEntityBasedRepo(tableDefn) {
    const kind = tableDefn.name;
    return {
      create: async (basicRow, beforeCreate = (r) => r) => {
        let txn;
        try {
          txn = await _db.transaction();
        } catch (err) {
          console.error('db start transaction err', err);
          return { error: ERRORS.DB_TRANS_START_ERR };
        }

        try {
          const basicRepo  = makeBasicRepo(tableDefn, txn);
          const entityRepo = makeBasicRepo(tables.entity, txn);

          const id = util.newUuid();
          const entityData = {
            id,
            kind,
            created_at: nowStr(),
            updated_at: nowStr(),
            created_by: null,
            updated_by: null,
          };
          const entityRow = beforeCreate(entityData);

          const entityResult = await entityRepo.create(entityRow);
          if (entityResult[0] > 0) {
            throw new Error(ERRORS.RECORD_NOT_CREATED);
          }

          const basicResult = await basicRepo.create(basicRow);
          if (basicResult[0] > 0) {
            throw new Error(ERRORS.RECORD_NOT_CREATED);
          }
          basicRow.id = id;

          await txn.commit();
          return { data: id };
        } catch (err) {
          await txn.rollback();
          console.warn(tableDefn.name, 'create err', err);
          return {
            error: ERRORS.REGISTRATION_FAILED,
          }
        }
      },
      retrieve:    makeBasicSelector(tableDefn),    // TODO: also retrieve entity
      retrieveOne: makeBasicSelectorOne(tableDefn), // TODO: also retrieve entity
      update:      makeBasicUpdater(tableDefn),     // TODO: also update entity
      delete:      makeBasicDeleter(tableDefn),     // TODO: just delete entity
    }
  }

  return {
    _db,
    tables,
    entityRepo:          makeBasicRepo(tables.entity),
    entityAssetRepo:     makeBasicRepo(tables.entityAsset),
    secretRepo:          makeBasicRepo(tables.secret),
    lookupRepo:          makeBasicRepo(tables.sysLookup),
    assetRepo:           makeEntityBasedRepo(tables.asset),
    userRepo:            makeEntityBasedRepo(tables.user),
    userAchievementRepo: makeEntityBasedRepo(tables.userAchievement),
    userLanguageRepo:    makeEntityBasedRepo(tables.userLanguage),
    userPostRepo:        makeEntityBasedRepo(tables.userPost),
    userProfileRepo:     makeEntityBasedRepo(tables.userProfile),
    userProjectRepo:     makeEntityBasedRepo(tables.userProject),
    userSkillRepo:       makeEntityBasedRepo(tables.userSkill),
  };
}
