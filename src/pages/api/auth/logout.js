import { newApi } from '../../../api';
import { newConfig } from '../../../config';

const config = newConfig(process.env);
const api = newApi(config);

export default async (req, res) => {
  const { method, body } = req;
  if (method === 'POST') {
    const result = await api.logout(body);
    res.status(200).json(result);
  } else {
    res.status(400).json({ error: 'bad request' });
  }
}
