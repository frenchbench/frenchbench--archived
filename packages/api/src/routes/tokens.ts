import { Router, Request, Response } from 'express';

export default function (api: any, router: Router) {

  router.post('/', async (req: Request, res: Response) => {
    const { url, method, query, body, headers } = req;
    console.log(method, url, query, headers, body);
    const result = await api.login(body);
    res.status(200).json(result);
  });

  router.delete('/', async (req: Request, res: Response) => {
    const { url, method, query, body, headers} = req;
    console.log(method, url, query, headers, body);
    const token = headers.authorization ? headers.authorization.replace('Bearer ', '') : '';
    if (token) {
      const result = await api.logout(token);
      res.status(200).json(result);
    } else {
      res.status(400).end('Bad Request');
    }
  });

  return router;
}
