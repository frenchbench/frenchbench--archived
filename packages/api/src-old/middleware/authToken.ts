import { NextFunction, Request, Response } from 'express';
import { HEADER_KEY_USER_ID } from '../constants';
import { tokenVerify } from '../lib/security';
import { IServerConfig } from '../serverConfig';

export default function(config: IServerConfig) {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    req.headers[HEADER_KEY_USER_ID] = '';
    const authorization = req.header('authorization');
    if (authorization) {
      const tokenData = authorization.split(' ');
      const decodedData = await tokenVerify(tokenData[1], config.security.tokens);
      if (decodedData && decodedData.user_id) {
        req.headers[HEADER_KEY_USER_ID] = decodedData.user_id;
      } else {
        throw new Error('invalid token');
      }
    }
    next();
  }
}
