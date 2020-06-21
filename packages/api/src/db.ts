import knex from 'knex';
import {ITableList, tables} from './constants';
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

export class Db {

  _db: any;
  tables: ITableList;

  constructor(dbConfig: IDbConfig) {
    this._db = knex(dbConfig);
    this.tables = tables;
  }

  makeBasicSelector({ name }: ITableDefn) {
    return async (args: IQrySelectOptions) => {
      const { where = '1 = 1', params = [], limit = 100, offset = 0, orderByField = null, orderByDir = 'asc' } = args;
      const tbl = this._db(name);
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

  makeBasicSelectorOne({ name }: ITableDefn) {
    return async (args: IQrySelectOneOptions) => {
      const { where = '1 = 0', params = [] } = args;
      const tbl = this._db(name);
      const rows = await tbl.select('*').whereRaw(where, params).limit(1);
      console.log('select one', name, where, params, 'result', rows);
      return rows[0] ? rows[0] : null;
    }
  }

  makeBasicInserter({ name }: ITableDefn) {
    return async (row: object) => {
      const tbl = this._db(name);
      const result = await tbl.insert(row); // do not return data: SQLite3 does not support it
      console.log('insert', name, row, 'result', result);
      return result;
    }
  }

  makeBasicUpdater({ name }: ITableDefn,) {
    return async (row: object, { where, params }: IQryUpdateOptions) => {
      const tbl = this._db(name);
      const result = await tbl.update(row).whereRaw(where, params);
      console.log('update', name, row, 'result', result);
      return result;
    }
  }

  makeBasicDeleter({ name }: ITableDefn) {
    return async ({ where, params }: IQryDeleteOptions) => {
      const tbl = this._db(name);
      const result = await tbl.whereRaw(where, params).del();
      console.log('delete', name, where, params, 'result', result);
      return result;
    }
  }

  makeBasicRepo(tableDefn: ITableDefn) {
    return {
      create:      this.makeBasicInserter(tableDefn),
      retrieve:    this.makeBasicSelector(tableDefn),
      retrieveOne: this.makeBasicSelectorOne(tableDefn),
      update:      this.makeBasicUpdater(tableDefn),
      delete:      this.makeBasicDeleter(tableDefn),
    }
  }

  secretRepo()          { return this.makeBasicRepo(tables.secret) }
  authConsentRepo()     { return this.makeBasicRepo(tables.authConsent) }
  authIdentityRepo()    { return this.makeBasicRepo(tables.authIdentity) }
  userRepo()            { return this.makeBasicRepo(tables.user) }
  userEmailRepo()       { return this.makeBasicRepo(tables.userEmail) }
  userAchievementRepo() { return this.makeBasicRepo(tables.userAchievement) }
  userLanguageRepo()    { return this.makeBasicRepo(tables.userLanguage) }
  userPostRepo()        { return this.makeBasicRepo(tables.userPost) }
  userProfileRepo()     { return this.makeBasicRepo(tables.userProfile) }
  userProjectRepo()     { return this.makeBasicRepo(tables.userProject) }
  userSkillRepo()       { return this.makeBasicRepo(tables.userSkill) }
  lookupRepo()          { return this.makeBasicRepo(tables.sysLookup) }
  assetRepo()           { return this.makeBasicRepo(tables.asset) }
  entityAssetRepo()     { return this.makeBasicRepo(tables.entityAsset) }

}
