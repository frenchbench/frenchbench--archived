import { newApi } from '../../api';
import { newConfig } from '../../config';

const config = newConfig(process.env);
const api = newApi(config);

export default async (req, res) => {
  const { method, body } = req;
  let result;
  switch (method) {
    case 'POST':
      try {
        result = await api.sendSecret(body);
        res.status(200).json(result);
      } catch (err) {
        console.error('/api/secrets', err);
        res.status(500).json({ error: 'server error' });
      }
      break;
    default:
      res.status(400).json({ error: 'bad request' });
  }
}
