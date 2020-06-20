import express, { Application } from 'express';

export default function routes(server: Application, api: any) {
  server.use('/auth',     require('./auth')(api, express.Router()));
  server.use('/entities', require('./entities')(api, express.Router()));
  server.use('/graphql',  require('./graphql')(api, express.Router()));
  server.use('/health',   require('./health')(api, express.Router()));
  server.use('/secrets',  require('./secrets')(api, express.Router()));
  server.use('/tokens',   require('./tokens')(api, express.Router()));
  server.use('/users',    require('./users')(api, express.Router()));
}
