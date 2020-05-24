import { newApi } from '../../api';
import { newConfig } from '../../config';

const config = newConfig(process.env);
const api = newApi(config);

export default async (req, res) => {
  const result = await api.health();
  res.status(200).json(result);
}
