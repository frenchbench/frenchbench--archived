import express from 'express';
import responseTime from 'response-time';
import { assignId, authToken } from '../middlewares';

export function newHttpApp({ httpConfig, logger, dbAdapterFb }) {
  const { port } = httpConfig;

  // express http server
  const expApp = express();

  expApp.use(logger.logger); // access log
  expApp.use(responseTime());
  expApp.use(assignId({ logger }));
  expApp.use(authToken({ logger }));
  expApp.use(express.json());// for parsing application/json
  expApp.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  function server() {
    return expApp;
  }

  function newRouter(){
    return express.Router();
  }

  const listen = (onListen) => {
    expApp.listen(port, onListen);
  };

  return {
    httpConfig,
    logger,
    dbAdapterFb,
    server, // 1 new server
    // 2. define/inject routes
    newRouter,
    listen, // 3. start listening
  };
}
