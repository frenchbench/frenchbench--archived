import { v4 } from 'uuid';

export function assignId({ logger }) {
  return (req, res, next) => {
    req.id = v4();
    next();
  }
}
