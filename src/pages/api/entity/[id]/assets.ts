import { NextApiRequest, NextApiResponse } from 'next';
import { newApi } from '../../../../server/api';

const api = newApi(process.env);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, query, body } = req;
  let result;
  switch (method) {
    case 'GET':
      const { id } = query;
      result = await api.entityAssetList({ where: 'parent_entity_id = ?', params: [id] });
      res.status(200).json(result);
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
