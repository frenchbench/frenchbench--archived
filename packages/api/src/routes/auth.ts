import { Router, Request, Response } from 'express';

export default function (api: any, router: Router) {

  router.post('/frenchbench/login', async (req: Request, res: Response) => {
    res.json({ data: 'todo' }); // TODO:
  });

  router.post('/frenchbench/logout', async (req: Request, res: Response) => {
    res.json({ data: 'todo' }); // TODO:
  });

  router.get('/frenchbench/user', async (req: Request, res: Response) => {
    res.json({ data: 'todo' }); // TODO:
  });

  router.get('/github/authenticate', async (req: Request, res: Response) => {
    res.json({ data: 'todo' }); // TODO:
  });

  router.post('/github/authorize', async (req: Request, res: Response) => {
    const url = await api.auth.getAuthUrl('github');
    res.status(200).json({ url });
  });

  router.get('/github/callback', async (req: Request, res: Response) => {
    const { state, code = null, error = null, error_description = null } = req.query;
    if (code && state) {
      const { access_token } = await api.auth.createAccessToken('github', { state, code });
      res.status(200).json({ access_token });
    } else {
      res.status(200).json({ error: { code: error, message: error_description } });
    }
  });

  router.get('/linkedin/authenticate', async (req: Request, res: Response) => {
    res.json({ data: 'todo' }); // TODO:
  });

  router.post('/linkedin/authorize', async (req: Request, res: Response) => {
    const url = await api.auth.getAuthUrl('linkedin');
    res.status(200).json({ url });
  });

  router.get('/linkedin/callback', async (req: Request, res: Response) => {
    const { state, code = null, error = null, error_description = null } = req.query;
    if (code && state) {
      const { access_token } = await api.auth.createAccessToken('linkedin', { state, code });
      res.status(200).json({ access_token });
    } else {
      res.status(200).json({ error: { code: error, message: error_description } });
    }
  });

  return router;
}
