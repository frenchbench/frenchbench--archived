import { graphqlHTTP } from 'express-graphql';
import { newConfig, newDbAdapter, newDbAdapterFb, newHttpApp, newHttpRoutes, newLogger, newGraphQL } from './lib';

export function boot(){
  const config      = newConfig(process.env, process.cwd());
  const logger      = newLogger({ loggerConfig: config.log });
  const dbAdapter   = newDbAdapter({ dbConfig: config.db, logger });
  const dbAdapterFb = newDbAdapterFb({ dbAdapter });
  const httpApp     = newHttpApp({ httpConfig: config.http, logger, dbAdapterFb });
  const httpServer  = httpApp.server();
  const httpRouter  = httpApp.newRouter();

  newHttpRoutes({ config, logger, httpRouter, dbAdapterFb });
  httpServer.use('/api/v1', httpRouter);

  const gqlConfig = newGraphQL({ config, logger, dbAdapterFb });
  httpServer.use('/api/graphql', graphqlHTTP(gqlConfig));

  httpServer.get('/api', (req, res) => res.json({ ts: new Date(), version: config.version }));
  httpServer.get('/', (req, res) => res.json({ ts: new Date(), version: config.version }));
  return httpApp;
}
