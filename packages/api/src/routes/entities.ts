import { Router, Request, Response } from 'express';
import { Api } from '../api';

export default function (api: Api, router: Router) {

  router.get('/:id/assets', async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await api.entityAssetList({ where: 'parent_entity_id = ?', params: [id] });
    res.status(200).json(result);
  });

  return router;
}
