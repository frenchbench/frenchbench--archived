import { newApi } from '../../server/api';

const api = newApi(process.env);

export default async (req, res) => {
  // TODO
  const result = await api.health();
  res.statusCode = 200;
  res.json(result);
}
