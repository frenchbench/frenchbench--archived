// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as api from '../../api';

export default async (req, res) => {
  const data = await api.hello()
  res.statusCode = 200;
  res.json(data);
}
