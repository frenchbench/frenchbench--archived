import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { newConfig, newDbAdapter, newDbAdapterFb, newHttpApp, newHttpRoutes, newLogger, newGraphQL } from './lib';

export function boot({ penv, cwd }) {
  // express http server
  const expressApp = express();

  const config = newConfig({ penv, cwd });
  expressApp.set('config', config);

  const logger = newLogger({ expressApp, config });
  expressApp.set('logger', logger);

  const dbAdapter = newDbAdapter({ expressApp, config, logger });
  expressApp.set('dbAdapter', dbAdapter);

  const dbAdapterFb = newDbAdapterFb({ expressApp, config, logger, dbAdapter });
  expressApp.set('dbAdapterFb', dbAdapterFb);

  const httpApp = newHttpApp({ expressApp, config, logger, dbAdapterFb });

  const httpRouter = express.Router();

  newHttpRoutes({ config, logger, httpRouter, dbAdapterFb });
  expressApp.use('/api/v1', httpRouter);

  const gqlConfig = newGraphQL({ config, logger, dbAdapterFb });
  expressApp.use('/api/graphql', graphqlHTTP(gqlConfig));

  expressApp.get('/api', (req, res) => res.json({ ts: new Date(), version: config.version }));
  expressApp.get('/', (req, res) => res.json({ ts: new Date(), version: config.version }));
  return httpApp;
}
