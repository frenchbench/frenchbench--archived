import { NextApiRequest, NextApiResponse } from 'next';
import { newApi } from '../../server/api';

const api = newApi(process.env);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await api.health();
  res.status(200).json(result);
}
