import express, { Application, Request, Response } from 'express';
import { newApi } from './api';
require('dotenv').config();

const server: Application = express();
const api = newApi(process.env);
require('./routes')(server, api);

server.get('/api', function (req: Request, res: Response) {
  res.json({ ts: new Date().toISOString() });
});

server.get('/', function (req: Request, res: Response) {
  res.json({ ts: new Date().toISOString() });
});

server.listen(9090, function () {
  console.log('server is listening on port 3000!');
});
