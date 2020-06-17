import { NextApiRequest, NextApiResponse } from 'next';
import { newApi } from '../../../../server/api';
import { ERRORS } from '../../../../constants';

const api = newApi(process.env);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, query, body, headers } = req;

  switch (method) {
    case 'GET':
      const { id } = query;
      const data = await api.userSkillsRetrieve({ where: 'user_id = ?', params: [id] });
      if (data) {
        res.status(200).json({ data });
      } else {
        res.status(404).json({ error: ERRORS.RECORD_NOT_FOUND });
      }
      break
    case 'PUT':
      // TODO
      res.status(200).json({ data: 'updated' });
      break;
    case 'DELETE':
      // TODO
      res.status(200).json({ data: 'delete' });
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
