import { newApi } from '../../server/api';

const api = newApi(process.env);

export default async (req, res) => {
  const { method, query, body } = req;
  let result;
  switch (method) {
    case 'GET':
      result = await api.entityList(query);
      res.status(200).json(result);
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
