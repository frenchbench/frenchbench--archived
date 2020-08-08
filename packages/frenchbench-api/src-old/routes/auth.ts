import { Router, Request, Response } from 'express';
import { Api } from '../api';
import { HEADER_KEY_USER_ID } from '../constants';

export default function (api: Api, router: Router): Router  {

  // TODO: generic logout
  router.post('/logout', async (req: Request, res: Response) => {
    res.json({ data: 'todo' });
  });

  // TODO: login via specific provider: frenchbench
  router.post('/frenchbench/register', async (req: Request, res: Response) => {
    const { body } = req;
    const result = await api.userCreate(body);
    res.json(result);
  });

  // TODO: login via specific provider: frenchbench
  router.post('/frenchbench/login', async (req: Request, res: Response) => {

    res.json({ data: 'todo' });
  });

  // TODO: get user details via specific provider
  router.get('/frenchbench/me', async (req: Request, res: Response) => {
    const userData = await api.userRetrieve(req.header(HEADER_KEY_USER_ID));
    res.json({ data: userData });
  });

  // TODO: login via specific provider: github
  router.get('/github/authenticate', async (req: Request, res: Response) => {
    res.json({ data: 'todo' });
  });

  // TODO: ask consent via specific provider: github
  router.post('/github/authorize', async (req: Request, res: Response) => {
    const url = await api.auth().getAuthorizeUrl('github', {});
    res.status(200).json({ url });
  });

  // TODO: consent callback via specific provider: github
  router.get('/github/callback', async (req: Request, res: Response) => {
    const { state = '', code = '', error = '', error_description = '' } = req.query;
    if (code && code !== '' && state && state !== '') {
      const { access_token } = await api.auth().createAccessToken(
        'github', { state: String(state), code: String(code) }
      );
      res.status(200).json({ access_token });
    } else {
      res.status(200).json({ error: { code: error, message: error_description } });
    }
  });

  router.get('/linkedin/authenticate', async (req: Request, res: Response) => {
    res.json({ data: 'todo' }); // TODO:
  });

  router.post('/linkedin/authorize', async (req: Request, res: Response) => {
    const url = await api.auth().getAuthorizeUrl('linkedin', {});
    res.status(200).json({ url });
  });

  router.get('/linkedin/callback', async (req: Request, res: Response) => {
    const { state = '', code = '', error = '', error_description = '' } = req.query;
    if (code && code !== '' && state && state !== '') {
      const { access_token } = await api.auth().createAccessToken(
        'linkedin', { state: String(state), code: String(code) }
      );
      res.status(200).json({ access_token });
    } else {
      res.status(200).json({ error: { code: error, message: error_description } });
    }
  });

  return router;
}
