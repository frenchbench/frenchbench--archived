import { newApi } from '../../api';
import { newConfig } from '../../config';

const config = newConfig(process.env);
const api = newApi(config);

export default async (req, res) => {
  const { method, query, body } = req;
  let result;
  switch (method) {
    case 'GET':
      result = await api.userList(query);
      break;
    case 'POST': // TODO create user?
      result = await api.userCreate(body);
      break;
  }
  res.status(200).json(result);
}
