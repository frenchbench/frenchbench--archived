import { Application } from 'express';
import { IServerConfig } from '../serverConfig';
import authToken from './authToken';

export default function (server: Application, config: IServerConfig): Application {
  server.use(authToken(config));

  return server;
}
