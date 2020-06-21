import express, { Application, Request, Response } from 'express';
import { Api } from './api';
import { newConfig } from './serverConfig';
import { Db } from './db';
import { tokenVerify } from './security';
import { HEADER_KEY_USER_ID } from "./constants";
require('dotenv').config();

const server: Application = express();
const config = newConfig(process.env);
const db = new Db(config.dbConfig);
const api = new Api(config, db);
require('./routes')(server, api);

server.use(async (req: Request, res: Response, next) => {
  req.headers[HEADER_KEY_USER_ID] = '';
  const authorization = req.header('authorization');
  if (authorization) {
    const [ token_type, token ] = authorization.split(' ');
    const decodedData = await tokenVerify(token, config.security.tokens);
    if (decodedData && decodedData.user_id) {
      req.headers[HEADER_KEY_USER_ID] = decodedData.user_id;
    } else {
      throw new Error('invalid token');
    }
  }
  next();
});

server.get('/api', function (req: Request, res: Response) {
  res.json({ ts: new Date().toISOString() });
});

server.get('/', function (req: Request, res: Response) {
  res.json({ ts: new Date().toISOString() });
});

server.listen(config.httpConfig.port, function () {
  console.log('frenchbench api is listening on http://localhost:' + config.httpConfig.port);
});
