import { newApi } from '../../server/api';

const api = newApi(process.env);

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
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
