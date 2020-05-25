import { newApi } from '../../server/api';

const api = newApi(process.env);

export default async (req, res) => {
  const result = await api.health();
  res.status(200).json(result);
}
