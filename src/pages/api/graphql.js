import { newApi } from '../../api';
import { newConfig } from '../../config';

const config = newConfig(process.env);
const api = newApi(config);

export default async (req, res) => {
  // TODO
  const result = await api.health();
  res.statusCode = 200;
  res.json(result);
}
