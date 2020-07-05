export function authToken({ logger }) {
  return (req, res, next) => {
    logger.info('authToken');
    next();
  }
}
