import { newApi } from '../../../server/api';
import { ERRORS } from '../../../server/constants';

const api = newApi(process.env);

export default async (req, res) => {
  const { method, query, params, body, headers } = req;

  switch (method) {
    case 'GET':
      const { id } = query;
      const data = await api.userRetrieve(id);
      if (data) {
        delete data.password_hash;
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
