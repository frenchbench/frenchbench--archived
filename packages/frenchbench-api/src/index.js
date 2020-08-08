require('dotenv').config(); // read .env file
import { boot } from './boot';

// override any process.env settings/props

// then boot HTTP app
const httpApp = boot();

httpApp.listen(() => {
  console.info(`FrenchBench API is ready at http://localhost:${httpApp.httpConfig.port}!`);
});
