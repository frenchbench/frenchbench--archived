import { Router, Request, Response } from 'express';

export default function (api: any, router: Router) {

  router.get('/', async (req: Request, res: Response) => {
    // TODO
    const result = await api.health();
    res.statusCode = 200;
    res.json(result);
  });

  return router;
}
