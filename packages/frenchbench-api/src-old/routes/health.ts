import { Router, Request, Response } from 'express';
import { Api } from '../api';

export default function (api: Api, router: Router): Router  {

  router.get('/', async (req: Request, res: Response) => {
    const result = await api.health();
    res.status(200).json(result);
  });

  return router;
}
