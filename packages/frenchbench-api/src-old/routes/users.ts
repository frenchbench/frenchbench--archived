import { Router, Request, Response } from 'express';
import { ERRORS } from '../constants';
import { Api } from '../api';

export default function (api: Api, router: Router): Router {

  router.get('/:id/skills', async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await api.userSkillsRetrieve({ where: 'user_id = ?', params: [id] });
    if (data) {
      res.status(200).json({ data });
    } else {
      res.status(404).json({ error: ERRORS.RECORD_NOT_FOUND });
    }
  });

  router.put('/:id/skills/:skillId', async (req: Request, res: Response) => {
    res.status(200).json({ data: 'updated' }); // TODO
  });

  router.delete('/:id/skills/:skillId', async (req: Request, res: Response) => {
    res.status(200).json({ data: 'deleted' }); // TODO
  });

  router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await api.userRetrieve(id as string);
    if (data) {
      delete data.password_hash;
      res.json({ data });
    } else {
      res.status(404).json({ error: ERRORS.RECORD_NOT_FOUND });
    }
  });

  router.put('/:id', async (req: Request, res: Response) => {
    res.json({ data: 'updated' }); // TODO
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    res.json({ data: 'deleted' }); // TODO
  });

  router.get('/', async (req: Request, res: Response) => {
    const { query } = req;
    const result = await api.userList(query);
    res.json(result);
  });

  router.post('/', async (req: Request, res: Response) => {
    const { body } = req;
    const result = await api.userCreate(body);
    res.json(result);
  });

  return router;
}
