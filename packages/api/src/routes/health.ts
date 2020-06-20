import { Router, Request, Response } from 'express';

export default function (api: any, router: Router) {

  router.get('/', async (req: Request, res: Response) => {
    const result = await api.health();
    res.status(200).json(result);
  });

  return router;
}
