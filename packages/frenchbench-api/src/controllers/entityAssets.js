import * as constants from '../constants';
import { makeBaseController } from '../lib';

export function entityAssets({ config, logger, dbAdapterFb }) {
  return makeBaseController({
    config,
    logger,
    dbAdapter: dbAdapterFb,
    tableName: constants.TBL_ENTITY_ASSET,
    route: constants.RUT_ENTITY_ASSET,
  });
}
