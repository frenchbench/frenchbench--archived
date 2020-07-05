import { Router, Request, Response } from 'express';
import { Api } from '../api';

export default function (api: Api, router: Router): Router  {

  router.get('/', async (req: Request, res: Response) => {
    // TODO
    const result = await api.health();
    res.statusCode = 200;
    res.json(result);
  });

  return router;
}
