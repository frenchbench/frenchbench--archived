import express from 'express';
import responseTime from 'response-time';
import { assignId, authToken, initSessionMiddleware } from '../middlewares';

export function newHttpApp({ expressApp, config, logger, dbAdapterFb }) {
  const { port } = config.http;

  expressApp.set('x-powered-by', false);

  expressApp.use(logger.logger); // access log
  expressApp.use(responseTime());
  expressApp.use(assignId({ logger }));
  expressApp.use(initSessionMiddleware({ config, logger, dbAdapterFb }));
  expressApp.use(authToken({ logger }));
  expressApp.use(express.json()); // for parsing application/json
  expressApp.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  function server() {
    return expressApp;
  }

  function newRouter(){
    return express.Router();
  }

  const listen = (onListen) => {
    expressApp.listen(port, onListen);
  };

  return {
    config,
    logger,
    dbAdapterFb,
    server, // 1 new server
    // 2. define/inject routes
    newRouter,
    listen, // 3. start listening
  };
}
