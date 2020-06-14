import knex from 'knex';
import { tables } from '../constants';
import { IDbConfig } from './serverConfig';

export interface ITableDefn {
  name: string;
}

export interface IQryOptionsBasic {
  where: string;
  params: Array<any>;
}

export interface IQrySelectOneOptions extends IQryOptionsBasic {

}
export interface IQrySelectOptions extends IQryOptionsBasic {
  limit: number;
  offset: number;
  orderByField: string;
  orderByDir: 'asc' | 'desc';
}
export interface IQryInsertOptions extends IQryOptionsBasic {

}
export interface IQryUpdateOptions extends IQryOptionsBasic {

}
export interface IQryDeleteOptions extends IQryOptionsBasic {

}

export function newDb(dbConfig: IDbConfig) {
  const _db = knex(dbConfig);

  function makeBasicSelector({ name }: ITableDefn) {
    return async (args: IQrySelectOptions) => {
      const { where = '1 = 1', params = [], limit = 100, offset = 0, orderByField = null, orderByDir = 'asc' } = args;
      const tbl = _db(name);
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

  function makeBasicSelectorOne({ name }: ITableDefn) {
    return async (args: IQrySelectOneOptions) => {
      const { where = '1 = 0', params = [] } = args;
      const tbl = _db(name);
      const rows = await tbl.select('*').whereRaw(where, params).limit(1);
      console.log('select one', name, where, params, 'result', rows);
      return rows[0] ? rows[0] : null;
    }
  }

  function makeBasicInserter({ name }: ITableDefn) {
    return async (row: object) => {
      const tbl = _db(name);
      const result = await tbl.insert(row); // do not return data: SQLite3 does not support it
      console.log('insert', name, row, 'result', result);
      return result;
    }
  }

  function makeBasicUpdater({ name }: ITableDefn,) {
    return async (row: object, { where, params }: IQryUpdateOptions) => {
      const tbl = _db(name);
      const result = await tbl.update(row).whereRaw(where, params);
      console.log('update', name, row, 'result', result);
      return result;
    }
  }

  function makeBasicDeleter({ name }: ITableDefn) {
    return async ({ where, params }: IQryDeleteOptions) => {
      const tbl = _db(name);
      const result = await tbl.whereRaw(where, params).del();
      console.log('delete', name, where, params, 'result', result);
      return result;
    }
  }

  function makeBasicRepo(tableDefn: ITableDefn) {
    return {
      create:      makeBasicInserter(tableDefn),
      retrieve:    makeBasicSelector(tableDefn),
      retrieveOne: makeBasicSelectorOne(tableDefn),
      update:      makeBasicUpdater(tableDefn),
      delete:      makeBasicDeleter(tableDefn),
    }
  }

  return {
    _db,
    tables,
    secretRepo:          makeBasicRepo(tables.secret),
    userRepo:            makeBasicRepo(tables.user),
    userAchievementRepo: makeBasicRepo(tables.userAchievement),
    userLanguageRepo:    makeBasicRepo(tables.userLanguage),
    userPostRepo:        makeBasicRepo(tables.userPost),
    userProfileRepo:     makeBasicRepo(tables.userProfile),
    userProjectRepo:     makeBasicRepo(tables.userProject),
    userSkillRepo:       makeBasicRepo(tables.userSkill),
    lookupRepo:          makeBasicRepo(tables.sysLookup),
    assetRepo:           makeBasicRepo(tables.asset),
    entityAssetRepo:     makeBasicRepo(tables.entityAsset),
    authConsentRepo:     makeBasicRepo(tables.authConsent),
    authIdentityRepo:    makeBasicRepo(tables.authIdentity),
  };
}
