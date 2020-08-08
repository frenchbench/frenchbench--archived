import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

export function newLogger({ loggerConfig }) {
  const { file, consoleOn } = loggerConfig;
  // create a write stream (in append mode)
  const accessLogStream = fs.createWriteStream(file, { flags: 'a' });
  const logger = morgan('combined', { stream: accessLogStream });
  return {
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
}
