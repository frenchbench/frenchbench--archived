import { newConfig, newDbAdapter, newDbAdapterFb, newHttpApp, newHttpRoutes, newLogger } from './lib';

export function boot(){
  const config      = newConfig(process);
  const logger      = newLogger({ loggerConfig: config.log });
  const dbAdapter   = newDbAdapter({ dbConfig: config.db, logger });
  const dbAdapterFb = newDbAdapterFb({ dbAdapter });
  const httpApp     = newHttpApp({ httpConfig: config.http, logger, dbAdapterFb });
  const httpServer  = httpApp.server();
  const httpRouter  = httpApp.newRouter();
  newHttpRoutes({ config, logger, httpRouter, dbAdapterFb });
  httpServer.use('/api/v1', httpRouter);
  httpServer.get('/api', (req, res) => res.json({ ts: new Date(), version: config.version }));
  httpServer.get('/', (req, res) => res.json({ ts: new Date(), version: config.version }));
  return httpApp;
}
