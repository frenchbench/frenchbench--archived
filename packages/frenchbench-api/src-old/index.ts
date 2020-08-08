import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import { newConfig } from './lib/Config';
import { Api } from './api';
import { Db } from './db';
import routes from './routes';
import middleware from './middleware';

dotenv.config();

const server: Application = express();
const config = newConfig(process.env);
const db = new Db(config.dbConfig);
const api = new Api(config, db);

middleware(server, config);

routes(server, api);

server.get('/api', function (req: Request, res: Response) {
  res.json({ ts: new Date().toISOString() });
});

server.get('/', function (req: Request, res: Response) {
  res.json({ ts: new Date().toISOString() });
});

server.listen(config.httpConfig.port, function () {
  console.log('frenchbench api is listening on http://localhost:' + config.httpConfig.port);
});
