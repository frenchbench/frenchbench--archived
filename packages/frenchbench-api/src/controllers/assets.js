import * as constants from '../constants';
import { makeBaseController } from '../lib';

export function assets({ config, logger, dbAdapterFb }) {
  return makeBaseController({
    config,
    logger,
    dbAdapter: dbAdapterFb,
    tableName: constants.TBL_ASSET,
    route: constants.RUT_ASSET,
  });
}
