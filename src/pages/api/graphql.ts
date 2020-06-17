import { NextApiRequest, NextApiResponse } from 'next';
import { newApi } from '../../server/api';

const api = newApi(process.env);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO
  const result = await api.health();
  res.statusCode = 200;
  res.json(result);
}
