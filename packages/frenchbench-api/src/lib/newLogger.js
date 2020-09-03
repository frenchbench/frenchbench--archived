import morgan from 'morgan';
import fs from 'fs';

export function newLogger({ expressApp, config }) {
  const { file, consoleOn } = config.logger;
  // create a write stream (in append mode)
  const accessLogStream = fs.createWriteStream(file, { flags: 'a' });
  const logger = morgan('combined', { stream: accessLogStream });
  const loggerExt = {
    logger,
    info: (...args) => {
      if (consoleOn) {
        console.info.call(null, args);
      }
    },
    error: (...args) => {
      if (consoleOn) {
        console.error.call(null, args);
      }
    },
  };
  expressApp.set('logger', loggerExt);
  return loggerExt;
}
