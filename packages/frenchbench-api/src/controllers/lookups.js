import * as constants from '../constants';
import { makeBaseController } from '../lib';

export function lookups({ config, logger, dbAdapterFb }) {
  return makeBaseController({
    config,
    logger,
    dbAdapter: dbAdapterFb,
    tableName: constants.TBL_LOOKUP,
    route: constants.RUT_LOOKUPS,
  });
}
