import { Router, Request, Response } from 'express';
import { Api } from '../api';

export default function (api: Api, router: Router) {

  router.post('/', async (req: Request, res: Response) => {
    try {
      const result = await api.sendSecret(req.body);
      res.status(200).json(result);
    } catch (err) {
      console.error('/api/secrets', err);
      res.status(500).json({ error: 'server error' });
    }
  });

  return router;
}
