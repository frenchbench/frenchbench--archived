// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { newApi } from '../../api';
import { newConfig } from '../../config';

const config = newConfig(process.env);
const api = newApi(config);

export default async (req, res) => {
  const result = await api.hello();
  res.statusCode = 200;
  res.json(result);
}
