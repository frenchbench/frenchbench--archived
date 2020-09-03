import {
  makeCreateHandler,
  makeDeleteHandler,
  makeListHandler,
  makeRetrieveHandler,
  makeUpdateHandler
} from './controller';

export function makeBaseController({ config, logger, dbAdapter, tableName, route }) {
  const list      = makeListHandler(dbAdapter, tableName);
  const create    = makeCreateHandler(dbAdapter, tableName);
  const retrieve  = makeRetrieveHandler(dbAdapter, tableName);
  const update    = makeUpdateHandler(dbAdapter, tableName);
  const deleteOne = makeDeleteHandler(dbAdapter, tableName);

  return {
    list,
    create,
    retrieve,
    update,
    deleteOne,
    route,
  };
}
