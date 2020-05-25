import { newApi } from '../../server/api';

const api = newApi(process.env);

export default async (req, res) => {
  const { url, method, query, body, headers } = req;
  console.log(method, url, query, headers, body);
  let result = null;
  switch (method) {
    case 'POST':
      result = await api.login(body);
      res.status(200).json(result);
      break;
    case 'DELETE':
      const token = headers['authorization'].replace('Bearer ', '');
      result = await api.logout({ token });
      res.status(200).json(result);
      break;
    default:
      res.setHeader('Allow', ['POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
