import express, { Application } from 'express';
import { Api } from '../api';
import auth from './auth';
import entities from './entities';
import graphql from './graphql';
import health from './health';
import secrets from './secrets';
import tokens from './tokens';
import users from './users';

export default function routes(server: Application, api: Api): Application {
  server.use('/auth',     auth(api, express.Router()));
  server.use('/entities', entities(api, express.Router()));
  server.use('/graphql',  graphql(api, express.Router()));
  server.use('/health',   health(api, express.Router()));
  server.use('/secrets',  secrets(api, express.Router()));
  server.use('/tokens',   tokens(api, express.Router()));
  server.use('/users',    users(api, express.Router()));

  return server;
}
