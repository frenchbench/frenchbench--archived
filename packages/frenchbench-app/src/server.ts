import dotenv from 'dotenv'
import express from 'express';
import next from 'next';
import cookieParser from 'cookie-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { newServerConfig } from './serverConfig';

dotenv.config();

const serverConfig = newServerConfig(process.env);
const { port, env, isDevMode, proxyConfig } = serverConfig;

const app = next({
  dir: 'src', // base directory where everything is, could move to src later
  dev: isDevMode,
});

const handle = app.getRequestHandler();

let server: any;
app
  .prepare()
  .then(() => {
    server = express();

    server.use(cookieParser);

    // attach api proxy middleware
    Object.keys(proxyConfig).forEach(context => {
      server.use(createProxyMiddleware(context, proxyConfig[context]));
    });

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all('*', (req, res) => handle(req, res));

    server.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on port ${port} [${env}]`);
    })
  })
  .catch((err) => {
    console.log('An error occurred, unable to start the server');
    console.log(err);
  });
