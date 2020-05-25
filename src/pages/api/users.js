import { newApi } from '../../server/api';

const api = newApi(process.env);

export default async (req, res) => {
  const { method, query, body } = req;
  let result;
  switch (method) {
    case 'GET':
      result = await api.userList(query);
      res.status(200).json(result);
      break;
    case 'POST': // TODO create user?
      result = await api.userCreate(body);
      res.status(200).json(result);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
